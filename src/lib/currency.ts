// Conversión y formato de monedas. Precio base: USD. Tasas configurables en admin.

export type CurrencyCode = "USD" | "COP" | "VES";

export const CURRENCIES: Record<CurrencyCode, { label: string; symbol: string; locale: string; maxDecimals: number }> = {
  USD: { label: "Dólar", symbol: "USD $", locale: "en-US", maxDecimals: 2 },
  COP: { label: "Peso colombiano", symbol: "$", locale: "es-CO", maxDecimals: 0 },
  VES: { label: "Bolívar", symbol: "Bs.", locale: "es-VE", maxDecimals: 2 },
};

export type Rates = { usdToCop: number; usdToVes: number };

export const DEFAULT_RATES: Rates = { usdToCop: 3900, usdToVes: 40 };

export function convertFromUsd(amountUsd: number, currency: CurrencyCode, rates: Rates): number {
  switch (currency) {
    case "COP": return amountUsd * rates.usdToCop;
    case "VES": return amountUsd * rates.usdToVes;
    default: return amountUsd;
  }
}

export function convertToUsd(amountLocal: number, currency: CurrencyCode, rates: Rates): number {
  switch (currency) {
    case "COP": return rates.usdToCop > 0 ? amountLocal / rates.usdToCop : 0;
    case "VES": return rates.usdToVes > 0 ? amountLocal / rates.usdToVes : 0;
    default: return amountLocal;
  }
}

export function rateForUsd(currency: CurrencyCode, rates: Rates): number {
  switch (currency) {
    case "COP": return rates.usdToCop;
    case "VES": return rates.usdToVes;
    default: return 1;
  }
}

export function formatMoney(amount: number, currency: CurrencyCode): string {
  const cfg = CURRENCIES[currency];
  const formatted = new Intl.NumberFormat(cfg.locale, {
    maximumFractionDigits: cfg.maxDecimals,
    minimumFractionDigits: 0,
  }).format(amount);
  return currency === "USD" ? `US$ ${formatted}` : currency === "VES" ? `Bs. ${formatted}` : `$ ${formatted}`;
}

/** Formatea un precio USD en la moneda elegida usando las tasas. */
export function priceIn(amountUsd: number, currency: CurrencyCode, rates: Rates): string {
  return formatMoney(convertFromUsd(amountUsd, currency, rates), currency);
}
