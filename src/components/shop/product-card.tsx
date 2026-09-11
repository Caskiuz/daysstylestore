"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, Heart } from "lucide-react";
import { AnimatedPrice, useCurrency } from "@/components/currency-provider";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GoldBadge } from "@/components/ui/misc";
import { useWishlist } from "@/lib/wishlist";
import { waLink, buyProductMessage } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import type { PublicProduct } from "@/lib/types";

export function ProductCard({ product, storeName, whatsapp }: { product: PublicProduct; storeName: string; whatsapp: string }) {
  const wishlist = useWishlist();
  const [quickView, setQuickView] = useState(false);
  const { currency, format } = useCurrency();

  const colors = useMemo(() => [...new Set(product.variants.map((v) => v.color))], [product.variants]);
  const sizes = useMemo(() => [...new Set(product.variants.map((v) => v.size))], [product.variants]);
  const inStock = product.variants.some((v) => v.stock > 0);
  const isWished = wishlist.has(product.id);

  return (
    <>
      <motion.article
        layout
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="tilt-card group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm hover:border-gold/50 hover:shadow-[var(--shadow-gold)]"
      >
        <Link href={`/producto/${product.slug}`} className="relative block aspect-[3/4] overflow-hidden bg-muted">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {product.tag && <GoldBadge>{product.tag}</GoldBadge>}
            {!inStock && (
              <span className="rounded-full bg-black/70 px-2.5 py-0.5 text-xs font-semibold text-white backdrop-blur">
                Agotado
              </span>
            )}
          </div>

          <button
            onClick={(e) => { e.preventDefault(); wishlist.toggle(product.id); }}
            aria-label={isWished ? "Quitar de favoritos" : "Agregar a favoritos"}
            className={cn(
              "absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur transition-all active:scale-90 cursor-pointer",
              isWished ? "bg-gold text-[#2a2005]" : "bg-white/80 text-neutral-700 hover:bg-gold hover:text-[#2a2005] dark:bg-black/60 dark:text-neutral-200"
            )}
          >
            <motion.span animate={isWished ? { scale: [1, 1.4, 1] } : {}} transition={{ duration: 0.35 }}>
              <Heart size={16} fill={isWished ? "currentColor" : "none"} />
            </motion.span>
          </button>

          <button
            onClick={(e) => { e.preventDefault(); setQuickView(true); }}
            className="absolute bottom-3 left-1/2 flex -translate-x-1/2 translate-y-14 items-center gap-1.5 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-neutral-900 opacity-0 shadow-lg backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-gold hover:text-[#2a2005] cursor-pointer dark:bg-black/80 dark:text-white"
          >
            <Eye size={14} /> Vista rápida
          </button>
        </Link>

        <div className="flex flex-1 flex-col gap-1.5 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{product.categoryName}</p>
          <Link href={`/producto/${product.slug}`} className="font-display text-[15px] font-semibold leading-snug transition-colors hover:text-primary">
            {product.name}
          </Link>
          <div className="mt-auto flex items-end justify-between pt-2">
            <AnimatedPrice usd={product.priceUsd} className="text-lg font-bold text-primary" />
            <div className="flex gap-1">
              {colors.slice(0, 4).map((c) => (
                <span key={c} title={c} className="h-3.5 w-3.5 rounded-full border border-border bg-gradient-to-br from-gold-soft to-gold-deep opacity-80" />
              ))}
            </div>
          </div>
        </div>
      </motion.article>

      {/* Vista rápida */}
      <Dialog open={quickView} onClose={() => setQuickView(false)} title={product.name} className="max-w-2xl">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-muted">
            <Image src={product.images[0]} alt={product.name} fill sizes="(max-width: 640px) 90vw, 300px" className="object-cover" />
          </div>
          <div className="flex flex-col">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{product.categoryName}</p>
            <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-muted-foreground">{product.description}</p>
            <p className="mt-3 text-2xl font-bold text-primary">{format(product.priceUsd)}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {sizes.map((s) => <span key={s} className="rounded-md border border-border px-2 py-0.5 text-xs">{s}</span>)}
            </div>
            <div className="mt-auto flex flex-col gap-2 pt-5">
              <Link href={`/producto/${product.slug}`}><Button variant="outline" className="w-full">Ver detalle completo</Button></Link>
              <a
                href={waLink(whatsapp, buyProductMessage({ storeName, productName: product.name, priceText: format(product.priceUsd) }))}
                target="_blank" rel="noopener noreferrer"
              >
                <Button variant="whatsapp" className="w-full">Comprar por WhatsApp</Button>
              </a>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}
