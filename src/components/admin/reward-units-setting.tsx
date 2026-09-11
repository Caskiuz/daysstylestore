"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { setRewardUnits } from "@/lib/actions/admin";

export function RewardUnitsSetting({ current }: { current: number }) {
  const [value, setValue] = useState(String(current));
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-gold/40 bg-gradient-to-r from-accent/60 to-card p-5">
      <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
        <b className="text-foreground">Regla global del programa:</b> cada{" "}
        <Input
          className="inline-block h-9 w-16 text-center align-middle"
          type="number" min="2" max="20" value={value}
          onChange={(e) => { setValue(e.target.value); setSaved(false); }}
        />{" "}
        prendas vendidas de un mismo producto, la trabajadora gana 1 premio (esa prenda o su valor en efectivo). Las unidades arrastran hacia el siguiente premio.
      </p>
      <Button
        loading={pending}
        onClick={() => {
          const n = Number(value);
          if (!n || n < 2) return;
          start(async () => {
            await setRewardUnits(n);
            setSaved(true);
            router.refresh();
          });
        }}
      >
        {!pending && <Save size={15} />} {saved ? "Guardado ✓" : "Guardar regla"}
      </Button>
    </div>
  );
}
