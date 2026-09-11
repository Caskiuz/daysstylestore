"use client";

import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/misc";
import { PAYMENT_METHOD_LABELS } from "@/lib/types";

const GOLD = "#d4af37";
const GOLD_SOFT = "#ecd98b";
const GOLD_DEEP = "#8a6d1d";
const CURRENCY_COLORS: Record<string, string> = { USD: GOLD, COP: GOLD_SOFT, VES: GOLD_DEEP };

export function DashboardCharts({
  serie,
  ingresosPorMoneda,
  ingresosPorMetodo,
}: {
  serie: { mes: string; total: number }[];
  ingresosPorMoneda: { currency: string; totalLocal: number; totalUsd: number; count: number }[];
  ingresosPorMetodo: { method: string; usd: number; count: number }[];
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Ventas por mes (US$)</CardTitle>
          <p className="text-xs text-muted-foreground">Últimos 6 meses</p>
        </CardHeader>
        <CardBody className="pt-2">
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={serie} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={GOLD} />
                    <stop offset="100%" stopColor={GOLD_SOFT} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: "rgba(212,175,55,0.08)" }}
                  contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 13 }}
                  formatter={(v) => [`US$ ${Number(v).toLocaleString()}`, "Ventas"]}
                />
                <Bar dataKey="total" fill="url(#barGold)" radius={[8, 8, 0, 0]} maxBarSize={46} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>

      <div className="grid gap-5 sm:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Ingresos por moneda</CardTitle></CardHeader>
          <CardBody className="pt-0">
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ingresosPorMoneda}
                    dataKey="totalUsd"
                    nameKey="currency"
                    innerRadius="58%"
                    outerRadius="88%"
                    paddingAngle={3}
                    strokeWidth={0}
                  >
                    {ingresosPorMoneda.map((e) => (
                      <Cell key={e.currency} fill={CURRENCY_COLORS[e.currency] || GOLD} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 13 }}
                    formatter={(v, name) => [`US$ ${Number(v).toLocaleString(undefined, { maximumFractionDigits: 2 })}`, `Ingresos ${name}`]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-1 space-y-1">
              {ingresosPorMoneda.map((m) => (
                <li key={m.currency} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: CURRENCY_COLORS[m.currency] }} />
                    {m.currency} · {m.count} pagos
                  </span>
                  <b>{m.currency === "USD" ? "US$" : m.currency === "COP" ? "$" : "Bs."} {Math.round(m.totalLocal).toLocaleString()}</b>
                </li>
              ))}
              {ingresosPorMoneda.length === 0 && <li className="text-center text-xs text-muted-foreground">Sin pagos registrados</li>}
            </ul>
          </CardBody>
        </Card>

        <Card>
          <CardHeader><CardTitle>Por método de pago</CardTitle></CardHeader>
          <CardBody className="space-y-2.5 pt-0">
            {ingresosPorMetodo.length === 0 && <p className="py-6 text-center text-xs text-muted-foreground">Sin pagos registrados</p>}
            {ingresosPorMetodo.map((m) => {
              const pct = ingresosPorMetodo[0].usd > 0 ? (m.usd / ingresosPorMetodo.reduce((a, x) => a + x.usd, 0)) * 100 : 0;
              return (
                <div key={m.method}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium">{PAYMENT_METHOD_LABELS[m.method] ?? m.method}</span>
                    <span className="text-muted-foreground">US$ {m.usd.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-gradient-to-r from-gold-soft to-gold transition-all" style={{ width: `${Math.max(4, pct)}%` }} />
                  </div>
                </div>
              );
            })}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
