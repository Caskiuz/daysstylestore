"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession, hashPassword } from "@/lib/auth";
import { addDays, slugify } from "@/lib/utils";
import { processRewardsForOrder } from "@/lib/rewards";

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") throw new Error("No autorizado");
  return session;
}

function refreshAdmin() {
  revalidatePath("/admin", "layout");
}

// ─────────────────────────── PRODUCTOS ───────────────────────────

const variantSchema = z.object({
  size: z.string().min(1).default("Única"),
  color: z.string().min(1).default("Estándar"),
  stock: z.number().int().min(0).default(0),
});

const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().default(""),
  priceUsd: z.number().positive(),
  categoryId: z.string().min(1),
  images: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
  tag: z.string().optional().nullable(),
  variants: z.array(variantSchema).min(1),
});

export type ProductInput = z.infer<typeof productSchema>;

export async function saveProduct(id: string | null, input: ProductInput) {
  await requireAdmin();
  const data = productSchema.parse(input);
  const slug = `${slugify(data.name)}-${Date.now().toString(36).slice(-4)}`;

  const payload = {
    name: data.name,
    description: data.description,
    priceUsd: data.priceUsd,
    categoryId: data.categoryId,
    images: data.images.filter(Boolean),
    featured: data.featured,
    active: data.active,
    tag: data.tag || null,
  };

  if (id) {
    await prisma.product.update({
      where: { id },
      data: {
        ...payload,
        variants: { deleteMany: {}, create: data.variants },
      },
    });
  } else {
    await prisma.product.create({
      data: { ...payload, slug, variants: { create: data.variants } },
    });
  }
  refreshAdmin();
  return { ok: true };
}

export async function toggleProductActive(id: string, active: boolean) {
  await requireAdmin();
  await prisma.product.update({ where: { id }, data: { active } });
  refreshAdmin();
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  try {
    await prisma.product.delete({ where: { id } });
  } catch {
    // El producto tiene pedidos históricos: solo se desactiva
    await prisma.product.update({ where: { id }, data: { active: false } });
  }
  refreshAdmin();
}

// ─────────────────────────── CATEGORÍAS ───────────────────────────

export async function saveCategory(id: string | null, name: string, image?: string) {
  await requireAdmin();
  if (id) {
    await prisma.category.update({ where: { id }, data: { name, image: image || null } });
  } else {
    await prisma.category.create({ data: { name, slug: `${slugify(name)}-${Date.now().toString(36).slice(-3)}`, image: image || null } });
  }
  refreshAdmin();
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0) throw new Error("No se puede eliminar: la categoría tiene productos. Mueve o elimina sus productos primero.");
  await prisma.category.delete({ where: { id } });
  refreshAdmin();
}

// ─────────────────────────── PEDIDOS ───────────────────────────

const orderItemInput = z.object({
  productId: z.string(),
  variantId: z.string().nullable().optional(),
  quantity: z.number().int().positive(),
});

const orderSchema = z.object({
  workerId: z.string().nullable().optional(),
  customerName: z.string().min(2),
  customerPhone: z.string().min(5),
  currency: z.enum(["USD", "COP", "VES"]),
  notes: z.string().optional(),
  source: z.enum(["MANUAL", "WHATSAPP", "REFERIDA"]).default("MANUAL"),
  items: z.array(orderItemInput).min(1),
});

async function currentRates() {
  const s = await prisma.setting.findUnique({ where: { id: "main" } });
  return { usdToCop: s?.usdToCop ?? 3900, usdToVes: s?.usdToVes ?? 40 };
}

export async function createOrder(input: z.infer<typeof orderSchema>) {
  await requireAdmin();
  const data = orderSchema.parse(input);

  const productIds = data.items.map((i) => i.productId);
  const products = await prisma.product.findMany({ where: { id: { in: productIds } }, include: { variants: true } });
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
    if (variant && variant.stock < item.quantity) throw new Error(`Stock insuficiente de ${product.name} (${variant.size}/${variant.color}): quedan ${variant.stock}`);
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

  const rates = await currentRates();
  const rateSnapshot = data.currency === "COP" ? rates.usdToCop : data.currency === "VES" ? rates.usdToVes : 1;

  const count = await prisma.order.count();
  const order = await prisma.order.create({
    data: {
      code: `DS-${String(count + 1).padStart(4, "0")}`,
      workerId: data.workerId || null,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      currency: data.currency,
      rateSnapshot,
      totalUsd,
      notes: data.notes || null,
      source: data.source,
      status: "PENDIENTE",
      items: { create: itemsData },
    },
  });

  // Descuento de stock al crear el pedido
  for (const item of itemsData) {
    if (item.variantId) {
      await prisma.productVariant.update({ where: { id: item.variantId }, data: { stock: { decrement: item.quantity } } });
    }
  }

  refreshAdmin();
  return { ok: true, orderId: order.id, code: order.code };
}

const FLOW: Record<string, string | null> = {
  PENDIENTE: "CONFIRMADO",
  CONFIRMADO: "EN_REPARTO",
  EN_REPARTO: "ENTREGADA_TRABAJADORA",
  ENTREGADA_TRABAJADORA: "ENTREGADA_CLIENTE",
  ENTREGADA_CLIENTE: "CERRADO",
};

export async function advanceOrder(orderId: string) {
  await requireAdmin();
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new Error("Pedido no encontrado");
  const next = FLOW[order.status];
  if (!next) throw new Error("El pedido ya está en su estado final");

  await prisma.order.update({
    where: { id: orderId },
    data: next === "ENTREGADA_CLIENTE"
      ? { status: next, deliveredAt: new Date(), balanceDueAt: addDays(new Date(), 8) }
      : { status: next },
  });

  if (next === "ENTREGADA_CLIENTE") {
    await processRewardsForOrder(orderId);
  }
  refreshAdmin();
  return { ok: true };
}

export async function cancelOrder(orderId: string) {
  await requireAdmin();
  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } });
  if (!order) throw new Error("Pedido no encontrado");
  if (order.status === "CANCELADO") return { ok: true };

  await prisma.order.update({ where: { id: orderId }, data: { status: "CANCELADO" } });
  // Devolver stock
  for (const item of order.items) {
    if (item.variantId) {
      await prisma.productVariant.update({ where: { id: item.variantId }, data: { stock: { increment: item.quantity } } }).catch(() => {});
    }
  }
  refreshAdmin();
  return { ok: true };
}

const paymentSchema = z.object({
  orderId: z.string(),
  method: z.string().min(1),
  currency: z.enum(["USD", "COP", "VES"]),
  amountLocal: z.number().positive(),
  reference: z.string().optional(),
  note: z.string().optional(),
});

export async function addPayment(input: z.infer<typeof paymentSchema>) {
  await requireAdmin();
  const data = paymentSchema.parse(input);
  const rates = await currentRates();
  const rate = data.currency === "COP" ? rates.usdToCop : data.currency === "VES" ? rates.usdToVes : 1;
  const amountUsd = rate > 0 ? data.amountLocal / rate : 0;

  await prisma.payment.create({
    data: {
      orderId: data.orderId,
      amountUsd,
      currency: data.currency,
      rate,
      amountLocal: data.amountLocal,
      method: data.method,
      reference: data.reference || null,
      note: data.note || null,
    },
  });

  // Si el pedido está pagado por completo y estaba entregado, pasa a CERRADO
  const [order, paidAgg] = await Promise.all([
    prisma.order.findUnique({ where: { id: data.orderId } }),
    prisma.payment.aggregate({ where: { orderId: data.orderId }, _sum: { amountUsd: true } }),
  ]);
  if (order && (paidAgg._sum.amountUsd ?? 0) >= order.totalUsd - 0.01 && ["ENTREGADA_CLIENTE", "CERRADO"].includes(order.status)) {
    await prisma.order.update({ where: { id: data.orderId }, data: { status: "CERRADO" } });
  }

  refreshAdmin();
  return { ok: true };
}

// ─────────────────────────── TRABAJADORAS ───────────────────────────

const workerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  code: z.string().min(2).max(12),
  password: z.string().min(6).optional(),
  active: z.boolean().default(true),
});

export async function saveWorker(id: string | null, input: z.infer<typeof workerSchema>) {
  await requireAdmin();
  const data = workerSchema.parse(input);
  const code = data.code.toUpperCase().replace(/\s+/g, "");

  if (id) {
    const worker = await prisma.worker.findUnique({ where: { id }, include: { user: true } });
    if (!worker) throw new Error("Trabajadora no encontrada");
    await prisma.user.update({ where: { id: worker.userId }, data: { name: data.name, email: data.email.toLowerCase() } });
    if (data.password) {
      await prisma.user.update({ where: { id: worker.userId }, data: { passwordHash: await hashPassword(data.password) } });
    }
    await prisma.worker.update({ where: { id }, data: { phone: data.phone || null, code, active: data.active } });
  } else {
    if (!data.password || data.password.length < 6) throw new Error("La contraseña es obligatoria (mínimo 6 caracteres)");
    const exists = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });
    if (exists) throw new Error("Ya existe una cuenta con ese correo");
    const codeExists = await prisma.worker.findUnique({ where: { code } });
    if (codeExists) throw new Error("Ese código de referida ya está en uso");
    await prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        passwordHash: await hashPassword(data.password),
        role: "WORKER",
        worker: { create: { phone: data.phone || null, code, active: data.active } },
      },
    });
  }
  refreshAdmin();
  return { ok: true };
}

export async function toggleWorkerActive(id: string, active: boolean) {
  await requireAdmin();
  await prisma.worker.update({ where: { id }, data: { active } });
  refreshAdmin();
}

// ─────────────────────────── CANJES DE PREMIOS ───────────────────────────

export async function resolveRedemption(redemptionId: string, approve: boolean, note?: string) {
  await requireAdmin();
  const redemption = await prisma.redemption.findUnique({ where: { id: redemptionId } });
  if (!redemption || redemption.status !== "PENDIENTE") throw new Error("Canje no encontrado o ya resuelto");

  if (approve) {
    // Si es un producto, descontar stock de la variante elegida
    if (redemption.type === "PRODUCTO" && redemption.variantId) {
      await prisma.productVariant
        .update({ where: { id: redemption.variantId }, data: { stock: { decrement: 1 } } })
        .catch(() => {});
    }
    await prisma.redemption.update({
      where: { id: redemptionId },
      data: { status: "APROBADO", resolvedAt: new Date(), note: note || redemption.note },
    });
  } else {
    await prisma.redemption.update({
      where: { id: redemptionId },
      data: { status: "RECHAZADO", resolvedAt: new Date(), note: note || redemption.note },
    });
  }
  refreshAdmin();
  return { ok: true };
}

export async function setRewardUnits(n: number) {
  await requireAdmin();
  const units = Math.max(2, Math.min(20, Math.round(n)));
  await prisma.setting.upsert({ where: { id: "main" }, update: { rewardUnits: units }, create: { id: "main", rewardUnits: units } });
  refreshAdmin();
  return { ok: true };
}

// ─────────────────────────── CONFIGURACIÓN ───────────────────────────

const settingsSchema = z.object({
  storeName: z.string().min(2),
  tagline: z.string().min(2),
  whatsapp: z.string().min(6),
  instagram: z.string().optional().nullable(),
  facebook: z.string().optional().nullable(),
  tiktok: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  aboutText: z.string().default(""),
  aiPrompt: z.string().default(""),
  aiEnabled: z.boolean().default(true),
  usdToCop: z.number().positive(),
  usdToVes: z.number().positive(),
  currenciesEnabled: z.array(z.string()).min(1),
  paymentMethods: z.array(z.object({
    id: z.string(),
    name: z.string(),
    currency: z.string(),
    details: z.string(),
    enabled: z.boolean(),
  })),
});

export type SettingsInput = z.infer<typeof settingsSchema>;

export async function updateSettings(input: SettingsInput) {
  await requireAdmin();
  const data = settingsSchema.parse(input);
  await prisma.setting.upsert({
    where: { id: "main" },
    update: { ...data, instagram: data.instagram || null, facebook: data.facebook || null, tiktok: data.tiktok || null, email: data.email || null, address: data.address || null },
    create: { id: "main", ...data },
  });
  revalidatePath("/", "layout");
  return { ok: true };
}

// ─────────────────────────── GASTOS ───────────────────────────

export async function addExpense(concept: string, amountUsd: number, currency: string, amountLocal: number, category: string, note?: string) {
  await requireAdmin();
  let usd = amountUsd;
  if (!usd && amountLocal > 0) {
    const rates = await currentRates();
    const rate = currency === "COP" ? rates.usdToCop : currency === "VES" ? rates.usdToVes : 1;
    usd = rate > 0 ? amountLocal / rate : 0;
  }
  await prisma.expense.create({ data: { concept, amountUsd: usd, currency, category, note: note || null } });
  refreshAdmin();
  return { ok: true };
}

export async function deleteExpense(id: string) {
  await requireAdmin();
  await prisma.expense.delete({ where: { id } });
  refreshAdmin();
}
