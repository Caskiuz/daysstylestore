"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { advanceOrder, cancelOrder } from "@/lib/actions/admin";

const NEXT_LABEL: Record<string, string> = {
  PENDIENTE: "Confirmar pedido",
  CONFIRMADO: "Marcar en reparto (jefa trae)",
  EN_REPARTO: "Entregada a trabajadora",
  ENTREGADA_TRABAJADORA: "Entregada a clienta ✓ (activa premios y cobro 50/50)",
  ENTREGADA_CLIENTE: "Cerrar pedido",
};

export function OrderActions({ orderId, status }: { orderId: string; status: string }) {
  const [pending, start] = useTransition();
  const router = useRouter();
  const finalStates = ["CERRADO", "CANCELADO"];

  if (finalStates.includes(status)) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {NEXT_LABEL[status] && (
        <Button
          loading={pending}
          onClick={() => start(async () => {
            try { await advanceOrder(orderId); router.refresh(); }
            catch (e) { alert(e instanceof Error ? e.message : "Error"); }
          })}
        >
          {!pending && <ArrowRight size={16} />} {NEXT_LABEL[status]}
        </Button>
      )}
      <Button
        variant="destructive"
        disabled={pending}
        onClick={() => {
          if (!confirm("¿Cancelar el pedido? El stock se devuelve al inventario.")) return;
          start(async () => { await cancelOrder(orderId); router.refresh(); });
        }}
      >
        <Ban size={15} /> Cancelar
      </Button>
    </div>
  );
}
