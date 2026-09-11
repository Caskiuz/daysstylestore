import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/misc";
import { ProductRowActions } from "@/components/admin/product-row-actions";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminProductosPage() {
  const products = await prisma.product.findMany({
    include: { category: true, variants: true },
    orderBy: { createdAt: "desc" },
  }).catch(() => []);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Productos</h1>
          <p className="text-sm text-muted-foreground">{products.length} productos · gestiona stock, precios y fotos</p>
        </div>
        <Link href="/admin/productos/nuevo"><Button>+ Nuevo producto</Button></Link>
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
          No hay productos aún. Crea el primero con «Nuevo producto».
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-3 font-semibold">Producto</th>
                  <th className="px-4 py-3 font-semibold">Categoría</th>
                  <th className="px-4 py-3 font-semibold">Precio</th>
                  <th className="px-4 py-3 font-semibold">Stock</th>
                  <th className="px-4 py-3 font-semibold">Estado</th>
                  <th className="px-4 py-3 font-semibold">Creado</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const stock = p.variants.reduce((a, v) => a + v.stock, 0);
                  return (
                    <tr key={p.id} className="border-b border-border/60 transition-colors last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <Link href={`/admin/productos/${p.id}`} className="flex items-center gap-3">
                          <span className="relative h-12 w-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                            {p.images[0] && <Image src={p.images[0]} alt={p.name} fill sizes="40px" className="object-cover" />}
                          </span>
                          <span>
                            <span className="font-semibold hover:text-primary">{p.name}</span>
                            {p.featured && <Badge className="ml-2 bg-gold/20 text-primary">★</Badge>}
                          </span>
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{p.category.name}</td>
                      <td className="px-4 py-3 font-semibold">US$ {p.priceUsd.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span className={stock === 0 ? "font-bold text-destructive" : stock <= 5 ? "font-bold text-amber-600 dark:text-amber-400" : "font-semibold"}>
                          {stock}
                        </span>
                        <span className="text-xs text-muted-foreground"> ({p.variants.length} var.)</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${p.active ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" : "bg-zinc-200 text-zinc-600 dark:bg-zinc-700/40 dark:text-zinc-300"}`}>
                          {p.active ? "Activo" : "Oculto"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(p.createdAt)}</td>
                      <td className="px-4 py-3"><ProductRowActions id={p.id} active={p.active} name={p.name} /></td>
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
