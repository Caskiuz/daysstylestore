"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/form";
import { addPayment } from "@/lib/actions/admin";
import type { PaymentMethod } from "@/lib/types";

export function PaymentForm({ orderId, methods, balanceUsd }: { orderId: string; methods: PaymentMethod[]; balanceUsd: number }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [method, setMethod] = useState(methods[0]?.name ?? "EFECTIVO");
  const [currency, setCurrency] = useState(methods[0]?.currency ?? "COP");
  const [amount, setAmount] = useState("");

  if (balanceUsd <= 0.01) {
    return <p className="rounded-xl bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-600 dark:text-emerald-400">✓ Pedido pagado por completo</p>;
  }

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        const amountLocal = Number(amount);
        if (!amountLocal || amountLocal <= 0) { setError("Ingresa el monto recibido"); return; }
        start(async () => {
          try {
            await addPayment({ orderId, method, currency: currency as "USD" | "COP" | "VES", amountLocal });
            setAmount("");
            router.refresh();
          } catch (e2) {
            setError(e2 instanceof Error ? e2.message : "Error al registrar el abono");
          }
        });
      }}
    >
      <div className="grid gap-3 sm:grid-cols-[1.4fr_1fr_1fr]">
        <Field label="Método">
          <Select value={method} onChange={(e) => setMethod(e.target.value)}>
            {methods.map((m) => (
              <option key={m.id} value={m.name}>{m.name}</option>
            ))}
            <option value="OTRO">Otro</option>
          </Select>
        </Field>
        <Field label="Moneda">
          <Select value={currency} onChange={(e) => setCurrency(e.target.value)}>
            <option value="COP">COP</option>
            <option value="USD">USD</option>
            <option value="VES">VES</option>
          </Select>
        </Field>
        <Field label={`Monto recibido (${currency})`}>
          <Input type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" />
        </Field>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" loading={pending}>
        {!pending && <Banknote size={16} />} Registrar abono
      </Button>
    </form>
  );
}
