import type { Metadata } from "next";
import { FAQAccordion } from "@/components/faq-accordion";

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  description: "Resuelve tus dudas sobre tallas, pagos 50/50 a 8 días, entregas, cambios y el programa de asesoras de Days Style Store.",
};

export const dynamic = "force-dynamic";

export default async function FaqPage() {
  const faqs: { q: string; a: string }[] = [
    { q: "¿Cómo compro?", a: "Elige tu prenda en la tienda, pulsa «Comprar por WhatsApp» y se abrirá el chat con el mensaje listo. Una asesora confirma talla, color y dirección, ¡y listo!" },
    { q: "¿Cómo funciona el pago 50% y 50%?", a: "Pagas la mitad al recibir tu pedido y la otra mitad a los 8 días. Así compras cómoda sin gastar todo de golpe. Aceptamos efectivo en pesos o dólares, transferencia Bancolombia y Nequi." },
    { q: "¿Cuánto tarda la entrega?", a: "Las entregas son personales y coordinadas por WhatsApp. En la ciudad solemos entregar entre 1 y 3 días después de confirmar el pedido; fuera de la ciudad, 3 a 7 días." },
    { q: "¿Puedo cambiar mi talla?", a: "Sí. Si la talla no te queda, tienes 3 días desde la entrega para solicitar cambio, siempre que la prenda esté sin uso y con etiquetas. Revisa nuestra guía de tallas o pide asesoría gratis por WhatsApp." },
    { q: "¿Los precios cambian según la moneda?", a: "Puedes ver los precios en dólares o pesos colombianos con el selector de moneda. La tasa se actualiza desde el panel de la tienda; al confirmar tu pedido se fija la tasa vigente." },
    { q: "¿Cómo funciona el programa «Vendes 4, ganas 1»?", a: "Si eres asesora, por cada 4 prendas vendidas ganas 1 prenda gratis o su valor en efectivo. Tu saldo se acumula automáticamente y puedes canjearlo por premios mayores cuando quieras." },
    { q: "¿Cómo me convierto en asesora?", a: "Escríbenos por WhatsApp con el botón «Ser asesora». Te creamos tu cuenta con código personal, recibes acceso a tu panel para registrar pedidos y ver tus premios, y no necesitas invertir dinero." },
    { q: "¿Qué pasa si no alcanzo a pagar el 50% restante a los 8 días?", a: "Una asesora se comunicará contigo para coordinar. Creemos en la palabra y el trato personal: avísanos con tiempo y buscamos una solución juntos." },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Resolvemos tus dudas</p>
        <h1 className="mt-2 font-display text-4xl font-bold">Preguntas <span className="text-gradient-gold">frecuentes</span></h1>
      </div>
      <div className="mt-10"><FAQAccordion faqs={faqs} /></div>
    </div>
  );
}
