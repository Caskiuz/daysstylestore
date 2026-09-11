# 👗 Days Style Store

Plataforma de e-commerce para tienda de ropa por catálogo con asesoras personales — modelo **"Vendes 4, ganas 1"**, pagos coordinados por WhatsApp y contabilidad multimoneda (USD / COP / VES).

Construida con **Next.js 16** (frontend + backend en uno), lista para desplegar **100% en Vercel** (sin servidores externos).

---

## ✨ Qué incluye

| Área | Funciones |
|---|---|
| **Tienda pública** | Home con escena 3D dorada, catálogo con filtros (categoría/talla/color/orden), vista rápida, página de producto con selector de variantes y stock real, guía de tallas, wishlist, FAQ, políticas legales, SEO (sitemap, robots, JSON-LD) |
| **Comprar por WhatsApp** | Botón en cada producto que abre el chat con el pedido pre-escrito (producto, talla/color, precio en la moneda elegida y código de asesora si viene de un enlace de referida) |
| **Chat IA "Daisy"** | Asistente con Google **Gemini Flash** (gratuito) que responde preguntas del negocio con el catálogo real, precios y políticas — clave: `GEMINI_API_KEY` |
| **Panel Admin** (`/admin`) | Dashboard con KPIs y gráficos, productos CRUD (variantes talla×color×stock + fotos a Cloudinary), categorías, pedidos con flujo de estados, trabajadoras, premios/canjes, contabilidad con export CSV y configuración completa |
| **Panel Trabajadora** (`/trabajadora`) | Saldo de premios, progreso "3/4 para ganar 1", registro de pedidos de sus clientas, solicitud de canjes (producto o efectivo) y catálogo con enlaces de referida |
| **Pagos 50/50** | Cliente paga 50% al recibir y 50% a los 15 días; el sistema agenda el vencimiento y marca los cobros vencidos |
| **Premios "Vendes N, ganas 1"** | Cada N prendas vendidas de un producto → 1 crédito (valor de la prenda); saldo acumulable canjeable por catálogo o efectivo, con aprobación de la jefa |
| **Tema** | Modo claro (blanco + dorado) y modo oscuro (negro + dorado) con toggle general, animaciones y efectos 3D en toda la web |

## 🚀 Puesta en marcha (5 pasos)

### 1. Base de datos — Neon Postgres (gratis)
1. Crea una cuenta en [neon.tech](https://neon.tech) y un proyecto nuevo.
2. Copia la **connection string** (usa la que termina en `-pooler`).
3. Pégala en `DATABASE_URL` del archivo `.env` (y luego en Vercel).

```bash
npm run db:push     # crea las tablas
npm run db:seed     # datos iniciales: admin, settings, categorías y 8 productos demo
```

### 2. Fotos — Cloudinary (gratis)
1. Cuenta en [cloudinary.com](https://cloudinary.com) → Dashboard.
2. Copia **Cloud name**, **API Key** y **API Secret** a `.env`.
Sin configurar, el admin permite usar imágenes de demo o pegar URLs.

### 3. IA — Google AI Studio (gratis)
1. Entra a [aistudio.google.com/apikey](https://aistudio.google.com/apikey).
2. Genera una API key de Gemini y pégala en `GEMINI_API_KEY` (modelo por defecto: `gemini-2.0-flash`).

### 4. WhatsApp y datos de la tienda
- `NEXT_PUBLIC_WHATSAPP_NUMBER`: número internacional sin `+` (ej: `573001234567`).
- Accede a **Admin → Configuración** para cambiar métodos de pago (Efectivo COP, Bancolombia, Nequi, Efectivo USD…), tasas de cambio y redes sociales.

### 5. Desplegar en Vercel
1. Sube el proyecto a GitHub e importa el repo en [vercel.com](https://vercel.com).
2. En **Settings → Environment Variables** añade TODAS las variables del `.env.example` (usa la URL de Neon con `-pooler`).
3. Deploy 🎉 — Vercel detecta Next.js solo; no necesita ningún otro servicio.

## 👤 Cuentas iniciales (las crea el seed)

| Rol | Correo | Contraseña |
|---|---|---|
| **Admin (la jefa)** | `admin@daystylestore.com` | `DaysStyle2026` |
| Trabajadora demo | `laura@daystylestore.com` | `Trabajadora2026` |

> Cambia la contraseña del admin desde el seed (`ADMIN_PASSWORD` en `.env` antes de `db:seed`) o directamente en la base de datos. **Cámbiala antes de production.**

## 📋 Flujo del negocio

1. La clienta toca **Comprar por WhatsApp** (o la trabajadora comparte su enlace `?ref=CODIGO`).
2. La jefa o la trabajadora **registra el pedido** en su panel (el stock se descuenta).
3. Estados: `Pendiente → Confirmado → En reparto (jefa trae) → Entregada a trabajadora → Entregada a clienta → Cerrado`.
4. Al marcar **Entregada a clienta**: se programa el cobro (50% restante a 15 días) y el motor de premios suma las unidades vendidas a la trabajadora (cada 4 → 1 crédito).
5. La trabajadora **solicita canjes** (productos o efectivo) y la jefa los **aprueba** desde Panel Admin → Premios.
6. Todo queda en **Contabilidad**: ventas, ingresos por moneda/método, cuentas por cobrar, gastos y utilidad, con exportación a CSV.

## 🛠️ Comandos

```bash
npm run dev        # servidor local (la tienda muestra datos demo sin DB)
npm run build      # compilación de producción
npm run db:push    # aplica el esquema a la base de datos
npm run db:seed    # datos iniciales
npm run db:studio  # explorador visual de la base de datos
```

### 💻 Opcional: Postgres local sin instalar nada (Windows/Mac/Linux)

Si quieres probar el panel admin localmente sin crear la cuenta de Neon, el proyecto incluye un Postgres embebido (devDependency):

```bash
node scripts/local-db.mjs start   # levanta Postgres en localhost:5432 (datos en .local-pg)
npm run db:push && npm run db:seed  # en otra terminal
# DATABASE_URL local: postgresql://postgres:postgres@localhost:5432/daystylestore
```

## 🧱 Stack

Next.js 16 · React 19 · Tailwind CSS 4 · Prisma 6 + Neon Postgres · Auth JWT (jose + bcryptjs) · Framer Motion · React Three Fiber (three.js) · Recharts · Cloudinary · Google Gemini (`@google/genai`) · lucide-react · desplegado en Vercel.

---

Hecho con ✨ para **Days Style Store** — moda que te hace brillar.
