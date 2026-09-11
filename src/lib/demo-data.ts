// Datos demo: se muestran en la tienda pública cuando la base de datos
// aún no está configurada (modo local antes de conectar Neon).
import type { PublicCategory, PublicProduct, StoreSettings } from "@/lib/types";

export const DEMO_SETTINGS: StoreSettings = {
  storeName: "Days Style Store",
  tagline: "Moda que te hace brillar",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "573001234567",
  instagram: "daystylestore",
  facebook: null,
  tiktok: "daystylestore",
  email: "hola@daystylestore.com",
  address: "Atendemos con entrega personalizada",
  aboutText:
    "Days Style Store nació de la pasión por la moda y el deseo de hacer brillar a cada mujer. Trabajamos con un equipo de asesoras que te acompaña de forma personal: promocionan las tendencias, reciben tu pedido y te lo llevan hasta la puerta. Calidad, estilo y un trato cercano — esa es nuestra esencia.",
  aiPrompt:
    "Eres la asistente virtual de Days Style Store, una tienda de ropa femenina. Ayudas con tallas, precios, métodos de pago, tiempos de entrega y el programa de asesoras. Sé cálida, breve y usa emojis con moderación.",
  aiEnabled: true,
  usdToCop: 3900,
  usdToVes: 40,
  rewardUnits: 4,
  currenciesEnabled: ["USD", "COP"],
  paymentMethods: [
    { id: "efectivo-cop", name: "Efectivo en pesos (COP)", currency: "COP", details: "Pago en efectivo al recibir el pedido.", enabled: true },
    { id: "bancolombia", name: "Transferencia Bancolombia", currency: "COP", details: "Los datos de la cuenta se comparten por WhatsApp al confirmar el pedido.", enabled: true },
    { id: "nequi", name: "Nequi", currency: "COP", details: "Envío por Nequi al número de la tienda — se comparte por WhatsApp al confirmar.", enabled: true },
    { id: "efectivo-usd", name: "Efectivo en dólares (USD)", currency: "USD", details: "Pago en efectivo en dólares al recibir el pedido.", enabled: true },
  ],
};

const DEMO_CATEGORIES: PublicCategory[] = [
  { id: "c1", name: "Blusas & Tops", slug: "blusas", image: null },
  { id: "c2", name: "Pantalones & Jeans", slug: "pantalones", image: null },
  { id: "c3", name: "Vestidos", slug: "vestidos", image: null },
  { id: "c4", name: "Faldas & Shorts", slug: "faldas", image: null },
  { id: "c5", name: "Accesorios", slug: "accesorios", image: null },
];

function makeVariants(sizes: string[], colors: string[], stock: number) {
  return sizes.flatMap((size, si) =>
    colors.map((color, ci) => ({ id: `v-${si}-${ci}`, size, color, stock }))
  );
}

export const DEMO_PRODUCTS: PublicProduct[] = [
  {
    id: "p1", name: "Blusa Satén Brillo Dorado", slug: "blusa-saten-brillo-dorado",
    description: "Blusa en satén con caída fluida y acabado perlado. Perfecta para brillar de día o de noche.",
    priceUsd: 14.99, images: ["/products/blusa-saten.svg"], categoryId: "c1", categoryName: "Blusas & Tops", categorySlug: "blusas",
    featured: true, active: true, tag: "NUEVO", variants: makeVariants(["S", "M", "L", "XL"], ["Champán", "Negro", "Blanco"], 8),
  },
  {
    id: "p2", name: "Jeans Slim Tiro Alto Premium", slug: "jeans-slim-tiro-alto",
    description: "Jeans slim de tiro alto con denim premium que moldea la figura. Comodidad total y diseño que estiliza.",
    priceUsd: 22.99, images: ["/products/jeans-slim.svg"], categoryId: "c2", categoryName: "Pantalones & Jeans", categorySlug: "pantalones",
    featured: true, active: true, tag: "HOT", variants: makeVariants(["26", "28", "30", "32", "34"], ["Azul medio", "Negro", "Celeste"], 10),
  },
  {
    id: "p3", name: "Vestido Midi Noche Estrellada", slug: "vestido-midi-noche",
    description: "Vestido midi ajustado con tejido elástico y brillo sutil. Tu aliado para ocasiones especiales.",
    priceUsd: 27.5, images: ["/products/vestido-midi.svg"], categoryId: "c3", categoryName: "Vestidos", categorySlug: "vestidos",
    featured: true, active: true, tag: "NUEVO", variants: makeVariants(["S", "M", "L"], ["Negro", "Vino"], 6),
  },
  {
    id: "p4", name: "Blusa Crop Encaje Delicado", slug: "blusa-crop-encaje",
    description: "Crop top de encaje delicado con forro interior. Romántico, fresco y súper combinable.",
    priceUsd: 11.99, images: ["/products/blusa-crop.svg"], categoryId: "c1", categoryName: "Blusas & Tops", categorySlug: "blusas",
    featured: false, active: true, tag: null, variants: makeVariants(["S", "M", "L", "XL"], ["Blanco", "Negro"], 12),
  },
  {
    id: "p5", name: "Pantalón Palazzo Fluido", slug: "pantalon-palazzo",
    description: "Pantalón palazzo de caída fluida que alarga la silueta. Elegencia bohemia con comodidad increíble.",
    priceUsd: 19.99, images: ["/products/palazzo.svg"], categoryId: "c2", categoryName: "Pantalones & Jeans", categorySlug: "pantalones",
    featured: false, active: true, tag: null, variants: makeVariants(["S", "M", "L", "XL"], ["Negro", "Cheetos", "Beige"], 9),
  },
  {
    id: "p6", name: "Falda Jean Mini Clásica", slug: "falda-jean-mini",
    description: "Falda mini de jean con detalle de botones dorados. Un básico infaltable del armario.",
    priceUsd: 15.5, images: ["/products/falda-jean.svg"], categoryId: "c4", categoryName: "Faldas & Shorts", categorySlug: "faldas",
    featured: false, active: true, tag: null, variants: makeVariants(["26", "28", "30", "32", "34"], ["Azul claro", "Azul oscuro"], 7),
  },
  {
    id: "p7", name: "Vestido Playa Tropical Sunset", slug: "vestido-playa-tropical",
    description: "Vestido ligero estampado con colores del atardecer. Ideal para vacaciones.",
    priceUsd: 18.99, images: ["/products/vestido-playa.svg"], categoryId: "c3", categoryName: "Vestidos", categorySlug: "vestidos",
    featured: true, active: true, tag: null, variants: makeVariants(["S/M", "L/XL"], ["Atardecer", "Turquesa"], 11),
  },
  {
    id: "p8", name: "Set Accesorios Gold Essence", slug: "set-accesorios-gold",
    description: "Set de accesorios bañados en oro: aretes, collar y pulsera. El toque final para cualquier outfit.",
    priceUsd: 9.99, images: ["/products/accesorios-gold.svg"], categoryId: "c5", categoryName: "Accesorios", categorySlug: "accesorios",
    featured: false, active: true, tag: "OFERTA", variants: makeVariants(["Única"], ["Dorado"], 20),
  },
];

export { DEMO_CATEGORIES };
