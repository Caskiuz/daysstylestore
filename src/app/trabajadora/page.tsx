import Link from "next/link";
import { Gift, ShoppingBag, TrendingUp, ArrowUpRight } from "lucide-react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getWorkerBalance, getWorkerProgress } from "@/lib/rewards";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/misc";
import { Button } from "@/components/ui/button";
import { formatMoney, convertFromUsd } from "@/lib/currency";
import { formatDate } from "@/lib/utils";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, type OrderStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function TrabajadoraHome() {
  const session = await getSession();
  const workerId = session!.workerId!;

  const [balance, progress, orders, setting, recentCredits] = await Promise.all([
    getWorkerBalance(workerId),
    getWorkerProgress(workerId),
    prisma.order.findMany({ where: { workerId }, orderBy: { createdAt: "desc" }, take: 6 }).catch(() => []),
    prisma.setting.findUnique({ where: { id: "main" } }),
    prisma.rewardCredit.findMany({
      where: { workerId },
      include: { product: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 6,
    }).catch(() => []),
  ]);

  const rates = { usdToCop: setting?.usdToCop ?? 3900, usdToVes: setting?.usdToVes ?? 40 };
  const rewardUnits = setting?.rewardUnits ?? 4;
  const activeOrders = orders.filter((o) => !["CERRADO", "CANCELADO"].includes(o.status)).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Mi panel</h1>
          <p className="text-sm text-muted-foreground">Tu negocio con Days Style Store</p>
        </div>
        <div className="flex gap-2">
          <Link href="/trabajadora/pedidos/nuevo"><Button>+ Registrar pedido</Button></Link>
          <Link href="/trabajadora/canjes"><Button variant="outline"><Gift size={16} /> Canjear premios</Button></Link>
        </div>
      </div>

      {/* Tarjeta de saldo */}
      <div className="relative overflow-hidden rounded-3xl border border-gold/40 bg-gradient-to-br from-[#1a1508] via-[#2a2005] to-[#0a0a0b] p-7 text-white dark:from-[#131315] dark:via-[#1e1b12] dark:to-[#131315]">
        <div className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(ellipse_at_top_right,rgba(212,175,55,0.3),transparent_55%)]" />
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold-soft">Saldo disponible para canjear</p>
            <p className="mt-2 font-display text-5xl font-bold text-gradient-gold">US$ {balance.availableUsd.toFixed(2)}</p>
            <p className="mt-1 text-sm text-white/60">≈ {formatMoney(convertFromUsd(balance.availableUsd, "COP", rates), "COP")}</p>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            <div><p className="text-white/50 text-xs">Ganado total</p><p className="font-bold">US$ {balance.totalEarnedUsd.toFixed(2)}</p></div>
            <div><p className="text-white/50 text-xs">Canjeado</p><p className="font-bold">US$ {balance.redeemedUsd.toFixed(2)}</p></div>
            <div><p className="text-white/50 text-xs">En aprobación</p><p className="font-bold">US$ {balance.pendingUsd.toFixed(2)}</p></div>
            <div><p className="text-white/50 text-xs">Pedidos activos</p><p className="font-bold">{activeOrders}</p></div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Progreso hacia premios */}
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2"><TrendingUp size={17} className="text-gold" /> Vendes {rewardUnits}, ganas 1</CardTitle>
          </CardHeader>
          <CardBody className="pt-3">
            {progress.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Todavía no tienes ventas contabilizadas. <br />Registra tu primer pedido y empieza a acumular ✨
              </p>
            ) : (
              <div className="space-y-3.5">
                {progress.slice(0, 6).map((p) => (
                  <div key={p.productId}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="truncate font-medium">{p.productName}</span>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {p.credits > 0 && <b className="mr-1.5 text-primary">{p.credits} ✓</b>}
                        {p.progress}/{p.goal} para el próximo
                      </span>
                    </div>
                    <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-gold-soft via-gold to-gold-deep transition-all duration-700"
                        style={{ width: `${(p.progress / p.goal) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Últimos créditos */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Gift size={17} className="text-gold" /> Premios ganados</CardTitle></CardHeader>
          <CardBody className="pt-3">
            {recentCredits.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">Cuando entregues pedidos, aquí verás tus premios acumulados.</p>
            ) : (
              <ul className="divide-y divide-border">
                {recentCredits.map((c) => (
                  <li key={c.id} className="flex items-center gap-3 py-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/15 text-sm font-bold text-primary">+{c.quantity}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{c.product.name}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(c.createdAt)}</p>
                    </div>
                    <b className="text-sm text-primary">US$ {(c.quantity * c.valueUsd).toFixed(2)}</b>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Pedidos recientes */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2"><ShoppingBag size={17} className="text-gold" /> Mis pedidos recientes</CardTitle>
          <Link href="/trabajadora/pedidos" className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
            Ver todos <ArrowUpRight size={13} />
          </Link>
        </CardHeader>
        <CardBody className="pt-3">
          {orders.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">Sin pedidos aún. ¡Registra el primero!</p>
          ) : (
            <ul className="divide-y divide-border">
              {orders.map((o) => (
                <li key={o.id} className="flex items-center gap-3 py-2.5">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{o.customerName}</p>
                    <p className="text-xs text-muted-foreground">{o.code} · {formatDate(o.createdAt)}</p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${ORDER_STATUS_COLORS[o.status as OrderStatus]}`}>{ORDER_STATUS_LABELS[o.status as OrderStatus]}</span>
                  <b className="text-sm">US$ {o.totalUsd.toFixed(2)}</b>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
