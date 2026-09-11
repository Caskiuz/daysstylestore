import "server-only";
import { prisma } from "@/lib/prisma";
import { addDays } from "@/lib/utils";

export async function checkDbReady(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

export type DashboardData = Awaited<ReturnType<typeof getDashboard>>;

export async function getDashboard() {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const sixMonthsAgo = addDays(monthStart, -180);

  const [orders, payments, expenses, redemptions, workers, lowStockVariants, pendingRedemptions] = await Promise.all([
    prisma.order.findMany({
      where: { createdAt: { gte: sixMonthsAgo }, status: { notIn: ["CANCELADO"] } },
      include: { worker: { include: { user: { select: { name: true } } } }, payments: { select: { amountUsd: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.payment.findMany({ select: { amountUsd: true, currency: true, method: true, amountLocal: true, createdAt: true } }),
    prisma.expense.findMany({ select: { amountUsd: true } }),
    prisma.redemption.findMany({ where: { status: "APROBADO" }, select: { amountUsd: true } }),
    prisma.worker.findMany({ include: { user: { select: { name: true, email: true } }, credits: { select: { quantity: true, valueUsd: true } }, redemptions: { where: { status: { in: ["PENDIENTE", "APROBADO"] } }, select: { amountUsd: true, status: true } } } }),
    prisma.productVariant.findMany({ where: { stock: { lte: 3 } }, include: { product: { select: { name: true, slug: true } } }, take: 12 }),
    prisma.redemption.count({ where: { status: "PENDIENTE" } }),
  ]);

  const activeOrders = orders.filter((o) => !["CERRADO", "CANCELADO"].includes(o.status));
  const monthOrders = orders.filter((o) => o.createdAt >= monthStart);
  const ventasMesUsd = monthOrders.reduce((a, o) => a + o.totalUsd, 0);

  const cobrosPendientes = orders
    .filter((o) => o.payments.reduce((a, p) => a + p.amountUsd, 0) < o.totalUsd - 0.01 && o.status !== "CANCELADO")
    .map((o) => ({ ...o, paidUsd: o.payments.reduce((a, p) => a + p.amountUsd, 0), balanceUsd: o.totalUsd - o.payments.reduce((a, p) => a + p.amountUsd, 0) }));
  const cobrosVencidos = cobrosPendientes.filter((o) => o.balanceDueAt && o.balanceDueAt < now);
  const porCobrarUsd = cobrosPendientes.reduce((a, o) => a + o.balanceUsd, 0);

  // Ingresos por moneda (montos locales recibidos)
  const ingresosPorMoneda = ["USD", "COP", "VES"].map((cur) => {
    const rows = payments.filter((p) => p.currency === cur);
    return { currency: cur, totalLocal: rows.reduce((a, p) => a + p.amountLocal, 0), totalUsd: rows.reduce((a, p) => a + p.amountUsd, 0), count: rows.length };
  }).filter((r) => r.count > 0);

  const ingresosPorMetodo = Object.entries(
    payments.reduce<Record<string, { usd: number; count: number }>>((acc, p) => {
      acc[p.method] = acc[p.method] || { usd: 0, count: 0 };
      acc[p.method].usd += p.amountUsd;
      acc[p.method].count += 1;
      return acc;
    }, {})
  ).map(([method, v]) => ({ method, ...v })).sort((a, b) => b.usd - a.usd);

  // Serie mensual últimos 6 meses
  const serie: { mes: string; total: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    const total = orders.filter((o) => o.createdAt >= start && o.createdAt < end).reduce((a, o) => a + o.totalUsd, 0);
    serie.push({ mes: start.toLocaleDateString("es-CO", { month: "short" }), total: Math.round(total * 100) / 100 });
  }

  const gastosUsd = expenses.reduce((a, e) => a + e.amountUsd, 0);
  const canjesPagadosUsd = redemptions.reduce((a, r) => a + r.amountUsd, 0);
  const ingresosUsd = payments.reduce((a, p) => a + p.amountUsd, 0);

  const saldoTrabajadoras = workers.map((w) => {
    const earned = w.credits.reduce((a, c) => a + c.quantity * c.valueUsd, 0);
    const redeemed = w.redemptions.filter((r) => r.status === "APROBADO").reduce((a, r) => a + r.amountUsd, 0);
    const pending = w.redemptions.filter((r) => r.status === "PENDIENTE").reduce((a, r) => a + r.amountUsd, 0);
    return { id: w.id, name: w.user.name, code: w.code, active: w.active, earned, redeemed, pending, available: Math.max(0, earned - redeemed - pending) };
  }).sort((a, b) => b.available - a.available);
  const saldoTotalTrabajadorasUsd = saldoTrabajadoras.reduce((a, w) => a + w.available, 0);

  return {
    kpis: {
      ventasMesUsd,
      pedidosActivos: activeOrders.length,
      pedidosMes: monthOrders.length,
      porCobrarUsd,
      cobrosVencidos: cobrosVencidos.length,
      ingresosUsd,
      gastosUsd,
      utilidadUsd: ingresosUsd - gastosUsd - canjesPagadosUsd,
      saldoTrabajadorasUsd: saldoTotalTrabajadorasUsd,
      canjesPendientes: pendingRedemptions,
    },
    serie,
    ingresosPorMoneda,
    ingresosPorMetodo,
    cobrosPendientes: cobrosPendientes.slice(0, 8),
    saldoTrabajadoras: saldoTrabajadoras.slice(0, 6),
    stockBajo: lowStockVariants.map((v) => ({ id: v.id, product: v.product.name, slug: v.product.slug, size: v.size, color: v.color, stock: v.stock })),
    pedidosRecientes: orders.slice(0, 7).map((o) => ({
      id: o.id, code: o.code, customer: o.customerName, status: o.status, totalUsd: o.totalUsd,
      worker: o.worker?.user.name ?? null, createdAt: o.createdAt, currency: o.currency, rateSnapshot: o.rateSnapshot,
      paidUsd: o.payments.reduce((a, p) => a + p.amountUsd, 0),
    })),
  };
}
