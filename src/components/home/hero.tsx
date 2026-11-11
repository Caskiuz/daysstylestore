"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, Sparkles, Truck, Wallet, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { waLink, generalMessage } from "@/lib/whatsapp";

const HeroScene = dynamic(() => import("@/components/three/hero-scene"), {
  ssr: false,
  loading: () => <div className="flex h-full w-full items-center justify-center"><div className="skeleton h-56 w-56 rounded-full" /></div>,
});

const headlines = ["brillar", "elegir", "volverte a ver"];

export function Hero({ storeName, whatsapp }: { storeName: string; whatsapp: string }) {
  return (
    <section className="hero-bg relative overflow-hidden">
      {/* resplandor decorativo */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-gold/15 blur-3xl" />

      <div className="mx-auto grid max-w-7xl items-center gap-6 px-4 pb-10 pt-12 sm:px-6 lg:grid-cols-2 lg:gap-2 lg:pt-16">
        <div className="relative z-10 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-accent px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent-foreground"
          >
            <Sparkles size={13} className="text-gold" />
            Nueva colección · {new Date().getFullYear()}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-4xl font-bold leading-[1.08] sm:text-6xl"
          >
            La moda que te hace
            <br />
            <span className="text-gradient-gold italic">{headlines[0]}</span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="ml-3 inline-block text-2xl align-middle sm:text-3xl"
            >
              ✨
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22 }}
            className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-muted-foreground lg:mx-0 sm:text-lg"
          >
            Descubre prendas seleccionadas para cada ocasión. Compra fácil por WhatsApp, paga{" "}
            <strong className="text-foreground">50% al recibir</strong> y el resto a 15 días, con la asesoría
            personal de nuestro equipo.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.34 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
          >
            <Link href="/shop">
              <Button size="lg" className="group">
                Ver colección
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <a href={waLink(whatsapp, generalMessage(storeName))} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline">
                <MessageCircle size={18} />
                Comprar por WhatsApp
              </Button>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.8 }}
            className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground lg:justify-start"
          >
            <span className="flex items-center gap-1.5"><Truck size={14} className="text-gold" /> Entrega personalizada</span>
            <span className="flex items-center gap-1.5"><Wallet size={14} className="text-gold" /> Pesos, Nequi, Bancolombia o dólares</span>
            <span className="flex items-center gap-1.5"><BadgeCheck size={14} className="text-gold" /> Calidad garantizada</span>
          </motion.div>
        </div>

        {/* Escena 3D */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.25 }}
          className="relative h-[320px] sm:h-[420px] lg:h-[520px]"
        >
          <HeroScene />
        </motion.div>
      </div>

      {/* Marquesina */}
      <div className="relative border-y border-gold/20 bg-card/60 py-3 backdrop-blur-sm">
        <div className="flex overflow-hidden">
          <div className="animate-marquee flex shrink-0 items-center gap-10 pr-10 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {Array.from({ length: 2 }).flatMap((_, k) =>
              ["Sandalias", "✦", "Chanclas", "✦", "Tallas 34 al 40", "✦", "Nueva colección", "✦"].map((t, i) => (
                <span key={`${k}-${i}`} className={t === "✦" ? "text-gold" : ""}>{t}</span>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
