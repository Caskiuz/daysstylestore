"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Banknote, Gift, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { requestRedemption } from "@/lib/actions/worker";
import { cn } from "@/lib/utils";

type ProductOpt = { id: string; name: string; priceUsd: number; variants: { id: string; size: string; color: string; stock: number }[] };

export function RedemptionForm({ products, availableUsd }: { products: ProductOpt[]; availableUsd: number }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const [type, setType] = useState<"PRODUCTO" | "EFECTIVO">("PRODUCTO");
  const [productId, setProductId] = useState(products[0]?.id ?? "");
  const [variantId, setVariantId] = useState(products[0]?.variants.find((v) => v.stock > 0)?.id ?? "");
  const [currency, setCurrency] = useState("COP");
  const [amountUsd, setAmountUsd] = useState("");
  const [note, setNote] = useState("");

  const product = products.find((p) => p.id === productId);

  function submit() {
    setError(null);
    setDone(false);
    start(async () => {
      try {
        await requestRedemption({
          type,
          productId: type === "PRODUCTO" ? productId : null,
          variantId: type === "PRODUCTO" ? variantId || null : null,
          amountUsd: type === "EFECTIVO" ? Number(amountUsd) : undefined,
          currency: type === "EFECTIVO" ? (currency as "USD" | "COP") : undefined,
          note: note.trim() || undefined,
        });
        setDone(true);
        setAmountUsd(""); setNote("");
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error al solicitar el canje");
      }
    });
  }

  return (
    <div className="space-y-4">
      {/* Selector de tipo */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setType("PRODUCTO")}
          className={cn(
            "flex items-center justify-center gap-2 rounded-xl border-2 p-3.5 text-sm font-bold transition-all cursor-pointer",
            type === "PRODUCTO" ? "border-gold bg-accent text-accent-foreground shadow-[var(--shadow-gold)]" : "border-border text-muted-foreground hover:border-gold/40"
          )}
        >
          <Gift size={17} /> Producto
        </button>
        <button
          onClick={() => setType("EFECTIVO")}
          className={cn(
            "flex items-center justify-center gap-2 rounded-xl border-2 p-3.5 text-sm font-bold transition-all cursor-pointer",
            type === "EFECTIVO" ? "border-gold bg-accent text-accent-foreground shadow-[var(--shadow-gold)]" : "border-border text-muted-foreground hover:border-gold/40"
          )}
        >
          <Banknote size={17} /> Efectivo
        </button>
      </div>

      {type === "PRODUCTO" ? (
        <>
          <Field label="Elige tu premio">
            <Select
              value={productId}
              onChange={(e) => {
                setProductId(e.target.value);
                const p = products.find((x) => x.id === e.target.value);
                setVariantId(p?.variants.find((v) => v.stock > 0)?.id ?? "");
              }}
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name} — US$ {p.priceUsd.toFixed(2)}</option>
              ))}
            </Select>
          </Field>
          {product && product.variants.length > 0 && (
            <Field label="Talla / color">
              <Select value={variantId} onChange={(e) => setVariantId(e.target.value)}>
                {product.variants.map((v) => (
                  <option key={v.id} value={v.id} disabled={v.stock <= 0}>
                    {v.size} / {v.color} {v.stock <= 0 ? "(sin stock)" : ""}
                  </option>
                ))}
              </Select>
            </Field>
          )}
          {product && (
            <p className={cn("rounded-xl px-3 py-2 text-sm font-semibold", product.priceUsd > availableUsd ? "bg-destructive/10 text-destructive" : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400")}>
              {product.priceUsd > availableUsd
                ? `Te faltan US$ ${(product.priceUsd - availableUsd).toFixed(2)} para este premio. ¡Sigue vendiendo!`
                : `Se descontará US$ ${product.priceUsd.toFixed(2)} de tu saldo (quedarán US$ ${(availableUsd - product.priceUsd).toFixed(2)})`}
            </p>
          )}
        </>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Monto a canjear (US$)" hint={`Disponible: US$ ${availableUsd.toFixed(2)}`}>
              <Input type="number" min="0" step="0.5" max={availableUsd} value={amountUsd} onChange={(e) => setAmountUsd(e.target.value)} placeholder="0.00" />
            </Field>
            <Field label="Moneda en que prefieres el pago">
              <Select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option value="COP">Pesos (COP)</option>
                <option value="USD">Dólares (USD)</option>
              </Select>
            </Field>
          </div>
        </>
      )}

      <Field label="Nota para la jefa (opcional)">
        <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ej: lo necesito para el viernes" className="min-h-[60px]" />
      </Field>

      {error && <p className="rounded-xl bg-destructive/10 px-3 py-2.5 text-sm text-destructive">{error}</p>}
      {done && <p className="rounded-xl bg-emerald-500/10 px-3 py-2.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400">✓ ¡Solicitud enviada! La jefa la revisará pronto.</p>}

      <Button size="lg" className="w-full" onClick={submit} loading={pending} disabled={availableUsd <= 0}>
        {!pending && <Send size={16} />} Solicitar canje
      </Button>
      {availableUsd <= 0 && <p className="text-center text-xs text-muted-foreground">Aún no tienes saldo disponible para canjear.</p>}
    </div>
  );
}
