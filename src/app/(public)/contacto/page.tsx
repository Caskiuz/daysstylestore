import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Wallet } from "lucide-react";
import { InstagramIcon } from "@/components/social-icons";
import { Reveal } from "@/components/animations/reveal";
import { Button } from "@/components/ui/button";
import { getSettings } from "@/lib/data";
import { waLink, generalMessage } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Habla con Days Style Store por WhatsApp: asesoría de tallas, pedidos, pagos y programa de asesoras. Atención personalizada.",
};

export default async function ContactoPage() {
  const s = await getSettings();
  const wa = waLink(s.whatsapp, generalMessage(s.storeName));

  const channels = [
    { icon: MessageCircle, title: "WhatsApp", value: `+${s.whatsapp}`, href: wa, note: "Canal principal · respuesta rápida" },
    ...(s.instagram ? [{ icon: InstagramIcon, title: "Instagram", value: `@${s.instagram}`, href: `https://instagram.com/${s.instagram}`, note: "Novedades y lookbooks" }] : []),
    ...(s.email ? [{ icon: Mail, title: "Correo", value: s.email, href: `mailto:${s.email}`, note: "Para alianzas y sugerencias" }] : []),
    ...(s.address ? [{ icon: MapPin, title: "Ubicación", value: s.address, href: undefined, note: "Entregas coordinadas por WhatsApp" }] : []),
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Estamos para ti</p>
        <h1 className="mt-2 font-display text-4xl font-bold">Hablemos por <span className="text-gradient-gold">WhatsApp</span></h1>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          Toda la atención es 100% personal: pedidos, pagos, tallas y entregas se coordinan contigo directamente.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {channels.map((c, i) => {
          const inner = (
            <div className="flex h-full items-start gap-4 rounded-2xl border border-border bg-card p-5 transition-all hover:border-gold/50 hover:shadow-[var(--shadow-gold)]">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gold-soft/40 to-gold/20 text-primary">
                <c.icon size={20} />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{c.title}</p>
                <p className="mt-0.5 font-semibold">{c.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{c.note}</p>
              </div>
            </div>
          );
          return (
            <Reveal key={c.title} delay={i * 0.07}>
              {c.href ? <a href={c.href} target="_blank" rel="noopener noreferrer">{inner}</a> : inner}
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={0.1} className="mt-8">
        <div className="rounded-2xl border border-gold/30 bg-card p-6">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold"><Wallet size={20} className="text-gold" /> Métodos de pago</h2>
          <p className="mt-1 text-sm text-muted-foreground">Pagas 50% al recibir tu pedido y el 50% restante a los 8 días.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {s.paymentMethods.filter((m) => m.enabled).map((m) => (
              <div key={m.id} className="rounded-xl border border-border bg-background/50 p-4">
                <p className="font-semibold">{m.name} <span className="ml-1 rounded-md bg-accent px-1.5 py-0.5 text-[10px] font-bold text-accent-foreground">{m.currency}</span></p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{m.details}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.15} className="mt-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm text-muted-foreground">
          <Clock size={15} className="text-gold" /> Atención: Lunes a Sábado · 8:00 am – 8:00 pm
        </div>
        <div className="mt-6">
          <a href={wa} target="_blank" rel="noopener noreferrer">
            <Button variant="whatsapp" size="lg"><MessageCircle size={18} /> Escribir por WhatsApp</Button>
          </a>
        </div>
      </Reveal>
    </div>
  );
}
