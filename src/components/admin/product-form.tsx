"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ImagePlus, Loader2, Plus, Save, Trash2, Upload, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { saveProduct, type ProductInput } from "@/lib/actions/admin";
import type { PublicCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

type VariantRow = { size: string; color: string; stock: number };

export function ProductForm({
  categories,
  product,
}: {
  categories: PublicCategory[];
  product?: ProductInput & { id: string; slug: string };
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [priceUsd, setPriceUsd] = useState(String(product?.priceUsd ?? ""));
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? categories[0]?.id ?? "");
  const [tag, setTag] = useState(product?.tag ?? "");
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [active, setActive] = useState(product?.active ?? true);
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [variants, setVariants] = useState<VariantRow[]>(
    product?.variants?.length
      ? product.variants.map((v) => ({ size: v.size, color: v.color, stock: v.stock }))
      : [{ size: "M", color: "Negro", stock: 5 }]
  );

  // generador masivo
  const [bulkSizes, setBulkSizes] = useState("S, M, L, XL");
  const [bulkColors, setBulkColors] = useState("Negro, Blanco");
  const [bulkStock, setBulkStock] = useState("5");

  const [uploading, setUploading] = useState(false);

  const totalStock = variants.reduce((a, v) => a + (Number(v.stock) || 0), 0);

  function uploadImage(file: File) {
    setUploading(true);
    setError(null);
    const body = new FormData();
    body.append("file", file);
    fetch("/api/admin/upload", { method: "POST", body })
      .then((r) => r.json())
      .then((d) => {
        if (d.url) setImages((imgs) => [...imgs, d.url]);
        else setError(d.error || "No se pudo subir la imagen");
      })
      .catch(() => setError("Error de red al subir la imagen"))
      .finally(() => setUploading(false));
  }

  function submit() {
    setError(null);
    if (!name.trim() || !priceUsd || !categoryId) {
      setError("Completa nombre, precio y categoría.");
      return;
    }
    const payload: ProductInput = {
      name: name.trim(),
      description: description.trim(),
      priceUsd: Number(priceUsd),
      categoryId,
      images,
      featured,
      active,
      tag: tag || null,
      variants: variants.map((v) => ({ size: v.size.trim() || "Única", color: v.color.trim() || "Estándar", stock: Math.max(0, Number(v.stock) || 0) })),
    };
    start(async () => {
      try {
        await saveProduct(product?.id ?? null, payload);
        router.push("/admin/productos");
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error al guardar");
      }
    });
  }

  return (
    <div className="space-y-6 pb-24 lg:pb-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="mb-4 font-display font-bold">Información básica</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nombre del producto" className="sm:col-span-2">
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Blusa Satén Brillo Dorado" />
              </Field>
              <Field label="Precio base (US$)" hint="Los precios en COP/VES se calculan con las tasas de Configuración.">
                <Input type="number" step="0.01" min="0" value={priceUsd} onChange={(e) => setPriceUsd(e.target.value)} placeholder="14.99" />
              </Field>
              <Field label="Categoría">
                <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </Select>
              </Field>
              <Field label="Etiqueta destacada">
                <Select value={tag} onChange={(e) => setTag(e.target.value)}>
                  <option value="">Sin etiqueta</option>
                  <option value="NUEVO">NUEVO</option>
                  <option value="HOT">HOT</option>
                  <option value="OFERTA">OFERTA</option>
                </Select>
              </Field>
              <div className="flex items-end gap-4">
                <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
                  <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="h-4 w-4 accent-[#d4af37]" />
                  ★ Destacado
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
                  <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="h-4 w-4 accent-[#d4af37]" />
                  Visible en tienda
                </label>
              </div>
              <Field label="Descripción" className="sm:col-span-2">
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe la prenda: tela, caída, ocasiones…" />
              </Field>
            </div>
          </div>

          {/* Variantes */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display font-bold">Variantes (talla × color × stock)</h2>
              <span className="text-sm font-bold text-primary">Stock total: {totalStock}</span>
            </div>

            {/* Generador masivo */}
            <div className="mb-4 grid gap-2 rounded-xl border border-gold/30 bg-accent/50 p-3 sm:grid-cols-[1fr_1fr_auto_auto]">
              <Input value={bulkSizes} onChange={(e) => setBulkSizes(e.target.value)} placeholder="Tallas: S, M, L" className="h-9" />
              <Input value={bulkColors} onChange={(e) => setBulkColors(e.target.value)} placeholder="Colores: Negro, Blanco" className="h-9" />
              <Input value={bulkStock} onChange={(e) => setBulkStock(e.target.value)} placeholder="Stock" type="number" min="0" className="h-9 w-24" />
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const sizes = bulkSizes.split(",").map((s) => s.trim()).filter(Boolean);
                  const colors = bulkColors.split(",").map((c) => c.trim()).filter(Boolean);
                  if (!sizes.length || !colors.length) return;
                  const stock = Math.max(0, Number(bulkStock) || 0);
                  setVariants(sizes.flatMap((size) => colors.map((color) => ({ size, color, stock }))));
                }}
              >
                <Wand2 size={14} /> Generar
              </Button>
            </div>

            <div className="space-y-2">
              <AnimatePresence initial={false}>
                {variants.map((v, i) => (
                  <motion.div
                    key={i}
                    layout
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="grid grid-cols-[1fr_1fr_80px_36px] items-center gap-2"
                  >
                    <Input value={v.size} onChange={(e) => setVariants(variants.map((x, j) => j === i ? { ...x, size: e.target.value } : x))} placeholder="Talla" className="h-9" />
                    <Input value={v.color} onChange={(e) => setVariants(variants.map((x, j) => j === i ? { ...x, color: e.target.value } : x))} placeholder="Color" className="h-9" />
                    <Input type="number" min="0" value={v.stock} onChange={(e) => setVariants(variants.map((x, j) => j === i ? { ...x, stock: Number(e.target.value) } : x))} className="h-9" />
                    <button
                      aria-label="Quitar variante"
                      onClick={() => setVariants(variants.filter((_, j) => j !== i))}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <Button variant="ghost" size="sm" className="mt-3" onClick={() => setVariants([...variants, { size: "", color: "", stock: 0 }])}>
              <Plus size={14} /> Agregar variante
            </Button>
          </div>
        </div>

        {/* Imágenes */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="mb-4 font-display font-bold">Fotos</h2>
            <div
              className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border p-6 text-center transition-colors hover:border-gold/60"
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) uploadImage(f); }}
            >
              {uploading ? <Loader2 className="animate-spin text-gold" /> : <Upload size={22} className="text-gold" />}
              <p className="text-sm font-medium">{uploading ? "Subiendo…" : "Arrastra o haz click"}</p>
              <p className="text-xs text-muted-foreground">Se sube a Cloudinary (máx 8MB)</p>
              <input
                ref={fileRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f); e.target.value = ""; }}
              />
            </div>

            <div className="mt-3 space-y-2">
              {images.map((img, i) => (
                <div key={img + i} className={cn("relative flex items-center gap-3 rounded-xl border p-2", i === 0 ? "border-gold/60" : "border-border")}>
                  <span className="relative h-14 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <Image src={img} alt={`Foto ${i + 1}`} fill sizes="48px" className="object-cover" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold">{i === 0 ? "Foto principal" : `Foto ${i + 1}`}</p>
                    <p className="truncate text-[10px] text-muted-foreground">{img}</p>
                    {i > 0 && (
                      <button onClick={() => setImages([img, ...images.filter((_, j) => j !== i)])} className="mt-0.5 text-[10px] font-bold text-primary hover:underline cursor-pointer">
                        Hacer principal
                      </button>
                    )}
                  </div>
                  <button onClick={() => setImages(images.filter((_, j) => j !== i))} aria-label="Quitar" className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive cursor-pointer">
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
              {images.length === 0 && (
                <button
                  onClick={() => setImages(["/products/placeholder.svg"])}
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-border px-3 py-2.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-gold/50 hover:text-primary cursor-pointer"
                >
                  <ImagePlus size={14} /> Usar imagen de demo
                </button>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground">💡 Consejos</p>
            <ul className="mt-2 list-disc space-y-1.5 pl-4 text-xs leading-relaxed">
              <li>La primera foto es la portada del producto.</li>
              <li>Usa varias fotos: frontal, trasera y detalle.</li>
              <li>El stock se descuenta automáticamente al crear pedidos.</li>
            </ul>
          </div>
        </div>
      </div>

      {error && <p className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}

      {/* Barra de guardar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/90 p-3 backdrop-blur-lg lg:static lg:z-auto lg:border-0 lg:bg-transparent lg:p-0">
        <Button size="lg" className="w-full lg:w-auto" onClick={submit} loading={pending}>
          {!pending && <Save size={17} />} {product ? "Guardar cambios" : "Crear producto"}
        </Button>
      </div>
    </div>
  );
}
