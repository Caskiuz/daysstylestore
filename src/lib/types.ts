// Tipos compartidos entre la base de datos y los datos demo

export type VariantInfo = { id: string; size: string; color: string; stock: number };

export type PublicProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  priceUsd: number;
  images: string[];
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  featured: boolean;
  active: boolean;
  tag: string | null;
  variants: VariantInfo[];
};

export type PublicCategory = {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  productCount?: number;
};

export type PaymentMethod = {
  id: string;
  name: string;
  currency: string;
  details: string;
  enabled: boolean;
};

export type StoreSettings = {
  storeName: string;
  tagline: string;
  whatsapp: string;
  instagram: string | null;
  facebook: string | null;
  tiktok: string | null;
  email: string | null;
  address: string | null;
  aboutText: string;
  aiPrompt: string;
  aiEnabled: boolean;
  usdToCop: number;
  usdToVes: number;
  rewardUnits: number;
  currenciesEnabled: string[];
  paymentMethods: PaymentMethod[];
};

export const ORDER_STATUSES = [
  "PENDIENTE",
  "CONFIRMADO",
  "EN_REPARTO",
  "ENTREGADA_TRABAJADORA",
  "ENTREGADA_CLIENTE",
  "CERRADO",
  "CANCELADO",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDIENTE: "Pendiente",
  CONFIRMADO: "Confirmado",
  EN_REPARTO: "En reparto (jefa trae)",
  ENTREGADA_TRABAJADORA: "Entregada a trabajadora",
  ENTREGADA_CLIENTE: "Entregada a cliente",
  CERRADO: "Cerrado",
  CANCELADO: "Cancelado",
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  PENDIENTE: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  CONFIRMADO: "bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-300",
  EN_REPARTO: "bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-300",
  ENTREGADA_TRABAJADORA: "bg-cyan-100 text-cyan-800 dark:bg-cyan-500/15 dark:text-cyan-300",
  ENTREGADA_CLIENTE: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
  CERRADO: "bg-zinc-200 text-zinc-700 dark:bg-zinc-500/20 dark:text-zinc-300",
  CANCELADO: "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300",
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  EFECTIVO: "Efectivo",
  BANCOLOMBIA: "Transferencia Bancolombia",
  NEQUI: "Nequi",
  EFECTIVO_USD: "Efectivo USD",
  EFECTIVO_VES: "Efectivo Bs.",
  OTRO: "Otro",
};
