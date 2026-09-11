"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Tags, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { Dialog } from "@/components/ui/dialog";
import { saveCategory, deleteCategory } from "@/lib/actions/admin";

type Cat = { id: string; name: string; productCount: number };

export function CategoryManager({ categories }: { categories: Cat[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [dialog, setDialog] = useState<{ mode: "new" | "edit"; cat?: Cat } | null>(null);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  function openNew() { setName(""); setError(null); setDialog({ mode: "new" }); }
  function openEdit(c: Cat) { setName(c.name); setError(null); setDialog({ mode: "edit", cat: c }); }

  function save() {
    if (!name.trim()) { setError("Escribe un nombre"); return; }
    setError(null);
    start(async () => {
      try {
        await saveCategory(dialog?.mode === "edit" ? dialog.cat!.id : null, name.trim());
        setDialog(null);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error al guardar");
      }
    });
  }

  function remove(c: Cat) {
    if (!confirm(`¿Eliminar la categoría «${c.name}»?`)) return;
    start(async () => {
      try {
        await deleteCategory(c.id);
        router.refresh();
      } catch (e) {
        alert(e instanceof Error ? e.message : "Error al eliminar");
      }
    });
  }

  return (
    <>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{categories.length} categorías</p>
        <Button onClick={openNew}><Plus size={16} /> Nueva categoría</Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <div key={c.id} className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-gold/40">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gold-soft/40 to-gold/15 text-primary">
              <Tags size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{c.name}</p>
              <p className="text-xs text-muted-foreground">{c.productCount} productos</p>
            </div>
            <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <button onClick={() => openEdit(c)} aria-label="Editar" className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-primary cursor-pointer"><Pencil size={14} /></button>
              <button onClick={() => remove(c)} aria-label="Eliminar" className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive cursor-pointer"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!dialog} onClose={() => setDialog(null)} title={dialog?.mode === "edit" ? "Editar categoría" : "Nueva categoría"}>
        <Field label="Nombre">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Vestidos de fiesta" autoFocus onKeyDown={(e) => e.key === "Enter" && save()} />
        </Field>
        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setDialog(null)}>Cancelar</Button>
          <Button onClick={save} loading={pending}>Guardar</Button>
        </div>
      </Dialog>
    </>
  );
}
