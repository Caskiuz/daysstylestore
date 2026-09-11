import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";
import type { ProductInput } from "@/lib/actions/admin";

export const dynamic = "force-dynamic";

export default async function EditarProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id }, include: { variants: true } }).catch(() => null),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }).catch(() => []),
  ]);
  if (!product) notFound();

  const initial: ProductInput & { id: string; slug: string } = {
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description,
    priceUsd: product.priceUsd,
    categoryId: product.categoryId,
    images: product.images,
    featured: product.featured,
    active: product.active,
    tag: product.tag,
    variants: product.variants.map((v) => ({ size: v.size, color: v.color, stock: v.stock })),
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/admin/productos" className="rounded-lg p-2 text-muted-foreground hover:bg-muted" aria-label="Volver">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold">{product.name}</h1>
          <p className="text-sm text-muted-foreground">Edita la información, fotos y stock</p>
        </div>
      </div>
      <ProductForm categories={categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug, image: c.image }))} product={initial} />
    </div>
  );
}
