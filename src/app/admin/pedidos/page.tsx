import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { formatDate, daysUntil } from "@/lib/utils";
import { ORDER_STATUSES, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, type OrderStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminPedidosPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const status = typeof sp.status === "string" ? sp.status : "";

  const where: Record<string, unknown> = {};
  if (status && ORDER_STATUSES.includes(status as OrderStatus)) where.status = status;

  const orders = await prisma.order.findMany({
    where,
    include: {
      worker: { include: { user: { select: { name: true } } } },
      items: { select: { quantity: true } },
      payments: { select: { amountUsd: true } },
    },
    orderBy: { createdAt: "desc" },
  }).catch(() => []);

  const today = new Date();

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Pedidos</h1>
          <p className="text-sm text-muted-foreground">{orders.length} {status ? `con estado ${ORDER_STATUS_LABELS[status as OrderStatus]}` : "en total"}</p>
        </div>
        <Link href="/admin/pedidos/nuevo"><Button>+ Nuevo pedido</Button></Link>
      </div>

      {/* Tabs de estado */}
      <div className="flex flex-wrap gap-1.5">
        <Link
          href="/admin/pedidos"
          className={cn("rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors", !status ? "bg-gradient-to-b from-[#e9d489] to-[#d4af37] text-[#2a2005]" : "border border-border text-muted-foreground hover:border-gold/50 hover:text-primary")}
        >
          Todos
        </Link>
        {ORDER_STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/pedidos?status=${s}`}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors",
              status === s ? "bg-gradient-to-b from-[#e9d489] to-[#d4af37] text-[#2a2005]" : "border border-border text-muted-foreground hover:border-gold/50 hover:text-primary"
            )}
          >
            {ORDER_STATUS_LABELS[s]}
          </Link>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
          No hay pedidos {status && "con este estado"}.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-3 font-semibold">Código</th>
                  <th className="px-4 py-3 font-semibold">Cliente</th>
                  <th className="px-4 py-3 font-semibold">Trabajadora</th>
                  <th className="px-4 py-3 font-semibold">Prendas</th>
                  <th className="px-4 py-3 font-semibold">Total</th>
                  <th className="px-4 py-3 font-semibold">Pagado</th>
                  <th className="px-4 py-3 font-semibold">Cobro</th>
                  <th className="px-4 py-3 font-semibold">Estado</th>
                  <th className="px-4 py-3 font-semibold">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => {
                  const paid = o.payments.reduce((a, p) => a + p.amountUsd, 0);
                  const balance = o.totalUsd - paid;
                  const overdue = o.balanceDueAt && o.balanceDueAt < today && balance > 0.01;
                  return (
                    <tr key={o.id} className="border-b border-border/60 transition-colors last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <Link href={`/admin/pedidos/${o.id}`} className="font-bold text-primary hover:underline">{o.code}</Link>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold">{o.customerName}</p>
                        <p className="text-xs text-muted-foreground">+{o.customerPhone}</p>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{o.worker?.user.name ?? "—"}</td>
                      <td className="px-4 py-3">{o.items.reduce((a, i) => a + i.quantity, 0)}</td>
                      <td className="px-4 py-3 font-semibold">US$ {o.totalUsd.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span className={balance <= 0.01 ? "font-bold text-emerald-600 dark:text-emerald-400" : "font-semibold"}>
                          US$ {paid.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {balance <= 0.01 ? (
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Pagado</span>
                        ) : overdue ? (
                          <span className="text-xs font-bold text-destructive">Vencido ({Math.abs(daysUntil(o.balanceDueAt!))}d)</span>
                        ) : o.balanceDueAt ? (
                          <span className="text-xs text-muted-foreground">en {daysUntil(o.balanceDueAt)}d</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${ORDER_STATUS_COLORS[o.status as OrderStatus]}`}>
                          {ORDER_STATUS_LABELS[o.status as OrderStatus]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(o.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
