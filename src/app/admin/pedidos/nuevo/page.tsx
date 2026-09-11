import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { OrderForm } from "@/components/admin/order-form";
import { getSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function NuevoPedidoPage() {
  const [products, workersRaw, settings] = await Promise.all([
    prisma.product.findMany({ where: { active: true }, select: { id: true, name: true, priceUsd: true, variants: true }, orderBy: { name: "asc" } }).catch(() => []),
    prisma.worker.findMany({ where: { active: true }, include: { user: { select: { name: true } } }, orderBy: { user: { name: "asc" } } }).catch(() => []),
    getSettings(),
  ]);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/admin/pedidos" className="rounded-lg p-2 text-muted-foreground hover:bg-muted" aria-label="Volver"><ArrowLeft size={18} /></Link>
        <div>
          <h1 className="font-display text-2xl font-bold">Nuevo pedido</h1>
          <p className="text-sm text-muted-foreground">Registra la venta y asigna la trabajadora</p>
        </div>
      </div>
      <OrderForm
        mode="admin"
        products={products}
        workers={workersRaw.map((w) => ({ id: w.id, name: w.user.name }))}
        rates={{ usdToCop: settings.usdToCop, usdToVes: settings.usdToVes }}
      />
    </div>
  );
}
