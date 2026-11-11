"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Copy, Pencil, Plus, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { Dialog } from "@/components/ui/dialog";
import { saveWorker, toggleWorkerActive } from "@/lib/actions/admin";

export type WorkerRow = {
  id: string; name: string; email: string; phone: string | null; code: string; active: boolean;
  available: number; earned: number; pendingCount: number;
};

const usd = (n: number) => `US$ ${n.toFixed(2)}`;

export function WorkerManager({ workers, siteUrl }: { workers: WorkerRow[]; siteUrl: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [dialog, setDialog] = useState<{ mode: "new" | "edit"; w?: WorkerRow } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [active, setActive] = useState(true);

  function openNew() {
    setName(""); setEmail(""); setPhone(""); setCode(""); setPassword(""); setActive(true); setError(null);
    setDialog({ mode: "new" });
  }
  function openEdit(w: WorkerRow) {
    setName(w.name); setEmail(w.email); setPhone(w.phone ?? ""); setCode(w.code); setPassword(""); setActive(w.active); setError(null);
    setDialog({ mode: "edit", w });
  }

  function save() {
    setError(null);
    start(async () => {
      try {
        await saveWorker(dialog?.mode === "edit" ? dialog.w!.id : null, {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          code: code.trim(),
          password: password || undefined,
          active,
        });
        setDialog(null);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error al guardar");
      }
    });
  }

  return (
    <>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{workers.length} trabajadoras registradas</p>
        <Button onClick={openNew}><Plus size={16} /> Nueva trabajadora</Button>
      </div>

      {workers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-14 text-center text-sm text-muted-foreground">
          Aún no hay trabajadoras. Agrega la primera para activar el programa de premios.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {workers.map((w) => (
            <div key={w.id} className={`rounded-2xl border bg-card p-5 transition-colors ${w.active ? "border-border hover:border-gold/40" : "border-border opacity-70"}`}>
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold-soft to-gold font-display text-lg font-bold text-[#2a2005]">
                  {w.name.charAt(0)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display font-bold">{w.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{w.email}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(w)} aria-label="Editar" className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-primary cursor-pointer"><Pencil size={14} /></button>
                  <button
                    aria-label={w.active ? "Desactivar" : "Activar"}
                    onClick={() => start(async () => { await toggleWorkerActive(w.id, !w.active); router.refresh(); })}
                    className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-primary cursor-pointer"
                  >
                    <Power size={14} />
                  </button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                <div className="rounded-xl bg-muted/60 p-2.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Saldo premios</p>
                  <p className="text-sm font-bold text-primary">{usd(w.available)}</p>
                </div>
                <div className="rounded-xl bg-muted/60 p-2.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Ganado total</p>
                  <p className="text-sm font-bold">{usd(w.earned)}</p>
                </div>
              </div>

              {w.pendingCount > 0 && (
                <p className="mt-2 rounded-lg bg-amber-500/10 px-2.5 py-1.5 text-[11px] font-semibold text-amber-700 dark:text-amber-300">
                  ⏳ {w.pendingCount} canje(s) esperando aprobación
                </p>
              )}

              <button
                onClick={() => navigator.clipboard.writeText(`${siteUrl}/producto/sandalias-greca-camel?ref=${w.code}`)}
                className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-gold/40 bg-accent px-3 py-2 text-xs font-bold text-accent-foreground transition-colors hover:border-gold cursor-pointer"
              >
                <Copy size={13} /> Código de referida: <b>{w.code}</b> (copiar link)
              </button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!dialog} onClose={() => setDialog(null)} title={dialog?.mode === "edit" ? "Editar trabajadora" : "Nueva trabajadora"}>
        <div className="space-y-3.5">
          <Field label="Nombre completo"><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Laura Martínez" /></Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Correo (para ingresar)"><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="laura@correo.com" /></Field>
            <Field label="WhatsApp"><Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="573005551111" /></Field>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Código de referida" hint="Aparece en los links que comparte.">
              <Input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="LAURA" />
            </Field>
            <Field label={dialog?.mode === "edit" ? "Nueva contraseña (opcional)" : "Contraseña"} hint="Mínimo 6 caracteres.">
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" />
            </Field>
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
            <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="h-4 w-4 accent-[#d4af37]" />
            Cuenta activa (puede ingresar y acumular premios)
          </label>
          {error && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="ghost" onClick={() => setDialog(null)}>Cancelar</Button>
            <Button onClick={save} loading={pending}>Guardar</Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
