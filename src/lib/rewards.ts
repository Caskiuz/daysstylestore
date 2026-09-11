import "server-only";
import { prisma } from "@/lib/prisma";

/**
 * Motor de premios "Vendes N, ganas 1".
 * Al entregar un pedido al cliente (ENTREGADA_CLIENTE) suma las unidades vendidas
 * por producto a la trabajadora y genera créditos al cruzar cada múltiplo de N.
 * Las unidades sobrantes arrastran hacia el siguiente premio.
 */
export async function processRewardsForOrder(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order?.workerId) return;

  const setting = await prisma.setting.findUnique({ where: { id: "main" } });
  const N = Math.max(1, setting?.rewardUnits ?? 4);

  for (const item of order.items) {
    const progress = await prisma.workerProductProgress.upsert({
      where: { workerId_productId: { workerId: order.workerId, productId: item.productId } },
      create: { workerId: order.workerId, productId: item.productId, units: item.quantity },
      update: { units: { increment: item.quantity } },
    });

    const unitsBefore = progress.units - item.quantity;
    const creditsBefore = Math.floor(unitsBefore / N);
    const creditsAfter = Math.floor(progress.units / N);
    const earned = creditsAfter - creditsBefore;

    if (earned > 0) {
      await prisma.rewardCredit.create({
        data: {
          workerId: order.workerId,
          productId: item.productId,
          orderId: order.id,
          quantity: earned,
          valueUsd: item.unitPriceUsd,
        },
      });
    }
  }
}

export type WorkerBalance = {
  totalEarnedUsd: number; // total de créditos ganados
  redeemedUsd: number; // canjes aprobados
  pendingUsd: number; // canjes pendientes de aprobación
  availableUsd: number; // disponible para canjear
};

export async function getWorkerBalance(workerId: string): Promise<WorkerBalance> {
  const [creditsAgg, redemptions] = await Promise.all([
    prisma.rewardCredit.aggregate({
      where: { workerId },
      _sum: { valueUsd: true, quantity: true },
    }),
    prisma.redemption.findMany({
      where: { workerId, status: { in: ["PENDIENTE", "APROBADO"] } },
      select: { amountUsd: true, status: true },
    }),
  ]);

  // cada crédito: quantity premios × valor unitario
  const creditRows = await prisma.rewardCredit.findMany({
    where: { workerId },
    select: { quantity: true, valueUsd: true },
  });
  const totalEarnedUsd = creditRows.reduce((acc, c) => acc + c.quantity * c.valueUsd, 0);

  const redeemedUsd = redemptions.filter((r) => r.status === "APROBADO").reduce((a, r) => a + r.amountUsd, 0);
  const pendingUsd = redemptions.filter((r) => r.status === "PENDIENTE").reduce((a, r) => a + r.amountUsd, 0);

  return {
    totalEarnedUsd,
    redeemedUsd,
    pendingUsd,
    availableUsd: Math.max(0, totalEarnedUsd - redeemedUsd - pendingUsd),
  };
}

/** Progreso por producto de una trabajadora (para las barras "3/4"). */
export async function getWorkerProgress(workerId: string) {
  const N = (await prisma.setting.findUnique({ where: { id: "main" } }))?.rewardUnits ?? 4;
  const rows = await prisma.workerProductProgress.findMany({
    where: { workerId, units: { gt: 0 } },
    include: { product: { select: { id: true, name: true, slug: true, priceUsd: true } } },
    orderBy: { units: "desc" },
  });
  return rows.map((r) => ({
    productId: r.productId,
    productName: r.product.name,
    priceUsd: r.product.priceUsd,
    units: r.units,
    credits: Math.floor(r.units / N),
    progress: r.units % N, // unidades que arrastran
    goal: N,
  }));
}
