import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";

export const dynamic = "force-dynamic";

export default async function NuevoProductoPage() {
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } }).catch(() => []);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold">Nuevo producto</h1>
        <p className="text-sm text-muted-foreground">Agrega una prenda al catálogo con sus variantes</p>
      </div>
      <ProductForm categories={categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug, image: c.image }))} />
    </div>
  );
}
