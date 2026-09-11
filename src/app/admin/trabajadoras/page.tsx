import { prisma } from "@/lib/prisma";
import { WorkerManager, type WorkerRow } from "@/components/admin/worker-manager";

export const dynamic = "force-dynamic";

export default async function AdminTrabajadorasPage() {
  const workersRaw = await prisma.worker.findMany({
    include: {
      user: { select: { name: true, email: true } },
      credits: { select: { quantity: true, valueUsd: true } },
      redemptions: { select: { amountUsd: true, status: true } },
    },
    orderBy: { createdAt: "asc" },
  }).catch(() => []);

  const workers: WorkerRow[] = workersRaw.map((w) => {
    const earned = w.credits.reduce((a, c) => a + c.quantity * c.valueUsd, 0);
    const redeemed = w.redemptions.filter((r) => r.status === "APROBADO").reduce((a, r) => a + r.amountUsd, 0);
    const pending = w.redemptions.filter((r) => r.status === "PENDIENTE").reduce((a, r) => a + r.amountUsd, 0);
    return {
      id: w.id,
      name: w.user.name,
      email: w.user.email,
      phone: w.phone,
      code: w.code,
      active: w.active,
      earned,
      available: Math.max(0, earned - redeemed - pending),
      pendingCount: w.redemptions.filter((r) => r.status === "PENDIENTE").length,
    };
  });

  return (
    <div className="space-y-2">
      <div>
        <h1 className="font-display text-2xl font-bold">Trabajadoras</h1>
        <p className="text-sm text-muted-foreground">Equipo de asesoras: accesos, códigos y saldo de premios</p>
      </div>
      <WorkerManager workers={workers} siteUrl={process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"} />
    </div>
  );
}
