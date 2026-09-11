import { CheckCircle2, Clock, Gift, XCircle } from "lucide-react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getWorkerBalance } from "@/lib/rewards";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/misc";
import { RedemptionForm } from "@/components/worker/redemption-form";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function MisCanjesPage() {
  const session = await getSession();
  const workerId = session!.workerId!;

  const [balance, redemptions, products] = await Promise.all([
    getWorkerBalance(workerId),
    prisma.redemption.findMany({
      where: { workerId },
      include: { product: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 30,
    }).catch(() => []),
    prisma.product.findMany({
      where: { active: true },
      select: { id: true, name: true, priceUsd: true, variants: true },
      orderBy: { name: "asc" },
    }).catch(() => []),
  ]);

  const STATUS_UI = {
    PENDIENTE: { icon: Clock, cls: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300", label: "En aprobación" },
    APROBADO: { icon: CheckCircle2, cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300", label: "Aprobado" },
    RECHAZADO: { icon: XCircle, cls: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300", label: "Rechazado" },
  } as const;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Mis premios</h1>
        <p className="text-sm text-muted-foreground">Canjea tu saldo por productos o efectivo</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="border-gold/40">
          <CardHeader>
            <CardTitle>Solicitar canje</CardTitle>
            <p className="text-sm text-muted-foreground">Saldo disponible: <b className="text-primary">US$ {balance.availableUsd.toFixed(2)}</b></p>
          </CardHeader>
          <CardBody className="pt-3">
            <RedemptionForm products={products} availableUsd={balance.availableUsd} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Gift size={17} className="text-gold" /> Historial de canjes</CardTitle></CardHeader>
          <CardBody className="pt-3">
            {redemptions.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">Aún no has solicitado canjes.</p>
            ) : (
              <ul className="divide-y divide-border">
                {redemptions.map((r) => {
                  const ui = STATUS_UI[r.status as keyof typeof STATUS_UI] ?? STATUS_UI.PENDIENTE;
                  return (
                    <li key={r.id} className="flex items-center gap-3 py-3">
                      <ui.icon size={18} className="shrink-0 text-gold" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">
                          {r.type === "PRODUCTO" ? r.product?.name ?? "Producto" : `Efectivo${r.currency ? ` (${r.currency})` : ""}`}
                        </p>
                        <p className="text-xs text-muted-foreground">Solicitado el {formatDate(r.createdAt)}{r.note && ` · ${r.note}`}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">US$ {r.amountUsd.toFixed(2)}</p>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${ui.cls}`}>{ui.label}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
