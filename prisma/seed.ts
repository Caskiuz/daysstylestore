// Seed inicial: admin, settings, categorías, productos demo, trabajadora demo y pedidos de ejemplo
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const PAYMENT_METHODS = [
  { id: "efectivo-cop", name: "Efectivo en pesos (COP)", currency: "COP", details: "Pago en efectivo al recibir el pedido.", enabled: true },
  { id: "bancolombia", name: "Transferencia Bancolombia", currency: "COP", details: "Cuenta de ahorros Bancolombia — coordenadas se comparten por WhatsApp al confirmar el pedido.", enabled: true },
  { id: "nequi", name: "Nequi", currency: "COP", details: "Envío por Nequi al número de la tienda — se comparte por WhatsApp al confirmar.", enabled: true },
  { id: "efectivo-usd", name: "Efectivo en dólares (USD)", currency: "USD", details: "Pago en efectivo en dólares al recibir el pedido.", enabled: true },
  { id: "efectivo-ves", name: "Efectivo en bolívares (VES)", currency: "VES", details: "Pago en efectivo en bolívares (tasa del día).", enabled: false },
];

const CATEGORIES = [
  { name: "Calzado", slug: "calzado", sortOrder: 6, image: "/products/sandalias-36000-07.jpg" },
];

const SIZES_TOP = ["S", "M", "L", "XL"];
const SIZES_PANTS = ["26", "28", "30", "32", "34"];
const SIZES_DRESS = ["S", "M", "L"];
const SIZES_CALZADO = ["34", "35", "36", "37", "38", "39", "40"];

type DemoProduct = {
  name: string; slug: string; cat: string; priceUsd: number; tag?: string; featured?: boolean;
  sizes: string[]; colors: string[]; stock: number; image: string; extraImages?: string[];
  description: string;
};

const PRODUCTS: DemoProduct[] = [
  {
    name: "Sandalias Greca Camel", slug: "sandalias-greca-camel", cat: "calzado", priceUsd: 12, tag: "NUEVO",
    sizes: SIZES_CALZADO, colors: ["Camel"], stock: 5,
    image: "/products/sandalias-36000-01.jpg", extraImages: [],
    description: "Sandalias planas con greca tejida y punta cuadrada, cómodas y frescas para tus looks casuales.",
  },
  {
    name: "Chanclas Plisadas Brillo", slug: "chanclas-plisadas-brillo", cat: "calzado", priceUsd: 12, tag: "NUEVO",
    sizes: SIZES_CALZADO, colors: ["Multicolor"], stock: 5,
    image: "/products/sandalias-36000-02.jpg", extraImages: [],
    description: "Chanclas plisadas con acabado metálico brillante, suela plana y comodidad para elevar cualquier look casual.",
  },
  {
    name: "Sandalias Perlas Ante", slug: "sandalias-perlas-ante", cat: "calzado", priceUsd: 12, tag: "NUEVO",
    sizes: SIZES_CALZADO, colors: ["Multicolor"], stock: 5,
    image: "/products/sandalias-36000-03.jpg", extraImages: [],
    description: "Sandalias de ante con perlas decorativas, suaves, planas y versátiles para acompañar tus looks diarios.",
  },
  {
    name: "Sandalias Monograma Brillo", slug: "sandalias-monograma-brillo", cat: "calzado", priceUsd: 12, tag: "NUEVO",
    sizes: SIZES_CALZADO, colors: ["Multicolor"], stock: 5,
    image: "/products/sandalias-36000-04.jpg", extraImages: [],
    description: "Sandalias planas con monograma brillante, ligeras y cómodas para un estilo moderno durante todo el día.",
  },
  {
    name: "Sandalias Perlas Grandes", slug: "sandalias-perlas-grandes", cat: "calzado", priceUsd: 12, tag: "NUEVO",
    sizes: SIZES_CALZADO, colors: ["Multicolor"], stock: 5,
    image: "/products/sandalias-36000-05.jpg", extraImages: [],
    description: "Sandalias planas con perlas grandes y detalle rústico, cómodas y encantadoras para tus días de verano.",
  },
  {
    name: "Sandalias Colección Verano", slug: "sandalias-coleccion-verano", cat: "calzado", priceUsd: 12, tag: "NUEVO",
    sizes: SIZES_CALZADO, colors: ["Multicolor"], stock: 5,
    image: "/products/sandalias-36000-06.jpg", extraImages: [],
    description: "Colección de sandalias planas con estampados variados y brillo, cómodas para renovar tus looks de diario.",
  },
  {
    name: "Sandalias Pedrería Dobles", slug: "sandalias-pedreria-dobles", cat: "calzado", priceUsd: 12, tag: "NUEVO",
    sizes: SIZES_CALZADO, colors: ["Multicolor"], stock: 5,
    image: "/products/sandalias-36000-07.jpg", extraImages: [],
    description: "Sandalias de dos tiras con pedrería y punta cuadrada, comodidad y brillo para cualquier ocasión.",
  },
  {
    name: "Sandalias Moño Metálico", slug: "sandalias-mono-metalico", cat: "calzado", priceUsd: 12, tag: "NUEVO",
    sizes: SIZES_CALZADO, colors: ["Multicolor"], stock: 5,
    image: "/products/sandalias-36000-08.jpg", extraImages: ["/products/sandalias-36000-21.jpg"],
    description: "Sandalias de ante con moño metálico dorado, planas, suaves y elegantes para el uso diario.",
  },
  {
    name: "Chanclas Placa Dorada", slug: "chanclas-placa-dorada", cat: "calzado", priceUsd: 12, tag: "NUEVO",
    sizes: SIZES_CALZADO, colors: ["Multicolor"], stock: 5,
    image: "/products/sandalias-36000-09.jpg", extraImages: [],
    description: "Chanclas con placa dorada al frente, suela plana, ligeras y con estilo para tus días soleados.",
  },
  {
    name: "Sandalias Moño con Perla", slug: "sandalias-mono-con-perla", cat: "calzado", priceUsd: 12, tag: "NUEVO",
    sizes: SIZES_CALZADO, colors: ["Multicolor"], stock: 5,
    image: "/products/sandalias-36000-10.jpg", extraImages: [],
    description: "Sandalias de ante con moño y detalle de esfera dorada, cómodas y femeninas para cada día.",
  },
  {
    name: "Sandalias Moño Damero", slug: "sandalias-mono-damero", cat: "calzado", priceUsd: 12, tag: "NUEVO",
    sizes: SIZES_CALZADO, colors: ["Multicolor"], stock: 5,
    image: "/products/sandalias-36000-11.jpg", extraImages: [],
    description: "Sandalias con moño y estampado damero, correa al tobillo, planas y muy cómodas de usar.",
  },
  {
    name: "Sandalias Moño Pedrería", slug: "sandalias-mono-pedreria", cat: "calzado", priceUsd: 12, tag: "NUEVO",
    sizes: SIZES_CALZADO, colors: ["Multicolor"], stock: 5,
    image: "/products/sandalias-36000-12.jpg", extraImages: ["/products/sandalias-36000-15.jpg", "/products/sandalias-36000-27.jpg"],
    description: "Sandalias con moño decorado en pedrería, suela suave y estilo dulce para toda ocasión.",
  },
  {
    name: "Sandalias Esferas Doradas", slug: "sandalias-esferas-doradas", cat: "calzado", priceUsd: 12, tag: "NUEVO",
    sizes: SIZES_CALZADO, colors: ["Dorado"], stock: 5,
    image: "/products/sandalias-36000-13.jpg", extraImages: [],
    description: "Sandalias con hilera de esferas doradas sobre tiras finas, planas y cómodas para el verano.",
  },
  {
    name: "Chanclas Dientes Doradas", slug: "chanclas-dientes-doradas", cat: "calzado", priceUsd: 12, tag: "NUEVO",
    sizes: SIZES_CALZADO, colors: ["Multicolor"], stock: 5,
    image: "/products/sandalias-36000-14.jpg", extraImages: [],
    description: "Chanclas con dientes dorados sobre tiras cruzadas, planas, frescas y perfectas para el clima cálido.",
  },
  {
    name: "Sandalias Cristales Cuadradas", slug: "sandalias-cristales-cuadradas", cat: "calzado", priceUsd: 12, tag: "NUEVO",
    sizes: SIZES_CALZADO, colors: ["Multicolor"], stock: 5,
    image: "/products/sandalias-36000-16.jpg", extraImages: [],
    description: "Sandalias de punta cuadrada con banda de cristales, brillo elegante y comodidad durante toda la noche.",
  },
  {
    name: "Chanclas Glitter Logo Dorado", slug: "chanclas-glitter-logo-dorado", cat: "calzado", priceUsd: 12, tag: "NUEVO",
    sizes: SIZES_CALZADO, colors: ["Multicolor"], stock: 5,
    image: "/products/sandalias-36000-17.jpg", extraImages: ["/products/sandalias-36000-23.jpg", "/products/sandalias-36000-34.jpg"],
    description: "Chanclas con banda glitter y placa dorada, ligeras, brillantes y cómodas para cualquier ocasión especial.",
  },
  {
    name: "Sandalias Greca Colores", slug: "sandalias-greca-colores", cat: "calzado", priceUsd: 12, tag: "NUEVO",
    sizes: SIZES_CALZADO, colors: ["Multicolor"], stock: 5,
    image: "/products/sandalias-36000-18.jpg", extraImages: [],
    description: "Sandalias planas en colores vivos con detalles de greca, cómodas y frescas para tus looks de verano.",
  },
  {
    name: "Sandalias Greca Glitter", slug: "sandalias-greca-glitter", cat: "calzado", priceUsd: 12, tag: "NUEVO",
    sizes: SIZES_CALZADO, colors: ["Multicolor"], stock: 5,
    image: "/products/sandalias-36000-19.jpg", extraImages: [],
    description: "Sandalias con greca en glitter y detalle dorado, suela plana y comodidad para lucir con estilo.",
  },
  {
    name: "Sandalias Blancas Pedrería", slug: "sandalias-blancas-pedreria", cat: "calzado", priceUsd: 12, tag: "NUEVO",
    sizes: SIZES_CALZADO, colors: ["Blanco"], stock: 5,
    image: "/products/sandalias-36000-20.jpg", extraImages: [],
    description: "Sandalias blancas de tiras delgadas con pedrería, elegantes, ligeras y perfectas para ocasiones especiales.",
  },
  {
    name: "Sandalias Tejidas Estampadas", slug: "sandalias-tejidas-estampadas", cat: "calzado", priceUsd: 12, tag: "NUEVO",
    sizes: SIZES_CALZADO, colors: ["Multicolor"], stock: 5,
    image: "/products/sandalias-36000-22.jpg", extraImages: [],
    description: "Sandalias tejidas con estampado exclusivo, planas, ligeras y cómodas para tu día a día.",
  },
  {
    name: "Sandalias Leopardo Nudo", slug: "sandalias-leopardo-nudo", cat: "calzado", priceUsd: 12, tag: "NUEVO",
    sizes: SIZES_CALZADO, colors: ["Leopardo"], stock: 5,
    image: "/products/sandalias-36000-24.jpg", extraImages: [],
    description: "Sandalias de leopardo con nudo frontal, planas y cómodas para un estilo audaz y natural.",
  },
  {
    name: "Sandalias Dientes Glitter", slug: "sandalias-dientes-glitter", cat: "calzado", priceUsd: 12, tag: "NUEVO",
    sizes: SIZES_CALZADO, colors: ["Multicolor"], stock: 5,
    image: "/products/sandalias-36000-25.jpg", extraImages: [],
    description: "Sandalias con banda brillante y esferas metálicas, cómodas, llamativas y perfectas para el verano.",
  },
  {
    name: "Chanclas Parche Triangular", slug: "chanclas-parche-triangular", cat: "calzado", priceUsd: 12, tag: "NUEVO",
    sizes: SIZES_CALZADO, colors: ["Multicolor"], stock: 5,
    image: "/products/sandalias-36000-26.jpg", extraImages: [],
    description: "Chanclas de ante con parche triangular al frente, planas, suaves y cómodas para el diario.",
  },
  {
    name: "Chanclas Pedrería Clásicas", slug: "chanclas-pedreria-clasicas", cat: "calzado", priceUsd: 12, tag: "NUEVO",
    sizes: SIZES_CALZADO, colors: ["Multicolor"], stock: 5,
    image: "/products/sandalias-36000-28.jpg", extraImages: ["/products/sandalias-36000-32.jpg"],
    description: "Chanclas con tiras decoradas en pedrería, suela plana y brillo fresco para tus días de sol.",
  },
  {
    name: "Sandalias Tirantes Pedrería", slug: "sandalias-tirantes-pedreria", cat: "calzado", priceUsd: 12, tag: "NUEVO",
    sizes: SIZES_CALZADO, colors: ["Multicolor"], stock: 5,
    image: "/products/sandalias-36000-29.jpg", extraImages: [],
    description: "Sandalias de tiras finas con pedrería y argolla para el dedo, elegantes y muy cómodas.",
  },
  {
    name: "Sandalias Pelo Estampado", slug: "sandalias-pelo-estampado", cat: "calzado", priceUsd: 12, tag: "NUEVO",
    sizes: SIZES_CALZADO, colors: ["Multicolor"], stock: 5,
    image: "/products/sandalias-36000-30.jpg", extraImages: [],
    description: "Sandalias de pelo con estampados animal print, punta cuadrada y comodidad para looks con actitud.",
  },
  {
    name: "Sandalias Plisadas Esferas", slug: "sandalias-plisadas-esferas", cat: "calzado", priceUsd: 12, tag: "NUEVO",
    sizes: SIZES_CALZADO, colors: ["Multicolor"], stock: 5,
    image: "/products/sandalias-36000-31.jpg", extraImages: [],
    description: "Sandalias plisadas con esferas doradas, suela plana y comodidad para brillar en tus ocasiones especiales.",
  },
  {
    name: "Sandalias Moño con Brillo", slug: "sandalias-mono-con-brillo", cat: "calzado", priceUsd: 12, tag: "NUEVO",
    sizes: SIZES_CALZADO, colors: ["Multicolor"], stock: 5,
    image: "/products/sandalias-36000-33.jpg", extraImages: [],
    description: "Sandalias con moño y hebilla de pedrería, planas, femeninas y cómodas para el uso diario.",
  },
  {
    name: "Sandalias Moño con Hebilla", slug: "sandalias-mono-con-hebilla", cat: "calzado", priceUsd: 12, tag: "NUEVO",
    sizes: SIZES_CALZADO, colors: ["Multicolor"], stock: 5,
    image: "/products/sandalias-36000-35.jpg", extraImages: ["/products/sandalias-36000-36.jpg"],
    description: "Sandalias con moño suave y hebilla dorada, suela plana, femeninas y elegantes para cualquier ocasión.",
  },
  {
    name: "Sandalias Cruzadas con Dientes", slug: "sandalias-cruzadas-con-dientes", cat: "calzado", priceUsd: 13.333333333333334, tag: "NUEVO",
    sizes: SIZES_CALZADO, colors: ["Café"], stock: 5,
    image: "/products/sandalias-40000-01.jpg", extraImages: [],
    description: "Sandalias de tiras cruzadas con dientes dorados y argolla, cómodas y versátiles para el diario.",
  },
  {
    name: "Sandalias Cruzadas Rojas", slug: "sandalias-cruzadas-rojas", cat: "calzado", priceUsd: 13.333333333333334, tag: "NUEVO",
    sizes: SIZES_CALZADO, colors: ["Rojo"], stock: 5,
    image: "/products/sandalias-40000-02.jpg", extraImages: [],
    description: "Sandalias rojas de tiras cruzadas con dientes dorados, frescas, cómodas y llenas de estilo.",
  },
  {
    name: "Sandalias Tobillo Glitter", slug: "sandalias-tobillo-glitter", cat: "calzado", priceUsd: 13.333333333333334, tag: "NUEVO",
    sizes: SIZES_CALZADO, colors: ["Multicolor"], stock: 5,
    image: "/products/sandalias-40000-03.jpg", extraImages: [],
    description: "Sandalias con banda ancha brillante y correa al tobillo, planas y cómodas para el verano.",
  },
  {
    name: "Sandalias Moño Gigante", slug: "sandalias-mono-gigante", cat: "calzado", priceUsd: 13.333333333333334, tag: "NUEVO",
    sizes: SIZES_CALZADO, colors: ["Multicolor"], stock: 5,
    image: "/products/sandalias-40000-04.jpg", extraImages: [],
    description: "Sandalias con moño gigante decorativo, suela plana y comodidad para un look divertido y femenino.",
  },
  {
    name: "Sandalias Delgadas Pedrería", slug: "sandalias-delgadas-pedreria", cat: "calzado", priceUsd: 13.333333333333334, tag: "NUEVO",
    sizes: SIZES_CALZADO, colors: ["Multicolor"], stock: 5,
    image: "/products/sandalias-40000-05.jpg", extraImages: [],
    description: "Sandalias de tiras delgadas con pedrería, ligeras, brillantes y cómodas para tus ocasiones especiales.",
  },
  {
    name: "Sandalias Bolitas en T", slug: "sandalias-bolitas-en-t", cat: "calzado", priceUsd: 13.333333333333334, tag: "NUEVO",
    sizes: SIZES_CALZADO, colors: ["Multicolor"], stock: 5,
    image: "/products/sandalias-40000-06.jpg", extraImages: [],
    description: "Sandalias planas con correa en T y bolitas doradas, ajustables y cómodas para tus paseos.",
  },
  {
    name: "Sandalias Tobillo Pedrería", slug: "sandalias-tobillo-pedreria", cat: "calzado", priceUsd: 13.333333333333334, tag: "NUEVO",
    sizes: SIZES_CALZADO, colors: ["Multicolor"], stock: 5,
    image: "/products/sandalias-40000-07.jpg", extraImages: [],
    description: "Sandalias con correa al tobillo, tiras con pedrería y detalle dorado, cómodas para todo el día.",
  },
  {
    name: "Sandalias Cruzadas Pedrería", slug: "sandalias-cruzadas-pedreria", cat: "calzado", priceUsd: 13.333333333333334, tag: "NUEVO",
    sizes: SIZES_CALZADO, colors: ["Multicolor"], stock: 5,
    image: "/products/sandalias-40000-08.jpg", extraImages: [],
    description: "Sandalias cruzadas con pedrería y correa al tobillo, punta cuadrada y comodidad para todo el día.",
  },
  {
    name: "Sandalias Cuerdas Bolitas", slug: "sandalias-cuerdas-bolitas", cat: "calzado", priceUsd: 13.333333333333334, tag: "NUEVO",
    sizes: SIZES_CALZADO, colors: ["Negro"], stock: 5,
    image: "/products/sandalias-40000-09.jpg", extraImages: [],
    description: "Sandalias de cuerdas negras con bolitas doradas, ligeras, ajustables y perfectas para el verano.",
  },
  {
    name: "Sandalias Pastel Dientes", slug: "sandalias-pastel-dientes", cat: "calzado", priceUsd: 13.333333333333334, tag: "NUEVO",
    sizes: SIZES_CALZADO, colors: ["Multicolor"], stock: 5,
    image: "/products/sandalias-40000-10.jpg", extraImages: [],
    description: "Sandalias de colores pastel con dientes dorados y correa al tobillo, frescas y muy cómodas.",
  },
  {
    name: "Sandalias Malla Brillante", slug: "sandalias-malla-brillante", cat: "calzado", priceUsd: 13.333333333333334, tag: "NUEVO",
    sizes: SIZES_CALZADO, colors: ["Multicolor"], stock: 5,
    image: "/products/sandalias-40000-11.jpg", extraImages: [],
    description: "Sandalias con banda de malla brillante y correa al tobillo, planas, elegantes y muy cómodas.",
  },
  {
    name: "Chanclas Esferas Plateadas", slug: "chanclas-esferas-plateadas", cat: "calzado", priceUsd: 13.333333333333334, tag: "NUEVO",
    sizes: SIZES_CALZADO, colors: ["Plateado"], stock: 5,
    image: "/products/sandalias-40000-12.jpg", extraImages: [],
    description: "Chanclas transparentes con esferas plateadas y suela metálica, cómodas para un look moderno y fresco.",
  },
  {
    name: "Sandalias Corazón Dorado", slug: "sandalias-corazon-dorado", cat: "calzado", priceUsd: 13.333333333333334, tag: "NUEVO",
    sizes: SIZES_CALZADO, colors: ["Multicolor"], stock: 5,
    image: "/products/sandalias-40000-13.jpg", extraImages: [],
    description: "Sandalias de ante con correa al tobillo y corazón dorado, suaves, cómodas y muy femeninas.",
  },
  {
    name: "Sandalias Tobillo Dientes", slug: "sandalias-tobillo-dientes", cat: "calzado", priceUsd: 13.333333333333334, tag: "NUEVO",
    sizes: SIZES_CALZADO, colors: ["Multicolor"], stock: 5,
    image: "/products/sandalias-40000-14.jpg", extraImages: [],
    description: "Sandalias con dientes dorados y correa al tobillo ajustable, planas, cómodas y versátiles para el diario.",
  },
  {
    name: "Chanclas Translúcidas Doradas", slug: "chanclas-translucidas-doradas", cat: "calzado", priceUsd: 13.333333333333334, tag: "NUEVO",
    sizes: SIZES_CALZADO, colors: ["Dorado"], stock: 5,
    image: "/products/sandalias-40000-15.jpg", extraImages: ["/products/sandalias-40000-17.jpg"],
    description: "Chanclas transparentes con esferas doradas, suela con brillo y comodidad para lucir fresca y elegante.",
  },
  {
    name: "Chanclas con Perlas", slug: "chanclas-con-perlas", cat: "calzado", priceUsd: 13.333333333333334, tag: "NUEVO",
    sizes: SIZES_CALZADO, colors: ["Multicolor"], stock: 5,
    image: "/products/sandalias-40000-16.jpg", extraImages: [],
    description: "Chanclas con hilera de perlas sobre las tiras, suela metalizada y comodidad para el verano.",
  },
  {
    name: "Sandalias Moño con Hebilla", slug: "sandalias-mono-con-hebilla-2", cat: "calzado", priceUsd: 13.333333333333334, tag: "NUEVO",
    sizes: SIZES_CALZADO, colors: ["Multicolor"], stock: 5,
    image: "/products/sandalias-40000-18.jpg", extraImages: [],
    description: "Sandalias con moño suave y hebilla dorada, suela plana, femeninas y elegantes para cualquier ocasión.",
  },
];

async function main() {
  console.log("🌱 Sembrando Days Style Store...");

  // ── Settings ──
  await prisma.setting.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "573001234567",
      instagram: "daystylestore",
      aboutText:
        "Days Style Store nació de la pasión por la moda y el deseo de hacer brillar a cada mujer. Trabajamos con un equipo de asesoras que te acompaña de forma personal: promocionan las tendencias, reciben tu pedido y te lo llevan hasta la puerta. Calidad, estilo y un trato cercano — esa es nuestra esencia.",
      aiPrompt:
        "Eres la asistente virtual de Days Style Store, una tienda de ropa femenina. Ayudas con tallas, precios, métodos de pago, tiempos de entrega y el programa de asesoras. Sé cálida, breve y usa emojis con moderación. Toda venta se cierra por WhatsApp de forma personal.",
      usdToCop: 3900,
      usdToVes: 40,
      rewardUnits: 4,
      currenciesEnabled: ["USD", "COP"],
      paymentMethods: PAYMENT_METHODS,
    },
  });

  // ── Admin (la jefa) ──
  const adminEmail = process.env.ADMIN_EMAIL || "admin@daystylestore.com";
  const adminPass = process.env.ADMIN_PASSWORD || "DaysStyle2026";
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Dayanna (La Jefa)",
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPass, 12),
      role: "ADMIN",
    },
  });

  // ── Trabajadora demo ──
  const workerPass = await bcrypt.hash("Trabajadora2026", 12);
  const workerUser = await prisma.user.upsert({
    where: { email: "laura@daystylestore.com" },
    update: {},
    create: {
      name: "Laura Martínez",
      email: "laura@daystylestore.com",
      passwordHash: workerPass,
      role: "WORKER",
      worker: { create: { phone: "573005551111", code: "LAURA", active: true } },
    },
    include: { worker: true },
  });

  // ── Categorías ──
  const catMap = new Map<string, string>();
  for (const c of CATEGORIES) {
    const cat = await prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: c });
    catMap.set(c.slug, cat.id);
  }

  // ── Productos ──
  for (const p of PRODUCTS) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        priceUsd: p.priceUsd,
        images: [p.image, ...(p.extraImages ?? [])],
        categoryId: catMap.get(p.cat)!,
        featured: p.featured ?? false,
        tag: p.tag,
        variants: {
          create: p.sizes.flatMap((size) =>
            p.colors.map((color) => ({ size, color, stock: p.stock }))
          ),
        },
      },
    });
  }

  console.log("✅ Seed completado.");
  console.log(`   Admin:      ${adminEmail} / ${adminPass}`);
  console.log("   Trabajadora: laura@daystylestore.com / Trabajadora2026");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
