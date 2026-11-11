import Link from "next/link";
import Image from "next/image";
import { ArrowRight, HandCoins, HeartHandshake, MessageCircle, PackageCheck, Sparkles, Star, Users } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/animations/reveal";
import { ProductCard } from "@/components/shop/product-card";
import { Button } from "@/components/ui/button";
import { waLink } from "@/lib/whatsapp";
import type { PublicCategory, PublicProduct } from "@/lib/types";

export function SectionTitle({ kicker, title, center = true }: { kicker: string; title: string; center?: boolean }) {
  return (
    <div className={center ? "text-center" : ""}>
      <Reveal from="fade">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-primary">{kicker}</p>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="font-display text-3xl font-bold sm:text-4xl">{title}</h2>
      </Reveal>
      <Reveal delay={0.14} className={center ? "flex justify-center" : ""}>
        <div className="mt-4 h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent" />
      </Reveal>
    </div>
  );
}

export function CategoriesSection({ categories }: { categories: PublicCategory[] }) {
  const gradients = [
    "from-[#3d3320] to-[#171310]", "from-[#2b3d55] to-[#10151d]", "from-[#3d1f2e] to-[#150c11]",
    "from-[#40352a] to-[#15120e]", "from-[#4a3a12] to-[#171208]", "from-[#555045] to-[#1c1a16]",
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <SectionTitle kicker="Encuentra tu estilo" title="Categorías" />
      <Stagger className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5" gap={0.07}>
        {categories.map((cat, i) => (
          <StaggerItem key={cat.id}>
            <Link
              href={`/shop?cat=${cat.slug}`}
              className={`group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl bg-gradient-to-br p-4 transition-transform duration-300 hover:-translate-y-1.5 ${gradients[i % gradients.length]}`}
            >
              {cat.image && (
                <>
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                </>
              )}
              <span className="relative font-display text-xl font-bold text-white">{cat.name}</span>
              <span className="relative mt-0.5 text-xs text-gold-soft">
                {cat.productCount !== undefined ? `${cat.productCount} productos` : "Ver colección"}
              </span>
              <span className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-gold/50 text-gold transition-all duration-300 group-hover:bg-gold group-hover:text-[#2a2005]">
                <ArrowRight size={15} className="transition-transform group-hover:-rotate-45" />
              </span>
              {!cat.image && (
                <div className="pointer-events-none absolute -right-6 -top-6 font-display text-[7rem] font-bold leading-none text-gold/10 transition-all duration-500 group-hover:text-gold/20">
                  {cat.name.charAt(0)}
                </div>
              )}
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

export function FeaturedSection({ products, storeName, whatsapp }: { products: PublicProduct[]; storeName: string; whatsapp: string }) {
  return (
    <section className="relative py-16">
      <div className="pointer-events-none absolute inset-x-0 top-1/3 h-64 bg-gold/5 blur-3xl" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionTitle kicker="Las favoritas" title="Destacados de la temporada" center={false} />
          <Reveal from="fade" delay={0.15}>
            <Link href="/shop">
              <Button variant="outline" className="group">
                Ver todo <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </Reveal>
        </div>
        <Stagger className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {products.map((p) => (
            <StaggerItem key={p.id}>
              <ProductCard product={p} storeName={storeName} whatsapp={whatsapp} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

const BENEFITS = [
  { icon: MessageCircle, title: "Compra por WhatsApp", text: "Elige tu prenda, escríbenos y una asesora te guía en todo el proceso, sin formularios complicados." },
  { icon: HandCoins, title: "Paga 50% y 50%", text: "La mitad al recibir tu pedido y el resto a los 8 días. Compra cómoda y sin presión." },
  { icon: PackageCheck, title: "Entrega personal", text: "Nuestras asesoras llevan tu pedido hasta tu puerta y te asesoran con tallas y estilos." },
  { icon: Sparkles, title: "Calidad seleccionada", text: "Cada prenda es escogida a mano: telas, caídas y diseños que te hacen brillar de verdad." },
];

export function BenefitsSection() {
  return (
    <section className="border-y border-gold/20 bg-card/50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionTitle kicker="¿Por qué Days Style?" title="Una experiencia pensada para ti" />
        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b) => (
            <StaggerItem key={b.title}>
              <div className="group h-full rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[var(--shadow-gold)]">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gold-soft/40 to-gold/20 text-primary transition-transform duration-300 group-hover:scale-110">
                  <b.icon size={22} />
                </div>
                <h3 className="font-display text-lg font-semibold">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.text}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

export function WorkerProgramSection({ rewardUnits }: { rewardUnits: number }) {
  const steps = [
    { n: "1", title: "Promociona", text: "Comparte el catálogo con tu código personal de asesora en tus redes y WhatsApp." },
    { n: "2", title: "Recibe pedidos", text: "Tus clientas te escriben, tú registras el pedido y la jefa lleva la mercancía hasta ti." },
    { n: "3", title: "Entrega y gana", text: `Entregas a tus clientas y cada ${rewardUnits} prendas vendidas ganas 1 premio o su valor en efectivo.` },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-br from-accent via-card to-card p-8 sm:p-12">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gold/10 blur-3xl" />
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-primary">Programa de asesoras</p>
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              Vendes <span className="text-gradient-gold">{rewardUnits}</span>, ganas <span className="text-gradient-gold">1</span> ✨
            </h2>
            <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">
              Únete a nuestro equipo de asesoras de moda. Gana premios o efectivo por cada {rewardUnits}{" "}
              prendas vendidas, acumula saldo y cámbialo por premios mayores. Sin inversión previa.
            </p>
            <ul className="mt-6 space-y-2.5 text-sm">
              {["Saldo acumulable canjeable por productos o efectivo", "Panel propio para controlar tus pedidos y premios", "Flexibilidad total: tú manejas tus horarios"].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <Star size={15} className="mt-0.5 shrink-0 text-gold" fill="currentColor" /> {t}
                </li>
              ))}
            </ul>
          </div>
          <Stagger className="space-y-4">
            {steps.map((s) => (
              <StaggerItem key={s.n}>
                <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition-all hover:border-gold/50">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#e3c25c] to-[#d4af37] font-display text-lg font-bold text-[#2a2005] shadow-[0_4px_14px_-4px_rgba(212,175,55,0.6)]">
                    {s.n}
                  </span>
                  <div>
                    <h3 className="font-display font-semibold">{s.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}

const TESTIMONIALS = [
  { name: "María P.", text: "La calidad de los vestidos es hermosa y el sistema de pagar la mitad después me pareció increíble. Mi asesora Laura fue un amor.", stars: 5 },
  { name: "Carolina R.", text: "Compré unos jeans que me quedaron perfectos. La guía de tallas me ayudó mucho y me llegaron súper rápido.", stars: 5 },
  { name: "Andrea G.", text: "Amo cómo me asesoran por WhatsApp, siempre atentas. Ya hice tres pedidos y repetiré sin duda.", stars: 5 },
];

export function TestimonialsSection() {
  return (
    <section className="border-y border-gold/20 bg-card/50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionTitle kicker="Clientas felices" title="Lo que dicen de nosotras" />
        <Stagger className="mt-12 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <StaggerItem key={t.name}>
              <figure className="h-full rounded-2xl border border-border bg-card p-6 transition-all hover:border-gold/40 hover:shadow-[var(--shadow-gold)]">
                <div className="flex gap-0.5 text-gold">
                  {Array.from({ length: t.stars }).map((_, i) => <Star key={i} size={15} fill="currentColor" />)}
                </div>
                <blockquote className="mt-4 text-sm leading-relaxed text-muted-foreground">“{t.text}”</blockquote>
                <figcaption className="mt-4 flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-gold-soft to-gold font-semibold text-[#2a2005]">
                    {t.name.charAt(0)}
                  </span>
                  <span className="text-sm font-semibold">{t.name}</span>
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

export function FinalCTA({ whatsapp, storeName }: { whatsapp: string; storeName: string }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <Reveal from="scale">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1508] via-[#2a2005] to-[#1a1508] p-10 text-center sm:p-16 dark:from-[#131315] dark:via-[#1e1b12] dark:to-[#131315]">
          <div className="pointer-events-none absolute inset-0 opacity-30 [background:radial-gradient(ellipse_at_top,rgba(212,175,55,0.35),transparent_60%)]" />
          <HeartHandshake size={40} className="mx-auto text-gold" />
          <h2 className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl">
            ¿Lista para <span className="text-gradient-gold">brillar</span>?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-white/70">
            Escríbenos por WhatsApp y una asesora te acompañará en tu compra, o únete a nuestro equipo y empieza a ganar hoy.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a href={waLink(whatsapp, `¡Hola ${storeName}! Quiero hacer un pedido 👗✨`)} target="_blank" rel="noopener noreferrer">
              <Button variant="whatsapp" size="lg">Hacer un pedido</Button>
            </a>
            <a href={waLink(whatsapp, `¡Hola ${storeName}! Quiero ser asesora y ganar premios vendiendo ropa ✨`)} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="border-gold/60 text-gold-soft hover:bg-gold/10">
                <Users size={17} /> Ser asesora
              </Button>
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
