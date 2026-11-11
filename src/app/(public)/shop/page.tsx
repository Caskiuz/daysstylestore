import type { Metadata } from "next";
import { Suspense } from "react";
import { PackageSearch } from "lucide-react";
import { FilterBar } from "@/components/shop/filter-bar";
import { ProductCard } from "@/components/shop/product-card";
import { EmptyState } from "@/components/ui/misc";
import { getCategories, getFilterOptions, getProducts, getSettings, type ProductFilters } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tienda",
  description: "Explora el catálogo de Days Style Store: sandalias y chanclas de temporada en tallas 34 al 40, con entrega personalizada.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const get = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : undefined);

  const filters: ProductFilters = {
    category: get("cat"),
    size: get("size"),
    color: get("color"),
    search: get("q"),
    sort: (get("sort") as ProductFilters["sort"]) || "nuevos",
  };

  const [settings, categories, options, result] = await Promise.all([
    getSettings(),
    getCategories(),
    getFilterOptions(),
    getProducts(filters),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <header className="mb-8 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Colección</p>
        <h1 className="mt-2 font-display text-4xl font-bold">
          Nuestra <span className="text-gradient-gold">Tienda</span>
        </h1>
        <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent" />
      </header>

      <Suspense fallback={<div className="skeleton h-20 rounded-2xl" />}>
        <FilterBar categories={categories} sizes={options.sizes} colors={options.colors} />
      </Suspense>

      <p className="my-6 text-sm text-muted-foreground">
        {result.products.length} {result.products.length === 1 ? "producto encontrado" : "productos encontrados"}
      </p>

      {result.products.length === 0 ? (
        <EmptyState
          icon={<PackageSearch size={40} strokeWidth={1.4} />}
          title="No encontramos prendas con esos filtros"
          subtitle="Prueba quitando algunos filtros o buscando por otro nombre."
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {result.products.map((p) => (
            <ProductCard key={p.id} product={p} storeName={settings.storeName} whatsapp={settings.whatsapp} />
          ))}
        </div>
      )}
    </div>
  );
}
