import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { formatDate, cn } from "@/lib/utils";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, type OrderStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function MisPedidosPage() {
  const session = await getSession();
  const orders = await prisma.order.findMany({
    where: { workerId: session!.workerId },
    include: { items: { select: { quantity: true } }, payments: { select: { amountUsd: true } } },
    orderBy: { createdAt: "desc" },
  }).catch(() => []);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Mis pedidos</h1>
          <p className="text-sm text-muted-foreground">{orders.length} pedidos registrados por ti</p>
        </div>
        <Link href="/trabajadora/pedidos/nuevo"><Button>+ Registrar pedido</Button></Link>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
          Aún no tienes pedidos. Registra el primero con el botón «Registrar pedido».
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {orders.map((o) => {
            const paid = o.payments.reduce((a, p) => a + p.amountUsd, 0);
            const balance = o.totalUsd - paid;
            const overdue = o.balanceDueAt && o.balanceDueAt < new Date() && balance > 0.01;
            return (
              <Link
                key={o.id}
                href="#"
                className="block rounded-2xl border border-border bg-card p-5 transition-all hover:border-gold/50 hover:shadow-[var(--shadow-gold)]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary">{o.code}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${ORDER_STATUS_COLORS[o.status as OrderStatus]}`}>
                    {ORDER_STATUS_LABELS[o.status as OrderStatus]}
                  </span>
                </div>
                <p className="mt-2 font-display font-bold">{o.customerName}</p>
                <p className="text-xs text-muted-foreground">
                  {o.items.reduce((a, i) => a + i.quantity, 0)} prendas · {formatDate(o.createdAt)}
                </p>
                <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-sm">
                  <span className="text-muted-foreground">Total <b className="text-foreground">US$ {o.totalUsd.toFixed(2)}</b></span>
                  {balance <= 0.01 ? (
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Pagado ✓</span>
                  ) : (
                    <span className={cn("text-xs font-bold", overdue ? "text-destructive" : "text-amber-600 dark:text-amber-400")}>
                      Falta US$ {balance.toFixed(2)}{o.balanceDueAt && !overdue ? ` · ${formatDate(o.balanceDueAt)}` : overdue ? " · vencido" : ""}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
