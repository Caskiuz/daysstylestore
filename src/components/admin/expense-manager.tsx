"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/form";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/misc";
import { addExpense, deleteExpense } from "@/lib/actions/admin";

type Expense = { id: string; concept: string; amountUsd: number; currency: string; category: string; date: string };

export function ExpenseManager({ expenses }: { expenses: Expense[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [concept, setConcept] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [category, setCategory] = useState("COMPRA_MERCANCIA");

  const total = expenses.reduce((a, e) => a + e.amountUsd, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet size={17} className="text-gold" /> Gastos del período · US$ {total.toFixed(2)}
        </CardTitle>
      </CardHeader>
      <CardBody className="pt-3">
        <form
          className="mb-4 grid gap-3 sm:grid-cols-[2fr_1fr_1fr_auto_auto]"
          onSubmit={(e) => {
            e.preventDefault();
            const amt = Number(amount);
            if (!concept.trim() || (!amt && amt <= 0)) return;
            start(async () => {
              await addExpense(concept.trim(), currency === "USD" ? amt : 0, currency, currency === "USD" ? 0 : amt, category);
              setConcept(""); setAmount("");
              router.refresh();
            });
          }}
        >
          <Input value={concept} onChange={(e) => setConcept(e.target.value)} placeholder="Concepto (Ej: compra de lote de vestidos)" className="h-9" required />
          <Select value={currency} onChange={(e) => setCurrency(e.target.value)} className="h-9">
            <option value="USD">US$</option>
            <option value="COP">COP</option>
          </Select>
          <Input type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Monto" className="h-9" required />
          <Select value={category} onChange={(e) => setCategory(e.target.value)} className="h-9">
            <option value="COMPRA_MERCANCIA">Mercancía</option>
            <option value="ENVIO">Envíos</option>
            <option value="SERVICIO">Servicios</option>
            <option value="PREMIO">Premios</option>
            <option value="GENERAL">General</option>
          </Select>
          <Button type="submit" size="sm" className="h-9" loading={pending}><Plus size={14} /> Agregar</Button>
        </form>

        {expenses.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sin gastos registrados en el período.</p>
        ) : (
          <ul className="divide-y divide-border">
            {expenses.map((e) => (
              <li key={e.id} className="flex items-center gap-3 py-2.5 text-sm">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{e.concept}</p>
                  <p className="text-xs text-muted-foreground">{e.category.replace("_", " ")} · {new Date(e.date).toLocaleDateString("es-CO")} · {e.currency}</p>
                </div>
                <b className="text-destructive">US$ {e.amountUsd.toFixed(2)}</b>
                <button
                  aria-label="Eliminar gasto"
                  onClick={() => { if (confirm("¿Eliminar este gasto?")) start(async () => { await deleteExpense(e.id); router.refresh(); }); }}
                  className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </CardBody>
    </Card>
  );
}
