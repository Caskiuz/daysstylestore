"use client";

import { HeartCrack } from "lucide-react";
import { ProductCard } from "@/components/shop/product-card";
import { EmptyState } from "@/components/ui/misc";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useWishlist } from "@/lib/wishlist";
import type { PublicProduct } from "@/lib/types";

export function WishlistView({ allProducts, storeName, whatsapp }: { allProducts: PublicProduct[]; storeName: string; whatsapp: string }) {
  const { ids, mounted } = useWishlist();

  if (!mounted) {
    return <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton aspect-[3/4] rounded-2xl" />)}</div>;
  }

  const products = allProducts.filter((p) => ids.includes(p.id));

  if (products.length === 0) {
    return (
      <EmptyState
        icon={<HeartCrack size={40} strokeWidth={1.4} />}
        title="Tu lista de deseos está vacía"
        subtitle="Explora la tienda y toca el corazón ♡ en tus prendas favoritas para guardarlas aquí."
        action={<Link href="/shop"><Button>Ir a la tienda</Button></Link>}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} storeName={storeName} whatsapp={whatsapp} />
      ))}
    </div>
  );
}
