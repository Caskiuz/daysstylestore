import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { LogoMark } from "@/components/logo";
import { HeroSceneMini } from "@/components/auth/hero-mini";

export const metadata: Metadata = { title: "Ingresar" };

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Panel de marca */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-[#171310] via-[#2a2005] to-[#0a0a0b] lg:block">
        <div className="absolute inset-0 opacity-40 [background:radial-gradient(ellipse_at_30%_20%,rgba(212,175,55,0.35),transparent_55%)]" />
        <div className="relative z-10 flex h-full flex-col justify-between p-12">
          <Link href="/" className="flex items-center gap-3">
            <LogoMark size={46} />
            <div className="leading-none">
              <p className="font-display text-xl font-bold"><span className="text-gradient-gold">Days Style</span></p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-white/50">Store</p>
            </div>
          </Link>
          <div>
            <h2 className="font-display text-4xl font-bold leading-tight text-white">
              El control de tu negocio,
              <br />
              <span className="text-gradient-gold">en un solo lugar.</span>
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
              Gestiona pedidos, trabajadoras, premios y contabilidad. Todo conectado con tus ventas por WhatsApp.
            </p>
            <div className="mt-8 h-64 w-64"><HeroSceneMini /></div>
          </div>
          <p className="text-xs text-white/40">© {new Date().getFullYear()} Days Style Store</p>
        </div>
      </div>

      {/* Formulario */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex flex-col items-center text-center lg:hidden">
            <LogoMark size={56} />
            <h1 className="mt-3 font-display text-2xl font-bold"><span className="text-gradient-gold">Days Style Store</span></h1>
          </div>
          <h1 className="font-display text-3xl font-bold">Bienvenida de nuevo</h1>
          <p className="mt-2 text-sm text-muted-foreground">Ingresa con tu cuenta para continuar.</p>
          <Suspense>
            <LoginForm />
          </Suspense>
          <p className="mt-8 text-center text-xs text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-primary">← Volver a la tienda</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
