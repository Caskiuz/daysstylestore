import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/data";
import { OrderForm } from "@/components/admin/order-form";

export const dynamic = "force-dynamic";

export default async function NuevoPedidoTrabajadoraPage() {
  const [products, settings] = await Promise.all([
    prisma.product.findMany({ where: { active: true }, select: { id: true, name: true, priceUsd: true, variants: true }, orderBy: { name: "asc" } }).catch(() => []),
    getSettings(),
  ]);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/trabajadora/pedidos" className="rounded-lg p-2 text-muted-foreground hover:bg-muted" aria-label="Volver"><ArrowLeft size={18} /></Link>
        <div>
          <h1 className="font-display text-2xl font-bold">Registrar pedido</h1>
          <p className="text-sm text-muted-foreground">Anota la venta de tu clienta: suma premios automáticamente al entregar</p>
        </div>
      </div>
      <OrderForm mode="worker" products={products} workers={[]} rates={{ usdToCop: settings.usdToCop, usdToVes: settings.usdToVes }} />
    </div>
  );
}
