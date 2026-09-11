import Link from "next/link";
import { AlertTriangle, ArrowUpRight, Banknote, Clock, Gift, Package, TrendingUp, Users, Wallet } from "lucide-react";
import { getDashboard } from "@/lib/admin-data";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/misc";
import { Reveal } from "@/components/animations/reveal";
import { DashboardCharts } from "@/components/admin/dashboard-charts";
import { formatDate } from "@/lib/utils";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, type OrderStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

const usd = (n: number) => `US$ ${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;

export default async function AdminDashboard() {
  const d = await getDashboard();

  const kpis = [
    { label: "Ventas del mes", value: usd(d.kpis.ventasMesUsd), icon: TrendingUp, sub: `${d.kpis.pedidosMes} pedidos`, gold: true },
    { label: "Por cobrar", value: usd(d.kpis.porCobrarUsd), icon: Clock, sub: d.kpis.cobrosVencidos > 0 ? `⚠ ${d.kpis.cobrosVencidos} vencidos` : "Al día", danger: d.kpis.cobrosVencidos > 0 },
    { label: "Pedidos activos", value: String(d.kpis.pedidosActivos), icon: Package, sub: "En proceso" },
    { label: "Saldo trabajadoras", value: usd(d.kpis.saldoTrabajadorasUsd), icon: Users, sub: "premios por canjear" },
    { label: "Ingresos recibidos", value: usd(d.kpis.ingresosUsd), icon: Banknote, sub: "histórico" },
    { label: "Utilidad estimada", value: usd(d.kpis.utilidadUsd), icon: Wallet, sub: "ingresos − gastos − canjes" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Resumen del negocio en tiempo real</p>
        </div>
        <Link href="/admin/pedidos" className="flex items-center gap-1.5 rounded-full border border-gold/50 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-accent">
          Gestionar pedidos <ArrowUpRight size={15} />
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
        {kpis.map((k, i) => (
          <Reveal key={k.label} delay={i * 0.04}>
            <Card className={`h-full ${k.gold ? "border-gold/50 gold-ring" : ""} ${k.danger ? "border-destructive/50" : ""}`}>
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <k.icon size={18} className={k.danger ? "text-destructive" : "text-gold"} />
                </div>
                <p className="mt-2.5 truncate text-lg font-bold">{k.value}</p>
                <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{k.label}</p>
                <p className={`text-[11px] ${k.danger ? "text-destructive font-semibold" : "text-muted-foreground"}`}>{k.sub}</p>
              </CardBody>
            </Card>
          </Reveal>
        ))}
      </div>

      <DashboardCharts serie={d.serie} ingresosPorMoneda={d.ingresosPorMoneda} ingresosPorMetodo={d.ingresosPorMetodo} />

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Pedidos recientes */}
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Pedidos recientes</CardTitle>
            <Link href="/admin/pedidos" className="text-xs font-semibold text-primary hover:underline">Ver todos</Link>
          </CardHeader>
          <CardBody className="pt-3">
            {d.pedidosRecientes.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">Aún no hay pedidos registrados.</p>
            ) : (
              <ul className="divide-y divide-border">
                {d.pedidosRecientes.map((o) => (
                  <li key={o.id}>
                    <Link href={`/admin/pedidos/${o.id}`} className="flex items-center gap-3 rounded-lg px-1 py-2.5 transition-colors hover:bg-muted/60">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{o.customer}</p>
                        <p className="text-xs text-muted-foreground">{o.code} · {formatDate(o.createdAt)} {o.worker && `· ${o.worker}`}</p>
                      </div>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${ORDER_STATUS_COLORS[o.status as OrderStatus]}`}>
                        {ORDER_STATUS_LABELS[o.status as OrderStatus]}
                      </span>
                      <span className="text-sm font-bold text-primary">{usd(o.totalUsd)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>

        <div className="space-y-5">
          {/* Cobros pendientes */}
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2"><Clock size={17} className="text-gold" /> Cobros pendientes</CardTitle>
            </CardHeader>
            <CardBody className="pt-3">
              {d.cobrosPendientes.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">Sin saldos pendientes 🎉</p>
              ) : (
                <ul className="space-y-2">
                  {d.cobrosPendientes.map((o) => {
                    const overdue = o.balanceDueAt && o.balanceDueAt < new Date();
                    return (
                      <li key={o.id}>
                        <Link href={`/admin/pedidos/${o.id}`} className="flex items-center gap-3 rounded-xl border border-border px-3 py-2.5 transition-colors hover:border-gold/50">
                          {overdue && <AlertTriangle size={16} className="shrink-0 text-destructive" />}
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold">{o.customerName} <span className="font-normal text-muted-foreground">· {o.code}</span></p>
                            <p className={`text-xs ${overdue ? "font-semibold text-destructive" : "text-muted-foreground"}`}>
                              Vence: {o.balanceDueAt ? formatDate(o.balanceDueAt) : "al entregar"}
                            </p>
                          </div>
                          <span className="text-sm font-bold text-destructive">{usd(o.balanceUsd)}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardBody>
          </Card>

          {/* Stock bajo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><AlertTriangle size={17} className="text-gold" /> Stock bajo (≤3)</CardTitle>
            </CardHeader>
            <CardBody className="pt-3">
              {d.stockBajo.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">Todo con buen stock ✨</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {d.stockBajo.map((v) => (
                    <Link key={v.id} href={`/admin/productos?edit=${v.slug}`} className="rounded-lg border border-border px-2.5 py-1 text-xs transition-colors hover:border-gold/60">
                      {v.product} <span className="text-muted-foreground">({v.size}/{v.color})</span> · <b className={v.stock === 0 ? "text-destructive" : "text-amber-600 dark:text-amber-400"}>{v.stock}</b>
                    </Link>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Saldos trabajadoras */}
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2"><Gift size={17} className="text-gold" /> Saldos de premios</CardTitle>
              <Link href="/admin/premios" className="text-xs font-semibold text-primary hover:underline">Canjes {d.kpis.canjesPendientes > 0 && `(${d.kpis.canjesPendientes} pendientes)`}</Link>
            </CardHeader>
            <CardBody className="pt-3">
              {d.saldoTrabajadoras.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">Sin trabajadoras registradas.</p>
              ) : (
                <ul className="space-y-2">
                  {d.saldoTrabajadoras.map((w) => (
                    <li key={w.id} className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-gold-soft to-gold text-xs font-bold text-[#2a2005]">
                        {w.name.charAt(0)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold">{w.name} {!w.active && <span className="text-[10px] text-destructive">(inactiva)</span>}</p>
                        <p className="text-[11px] text-muted-foreground">Código: {w.code}</p>
                      </div>
                      <span className="text-sm font-bold text-primary">{usd(w.available)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
