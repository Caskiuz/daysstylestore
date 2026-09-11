"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { createOrder } from "@/lib/actions/admin";
import { createWorkerOrder } from "@/lib/actions/worker";
import { formatMoney, convertFromUsd, type CurrencyCode, type Rates } from "@/lib/currency";

type ProductOpt = {
  id: string; name: string; priceUsd: number;
  variants: { id: string; size: string; color: string; stock: number }[];
};

type ItemRow = { productId: string; variantId: string; quantity: number };

export function OrderForm({
  mode,
  products,
  workers,
  rates,
}: {
  mode: "admin" | "worker";
  products: ProductOpt[];
  workers: { id: string; name: string }[];
  rates: Rates;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  const [workerId, setWorkerId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [currency, setCurrency] = useState<CurrencyCode>("COP");
  const [notes, setNotes] = useState("");
  const [source, setSource] = useState("MANUAL");
  const [items, setItems] = useState<ItemRow[]>([{ productId: products[0]?.id ?? "", variantId: products[0]?.variants[0]?.id ?? "", quantity: 1 }]);

  const totalUsd = useMemo(
    () => items.reduce((acc, it) => acc + (products.find((p) => p.id === it.productId)?.priceUsd ?? 0) * it.quantity, 0),
    [items, products]
  );

  function updateItem(i: number, patch: Partial<ItemRow>) {
    setItems(items.map((it, j) => (j === i ? { ...it, ...patch } : it)));
  }

  function submit() {
    setError(null);
    if (!customerName.trim() || customerPhone.trim().length < 5) { setError("Completa el nombre y teléfono de la clienta."); return; }
    const cleanItems = items.filter((it) => it.productId && it.quantity > 0);
    if (cleanItems.length === 0) { setError("Agrega al menos un producto."); return; }

    start(async () => {
      try {
        const payload = {
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          currency,
          notes: notes.trim() || undefined,
          items: cleanItems.map((it) => ({ productId: it.productId, variantId: it.variantId || null, quantity: it.quantity })),
        };
        const res = mode === "admin"
          ? await createOrder({ ...payload, workerId: workerId || null, source: source as "MANUAL" | "WHATSAPP" | "REFERIDA" })
          : await createWorkerOrder(payload);
        if (res.ok) {
          setDone(res.code);
          router.push(mode === "admin" ? `/admin/pedidos` : "/trabajadora/pedidos");
          router.refresh();
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error al crear el pedido");
      }
    });
  }

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <div className="space-y-5 lg:col-span-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-4 font-display font-bold">Datos de la clienta</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nombre de la clienta">
              <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Ej: María Pérez" />
            </Field>
            <Field label="WhatsApp / teléfono">
              <Input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="573006667777" />
            </Field>
            {mode === "admin" && (
              <>
                <Field label="Trabajadora asignada" hint="Opcional: necesaria para acumular premios.">
                  <Select value={workerId} onChange={(e) => setWorkerId(e.target.value)}>
                    <option value="">Sin asignar (venta directa)</option>
                    {workers.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
                  </Select>
                </Field>
                <Field label="Origen del pedido">
                  <Select value={source} onChange={(e) => setSource(e.target.value)}>
                    <option value="MANUAL">Manual (jefa)</option>
                    <option value="WHATSAPP">WhatsApp</option>
                    <option value="REFERIDA">Referida de trabajadora</option>
                  </Select>
                </Field>
              </>
            )}
            <Field label="Moneda del pedido">
              <Select value={currency} onChange={(e) => setCurrency(e.target.value as CurrencyCode)}>
                <option value="COP">Pesos colombianos (COP)</option>
                <option value="USD">Dólares (USD)</option>
                <option value="VES">Bolívares (VES)</option>
              </Select>
            </Field>
          </div>
          <Field label="Notas" className="mt-4">
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Dirección, referencias, acuerdos…" className="min-h-[64px]" />
          </Field>
        </div>

        {/* Items */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display font-bold">Productos del pedido</h2>
            <Button
              variant="ghost" size="sm"
              onClick={() => setItems([...items, { productId: products[0]?.id ?? "", variantId: products[0]?.variants[0]?.id ?? "", quantity: 1 }])}
            >
              <Plus size={14} /> Agregar
            </Button>
          </div>

          <div className="space-y-3">
            {items.map((it, i) => {
              const product = products.find((p) => p.id === it.productId);
              const variant = product?.variants.find((v) => v.id === it.variantId);
              return (
                <div key={i} className="grid grid-cols-[2fr_1.6fr_80px_36px] items-center gap-2">
                  <Select value={it.productId} onChange={(e) => updateItem(i, { productId: e.target.value, variantId: products.find((p) => p.id === e.target.value)?.variants[0]?.id ?? "" })} className="h-9">
                    {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </Select>
                  <Select value={it.variantId} onChange={(e) => updateItem(i, { variantId: e.target.value })} className="h-9">
                    {(product?.variants ?? []).map((v) => (
                      <option key={v.id} value={v.id}>{v.size} / {v.color} ({v.stock})</option>
                    ))}
                  </Select>
                  <Input type="number" min="1" max={variant?.stock ?? 99} value={it.quantity} onChange={(e) => updateItem(i, { quantity: Math.max(1, Number(e.target.value) || 1) })} className="h-9" />
                  <button
                    aria-label="Quitar"
                    onClick={() => items.length > 1 ? setItems(items.filter((_, j) => j !== i)) : null}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Resumen */}
      <div className="space-y-4">
        <div className="rounded-2xl border border-gold/40 bg-card p-5 gold-ring">
          <h2 className="font-display font-bold">Resumen</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Prendas</span><b>{items.reduce((a, it) => a + it.quantity, 0)}</b></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Total US$</span><b>US$ {totalUsd.toFixed(2)}</b></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Total {currency}</span><b>{formatMoney(convertFromUsd(totalUsd, currency, rates), currency)}</b></div>
            <div className="gold-line my-3" />
            <div className="flex justify-between text-xs"><span className="text-muted-foreground">Abono 50% al recibir</span><b>{formatMoney(convertFromUsd(totalUsd / 2, currency, rates), currency)}</b></div>
            <div className="flex justify-between text-xs"><span className="text-muted-foreground">Saldo a 15 días</span><b>{formatMoney(convertFromUsd(totalUsd / 2, currency, rates), currency)}</b></div>
          </div>
          {done && <p className="mt-4 flex items-center gap-2 text-sm font-bold text-emerald-600"><CheckCircle2 size={16} /> Pedido {done} creado</p>}
          {error && <p className="mt-3 rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</p>}
          <Button size="lg" className="mt-5 w-full" onClick={submit} loading={pending}>
            {!pending && <Save size={16} />} Crear pedido
          </Button>
          <p className="mt-2 text-center text-[11px] text-muted-foreground">El stock se descuenta automáticamente.</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 text-xs leading-relaxed text-muted-foreground">
          <b className="text-foreground">Flujo del pedido:</b> Pendiente → Confirmado → En reparto (jefa trae) → Entregada a trabajadora → Entregada a clienta (se programan los premios y el cobro 50/50).
        </div>
      </div>
    </div>
  );
}
