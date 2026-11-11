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
  { id: "c6", name: "Calzado", slug: "calzado", image: null },
];

function makeVariants(sizes: string[], colors: string[], stock: number) {
  return sizes.flatMap((size, si) =>
    colors.map((color, ci) => ({ id: `v-${si}-${ci}`, size, color, stock }))
  );
}

const SIZES_CALZADO = ["34", "35", "36", "37", "38", "39", "40"];

export const DEMO_PRODUCTS: PublicProduct[] = [
  {
    id: "cal-01", name: "Sandalias Greca Camel", slug: "sandalias-greca-camel",
    description: "Sandalias planas con greca tejida y punta cuadrada, cómodas y frescas para tus looks casuales.",
    priceUsd: 12, images: ["/products/sandalias-36000-01.jpg"], categoryId: "c6", categoryName: "Calzado", categorySlug: "calzado",
    featured: false, active: true, tag: "NUEVO", variants: makeVariants(SIZES_CALZADO, ["Camel"], 5),
  },
  {
    id: "cal-02", name: "Chanclas Plisadas Brillo", slug: "chanclas-plisadas-brillo",
    description: "Chanclas plisadas con acabado metálico brillante, suela plana y comodidad para elevar cualquier look casual.",
    priceUsd: 12, images: ["/products/sandalias-36000-02.jpg"], categoryId: "c6", categoryName: "Calzado", categorySlug: "calzado",
    featured: false, active: true, tag: "NUEVO", variants: makeVariants(SIZES_CALZADO, ["Multicolor"], 5),
  },
  {
    id: "cal-03", name: "Sandalias Perlas Ante", slug: "sandalias-perlas-ante",
    description: "Sandalias de ante con perlas decorativas, suaves, planas y versátiles para acompañar tus looks diarios.",
    priceUsd: 12, images: ["/products/sandalias-36000-03.jpg"], categoryId: "c6", categoryName: "Calzado", categorySlug: "calzado",
    featured: false, active: true, tag: "NUEVO", variants: makeVariants(SIZES_CALZADO, ["Multicolor"], 5),
  },
  {
    id: "cal-04", name: "Sandalias Monograma Brillo", slug: "sandalias-monograma-brillo",
    description: "Sandalias planas con monograma brillante, ligeras y cómodas para un estilo moderno durante todo el día.",
    priceUsd: 12, images: ["/products/sandalias-36000-04.jpg"], categoryId: "c6", categoryName: "Calzado", categorySlug: "calzado",
    featured: false, active: true, tag: "NUEVO", variants: makeVariants(SIZES_CALZADO, ["Multicolor"], 5),
  },
  {
    id: "cal-05", name: "Sandalias Perlas Grandes", slug: "sandalias-perlas-grandes",
    description: "Sandalias planas con perlas grandes y detalle rústico, cómodas y encantadoras para tus días de verano.",
    priceUsd: 12, images: ["/products/sandalias-36000-05.jpg"], categoryId: "c6", categoryName: "Calzado", categorySlug: "calzado",
    featured: false, active: true, tag: "NUEVO", variants: makeVariants(SIZES_CALZADO, ["Multicolor"], 5),
  },
  {
    id: "cal-06", name: "Sandalias Colección Verano", slug: "sandalias-coleccion-verano",
    description: "Colección de sandalias planas con estampados variados y brillo, cómodas para renovar tus looks de diario.",
    priceUsd: 12, images: ["/products/sandalias-36000-06.jpg"], categoryId: "c6", categoryName: "Calzado", categorySlug: "calzado",
    featured: false, active: true, tag: "NUEVO", variants: makeVariants(SIZES_CALZADO, ["Multicolor"], 5),
  },
  {
    id: "cal-07", name: "Sandalias Pedrería Dobles", slug: "sandalias-pedreria-dobles",
    description: "Sandalias de dos tiras con pedrería y punta cuadrada, comodidad y brillo para cualquier ocasión.",
    priceUsd: 12, images: ["/products/sandalias-36000-07.jpg"], categoryId: "c6", categoryName: "Calzado", categorySlug: "calzado",
    featured: false, active: true, tag: "NUEVO", variants: makeVariants(SIZES_CALZADO, ["Multicolor"], 5),
  },
  {
    id: "cal-08", name: "Sandalias Moño Metálico", slug: "sandalias-mono-metalico",
    description: "Sandalias de ante con moño metálico dorado, planas, suaves y elegantes para el uso diario.",
    priceUsd: 12, images: ["/products/sandalias-36000-08.jpg", "/products/sandalias-36000-21.jpg"], categoryId: "c6", categoryName: "Calzado", categorySlug: "calzado",
    featured: false, active: true, tag: "NUEVO", variants: makeVariants(SIZES_CALZADO, ["Multicolor"], 5),
  },
  {
    id: "cal-09", name: "Chanclas Placa Dorada", slug: "chanclas-placa-dorada",
    description: "Chanclas con placa dorada al frente, suela plana, ligeras y con estilo para tus días soleados.",
    priceUsd: 12, images: ["/products/sandalias-36000-09.jpg"], categoryId: "c6", categoryName: "Calzado", categorySlug: "calzado",
    featured: false, active: true, tag: "NUEVO", variants: makeVariants(SIZES_CALZADO, ["Multicolor"], 5),
  },
  {
    id: "cal-10", name: "Sandalias Moño con Perla", slug: "sandalias-mono-con-perla",
    description: "Sandalias de ante con moño y detalle de esfera dorada, cómodas y femeninas para cada día.",
    priceUsd: 12, images: ["/products/sandalias-36000-10.jpg"], categoryId: "c6", categoryName: "Calzado", categorySlug: "calzado",
    featured: false, active: true, tag: "NUEVO", variants: makeVariants(SIZES_CALZADO, ["Multicolor"], 5),
  },
  {
    id: "cal-11", name: "Sandalias Moño Damero", slug: "sandalias-mono-damero",
    description: "Sandalias con moño y estampado damero, correa al tobillo, planas y muy cómodas de usar.",
    priceUsd: 12, images: ["/products/sandalias-36000-11.jpg"], categoryId: "c6", categoryName: "Calzado", categorySlug: "calzado",
    featured: false, active: true, tag: "NUEVO", variants: makeVariants(SIZES_CALZADO, ["Multicolor"], 5),
  },
  {
    id: "cal-12", name: "Sandalias Moño Pedrería", slug: "sandalias-mono-pedreria",
    description: "Sandalias con moño decorado en pedrería, suela suave y estilo dulce para toda ocasión.",
    priceUsd: 12, images: ["/products/sandalias-36000-12.jpg", "/products/sandalias-36000-15.jpg", "/products/sandalias-36000-27.jpg"], categoryId: "c6", categoryName: "Calzado", categorySlug: "calzado",
    featured: false, active: true, tag: "NUEVO", variants: makeVariants(SIZES_CALZADO, ["Multicolor"], 5),
  },
  {
    id: "cal-13", name: "Sandalias Esferas Doradas", slug: "sandalias-esferas-doradas",
    description: "Sandalias con hilera de esferas doradas sobre tiras finas, planas y cómodas para el verano.",
    priceUsd: 12, images: ["/products/sandalias-36000-13.jpg"], categoryId: "c6", categoryName: "Calzado", categorySlug: "calzado",
    featured: false, active: true, tag: "NUEVO", variants: makeVariants(SIZES_CALZADO, ["Dorado"], 5),
  },
  {
    id: "cal-14", name: "Chanclas Dientes Doradas", slug: "chanclas-dientes-doradas",
    description: "Chanclas con dientes dorados sobre tiras cruzadas, planas, frescas y perfectas para el clima cálido.",
    priceUsd: 12, images: ["/products/sandalias-36000-14.jpg"], categoryId: "c6", categoryName: "Calzado", categorySlug: "calzado",
    featured: false, active: true, tag: "NUEVO", variants: makeVariants(SIZES_CALZADO, ["Multicolor"], 5),
  },
  {
    id: "cal-15", name: "Sandalias Cristales Cuadradas", slug: "sandalias-cristales-cuadradas",
    description: "Sandalias de punta cuadrada con banda de cristales, brillo elegante y comodidad durante toda la noche.",
    priceUsd: 12, images: ["/products/sandalias-36000-16.jpg"], categoryId: "c6", categoryName: "Calzado", categorySlug: "calzado",
    featured: false, active: true, tag: "NUEVO", variants: makeVariants(SIZES_CALZADO, ["Multicolor"], 5),
  },
  {
    id: "cal-16", name: "Chanclas Glitter Logo Dorado", slug: "chanclas-glitter-logo-dorado",
    description: "Chanclas con banda glitter y placa dorada, ligeras, brillantes y cómodas para cualquier ocasión especial.",
    priceUsd: 12, images: ["/products/sandalias-36000-17.jpg", "/products/sandalias-36000-23.jpg", "/products/sandalias-36000-34.jpg"], categoryId: "c6", categoryName: "Calzado", categorySlug: "calzado",
    featured: false, active: true, tag: "NUEVO", variants: makeVariants(SIZES_CALZADO, ["Multicolor"], 5),
  },
  {
    id: "cal-17", name: "Sandalias Greca Colores", slug: "sandalias-greca-colores",
    description: "Sandalias planas en colores vivos con detalles de greca, cómodas y frescas para tus looks de verano.",
    priceUsd: 12, images: ["/products/sandalias-36000-18.jpg"], categoryId: "c6", categoryName: "Calzado", categorySlug: "calzado",
    featured: false, active: true, tag: "NUEVO", variants: makeVariants(SIZES_CALZADO, ["Multicolor"], 5),
  },
  {
    id: "cal-18", name: "Sandalias Greca Glitter", slug: "sandalias-greca-glitter",
    description: "Sandalias con greca en glitter y detalle dorado, suela plana y comodidad para lucir con estilo.",
    priceUsd: 12, images: ["/products/sandalias-36000-19.jpg"], categoryId: "c6", categoryName: "Calzado", categorySlug: "calzado",
    featured: false, active: true, tag: "NUEVO", variants: makeVariants(SIZES_CALZADO, ["Multicolor"], 5),
  },
  {
    id: "cal-19", name: "Sandalias Blancas Pedrería", slug: "sandalias-blancas-pedreria",
    description: "Sandalias blancas de tiras delgadas con pedrería, elegantes, ligeras y perfectas para ocasiones especiales.",
    priceUsd: 12, images: ["/products/sandalias-36000-20.jpg"], categoryId: "c6", categoryName: "Calzado", categorySlug: "calzado",
    featured: false, active: true, tag: "NUEVO", variants: makeVariants(SIZES_CALZADO, ["Blanco"], 5),
  },
  {
    id: "cal-20", name: "Sandalias Tejidas Estampadas", slug: "sandalias-tejidas-estampadas",
    description: "Sandalias tejidas con estampado exclusivo, planas, ligeras y cómodas para tu día a día.",
    priceUsd: 12, images: ["/products/sandalias-36000-22.jpg"], categoryId: "c6", categoryName: "Calzado", categorySlug: "calzado",
    featured: false, active: true, tag: "NUEVO", variants: makeVariants(SIZES_CALZADO, ["Multicolor"], 5),
  },
  {
    id: "cal-21", name: "Sandalias Leopardo Nudo", slug: "sandalias-leopardo-nudo",
    description: "Sandalias de leopardo con nudo frontal, planas y cómodas para un estilo audaz y natural.",
    priceUsd: 12, images: ["/products/sandalias-36000-24.jpg"], categoryId: "c6", categoryName: "Calzado", categorySlug: "calzado",
    featured: false, active: true, tag: "NUEVO", variants: makeVariants(SIZES_CALZADO, ["Leopardo"], 5),
  },
  {
    id: "cal-22", name: "Sandalias Dientes Glitter", slug: "sandalias-dientes-glitter",
    description: "Sandalias con banda brillante y esferas metálicas, cómodas, llamativas y perfectas para el verano.",
    priceUsd: 12, images: ["/products/sandalias-36000-25.jpg"], categoryId: "c6", categoryName: "Calzado", categorySlug: "calzado",
    featured: false, active: true, tag: "NUEVO", variants: makeVariants(SIZES_CALZADO, ["Multicolor"], 5),
  },
  {
    id: "cal-23", name: "Chanclas Parche Triangular", slug: "chanclas-parche-triangular",
    description: "Chanclas de ante con parche triangular al frente, planas, suaves y cómodas para el diario.",
    priceUsd: 12, images: ["/products/sandalias-36000-26.jpg"], categoryId: "c6", categoryName: "Calzado", categorySlug: "calzado",
    featured: false, active: true, tag: "NUEVO", variants: makeVariants(SIZES_CALZADO, ["Multicolor"], 5),
  },
  {
    id: "cal-24", name: "Chanclas Pedrería Clásicas", slug: "chanclas-pedreria-clasicas",
    description: "Chanclas con tiras decoradas en pedrería, suela plana y brillo fresco para tus días de sol.",
    priceUsd: 12, images: ["/products/sandalias-36000-28.jpg", "/products/sandalias-36000-32.jpg"], categoryId: "c6", categoryName: "Calzado", categorySlug: "calzado",
    featured: false, active: true, tag: "NUEVO", variants: makeVariants(SIZES_CALZADO, ["Multicolor"], 5),
  },
  {
    id: "cal-25", name: "Sandalias Tirantes Pedrería", slug: "sandalias-tirantes-pedreria",
    description: "Sandalias de tiras finas con pedrería y argolla para el dedo, elegantes y muy cómodas.",
    priceUsd: 12, images: ["/products/sandalias-36000-29.jpg"], categoryId: "c6", categoryName: "Calzado", categorySlug: "calzado",
    featured: false, active: true, tag: "NUEVO", variants: makeVariants(SIZES_CALZADO, ["Multicolor"], 5),
  },
  {
    id: "cal-26", name: "Sandalias Pelo Estampado", slug: "sandalias-pelo-estampado",
    description: "Sandalias de pelo con estampados animal print, punta cuadrada y comodidad para looks con actitud.",
    priceUsd: 12, images: ["/products/sandalias-36000-30.jpg"], categoryId: "c6", categoryName: "Calzado", categorySlug: "calzado",
    featured: false, active: true, tag: "NUEVO", variants: makeVariants(SIZES_CALZADO, ["Multicolor"], 5),
  },
  {
    id: "cal-27", name: "Sandalias Plisadas Esferas", slug: "sandalias-plisadas-esferas",
    description: "Sandalias plisadas con esferas doradas, suela plana y comodidad para brillar en tus ocasiones especiales.",
    priceUsd: 12, images: ["/products/sandalias-36000-31.jpg"], categoryId: "c6", categoryName: "Calzado", categorySlug: "calzado",
    featured: false, active: true, tag: "NUEVO", variants: makeVariants(SIZES_CALZADO, ["Multicolor"], 5),
  },
  {
    id: "cal-28", name: "Sandalias Moño con Brillo", slug: "sandalias-mono-con-brillo",
    description: "Sandalias con moño y hebilla de pedrería, planas, femeninas y cómodas para el uso diario.",
    priceUsd: 12, images: ["/products/sandalias-36000-33.jpg"], categoryId: "c6", categoryName: "Calzado", categorySlug: "calzado",
    featured: false, active: true, tag: "NUEVO", variants: makeVariants(SIZES_CALZADO, ["Multicolor"], 5),
  },
  {
    id: "cal-29", name: "Sandalias Moño con Hebilla", slug: "sandalias-mono-con-hebilla",
    description: "Sandalias con moño suave y hebilla dorada, suela plana, femeninas y elegantes para cualquier ocasión.",
    priceUsd: 12, images: ["/products/sandalias-36000-35.jpg", "/products/sandalias-36000-36.jpg"], categoryId: "c6", categoryName: "Calzado", categorySlug: "calzado",
    featured: false, active: true, tag: "NUEVO", variants: makeVariants(SIZES_CALZADO, ["Multicolor"], 5),
  },
  {
    id: "cal-30", name: "Sandalias Cruzadas con Dientes", slug: "sandalias-cruzadas-con-dientes",
    description: "Sandalias de tiras cruzadas con dientes dorados y argolla, cómodas y versátiles para el diario.",
    priceUsd: 13.333333333333334, images: ["/products/sandalias-40000-01.jpg"], categoryId: "c6", categoryName: "Calzado", categorySlug: "calzado",
    featured: false, active: true, tag: "NUEVO", variants: makeVariants(SIZES_CALZADO, ["Café"], 5),
  },
  {
    id: "cal-31", name: "Sandalias Cruzadas Rojas", slug: "sandalias-cruzadas-rojas",
    description: "Sandalias rojas de tiras cruzadas con dientes dorados, frescas, cómodas y llenas de estilo.",
    priceUsd: 13.333333333333334, images: ["/products/sandalias-40000-02.jpg"], categoryId: "c6", categoryName: "Calzado", categorySlug: "calzado",
    featured: false, active: true, tag: "NUEVO", variants: makeVariants(SIZES_CALZADO, ["Rojo"], 5),
  },
  {
    id: "cal-32", name: "Sandalias Tobillo Glitter", slug: "sandalias-tobillo-glitter",
    description: "Sandalias con banda ancha brillante y correa al tobillo, planas y cómodas para el verano.",
    priceUsd: 13.333333333333334, images: ["/products/sandalias-40000-03.jpg"], categoryId: "c6", categoryName: "Calzado", categorySlug: "calzado",
    featured: false, active: true, tag: "NUEVO", variants: makeVariants(SIZES_CALZADO, ["Multicolor"], 5),
  },
  {
    id: "cal-33", name: "Sandalias Moño Gigante", slug: "sandalias-mono-gigante",
    description: "Sandalias con moño gigante decorativo, suela plana y comodidad para un look divertido y femenino.",
    priceUsd: 13.333333333333334, images: ["/products/sandalias-40000-04.jpg"], categoryId: "c6", categoryName: "Calzado", categorySlug: "calzado",
    featured: false, active: true, tag: "NUEVO", variants: makeVariants(SIZES_CALZADO, ["Multicolor"], 5),
  },
  {
    id: "cal-34", name: "Sandalias Delgadas Pedrería", slug: "sandalias-delgadas-pedreria",
    description: "Sandalias de tiras delgadas con pedrería, ligeras, brillantes y cómodas para tus ocasiones especiales.",
    priceUsd: 13.333333333333334, images: ["/products/sandalias-40000-05.jpg"], categoryId: "c6", categoryName: "Calzado", categorySlug: "calzado",
    featured: false, active: true, tag: "NUEVO", variants: makeVariants(SIZES_CALZADO, ["Multicolor"], 5),
  },
  {
    id: "cal-35", name: "Sandalias Bolitas en T", slug: "sandalias-bolitas-en-t",
    description: "Sandalias planas con correa en T y bolitas doradas, ajustables y cómodas para tus paseos.",
    priceUsd: 13.333333333333334, images: ["/products/sandalias-40000-06.jpg"], categoryId: "c6", categoryName: "Calzado", categorySlug: "calzado",
    featured: false, active: true, tag: "NUEVO", variants: makeVariants(SIZES_CALZADO, ["Multicolor"], 5),
  },
  {
    id: "cal-36", name: "Sandalias Tobillo Pedrería", slug: "sandalias-tobillo-pedreria",
    description: "Sandalias con correa al tobillo, tiras con pedrería y detalle dorado, cómodas para todo el día.",
    priceUsd: 13.333333333333334, images: ["/products/sandalias-40000-07.jpg"], categoryId: "c6", categoryName: "Calzado", categorySlug: "calzado",
    featured: false, active: true, tag: "NUEVO", variants: makeVariants(SIZES_CALZADO, ["Multicolor"], 5),
  },
  {
    id: "cal-37", name: "Sandalias Cruzadas Pedrería", slug: "sandalias-cruzadas-pedreria",
    description: "Sandalias cruzadas con pedrería y correa al tobillo, punta cuadrada y comodidad para todo el día.",
    priceUsd: 13.333333333333334, images: ["/products/sandalias-40000-08.jpg"], categoryId: "c6", categoryName: "Calzado", categorySlug: "calzado",
    featured: false, active: true, tag: "NUEVO", variants: makeVariants(SIZES_CALZADO, ["Multicolor"], 5),
  },
  {
    id: "cal-38", name: "Sandalias Cuerdas Bolitas", slug: "sandalias-cuerdas-bolitas",
    description: "Sandalias de cuerdas negras con bolitas doradas, ligeras, ajustables y perfectas para el verano.",
    priceUsd: 13.333333333333334, images: ["/products/sandalias-40000-09.jpg"], categoryId: "c6", categoryName: "Calzado", categorySlug: "calzado",
    featured: false, active: true, tag: "NUEVO", variants: makeVariants(SIZES_CALZADO, ["Negro"], 5),
  },
  {
    id: "cal-39", name: "Sandalias Pastel Dientes", slug: "sandalias-pastel-dientes",
    description: "Sandalias de colores pastel con dientes dorados y correa al tobillo, frescas y muy cómodas.",
    priceUsd: 13.333333333333334, images: ["/products/sandalias-40000-10.jpg"], categoryId: "c6", categoryName: "Calzado", categorySlug: "calzado",
    featured: false, active: true, tag: "NUEVO", variants: makeVariants(SIZES_CALZADO, ["Multicolor"], 5),
  },
  {
    id: "cal-40", name: "Sandalias Malla Brillante", slug: "sandalias-malla-brillante",
    description: "Sandalias con banda de malla brillante y correa al tobillo, planas, elegantes y muy cómodas.",
    priceUsd: 13.333333333333334, images: ["/products/sandalias-40000-11.jpg"], categoryId: "c6", categoryName: "Calzado", categorySlug: "calzado",
    featured: false, active: true, tag: "NUEVO", variants: makeVariants(SIZES_CALZADO, ["Multicolor"], 5),
  },
  {
    id: "cal-41", name: "Chanclas Esferas Plateadas", slug: "chanclas-esferas-plateadas",
    description: "Chanclas transparentes con esferas plateadas y suela metálica, cómodas para un look moderno y fresco.",
    priceUsd: 13.333333333333334, images: ["/products/sandalias-40000-12.jpg"], categoryId: "c6", categoryName: "Calzado", categorySlug: "calzado",
    featured: false, active: true, tag: "NUEVO", variants: makeVariants(SIZES_CALZADO, ["Plateado"], 5),
  },
  {
    id: "cal-42", name: "Sandalias Corazón Dorado", slug: "sandalias-corazon-dorado",
    description: "Sandalias de ante con correa al tobillo y corazón dorado, suaves, cómodas y muy femeninas.",
    priceUsd: 13.333333333333334, images: ["/products/sandalias-40000-13.jpg"], categoryId: "c6", categoryName: "Calzado", categorySlug: "calzado",
    featured: false, active: true, tag: "NUEVO", variants: makeVariants(SIZES_CALZADO, ["Multicolor"], 5),
  },
  {
    id: "cal-43", name: "Sandalias Tobillo Dientes", slug: "sandalias-tobillo-dientes",
    description: "Sandalias con dientes dorados y correa al tobillo ajustable, planas, cómodas y versátiles para el diario.",
    priceUsd: 13.333333333333334, images: ["/products/sandalias-40000-14.jpg"], categoryId: "c6", categoryName: "Calzado", categorySlug: "calzado",
    featured: false, active: true, tag: "NUEVO", variants: makeVariants(SIZES_CALZADO, ["Multicolor"], 5),
  },
  {
    id: "cal-44", name: "Chanclas Translúcidas Doradas", slug: "chanclas-translucidas-doradas",
    description: "Chanclas transparentes con esferas doradas, suela con brillo y comodidad para lucir fresca y elegante.",
    priceUsd: 13.333333333333334, images: ["/products/sandalias-40000-15.jpg", "/products/sandalias-40000-17.jpg"], categoryId: "c6", categoryName: "Calzado", categorySlug: "calzado",
    featured: false, active: true, tag: "NUEVO", variants: makeVariants(SIZES_CALZADO, ["Dorado"], 5),
  },
  {
    id: "cal-45", name: "Chanclas con Perlas", slug: "chanclas-con-perlas",
    description: "Chanclas con hilera de perlas sobre las tiras, suela metalizada y comodidad para el verano.",
    priceUsd: 13.333333333333334, images: ["/products/sandalias-40000-16.jpg"], categoryId: "c6", categoryName: "Calzado", categorySlug: "calzado",
    featured: false, active: true, tag: "NUEVO", variants: makeVariants(SIZES_CALZADO, ["Multicolor"], 5),
  },
  {
    id: "cal-46", name: "Sandalias Moño con Hebilla", slug: "sandalias-mono-con-hebilla-2",
    description: "Sandalias con moño suave y hebilla dorada, suela plana, femeninas y elegantes para cualquier ocasión.",
    priceUsd: 13.333333333333334, images: ["/products/sandalias-40000-18.jpg"], categoryId: "c6", categoryName: "Calzado", categorySlug: "calzado",
    featured: false, active: true, tag: "NUEVO", variants: makeVariants(SIZES_CALZADO, ["Multicolor"], 5),
  },
];

export { DEMO_CATEGORIES };
