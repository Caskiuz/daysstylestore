"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CURRENCIES, formatMoney, convertFromUsd, type CurrencyCode, type Rates } from "@/lib/currency";

type CurrencyCtx = {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  enabled: CurrencyCode[];
  rates: Rates;
  format: (usd: number) => string;
};

const Ctx = createContext<CurrencyCtx | null>(null);

export function CurrencyProvider({
  children,
  rates,
  enabled,
}: {
  children: ReactNode;
  rates: Rates;
  enabled: string[];
}) {
  const enabledCodes = (enabled.length ? enabled : ["USD", "COP"]) as CurrencyCode[];
  const [currency, setCurrencyState] = useState<CurrencyCode>("COP");

  useEffect(() => {
    const saved = localStorage.getItem("dss_currency") as CurrencyCode | null;
    if (saved && enabledCodes.includes(saved)) setCurrencyState(saved);
  }, [enabledCodes.join()]);

  const setCurrency = useCallback((c: CurrencyCode) => {
    setCurrencyState(c);
    localStorage.setItem("dss_currency", c);
  }, []);

  const format = useCallback((usd: number) => formatMoney(convertFromUsd(usd, currency, rates), currency), [currency, rates]);

  const value = useMemo(
    () => ({ currency, setCurrency, enabled: enabledCodes, rates, format }),
    [currency, setCurrency, enabledCodes, rates, format]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCurrency() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCurrency debe usarse dentro de CurrencyProvider");
  return ctx;
}

/** Precio animado que cambia suave al cambiar de moneda. */
export function AnimatedPrice({ usd, className }: { usd: number; className?: string }) {
  const { format, currency } = useCurrency();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={currency}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.18 }}
        className={className}
      >
        {format(usd)}
      </motion.span>
    </AnimatePresence>
  );
}

export function CurrencySwitcher() {
  const { currency, setCurrency, enabled } = useCurrency();
  return (
    <div className="flex items-center rounded-full border border-border bg-card p-0.5 text-xs font-bold" role="group" aria-label="Elegir moneda">
      {enabled.map((c) => (
        <button
          key={c}
          onClick={() => setCurrency(c)}
          className={`relative rounded-full px-2.5 py-1 transition-colors cursor-pointer ${
            currency === c ? "text-[#2a2005]" : "text-muted-foreground hover:text-foreground"
          }`}
          aria-pressed={currency === c}
        >
          {currency === c && (
            <motion.span
              layoutId="currency-pill"
              className="absolute inset-0 rounded-full bg-gradient-to-b from-[#e3c25c] to-[#d4af37]"
              transition={{ type: "spring", damping: 28, stiffness: 350 }}
            />
          )}
          <span className="relative">{c}</span>
        </button>
      ))}
    </div>
  );
}

export { CURRENCIES };
