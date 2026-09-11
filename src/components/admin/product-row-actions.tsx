"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import { toggleProductActive, deleteProduct } from "@/lib/actions/admin";

export function ProductRowActions({ id, active, name }: { id: string; active: boolean; name: string }) {
  const [pending, start] = useTransition();
  const router = useRouter();

  return (
    <div className="flex items-center justify-end gap-1">
      <Link href={`/admin/productos/${id}`} aria-label="Editar" className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-primary">
        <Pencil size={15} />
      </Link>
      <button
        aria-label={active ? "Ocultar" : "Mostrar"}
        disabled={pending}
        onClick={() => start(async () => { await toggleProductActive(id, !active); router.refresh(); })}
        className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-primary cursor-pointer disabled:opacity-40"
      >
        {active ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
      <button
        aria-label="Eliminar"
        disabled={pending}
        onClick={() => {
          if (!confirm(`¿Eliminar «${name}»? Si tiene pedidos históricos solo se ocultará.`)) return;
          start(async () => { await deleteProduct(id); router.refresh(); });
        }}
        className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive cursor-pointer disabled:opacity-40"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}
