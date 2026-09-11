import { prisma } from "@/lib/prisma";
import { CategoryManager } from "@/components/admin/category-manager";

export const dynamic = "force-dynamic";

export default async function AdminCategoriasPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  }).catch(() => []);

  return (
    <div className="space-y-2">
      <div>
        <h1 className="font-display text-2xl font-bold">Categorías</h1>
        <p className="text-sm text-muted-foreground">Organiza el catálogo por colecciones</p>
      </div>
      <CategoryManager categories={categories.map((c) => ({ id: c.id, name: c.name, productCount: c._count.products }))} />
    </div>
  );
}
