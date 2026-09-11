import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MessageCircle, Phone, Sparkles, User } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/data";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/misc";
import { Button } from "@/components/ui/button";
import { OrderActions } from "@/components/admin/order-actions";
import { PaymentForm } from "@/components/admin/payment-form";
import { formatDate, daysUntil, cn } from "@/lib/utils";
import { convertFromUsd, formatMoney } from "@/lib/currency";
import { waLink } from "@/lib/whatsapp";
import { ORDER_STATUSES, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, PAYMENT_METHOD_LABELS, type OrderStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

const FLOW_STEPS = ["PENDIENTE", "CONFIRMADO", "EN_REPARTO", "ENTREGADA_TRABAJADORA", "ENTREGADA_CLIENTE", "CERRADO"];

export default async function PedidoDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [order, settings] = await Promise.all([
    prisma.order.findUnique({
      where: { id },
      include: {
        worker: { include: { user: { select: { name: true } } } },
        items: { include: { product: { select: { name: true, slug: true } } } },
        payments: true,
      },
    }).catch(() => null),
    getSettings(),
  ]);
  if (!order) notFound();

  const paidUsd = order.payments.reduce((a, p) => a + p.amountUsd, 0);
  const balanceUsd = order.totalUsd - paidUsd;
  const overdue = order.balanceDueAt && order.balanceDueAt < new Date() && balanceUsd > 0.01;
  const rates = { usdToCop: settings.usdToCop, usdToVes: settings.usdToVes };
  const status = order.status as OrderStatus;
  const currentStep = FLOW_STEPS.indexOf(order.status);
  const totalLocal = convertFromUsd(order.totalUsd, order.currency as "USD" | "COP" | "VES", rates);

  const customerWa = waLink(
    order.customerPhone,
    `¡Hola ${order.customerName}! Te escribo de ${settings.storeName} por tu pedido ${order.code} 🛍️`
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <Link href="/admin/pedidos" className="rounded-lg p-2 text-muted-foreground hover:bg-muted" aria-label="Volver"><ArrowLeft size={18} /></Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-bold">{order.code}</h1>
            <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${ORDER_STATUS_COLORS[status]}`}>{ORDER_STATUS_LABELS[status]}</span>
          </div>
          <p className="text-sm text-muted-foreground">Creado el {formatDate(order.createdAt)}{order.worker && ` · Trabajadora: ${order.worker.user.name}`}</p>
        </div>
        <a href={customerWa} target="_blank" rel="noopener noreferrer">
          <Button variant="whatsapp"><MessageCircle size={16} /> Escribir a la clienta</Button>
        </a>
      </div>

      <OrderActions orderId={order.id} status={order.status} />

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          {/* Timeline */}
          {order.status !== "CANCELADO" && (
            <Card>
              <CardBody>
                <div className="flex items-start justify-between gap-1">
                  {FLOW_STEPS.map((s, i) => (
                    <div key={s} className="flex flex-1 flex-col items-center text-center">
                      <div className="flex w-full items-center">
                        <span className={cn("h-0.5 flex-1", i === 0 ? "bg-transparent" : i <= currentStep ? "bg-gold" : "bg-border")} />
                        <span
                          className={cn(
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors",
                            i < currentStep ? "border-gold bg-gradient-to-b from-[#e9d489] to-[#d4af37] text-[#2a2005]" :
                            i === currentStep ? "border-gold text-primary gold-ring" : "border-border text-muted-foreground"
                          )}
                        >
                          {i < currentStep ? "✓" : i + 1}
                        </span>
                        <span className={cn("h-0.5 flex-1", i === FLOW_STEPS.length - 1 ? "bg-transparent" : i < currentStep ? "bg-gold" : "bg-border")} />
                      </div>
                      <span className={cn("mt-2 hidden text-[10px] font-semibold leading-tight sm:block", i === currentStep ? "text-primary" : "text-muted-foreground")}>
                        {ORDER_STATUS_LABELS[s as OrderStatus]}
                      </span>
                    </div>
                  ))}
                </div>
                {status === "ENTREGADA_CLIENTE" && (
                  <p className="mt-4 flex items-center justify-center gap-1.5 rounded-xl bg-accent px-3 py-2 text-xs font-semibold text-accent-foreground">
                    <Sparkles size={13} /> Premios «vendes {settings.rewardUnits} ganas 1» acumulados a la trabajadora ✓
                  </p>
                )}
              </CardBody>
            </Card>
          )}

          {/* Items */}
          <Card>
            <CardHeader><CardTitle>Productos</CardTitle></CardHeader>
            <CardBody className="pt-3">
              <ul className="divide-y divide-border">
                {order.items.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 py-2.5">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{item.nameSnapshot}</p>
                      <p className="text-xs text-muted-foreground">{item.variantSnapshot} · US$ {item.unitPriceUsd.toFixed(2)} c/u</p>
                    </div>
                    <span className="text-sm text-muted-foreground">×{item.quantity}</span>
                    <span className="w-24 text-right text-sm font-bold">US$ {(item.unitPriceUsd * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex justify-between border-t border-border pt-3">
                <span className="font-display font-bold">Total</span>
                <span className="font-display font-bold text-primary">US$ {order.totalUsd.toFixed(2)} · {formatMoney(totalLocal, order.currency as "USD" | "COP" | "VES")}</span>
              </div>
            </CardBody>
          </Card>

          {/* Pagos */}
          <Card>
            <CardHeader><CardTitle>Abonos del cliente</CardTitle></CardHeader>
            <CardBody className="pt-3">
              {order.payments.length > 0 ? (
                <ul className="mb-4 divide-y divide-border">
                  {order.payments.map((p) => (
                    <li key={p.id} className="flex items-center gap-3 py-2.5 text-sm">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold">{formatMoney(p.amountLocal, p.currency as "USD" | "COP" | "VES")} <span className="text-xs font-normal text-muted-foreground">(≈ US$ {p.amountUsd.toFixed(2)})</span></p>
                        <p className="text-xs text-muted-foreground">{PAYMENT_METHOD_LABELS[p.method] ?? p.method} · {formatDate(p.createdAt)}{p.reference && ` · Ref: ${p.reference}`}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mb-4 text-sm text-muted-foreground">Sin abonos registrados todavía.</p>
              )}
              <PaymentForm orderId={order.id} methods={settings.paymentMethods.filter((m) => m.enabled)} balanceUsd={balanceUsd} />
            </CardBody>
          </Card>
        </div>

        {/* Panel lateral */}
        <div className="space-y-5">
          <Card>
            <CardBody>
              <h3 className="flex items-center gap-2 font-display font-bold"><User size={16} className="text-gold" /> Clienta</h3>
              <p className="mt-2 text-sm font-semibold">{order.customerName}</p>
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground"><Phone size={13} /> +{order.customerPhone}</p>
              {order.notes && <p className="mt-3 rounded-xl bg-muted p-3 text-xs leading-relaxed text-muted-foreground">📝 {order.notes}</p>}
            </CardBody>
          </Card>

          <Card className={cn(balanceUsd > 0.01 && overdue && "border-destructive/50")}>
            <CardBody>
              <h3 className="font-display font-bold">Estado del cobro</h3>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Total</span><b>US$ {order.totalUsd.toFixed(2)}</b></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Pagado</span><b className="text-emerald-600 dark:text-emerald-400">US$ {paidUsd.toFixed(2)}</b></div>
                <div className="gold-line my-1" />
                <div className="flex justify-between"><span className="text-muted-foreground">Saldo</span><b className={balanceUsd > 0.01 ? (overdue ? "text-destructive" : "text-primary") : "text-emerald-600 dark:text-emerald-400"}>US$ {balanceUsd.toFixed(2)}</b></div>
                {order.balanceDueAt && balanceUsd > 0.01 && (
                  <p className={cn("rounded-lg px-3 py-2 text-xs font-semibold", overdue ? "bg-destructive/10 text-destructive" : "bg-accent text-accent-foreground")}>
                    {overdue ? `⚠ Vencido hace ${Math.abs(daysUntil(order.balanceDueAt))} días` : `Vence en ${daysUntil(order.balanceDueAt)} días (${formatDate(order.balanceDueAt)})`}
                  </p>
                )}
                {order.deliveredAt && <p className="text-xs text-muted-foreground">Entregado al cliente: {formatDate(order.deliveredAt)}</p>}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
