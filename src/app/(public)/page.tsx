import { Hero } from "@/components/home/hero";
import {
  BenefitsSection,
  CategoriesSection,
  FeaturedSection,
  FinalCTA,
  TestimonialsSection,
  WorkerProgramSection,
} from "@/components/home/sections";
import { getCategories, getProducts, getSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [settings, categories, featured] = await Promise.all([
    getSettings(),
    getCategories(),
    getProducts({ featuredOnly: true, limit: 8 }),
  ]);
  const destacados = featured.products.length >= 4 ? featured.products : (await getProducts({ limit: 8 })).products;

  return (
    <>
      <Hero storeName={settings.storeName} whatsapp={settings.whatsapp} />
      <CategoriesSection categories={categories} />
      <FeaturedSection products={destacados} storeName={settings.storeName} whatsapp={settings.whatsapp} />
      <BenefitsSection />
      <WorkerProgramSection rewardUnits={settings.rewardUnits} />
      <TestimonialsSection />
      <FinalCTA whatsapp={settings.whatsapp} storeName={settings.storeName} />
    </>
  );
}
