"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { getWorkerBalance } from "@/lib/rewards";

async function requireWorker(): Promise<NonNullable<Awaited<ReturnType<typeof getSession>>> & { workerId: string }> {
  const session = await getSession();
  if (!session || session.role !== "WORKER" || !session.workerId) throw new Error("No autorizado");
  return { ...session, workerId: session.workerId };
}

const orderSchema = z.object({
  customerName: z.string().min(2),
  customerPhone: z.string().min(5),
  currency: z.enum(["USD", "COP", "VES"]),
  notes: z.string().optional(),
  items: z.array(
    z.object({ productId: z.string(), variantId: z.string().nullable().optional(), quantity: z.number().int().positive() })
  ).min(1),
});

export async function createWorkerOrder(input: z.infer<typeof orderSchema>) {
  const session = await requireWorker();
  const data = orderSchema.parse(input);

  const products = await prisma.product.findMany({
    where: { id: { in: data.items.map((i) => i.productId) }, active: true },
    include: { variants: true },
  });
  const productMap = new Map(products.map((p) => [p.id, p]));

  let totalUsd = 0;
  const itemsData: {
    productId: string; variantId: string | null; variantSnapshot: string;
    nameSnapshot: string; unitPriceUsd: number; quantity: number;
  }[] = [];

  for (const item of data.items) {
    const product = productMap.get(item.productId);
    if (!product) throw new Error("Producto no encontrado");
    const variant = item.variantId ? product.variants.find((v) => v.id === item.variantId) : null;
    if (variant && variant.stock < item.quantity) throw new Error(`Stock insuficiente de ${product.name}: quedan ${variant.stock}`);
    totalUsd += product.priceUsd * item.quantity;
    itemsData.push({
      productId: product.id,
      variantId: variant?.id ?? null,
      variantSnapshot: variant ? `${variant.size} / ${variant.color}` : "Sin variante",
      nameSnapshot: product.name,
      unitPriceUsd: product.priceUsd,
      quantity: item.quantity,
    });
  }

  const s = await prisma.setting.findUnique({ where: { id: "main" } });
  const rateSnapshot = data.currency === "COP" ? (s?.usdToCop ?? 3900) : data.currency === "VES" ? (s?.usdToVes ?? 40) : 1;
  const count = await prisma.order.count();

  const order = await prisma.order.create({
    data: {
      code: `DS-${String(count + 1).padStart(4, "0")}`,
      workerId: session.workerId,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      currency: data.currency,
      rateSnapshot,
      totalUsd,
      notes: data.notes || null,
      source: "REFERIDA",
      status: "PENDIENTE",
      items: { create: itemsData },
    },
  });

  for (const item of itemsData) {
    if (item.variantId) {
      await prisma.productVariant.update({ where: { id: item.variantId }, data: { stock: { decrement: item.quantity } } });
    }
  }

  revalidatePath("/trabajadora", "layout");
  return { ok: true, orderId: order.id, code: order.code };
}

const redemptionSchema = z.object({
  type: z.enum(["PRODUCTO", "EFECTIVO"]),
  productId: z.string().optional().nullable(),
  variantId: z.string().optional().nullable(),
  amountUsd: z.number().nonnegative().optional(),
  currency: z.enum(["USD", "COP"]).optional(),
  note: z.string().optional(),
});

export async function requestRedemption(input: z.infer<typeof redemptionSchema>) {
  const session = await requireWorker();
  const data = redemptionSchema.parse(input);

  const balance = await getWorkerBalance(session.workerId);

  let amountUsd = data.amountUsd ?? 0;
  let productId = data.productId ?? null;
  let variantId = data.variantId ?? null;

  if (data.type === "PRODUCTO") {
    if (!productId) throw new Error("Elige el producto que quieres como premio");
    const product = await prisma.product.findUnique({ where: { id: productId }, include: { variants: true } });
    if (!product || !product.active) throw new Error("Producto no disponible");
    amountUsd = product.priceUsd;
    if (!variantId && product.variants.length > 0) {
      const withStock = product.variants.find((v) => v.stock > 0);
      variantId = withStock?.id ?? product.variants[0].id;
    }
  } else {
    if (!amountUsd || amountUsd <= 0) throw new Error("Indica el monto a canjear");
  }

  if (amountUsd > balance.availableUsd + 0.001) {
    throw new Error(`Saldo insuficiente. Disponible: US$ ${balance.availableUsd.toFixed(2)}`);
  }

  await prisma.redemption.create({
    data: {
      workerId: session.workerId,
      type: data.type,
      productId: data.type === "PRODUCTO" ? productId : null,
      variantId: data.type === "PRODUCTO" ? variantId : null,
      amountUsd,
      currency: data.type === "EFECTIVO" ? (data.currency ?? "COP") : null,
      note: data.note || null,
      status: "PENDIENTE",
    },
  });

  revalidatePath("/trabajadora", "layout");
  return { ok: true };
}
