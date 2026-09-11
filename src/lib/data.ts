import "server-only";
import { prisma } from "@/lib/prisma";
import { DEMO_CATEGORIES, DEMO_PRODUCTS, DEMO_SETTINGS } from "@/lib/demo-data";
import type { PaymentMethod, PublicCategory, PublicProduct, StoreSettings } from "@/lib/types";

// Capa de datos pública: usa la base de datos si está disponible;
// si no (desarrollo local sin Neon), cae en datos demo para poder previsualizar.

function parsePaymentMethods(json: unknown): PaymentMethod[] {
  if (!Array.isArray(json)) return DEMO_SETTINGS.paymentMethods;
  return json.filter((m): m is PaymentMethod => !!m && typeof m === "object" && "name" in m);
}

export async function getSettings(): Promise<StoreSettings & { demo: boolean }> {
  try {
    const s = await prisma.setting.findUnique({ where: { id: "main" } });
    if (!s) return { ...DEMO_SETTINGS, demo: true };
    return {
      storeName: s.storeName,
      tagline: s.tagline,
      whatsapp: s.whatsapp || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "",
      instagram: s.instagram,
      facebook: s.facebook,
      tiktok: s.tiktok,
      email: s.email,
      address: s.address,
      aboutText: s.aboutText,
      aiPrompt: s.aiPrompt,
      aiEnabled: s.aiEnabled,
      usdToCop: s.usdToCop,
      usdToVes: s.usdToVes,
      rewardUnits: s.rewardUnits,
      currenciesEnabled: s.currenciesEnabled,
      paymentMethods: parsePaymentMethods(s.paymentMethods),
      demo: false,
    };
  } catch {
    return { ...DEMO_SETTINGS, demo: true };
  }
}

export async function getCategories(): Promise<PublicCategory[]> {
  try {
    const cats = await prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { products: { where: { active: true } } } } },
    });
    if (cats.length === 0) return DEMO_CATEGORIES;
    return cats.map((c) => ({ id: c.id, name: c.name, slug: c.slug, image: c.image, productCount: c._count.products }));
  } catch {
    return DEMO_CATEGORIES;
  }
}

function mapProduct(p: {
  id: string; name: string; slug: string; description: string; priceUsd: number; images: string[];
  categoryId: string; featured: boolean; active: boolean; tag: string | null;
  category: { name: string; slug: string };
  variants: { id: string; size: string; color: string; stock: number }[];
}): PublicProduct {
  return {
    id: p.id, name: p.name, slug: p.slug, description: p.description, priceUsd: p.priceUsd,
    images: p.images.length ? p.images : ["/products/placeholder.svg"],
    categoryId: p.categoryId, categoryName: p.category.name, categorySlug: p.category.slug,
    featured: p.featured, active: p.active, tag: p.tag,
    variants: p.variants.map((v) => ({ id: v.id, size: v.size, color: v.color, stock: v.stock })),
  };
}

export type ProductFilters = {
  category?: string;
  size?: string;
  color?: string;
  minUsd?: number;
  maxUsd?: number;
  search?: string;
  sort?: "nuevos" | "precio-asc" | "precio-desc" | "nombre";
  featuredOnly?: boolean;
  limit?: number;
};

export async function getProducts(filters: ProductFilters = {}): Promise<{ products: PublicProduct[]; demo: boolean }> {
  try {
    const where: Record<string, unknown> = { active: true };
    if (filters.category) where.category = { slug: filters.category };
    if (filters.featuredOnly) where.featured = true;
    if (filters.minUsd !== undefined || filters.maxUsd !== undefined) {
      where.priceUsd = {
        ...(filters.minUsd !== undefined ? { gte: filters.minUsd } : {}),
        ...(filters.maxUsd !== undefined ? { lte: filters.maxUsd } : {}),
      };
    }
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
      ];
    }
    if (filters.size || filters.color) {
      where.variants = {
        some: {
          ...(filters.size ? { size: filters.size } : {}),
          ...(filters.color ? { color: { contains: filters.color, mode: "insensitive" } } : {}),
        },
      };
    }
    const orderBy: Record<string, string> =
      filters.sort === "precio-asc" ? { priceUsd: "asc" }
      : filters.sort === "precio-desc" ? { priceUsd: "desc" }
      : filters.sort === "nombre" ? { name: "asc" }
      : { createdAt: "desc" };

    const products = await prisma.product.findMany({
      where,
      orderBy,
      ...(filters.limit ? { take: filters.limit } : {}),
      include: { category: true, variants: true },
    });
    if (products.length === 0 && !filters.category && !filters.search) {
      return { products: DEMO_PRODUCTS, demo: true };
    }
    return { products: products.map(mapProduct), demo: false };
  } catch {
    return { products: DEMO_PRODUCTS, demo: true };
  }
}

export async function getProductBySlug(slug: string): Promise<PublicProduct | null> {
  try {
    const p = await prisma.product.findUnique({
      where: { slug },
      include: { category: true, variants: true },
    });
    if (!p) {
      const demo = DEMO_PRODUCTS.find((d) => d.slug === slug);
      return demo ?? null;
    }
    return mapProduct(p);
  } catch {
    return DEMO_PRODUCTS.find((d) => d.slug === slug) ?? null;
  }
}

export async function getRelatedProducts(product: PublicProduct, limit = 4): Promise<PublicProduct[]> {
  const { products } = await getProducts({ category: product.categorySlug, limit: limit + 1 });
  return products.filter((p) => p.id !== product.id).slice(0, limit);
}

/** Todos los tamaños y colores disponibles (para filtros del catálogo). */
export async function getFilterOptions(): Promise<{ sizes: string[]; colors: string[] }> {
  const { products } = await getProducts();
  const sizes = new Set<string>();
  const colors = new Set<string>();
  for (const p of products) {
    p.variants.forEach((v) => {
      sizes.add(v.size);
      colors.add(v.color);
    });
  }
  const sizeOrder = ["XS", "S", "M", "L", "XL", "XXL", "S/M", "L/XL", "Única"];
  return {
    sizes: [...sizes].sort((a, b) => {
      const ia = sizeOrder.indexOf(a); const ib = sizeOrder.indexOf(b);
      if (ia !== -1 && ib !== -1) return ia - ib;
      if (ia !== -1) return -1;
      if (ib !== -1) return 1;
      return parseInt(a) - parseInt(b) || a.localeCompare(b);
    }),
    colors: [...colors].sort(),
  };
}
