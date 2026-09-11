import { prisma } from "@/lib/prisma";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/misc";
import { Input } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { CsvExport } from "@/components/admin/csv-export";
import { ExpenseManager } from "@/components/admin/expense-manager";
import { PAYMENT_METHOD_LABELS } from "@/lib/types";
import { formatMoney } from "@/lib/currency";

export const dynamic = "force-dynamic";

export default async function ContabilidadPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const now = new Date();
  const fromStr = typeof sp.from === "string" ? sp.from : new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
  const toStr = typeof sp.to === "string" ? sp.to : new Date(now.getTime() + 86400000).toISOString().slice(0, 10);
  const from = new Date(fromStr + "T00:00:00");
  const to = new Date(toStr + "T23:59:59");

  const [orders, payments, expenses, redemptions] = await Promise.all([
    prisma.order.findMany({
      where: { createdAt: { gte: from, lte: to }, status: { notIn: ["CANCELADO"] } },
      include: { worker: { include: { user: { select: { name: true } } } }, payments: true },
      orderBy: { createdAt: "desc" },
    }).catch(() => []),
    prisma.payment.findMany({
      where: { createdAt: { gte: from, lte: to } },
      include: { order: { select: { code: true, customerName: true } } },
      orderBy: { createdAt: "desc" },
    }).catch(() => []),
    prisma.expense.findMany({ where: { date: { gte: from, lte: to } }, orderBy: { date: "desc" } }).catch(() => []),
    prisma.redemption.findMany({
      where: { resolvedAt: { gte: from, lte: to }, status: "APROBADO" },
      include: { worker: { include: { user: { select: { name: true } } } }, product: { select: { name: true } } },
    }).catch(() => []),
  ]);

  const ventasUsd = orders.reduce((a, o) => a + o.totalUsd, 0);
  const ingresosUsd = payments.reduce((a, p) => a + p.amountUsd, 0);
  const gastosUsd = expenses.reduce((a, e) => a + e.amountUsd, 0);
  const canjesUsd = redemptions.reduce((a, r) => a + r.amountUsd, 0);
  const utilidad = ingresosUsd - gastosUsd - canjesUsd;

  const porCobrar = orders
    .map((o) => ({ ...o, paid: o.payments.reduce((a, p) => a + p.amountUsd, 0) }))
    .filter((o) => o.totalUsd - o.paid > 0.01);

  const porMoneda = ["USD", "COP", "VES"].map((cur) => {
    const rows = payments.filter((p) => p.currency === cur);
    return { currency: cur, local: rows.reduce((a, p) => a + p.amountLocal, 0), usd: rows.reduce((a, p) => a + p.amountUsd, 0), count: rows.length };
  }).filter((m) => m.count > 0);

  const porTrabajadora = Object.entries(
    orders.reduce<Record<string, { total: number; count: number }>>((acc, o) => {
      const key = o.worker?.user.name ?? "Venta directa";
      acc[key] = acc[key] || { total: 0, count: 0 };
      acc[key].total += o.totalUsd;
      acc[key].count += 1;
      return acc;
    }, {})
  ).map(([name, v]) => ({ name, ...v })).sort((a, b) => b.total - a.total);

  const csvData = {
    orders: orders.map((o) => ({
      Codigo: o.code, Cliente: o.customerName, Trabajadora: o.worker?.user.name ?? "",
      Estado: o.status, TotalUSD: o.totalUsd.toFixed(2), PagadoUSD: o.payments.reduce((a, p) => a + p.amountUsd, 0).toFixed(2),
      Moneda: o.currency, Fecha: o.createdAt.toLocaleDateString("es-CO"),
    })),
    payments: payments.map((p) => ({
      Pedido: p.order.code, Cliente: p.order.customerName, Metodo: PAYMENT_METHOD_LABELS[p.method] ?? p.method,
      Moneda: p.currency, MontoLocal: p.amountLocal.toFixed(2), EquivaleUSD: p.amountUsd.toFixed(2), Fecha: p.createdAt.toLocaleDateString("es-CO"),
    })),
    expenses: expenses.map((e) => ({
      Concepto: e.concept, Categoria: e.category, Moneda: e.currency, MontoUSD: e.amountUsd.toFixed(2), Fecha: e.date.toLocaleDateString("es-CO"),
    })),
    redemptions: redemptions.map((r) => ({
      Trabajadora: r.worker.user.name, Tipo: r.type, Producto: r.product?.name ?? "", MontoUSD: r.amountUsd.toFixed(2), Fecha: (r.resolvedAt ?? r.createdAt).toLocaleDateString("es-CO"),
    })),
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Contabilidad</h1>
          <p className="text-sm text-muted-foreground">Informes del período · todo normalizado a US$ para comparar</p>
        </div>
        <CsvExport range={`${fromStr}_${toStr}`} data={csvData} />
      </div>

      <form className="flex flex-wrap items-end gap-3 rounded-2xl border border-border bg-card p-4" action="/admin/contabilidad">
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Desde</label>
          <Input type="date" name="from" defaultValue={fromStr} className="h-9 w-44" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Hasta</label>
          <Input type="date" name="to" defaultValue={toStr} className="h-9 w-44" />
        </div>
        <Button variant="outline" className="h-9">Actualizar informe</Button>
      </form>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {[
          { label: "Ventas (US$)", value: ventasUsd, sub: `${orders.length} pedidos`, color: "text-primary" },
          { label: "Ingresos recibidos", value: ingresosUsd, sub: `${payments.length} abonos`, color: "text-emerald-600 dark:text-emerald-400" },
          { label: "Por cobrar", value: porCobrar.reduce((a, o) => a + (o.totalUsd - o.paid), 0), sub: `${porCobrar.length} pedidos con saldo`, color: "text-amber-600 dark:text-amber-400" },
          { label: "Gastos", value: gastosUsd, sub: `${expenses.length} registros`, color: "text-destructive" },
          { label: "Canjes pagados", value: canjesUsd, sub: `${redemptions.length} premios`, color: "text-muted-foreground" },
        ].map((k) => (
          <Card key={k.label} className="h-full"><CardBody className="p-4">
            <p className={`text-xl font-bold ${k.color}`}>US$ {k.value.toFixed(2)}</p>
            <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{k.label}</p>
            <p className="text-[11px] text-muted-foreground">{k.sub}</p>
          </CardBody></Card>
        ))}
      </div>

      <div className="rounded-2xl border border-gold/40 bg-gradient-to-r from-accent/60 to-card p-5">
        <p className="text-sm text-muted-foreground">Utilidad estimada del período (ingresos − gastos − premios pagados)</p>
        <p className={`font-display text-3xl font-bold ${utilidad >= 0 ? "text-primary" : "text-destructive"}`}>US$ {utilidad.toFixed(2)}</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Ingresos por moneda */}
        <Card>
          <CardHeader><CardTitle>Ingresos por moneda</CardTitle></CardHeader>
          <CardBody className="pt-3">
            {porMoneda.length === 0 ? <p className="text-sm text-muted-foreground">Sin ingresos en el período.</p> : (
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                  <th className="pb-2 font-semibold">Moneda</th><th className="pb-2 font-semibold">Abonos</th><th className="pb-2 text-right font-semibold">Recibido</th><th className="pb-2 text-right font-semibold">≈ US$</th>
                </tr></thead>
                <tbody>
                  {porMoneda.map((m) => (
                    <tr key={m.currency} className="border-b border-border/50 last:border-0">
                      <td className="py-2.5 font-bold">{m.currency}</td>
                      <td className="py-2.5 text-muted-foreground">{m.count}</td>
                      <td className="py-2.5 text-right font-semibold">{formatMoney(m.local, m.currency as "USD" | "COP" | "VES")}</td>
                      <td className="py-2.5 text-right text-muted-foreground">{m.usd.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardBody>
        </Card>

        {/* Ventas por trabajadora */}
        <Card>
          <CardHeader><CardTitle>Ventas por trabajadora</CardTitle></CardHeader>
          <CardBody className="pt-3">
            {porTrabajadora.length === 0 ? <p className="text-sm text-muted-foreground">Sin ventas en el período.</p> : (
              <ul className="space-y-2.5">
                {porTrabajadora.map((t) => {
                  const max = porTrabajadora[0].total || 1;
                  return (
                    <li key={t.name}>
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{t.name} <span className="text-xs text-muted-foreground">({t.count})</span></span>
                        <b className="text-primary">US$ {t.total.toFixed(2)}</b>
                      </div>
                      <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full bg-gradient-to-r from-gold-soft to-gold" style={{ width: `${(t.total / max) * 100}%` }} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Por cobrar */}
      <Card>
        <CardHeader><CardTitle>Cuentas por cobrar (50% pendientes)</CardTitle></CardHeader>
        <CardBody className="pt-3">
          {porCobrar.length === 0 ? <p className="text-sm text-muted-foreground">Sin saldos pendientes 🎉</p> : (
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                <th className="pb-2 font-semibold">Pedido</th><th className="pb-2 font-semibold">Cliente</th><th className="pb-2 font-semibold">Trabajadora</th>
                <th className="pb-2 text-right font-semibold">Total</th><th className="pb-2 text-right font-semibold">Saldo</th><th className="pb-2 text-right font-semibold">Vence</th>
              </tr></thead>
              <tbody>
                {porCobrar.map((o) => {
                  const overdue = o.balanceDueAt && o.balanceDueAt < new Date();
                  return (
                    <tr key={o.id} className="border-b border-border/50 last:border-0">
                      <td className="py-2.5 font-bold text-primary">{o.code}</td>
                      <td className="py-2.5">{o.customerName}</td>
                      <td className="py-2.5 text-muted-foreground">{o.worker?.user.name ?? "—"}</td>
                      <td className="py-2.5 text-right">US$ {o.totalUsd.toFixed(2)}</td>
                      <td className={`py-2.5 text-right font-bold ${overdue ? "text-destructive" : ""}`}>US$ {(o.totalUsd - o.paid).toFixed(2)}</td>
                      <td className={`py-2.5 text-right text-xs ${overdue ? "font-bold text-destructive" : "text-muted-foreground"}`}>
                        {o.balanceDueAt ? o.balanceDueAt.toLocaleDateString("es-CO") : "al entregar"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>

      <ExpenseManager expenses={expenses.map((e) => ({ id: e.id, concept: e.concept, amountUsd: e.amountUsd, currency: e.currency, category: e.category, date: e.date.toISOString() }))} />
    </div>
  );
}
