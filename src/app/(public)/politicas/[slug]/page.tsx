import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/animations/reveal";

export const dynamic = "force-dynamic";

const POLICIES: Record<string, { title: string; description: string; sections: { h: string; p: string }[] }> = {
  cambios: {
    title: "Política de cambios y devoluciones",
    description: "Conoce las condiciones para cambiar tallas o devolver prendas en Days Style Store.",
    sections: [
      { h: "Plazo para cambios", p: "Tienes 3 días calendario desde la entrega para solicitar un cambio de talla o color. La prenda debe estar sin uso, sin lavar, sin manchas y con sus etiquetas originales." },
      { h: "Cómo solicitarlo", p: "Escribe por WhatsApp a tu asesora o al número de la tienda indicando tu nombre, el pedido y el motivo. Coordinaremos la recogida y el cambio sin costo dentro de la ciudad." },
      { h: "Prendas en promoción", p: "Los productos marcados como OFERTA o de liquidación admiten cambio de talla sujeto a disponibilidad, pero no devolución del dinero." },
      { h: "Devolución de dinero", p: "Si la prenda presenta un defecto de fábrica, se reemplaza por una igual o similar; si no es posible, se devuelve el 100% de lo pagado por el mismo medio de pago en máximo 5 días hábiles." },
      { h: "Pedidos con pago 50/50", p: "En pedidos con saldo pendiente (50% a 8 días), el cambio se realiza sobre el valor total del producto. El saldo pendiente se ajusta si aplica diferencia de precio." },
    ],
  },
  privacidad: {
    title: "Política de privacidad",
    description: "Cómo Days Style Store recopila y protege tu información personal.",
    sections: [
      { h: "Datos que recopilamos", p: "Al comprar guardamos únicamente tu nombre, número de WhatsApp y los productos de tus pedidos, para gestionar la entrega y el cobro del saldo pendiente. Nunca pedimos ni almacenamos datos de tarjetas bancarias." },
      { h: "Uso de la información", p: "Tus datos se usan exclusivamente para: procesar pedidos, coordinar entregas y pagos, informarte del estado de tu compra y (si lo autorizas) enviarte novedades de la tienda." },
      { h: "Compartición", p: "No vendemos ni compartimos tu información con terceros. Solo tu asesora y la administración de la tienda tienen acceso a tus datos de pedido." },
      { h: "Seguridad", p: "La plataforma se aloja en infraestructura segura (Vercel + Neon) con conexiones cifradas. El acceso al panel de administración está protegido por contraseña y roles." },
      { h: "Tus derechos", p: "Puedes solicitar ver, corregir o eliminar tus datos en cualquier momento escribiendo por WhatsApp. Atendemos estas solicitudes en máximo 5 días hábiles." },
    ],
  },
  terminos: {
    title: "Términos y condiciones",
    description: "Condiciones de uso de la tienda Days Style Store y del programa de asesoras.",
    sections: [
      { h: "Naturaleza del servicio", p: "Days Style Store comercializa ropa femenina por catálogo con gestión de pedidos por WhatsApp. Los precios se muestran en USD y COP; al confirmar un pedido se fija la tasa de cambio vigente." },
      { h: "Pagos", p: "El esquema estándar es 50% al recibir el pedido y 50% a los 8 días. Los medios de pago habilitados se publican en la página de contacto. El pago se coordina personalmente por WhatsApp; la tienda no utiliza pasarelas de pago automáticas." },
      { h: "Entregas", p: "Las entregas se realizan de forma personal por nuestras asesoras o por coordenación directa. Los tiempos estimados son orientativos y se confirman al momento del pedido." },
      { h: "Programa de asesoras", p: "El programa «Vendes 4, ganas 1» premia a las asesoras activas: por cada 4 prendas de un mismo producto vendidas y entregadas, la asesora acumula un crédito equivalente al valor de esa prenda. Los créditos se canjean por productos del catálogo o efectivo, previa aprobación de la administración. Los saldos no canjeados no expiran mientras la asesora permanezca activa." },
      { h: "Suspensión de cuentas", p: "La administración puede suspender cuentas de asesoras por incumplimiento de pagos a la tienda, maltrato a clientas o uso indebido de la imagen de la marca." },
      { h: "Modificaciones", p: "Estos términos pueden actualizarse; la versión vigente siempre estará publicada en esta página." },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(POLICIES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = POLICIES[slug];
  if (!p) return { title: "No encontrado" };
  return { title: p.title, description: p.description };
}

export default async function PoliticaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const policy = POLICIES[slug];
  if (!policy) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Legal</p>
      <h1 className="mt-2 font-display text-4xl font-bold">{policy.title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">Última actualización: septiembre de 2026</p>
      <div className="mt-10 space-y-6">
        {policy.sections.map((s, i) => (
          <Reveal key={s.h} delay={i * 0.05}>
            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-display text-lg font-bold text-primary">{i + 1}. {s.h}</h2>
              <p className="mt-2 leading-relaxed text-muted-foreground">{s.p}</p>
            </section>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
