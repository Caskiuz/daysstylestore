"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Heart, MessageCircle, Ruler, Share2, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoldBadge, Badge } from "@/components/ui/misc";
import { AnimatedPrice, useCurrency } from "@/components/currency-provider";
import { useWishlist } from "@/lib/wishlist";
import { waLink, buyProductMessage } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import type { PublicProduct } from "@/lib/types";

export function ProductDetail({
  product,
  storeName,
  whatsapp,
  siteUrl,
  workerCode,
}: {
  product: PublicProduct;
  storeName: string;
  whatsapp: string;
  siteUrl: string;
  workerCode?: string;
}) {
  const { format } = useCurrency();
  const wishlist = useWishlist();
  const [imgIdx, setImgIdx] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const sizes = useMemo(() => [...new Set(product.variants.map((v) => v.size))], [product.variants]);
  const colors = useMemo(
    () => [...new Set(product.variants.filter((v) => !size || v.size === size).map((v) => v.color))],
    [product.variants, size]
  );
  const selected = product.variants.find((v) => v.size === size && v.color === color);
  const stockOf = (s: string, c: string) => product.variants.find((v) => v.size === s && v.color === c)?.stock ?? 0;
  const totalStock = product.variants.reduce((acc, v) => acc + v.stock, 0);
  const isWished = wishlist.has(product.id);

  const priceText = format(product.priceUsd);
  const shareUrl = `${siteUrl}/producto/${product.slug}${workerCode ? `?ref=${workerCode}` : ""}`;
  const buyHref = waLink(
    whatsapp,
    buyProductMessage({
      storeName,
      productName: product.name,
      variant: selected ? `${selected.size} / ${selected.color}` : size || color ? [size, color].filter(Boolean).join(" / ") : undefined,
      priceText,
      url: shareUrl,
      workerCode,
    })
  );

  const share = async () => {
    const text = `¡Mira esta prenda de ${storeName}! ✨ ${product.name} — ${priceText}`;
    if (navigator.share) {
      try { await navigator.share({ title: product.name, text, url: shareUrl }); return; } catch { /* cancelado */ }
    }
    await navigator.clipboard.writeText(`${text} ${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      {/* Galería */}
      <div>
        <div
          className="group relative aspect-[3/4] cursor-zoom-in overflow-hidden rounded-3xl border border-border bg-muted"
          onClick={() => setZoom(true)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={imgIdx}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0"
            >
              <Image
                src={product.images[imgIdx]}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </motion.div>
          </AnimatePresence>
          {product.tag && <div className="absolute left-4 top-4"><GoldBadge>{product.tag}</GoldBadge></div>}
          <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white backdrop-blur">
            Click para ampliar 🔍
          </span>
        </div>

        {product.images.length > 1 && (
          <div className="mt-3 flex gap-2.5">
            {product.images.map((img, i) => (
              <button
                key={img + i}
                onClick={() => setImgIdx(i)}
                className={cn(
                  "relative aspect-[3/4] w-20 overflow-hidden rounded-xl border-2 transition-all cursor-pointer",
                  i === imgIdx ? "border-gold shadow-[0_4px_16px_-4px_rgba(212,175,55,0.5)]" : "border-transparent opacity-60 hover:opacity-100"
                )}
              >
                <Image src={img} alt={`Vista ${i + 1}`} fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground">{product.categoryName}</p>
        <h1 className="mt-2 font-display text-3xl font-bold leading-tight sm:text-4xl">{product.name}</h1>

        <div className="mt-4 flex items-baseline gap-3">
          <AnimatedPrice usd={product.priceUsd} className="text-3xl font-bold text-primary" />
          {product.tag === "OFERTA" && <span className="text-sm text-muted-foreground line-through">{format(product.priceUsd * 1.25)}</span>}
        </div>

        <div className="my-5 h-px w-full bg-gradient-to-r from-gold/50 via-border to-transparent" />

        <p className="leading-relaxed text-muted-foreground">{product.description}</p>

        {/* Talla */}
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold">Talla {size && <span className="text-primary">· {size}</span>}</p>
            <Link href="/tallas" className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
              <Ruler size={13} /> Guía de tallas
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s) => {
              const available = colors.some((c) => stockOf(s, c) > 0);
              return (
                <button
                  key={s}
                  onClick={() => { setSize(s); setColor(null); }}
                  disabled={!available}
                  className={cn(
                    "min-w-11 rounded-xl border px-3.5 py-2 text-sm font-semibold transition-all cursor-pointer",
                    size === s
                      ? "border-gold bg-gradient-to-b from-[#e9d489] to-[#d4af37] text-[#2a2005] shadow-[0_4px_14px_-4px_rgba(212,175,55,0.6)]"
                      : available
                        ? "border-border hover:border-gold/60"
                        : "cursor-not-allowed border-border opacity-35 line-through"
                  )}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* Color */}
        <div className="mt-5">
          <p className="mb-2 text-sm font-semibold">Color {color && <span className="text-primary">· {color}</span>}</p>
          <div className="flex flex-wrap gap-2">
            {colors.map((c) => {
              const stock = size ? stockOf(size, c) : product.variants.filter((v) => v.color === c).reduce((a, v) => a + v.stock, 0);
              return (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  disabled={stock <= 0}
                  className={cn(
                    "rounded-xl border px-3.5 py-2 text-sm transition-all cursor-pointer",
                    color === c
                      ? "border-gold bg-accent font-semibold text-accent-foreground shadow-[0_4px_14px_-6px_rgba(212,175,55,0.7)]"
                      : stock > 0
                        ? "border-border hover:border-gold/60"
                        : "cursor-not-allowed border-border opacity-35 line-through"
                  )}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stock */}
        {selected && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={cn("mt-4 text-sm font-medium", selected.stock > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-destructive")}>
            {selected.stock > 0 ? `✓ Disponible (${selected.stock} en stock)` : "✗ Agotado en esta combinación"}
          </motion.p>
        )}

        {/* Acciones */}
        <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
          <a href={buyHref} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button variant="whatsapp" size="lg" className="w-full">
              <MessageCircle size={18} /> Comprar por WhatsApp
            </Button>
          </a>
          <Button
            variant="outline" size="lg"
            onClick={() => wishlist.toggle(product.id)}
            className={cn(isWished && "border-gold text-primary")}
          >
            <Heart size={17} fill={isWished ? "currentColor" : "none"} />
            {isWished ? "En favoritos" : "Favorito"}
          </Button>
          <Button variant="ghost" size="lg" onClick={share} aria-label="Compartir producto">
            {copied ? <Check size={17} className="text-emerald-500" /> : <Share2 size={17} />}
          </Button>
        </div>

        {totalStock <= 5 && totalStock > 0 && (
          <Badge className="mt-4 w-fit bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300">
            ¡Últimas {totalStock} unidades!
          </Badge>
        )}

        {/* Garantías */}
        <div className="mt-7 grid gap-3 rounded-2xl border border-border bg-card p-4 text-sm">
          <p className="flex items-center gap-2.5"><Truck size={16} className="shrink-0 text-gold" /> Entrega personal por nuestras asesoras</p>
          <p className="flex items-center gap-2.5"><ShieldCheck size={16} className="shrink-0 text-gold" /> Pago 50% al recibir y 50% a los 15 días</p>
          <p className="flex items-center gap-2.5"><MessageCircle size={16} className="shrink-0 text-gold" /> Asesoría de tallas gratis por WhatsApp</p>
        </div>
      </div>

      {/* Zoom modal */}
      <AnimatePresence>
        {zoom && (
          <motion.div
            className="fixed inset-0 z-[95] flex items-center justify-center bg-black/85 p-6 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setZoom(false)}
          >
            <motion.div
              initial={{ scale: 0.85 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              transition={{ type: "spring", damping: 24 }}
              className="relative h-[85vh] w-full max-w-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={product.images[imgIdx]} alt={product.name} fill sizes="90vw" className="object-contain" />
              <button onClick={() => setZoom(false)} className="absolute -top-3 -right-3 flex h-10 w-10 items-center justify-center rounded-full bg-gold text-[#2a2005] shadow-lg cursor-pointer" aria-label="Cerrar">
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
