import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts, getSettings } from "@/lib/data";
import { ProductDetail } from "@/components/shop/product-detail";
import { ProductCard } from "@/components/shop/product-card";
import { SectionTitle } from "@/components/home/sections";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Producto no encontrado" };
  return {
    title: product.name,
    description: product.description.slice(0, 155),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 155),
      images: product.images.slice(0, 1),
    },
  };
}

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const workerCode = typeof sp.ref === "string" ? sp.ref : undefined;
  const [settings, related] = await Promise.all([getSettings(), getRelatedProducts(product)]);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    brand: { "@type": "Brand", name: settings.storeName },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: product.priceUsd,
      availability: product.variants.some((v) => v.stock > 0)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><a href="/" className="hover:text-primary">Inicio</a></li>
          <li aria-hidden>/</li>
          <li><a href="/shop" className="hover:text-primary">Tienda</a></li>
          <li aria-hidden>/</li>
          <li><a href={`/shop?cat=${product.categorySlug}`} className="hover:text-primary">{product.categoryName}</a></li>
          <li aria-hidden>/</li>
          <li className="font-medium text-foreground">{product.name}</li>
        </ol>
      </nav>

      <ProductDetail
        product={product}
        storeName={settings.storeName}
        whatsapp={settings.whatsapp}
        siteUrl={siteUrl}
        workerCode={workerCode}
      />

      {related.length > 0 && (
        <section className="mt-20">
          <SectionTitle kicker="Te puede gustar" title="Productos relacionados" />
          <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} storeName={settings.storeName} whatsapp={settings.whatsapp} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
