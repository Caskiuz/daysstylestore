import Image from "next/image";
import { getSession } from "@/lib/auth";
import { getProducts } from "@/lib/data";
import { ShareButton } from "@/components/worker/share-button";

export const dynamic = "force-dynamic";

export default async function CatalogoTrabajadoraPage() {
  const session = await getSession();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const { products } = await getProducts();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold">Catálogo para compartir</h1>
        <p className="text-sm text-muted-foreground">
          Comparte tus enlaces con el código <b className="text-primary">{session!.workerCode}</b>: los pedidos quedarán asociados a ti.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((p) => (
          <div key={p.id} className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-gold/50 hover:shadow-[var(--shadow-gold)]">
            <div className="relative aspect-[3/4] bg-muted">
              <Image src={p.images[0]} alt={p.name} fill sizes="(max-width: 640px) 90vw, 250px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div className="flex flex-1 flex-col gap-1.5 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{p.categoryName}</p>
              <p className="font-display font-semibold leading-snug">{p.name}</p>
              <p className="font-bold text-primary">US$ {p.priceUsd.toFixed(2)}</p>
              <div className="mt-2 flex gap-2">
                <ShareButton url={`${siteUrl}/producto/${p.slug}?ref=${session!.workerCode}`} name={p.name} className="flex-1" />
                <a
                  href={`/producto/${p.slug}?ref=${session!.workerCode}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center rounded-xl border border-border px-3 text-xs font-bold text-muted-foreground transition-colors hover:border-gold hover:text-primary"
                >
                  Ver
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
