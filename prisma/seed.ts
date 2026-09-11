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
  { name: "Blusas & Tops", slug: "blusas", sortOrder: 1 },
  { name: "Pantalones & Jeans", slug: "pantalones", sortOrder: 2 },
  { name: "Vestidos", slug: "vestidos", sortOrder: 3 },
  { name: "Faldas & Shorts", slug: "faldas", sortOrder: 4 },
  { name: "Accesorios", slug: "accesorios", sortOrder: 5 },
];

const SIZES_TOP = ["S", "M", "L", "XL"];
const SIZES_PANTS = ["26", "28", "30", "32", "34"];
const SIZES_DRESS = ["S", "M", "L"];

type DemoProduct = {
  name: string; slug: string; cat: string; priceUsd: number; tag?: string; featured?: boolean;
  sizes: string[]; colors: string[]; stock: number; image: string;
  description: string;
};

const PRODUCTS: DemoProduct[] = [
  {
    name: "Blusa Satén Brillo Dorado", slug: "blusa-saten-brillo-dorado", cat: "blusas", priceUsd: 14.99, tag: "NUEVO", featured: true,
    sizes: SIZES_TOP, colors: ["Champán", "Negro", "Blanco"], stock: 8, image: "/products/blusa-saten.svg",
    description: "Blusa en satén con caída fluida y acabado perlado. Perfecta para brillar de día o de noche. Tela suave, fresca y elegante.",
  },
  {
    name: "Jeans Slim Tiro Alto Premium", slug: "jeans-slim-tiro-alto", cat: "pantalones", priceUsd: 22.99, tag: "HOT", featured: true,
    sizes: SIZES_PANTS, colors: ["Azul medio", "Negro", "Celeste"], stock: 10, image: "/products/jeans-slim.svg",
    description: "Jeans slim de tiro alto con denim premium que moldea la figura. Comodidad total y diseño que estiliza en cada paso.",
  },
  {
    name: "Vestido Midi Noche Estrellada", slug: "vestido-midi-noche", cat: "vestidos", priceUsd: 27.5, tag: "NUEVO", featured: true,
    sizes: SIZES_DRESS, colors: ["Negro", "Vino"], stock: 6, image: "/products/vestido-midi.svg",
    description: "Vestido midi ajustado con tejido elástico y brillo sutil. Tu aliado perfecto para citas y ocasiones especiales.",
  },
  {
    name: "Blusa Crop Encaje Delicado", slug: "blusa-crop-encaje", cat: "blusas", priceUsd: 11.99,
    sizes: SIZES_TOP, colors: ["Blanco", "Negro"], stock: 12, image: "/products/blusa-crop.svg",
    description: "Crop top de encaje delicado con forro interior. Romántico, fresco y súper combinable con tus jeans favoritos.",
  },
  {
    name: "Pantalón Palazzo Fluido", slug: "pantalon-palazzo", cat: "pantalones", priceUsd: 19.99,
    sizes: SIZES_TOP, colors: ["Negro", "Cheetos", "Beige"], stock: 9, image: "/products/palazzo.svg",
    description: "Pantalón palazzo de caída fluida que alarga la silueta. Elegancia bohemia con comodidad increíble.",
  },
  {
    name: "Falda Jean Mini Clásica", slug: "falda-jean-mini", cat: "faldas", priceUsd: 15.5,
    sizes: SIZES_PANTS, colors: ["Azul claro", "Azul oscuro"], stock: 7, image: "/products/falda-jean.svg",
    description: "Falda mini de jean con detalle de botones dorados. Un básico infaltable del armario, corte perfecto.",
  },
  {
    name: "Vestido Playa Tropical Sunset", slug: "vestido-playa-tropical", cat: "vestidos", priceUsd: 18.99, featured: true,
    sizes: ["S/M", "L/XL"], colors: ["Atardecer", "Turquesa"], stock: 11, image: "/products/vestido-playa.svg",
    description: "Vestido ligero estampado con colores del atardecer. Ideal para vacaciones: se seca rápido y no se arruga.",
  },
  {
    name: "Set Accesorios Gold Essence", slug: "set-accesorios-gold", cat: "accesorios", priceUsd: 9.99, tag: "OFERTA",
    sizes: ["Única"], colors: ["Dorado"], stock: 20, image: "/products/accesorios-gold.svg",
    description: "Set de accesorios bañados en oro: aretes, collar y pulsera. El toque final dorado para cualquier outfit.",
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
  const productIds: Record<string, string> = {};
  for (const p of PRODUCTS) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        priceUsd: p.priceUsd,
        images: [p.image],
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
    productIds[p.slug] = product.id;
  }

  // ── Pedidos de ejemplo con la trabajadora demo ──
  const worker = workerUser.worker!;
  const existingOrders = await prisma.order.count();
  if (existingOrders === 0) {
    const now = new Date();
    const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000);

    // Pedido 1: entregado al cliente, 50% pagado, saldo por cobrar (venció hace 2 días)
    const o1 = await prisma.order.create({
      data: {
        code: "DS-0001", workerId: worker.id, customerName: "María Pérez", customerPhone: "573006667777",
        currency: "COP", rateSnapshot: 3900, totalUsd: 37.98, status: "ENTREGADA_CLIENTE",
        deliveredAt: daysAgo(17), balanceDueAt: daysAgo(2), source: "REFERIDA",
        items: {
          create: [
            { productId: productIds["blusa-saten-brillo-dorado"], nameSnapshot: "Blusa Satén Brillo Dorado", variantSnapshot: "M / Champán", unitPriceUsd: 14.99, quantity: 1 },
            { productId: productIds["jeans-slim-tiro-alto"], nameSnapshot: "Jeans Slim Tiro Alto Premium", variantSnapshot: "30 / Azul medio", unitPriceUsd: 22.99, quantity: 1 },
          ],
        },
        payments: { create: [{ amountUsd: 18.99, currency: "COP", rate: 3900, amountLocal: 74061, method: "NEQUI", createdAt: daysAgo(17) }] },
      },
    });
    await prisma.payment.create({
      data: { orderId: o1.id, amountUsd: 18.99, currency: "COP", rate: 3900, amountLocal: 74061, method: "EFECTIVO", createdAt: daysAgo(5) },
    });

    // Pedido 2: en camino (jefa trae mercancía)
    await prisma.order.create({
      data: {
        code: "DS-0002", workerId: worker.id, customerName: "Carolina Ruiz", customerPhone: "573008889999",
        currency: "USD", rateSnapshot: 1, totalUsd: 27.5, status: "EN_REPARTO", source: "WHATSAPP",
        items: { create: [{ productId: productIds["vestido-midi-noche"], nameSnapshot: "Vestido Midi Noche Estrellada", variantSnapshot: "M / Negro", unitPriceUsd: 27.5, quantity: 1 }] },
      },
    });

    // Pedido 3: pendiente recién creado
    await prisma.order.create({
      data: {
        code: "DS-0003", workerId: worker.id, customerName: "Andrea Gómez", customerPhone: "573011223344",
        currency: "COP", rateSnapshot: 3900, totalUsd: 27.49, status: "PENDIENTE", source: "MANUAL",
        items: {
          create: [
            { productId: productIds["blusa-crop-encaje"], nameSnapshot: "Blusa Crop Encaje Delicado", variantSnapshot: "S / Blanco", unitPriceUsd: 11.99, quantity: 1 },
            { productId: productIds["falda-jean-mini"], nameSnapshot: "Falda Jean Mini Clásica", variantSnapshot: "28 / Azul claro", unitPriceUsd: 15.5, quantity: 1 },
          ],
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
