import { Gift, Settings2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getWorkerProgress } from "@/lib/rewards";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/misc";
import { RedemptionCard } from "@/components/admin/redemption-card";
import { RewardUnitsSetting } from "@/components/admin/reward-units-setting";

export const dynamic = "force-dynamic";

export default async function AdminPremiosPage() {
  const [setting, workersRaw, pending, history] = await Promise.all([
    prisma.setting.findUnique({ where: { id: "main" } }).catch(() => null),
    prisma.worker.findMany({
      where: { active: true },
      include: {
        user: { select: { name: true } },
        credits: { select: { quantity: true, valueUsd: true } },
        redemptions: { select: { amountUsd: true, status: true } },
      },
    }).catch(() => [] as never[]),
    prisma.redemption.findMany({
      where: { status: "PENDIENTE" },
      include: {
        worker: { include: { user: { select: { name: true } } } },
        product: { select: { name: true } },
      },
      orderBy: { createdAt: "asc" },
    }).catch(() => [] as never[]),
    prisma.redemption.findMany({
      where: { status: { in: ["APROBADO", "RECHAZADO"] } },
      include: {
        worker: { include: { user: { select: { name: true } } } },
        product: { select: { name: true } },
      },
      orderBy: { resolvedAt: "desc" },
      take: 12,
    }).catch(() => [] as never[]),
  ]);

  const rewardUnits = setting?.rewardUnits ?? 4;

  const workers = await Promise.all(
    workersRaw.map(async (w: typeof workersRaw[number]) => {
      const earned = w.credits.reduce((a: number, c: { quantity: number; valueUsd: number }) => a + c.quantity * c.valueUsd, 0);
      const redeemed = w.redemptions.filter((r: { status: string }) => r.status === "APROBADO").reduce((a: number, r: { amountUsd: number }) => a + r.amountUsd, 0);
      const pendingAmt = w.redemptions.filter((r: { status: string }) => r.status === "PENDIENTE").reduce((a: number, r: { amountUsd: number }) => a + r.amountUsd, 0);
      const progress = await getWorkerProgress(w.id);
      return { id: w.id, name: w.user.name, code: w.code, earned, redeemed, pendingAmt, available: Math.max(0, earned - redeemed - pendingAmt), progress };
    })
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Premios y canjes</h1>
        <p className="text-sm text-muted-foreground">Programa «vendes {rewardUnits}, ganas 1»: aprueba canjes y sigue el progreso del equipo</p>
      </div>

      <RewardUnitsSetting current={rewardUnits} />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift size={17} className="text-gold" /> Canjes pendientes ({pending.length})
          </CardTitle>
        </CardHeader>
        <CardBody className="space-y-3 pt-3">
          {pending.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">No hay canjes pendientes ✨</p>
          ) : (
            pending.map((r: typeof pending[number]) => (
              <RedemptionCard
                key={r.id}
                id={r.id}
                workerName={r.worker.user.name}
                type={r.type}
                productName={r.product?.name}
                variantLabel={null}
                amountUsd={r.amountUsd}
                currency={r.currency}
                note={r.note}
                createdAt={r.createdAt.toISOString()}
              />
            ))
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader><CardTitle>Progreso y saldos del equipo</CardTitle></CardHeader>
        <CardBody className="pt-3">
          {workers.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">Sin trabajadoras activas.</p>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {workers.map((w) => (
                <div key={w.id} className="rounded-2xl border border-border p-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gold-soft to-gold font-bold text-[#2a2005]">{w.name.charAt(0)}</span>
                    <div className="flex-1">
                      <p className="font-display font-bold">{w.name} <span className="text-xs font-normal text-muted-foreground">({w.code})</span></p>
                      <p className="text-xs text-muted-foreground">
                        Disponible: <b className="text-primary">US$ {w.available.toFixed(2)}</b> · Ganado US$ {w.earned.toFixed(2)} · Canjeado US$ {w.redeemed.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  {w.progress.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {w.progress.slice(0, 5).map((p) => (
                        <div key={p.productId}>
                          <div className="flex justify-between text-[11px]">
                            <span className="truncate font-medium">{p.productName}</span>
                            <span className="text-muted-foreground">
                              {p.credits > 0 && <b className="text-primary">{p.credits}✓ </b>}
                              {p.progress}/{p.goal}
                            </span>
                          </div>
                          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                            <div className="h-full rounded-full bg-gradient-to-r from-gold-soft to-gold" style={{ width: `${(p.progress / p.goal) * 100}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Settings2 size={16} className="text-gold" /> Historial de canjes</CardTitle></CardHeader>
        <CardBody className="pt-3">
          {history.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">Aún no hay canjes resueltos.</p>
          ) : (
            <ul className="divide-y divide-border text-sm">
              {history.map((r: typeof history[number]) => (
                <li key={r.id} className="flex items-center gap-3 py-2.5">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${r.status === "APROBADO" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" : "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300"}`}>
                    {r.status === "APROBADO" ? "APROBADO" : "RECHAZADO"}
                  </span>
                  <span className="min-w-0 flex-1 truncate">
                    <b>{r.worker.user.name}</b> · {r.type === "PRODUCTO" ? r.product?.name : "Efectivo"} · US$ {r.amountUsd.toFixed(2)}
                  </span>
                  <span className="text-xs text-muted-foreground">{r.resolvedAt?.toLocaleDateString("es-CO")}</span>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
