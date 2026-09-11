"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Gift, Banknote, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { resolveRedemption } from "@/lib/actions/admin";

export function RedemptionCard({
  id,
  workerName,
  type,
  productName,
  variantLabel,
  amountUsd,
  currency,
  note,
  createdAt,
}: {
  id: string; workerName: string; type: string; productName?: string | null; variantLabel?: string | null;
  amountUsd: number; currency?: string | null; note?: string | null; createdAt: string;
}) {
  const [pending, start] = useTransition();
  const router = useRouter();

  const resolve = (approve: boolean) => {
    if (approve && type === "PRODUCTO" && !confirm(`¿Entregar el premio «${productName}» a ${workerName}? Se descuenta del saldo y del stock.`)) return;
    if (!approve && !confirm("¿Rechazar este canje? El saldo vuelve a estar disponible.")) return;
    start(async () => {
      try { await resolveRedemption(id, approve); router.refresh(); }
      catch (e) { alert(e instanceof Error ? e.message : "Error"); }
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-gold/40">
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${type === "PRODUCTO" ? "bg-gold/15 text-primary" : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"}`}>
        {type === "PRODUCTO" ? <Gift size={18} /> : <Banknote size={18} />}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold">
          {workerName} <span className="font-normal text-muted-foreground">pide</span>{" "}
          {type === "PRODUCTO" ? productName : `efectivo US$ ${amountUsd.toFixed(2)}${currency ? ` (${currency})` : ""}`}
        </p>
        <p className="text-xs text-muted-foreground">
          {type === "PRODUCTO" && `Valor: US$ ${amountUsd.toFixed(2)}${variantLabel ? ` · ${variantLabel}` : ""} · `}
          {new Date(createdAt).toLocaleDateString("es-CO")}
          {note && ` · 📝 ${note}`}
        </p>
      </div>
      <div className="flex gap-2">
        <Button size="sm" loading={pending} onClick={() => resolve(true)}>
          {!pending && <Check size={14} />} Aprobar
        </Button>
        <Button size="sm" variant="outline" disabled={pending} onClick={() => resolve(false)}>
          <X size={14} /> Rechazar
        </Button>
      </div>
    </div>
  );
}
