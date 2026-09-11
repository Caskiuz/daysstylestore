"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { Filter, Search, X } from "lucide-react";
import { Input, Select } from "@/components/ui/form";
import { useCurrency } from "@/components/currency-provider";
import type { PublicCategory } from "@/lib/types";

export function FilterBar({ categories, sizes, colors }: { categories: PublicCategory[]; sizes: string[]; colors: string[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const { currency } = useCurrency();
  const [q, setQ] = useState(params.get("q") || "");

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const next = new URLSearchParams(params.toString());
      if (value && value !== "") next.set(key, value);
      else next.delete(key);
      router.push(`/shop?${next.toString()}`, { scroll: false });
    },
    [params, router]
  );

  const hasFilters = ["cat", "size", "color", "min", "max", "q", "sort"].some((k) => params.get(k));

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={`Buscar en la tienda (${currency})…`}
            className="pl-10"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && setParam("q", q || null)}
          />
        </div>

        <Select value={params.get("cat") || ""} onChange={(e) => setParam("cat", e.target.value || null)} className="w-auto min-w-40">
          <option value="">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </Select>

        <Select value={params.get("size") || ""} onChange={(e) => setParam("size", e.target.value || null)} className="w-auto min-w-28">
          <option value="">Talla</option>
          {sizes.map((s) => <option key={s} value={s}>{s}</option>)}
        </Select>

        <Select value={params.get("color") || ""} onChange={(e) => setParam("color", e.target.value || null)} className="w-auto min-w-32">
          <option value="">Color</option>
          {colors.map((c) => <option key={c} value={c}>{c}</option>)}
        </Select>

        <Select value={params.get("sort") || "nuevos"} onChange={(e) => setParam("sort", e.target.value)} className="w-auto min-w-40">
          <option value="nuevos">Más nuevos</option>
          <option value="precio-asc">Precio: menor a mayor</option>
          <option value="precio-desc">Precio: mayor a menor</option>
          <option value="nombre">Nombre A-Z</option>
        </Select>

        {hasFilters && (
          <button
            onClick={() => { setQ(""); router.push("/shop", { scroll: false }); }}
            className="flex items-center gap-1 rounded-full border border-border px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive cursor-pointer"
          >
            <X size={13} /> Limpiar
          </button>
        )}
      </div>

      {params.get("q") && (
        <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Filter size={12} className="text-gold" /> Resultados para “{params.get("q")}”
        </p>
      )}
    </div>
  );
}
