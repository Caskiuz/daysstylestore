import type { Metadata } from "next";
import Link from "next/link";
import { Gem, Handshake, Sparkles, Users } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
import { Button } from "@/components/ui/button";
import { getSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Nosotras",
  description: "Conoce la historia de Days Style Store: moda femenina con asesoras personales, calidad seleccionada y un programa que premia a las mujeres emprendedoras.",
};

export default async function NosotrosPage() {
  const settings = await getSettings();

  const values = [
    { icon: Gem, title: "Calidad seleccionada", text: "Cada prenda pasa por nuestras manos antes de llegar a las tuyas: telas, caídas y acabados que se sienten premium." },
    { icon: Users, title: "Mujeres que empoderan", text: "Nuestras asesoras no solo venden moda: construyen sus propios ingresos con el programa Vendes 4, Ganas 1." },
    { icon: Handshake, title: "Trato personal", text: "Nada de robots ni formularios fríos. Cada compra se acompaña de persona a persona, por WhatsApp." },
    { icon: Sparkles, title: "Brillo accesible", text: "Creemos que vestir bien no debe ser un lujo: precios justos y pagos flexibles 50% y 50% a 8 días." },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Nuestra historia</p>
        <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">
          Más que una tienda, <span className="text-gradient-gold">una comunidad</span>
        </h1>
      </div>

      <Reveal from="up" className="mt-10">
        <div className="relative overflow-hidden rounded-3xl border border-gold/30 bg-card p-8 sm:p-10">
          <div className="pointer-events-none absolute -right-10 -top-10 font-display text-[12rem] font-bold leading-none text-gold/5">DS</div>
          <p className="relative max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {settings.aboutText ||
              "Days Style Store nació de la pasión por la moda y el deseo de hacer brillar a cada mujer. Comenzamos vendiendo por WhatsApp entre amigas y hoy somos una red de asesoras que llevan estilo y confianza a cada rincón."}
          </p>
          <p className="relative mt-4 max-w-2xl leading-relaxed text-muted-foreground">
            Cada prenda que ves en el catálogo fue elegida pensando en ti: para el trabajo, la cita, el paseo o ese día en que
            solo quieres sentirte poderosa. Y detrás de cada entrega hay una mujer emprendedora que hace crecer su propio
            negocio con nosotras.
          </p>
        </div>
      </Reveal>

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {values.map((v, i) => (
          <Reveal key={v.title} delay={i * 0.08}>
            <div className="group h-full rounded-2xl border border-border bg-card p-6 transition-all hover:border-gold/50 hover:shadow-[var(--shadow-gold)]">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gold-soft/40 to-gold/20 text-primary transition-transform group-hover:scale-110">
                <v.icon size={22} />
              </div>
              <h3 className="font-display text-lg font-semibold">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.text}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal from="scale" className="mt-12 text-center">
        <p className="font-display text-2xl font-bold">¿Quieres ser parte de Days Style? ✨</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Únete como asesora, gana premios o efectivo por cada {settings.rewardUnits} prendas, y crece con nosotras.
        </p>
        <Link href="/contacto" className="mt-6 inline-block">
          <Button size="lg">Quiero ser asesora</Button>
        </Link>
      </Reveal>
    </div>
  );
}
