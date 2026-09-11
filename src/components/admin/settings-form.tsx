"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Bot, Plus, Save, Store, Trash2, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/misc";
import { updateSettings, type SettingsInput } from "@/lib/actions/admin";

export function SettingsForm({ initial }: { initial: SettingsInput }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [s, setS] = useState<SettingsInput>(initial);

  const set = <K extends keyof SettingsInput>(key: K, value: SettingsInput[K]) => {
    setS((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  function save() {
    setError(null);
    start(async () => {
      try {
        await updateSettings(s);
        setSaved(true);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error al guardar");
      }
    });
  }

  return (
    <div className="space-y-5 pb-20 lg:pb-0">
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Store size={16} className="text-gold" /> Información del negocio</CardTitle></CardHeader>
          <CardBody className="space-y-4 pt-3">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nombre de la tienda"><Input value={s.storeName} onChange={(e) => set("storeName", e.target.value)} /></Field>
              <Field label="Eslogan"><Input value={s.tagline} onChange={(e) => set("tagline", e.target.value)} /></Field>
              <Field label="WhatsApp (número internacional sin +)" hint="Ej: 573001234567">
                <Input value={s.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="573001234567" />
              </Field>
              <Field label="Correo"><Input type="email" value={s.email ?? ""} onChange={(e) => set("email", e.target.value)} /></Field>
              <Field label="Instagram (usuario)"><Input value={s.instagram ?? ""} onChange={(e) => set("instagram", e.target.value)} placeholder="daystylestore" /></Field>
              <Field label="TikTok (usuario)"><Input value={s.tiktok ?? ""} onChange={(e) => set("tiktok", e.target.value)} /></Field>
              <Field label="Facebook (página)"><Input value={s.facebook ?? ""} onChange={(e) => set("facebook", e.target.value)} /></Field>
              <Field label="Dirección / zona"><Input value={s.address ?? ""} onChange={(e) => set("address", e.target.value)} /></Field>
            </div>
            <Field label="Texto de «Nosotras»">
              <Textarea value={s.aboutText} onChange={(e) => set("aboutText", e.target.value)} />
            </Field>
          </CardBody>
        </Card>

        <div className="space-y-5">
          <Card>
            <CardHeader><CardTitle>Monedas y tasas de cambio</CardTitle></CardHeader>
            <CardBody className="space-y-4 pt-3">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="1 USD = pesos (COP)"><Input type="number" min="1" value={s.usdToCop} onChange={(e) => set("usdToCop", Number(e.target.value))} /></Field>
                <Field label="1 USD = bolívares (VES)"><Input type="number" min="1" value={s.usdToVes} onChange={(e) => set("usdToVes", Number(e.target.value))} /></Field>
              </div>
              <div>
                <p className="mb-1.5 text-sm font-medium">Monedas visibles en la tienda</p>
                <div className="flex flex-wrap gap-3">
                  {(["USD", "COP", "VES"] as const).map((c) => (
                    <label key={c} className="flex cursor-pointer items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-semibold transition-colors has-checked:border-gold has-checked:bg-accent">
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-[#d4af37]"
                        checked={s.currenciesEnabled.includes(c)}
                        onChange={(e) =>
                          set("currenciesEnabled", e.target.checked ? [...s.currenciesEnabled, c] : (s.currenciesEnabled.length > 1 ? s.currenciesEnabled.filter((x) => x !== c) : s.currenciesEnabled))
                        }
                      />
                      {c}
                    </label>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Bot size={16} className="text-gold" /> Asistente IA (Daisy)</CardTitle>
            </CardHeader>
            <CardBody className="space-y-4 pt-3">
              <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
                <input type="checkbox" className="h-4 w-4 accent-[#d4af37]" checked={s.aiEnabled} onChange={(e) => set("aiEnabled", e.target.checked)} />
                Chat IA activo en la tienda (requiere GEMINI_API_KEY)
              </label>
              <Field label="Estilo extra de la IA" hint="Se añade a las instrucciones base del bot (tono, reglas especiales…)">
                <Textarea value={s.aiPrompt} onChange={(e) => set("aiPrompt", e.target.value)} className="min-h-[100px]" />
              </Field>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Métodos de pago */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Wallet size={16} className="text-gold" /> Métodos de pago (sin pasarela: se coordina por WhatsApp)</CardTitle>
        </CardHeader>
        <CardBody className="space-y-3 pt-3">
          {s.paymentMethods.map((m, i) => (
            <div key={i} className="grid gap-2 rounded-xl border border-border p-3 sm:grid-cols-[1.4fr_90px_2fr_110px_40px]">
              <Input
                className="h-9" placeholder="Nombre (Ej: Nequi)" value={m.name}
                onChange={(e) => set("paymentMethods", s.paymentMethods.map((x, j) => j === i ? { ...x, name: e.target.value } : x))}
              />
              <Select
                className="h-9" value={m.currency}
                onChange={(e) => set("paymentMethods", s.paymentMethods.map((x, j) => j === i ? { ...x, currency: e.target.value } : x))}
              >
                <option value="COP">COP</option>
                <option value="USD">USD</option>
                <option value="VES">VES</option>
              </Select>
              <Input
                className="h-9" placeholder="Instrucciones para la clienta" value={m.details}
                onChange={(e) => set("paymentMethods", s.paymentMethods.map((x, j) => j === i ? { ...x, details: e.target.value } : x))}
              />
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-border text-xs font-bold">
                <input
                  type="checkbox" className="h-4 w-4 accent-[#d4af37]" checked={m.enabled}
                  onChange={(e) => set("paymentMethods", s.paymentMethods.map((x, j) => j === i ? { ...x, enabled: e.target.checked } : x))}
                />
                Activo
              </label>
              <button
                aria-label="Quitar método"
                onClick={() => set("paymentMethods", s.paymentMethods.filter((_, j) => j !== i))}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive cursor-pointer"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <Button
            variant="outline" size="sm"
            onClick={() => set("paymentMethods", [...s.paymentMethods, { id: `m-${Date.now()}`, name: "", currency: "COP", details: "", enabled: true }])}
          >
            <Plus size={14} /> Agregar método
          </Button>
        </CardBody>
      </Card>

      {error && <p className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}

      <div className="sticky bottom-0 z-30 -mx-4 border-t border-border bg-background/90 p-3 backdrop-blur-lg sm:-mx-6 lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:p-0">
        <Button size="lg" onClick={save} loading={pending}>
          {!pending && <Save size={17} />} {saved ? "Guardado ✓" : "Guardar configuración"}
        </Button>
      </div>
    </div>
  );
}
