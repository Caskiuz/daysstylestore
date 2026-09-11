import type { MetadataRoute } from "next";
import { getCategories, getProducts } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const [{ products }, categories] = await Promise.all([getProducts(), getCategories()]);

  const staticPages = ["", "/shop", "/tallas", "/nosotros", "/faq", "/contacto", "/wishlist", "/politicas/cambios", "/politicas/privacidad", "/politicas/terminos"].map((p) => ({
    url: `${base}${p}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.7,
  }));

  const productPages = products.map((p) => ({
    url: `${base}/producto/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  const categoryPages = categories.map((c) => ({
    url: `${base}/shop?cat=${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...productPages, ...categoryPages];
}
