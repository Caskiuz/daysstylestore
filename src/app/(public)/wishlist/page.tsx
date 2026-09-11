import type { Metadata } from "next";
import { WishlistView } from "@/components/shop/wishlist-view";
import { getProducts, getSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mi lista de deseos",
  description: "Tus prendas favoritas de Days Style Store guardadas para luego.",
};

export default async function WishlistPage() {
  const [settings, { products }] = await Promise.all([getSettings(), getProducts()]);
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <header className="mb-8 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Guardadas para ti</p>
        <h1 className="mt-2 font-display text-4xl font-bold">
          Lista de <span className="text-gradient-gold">deseos</span> 💛
        </h1>
      </header>
      <WishlistView allProducts={products} storeName={settings.storeName} whatsapp={settings.whatsapp} />
    </div>
  );
}
