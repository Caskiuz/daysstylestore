"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, LayoutDashboard, Menu, ShoppingBag, Sparkles, X } from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { CurrencySwitcher } from "@/components/currency-provider";
import { useWishlist } from "@/lib/wishlist";
import { cn } from "@/lib/utils";
import type { SessionUser } from "@/lib/auth";

const LINKS = [
  { href: "/shop", label: "Tienda" },
  { href: "/tallas", label: "Guía de tallas" },
  { href: "/nosotros", label: "Nosotras" },
  { href: "/faq", label: "Preguntas" },
  { href: "/contacto", label: "Contacto" },
];

export function Navbar({ whatsapp, session, demo }: { whatsapp: string; session: SessionUser | null; demo?: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const wishlist = useWishlist();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full border-b transition-all duration-300",
          scrolled ? "glass border-gold/25 shadow-[0_8px_30px_-12px_rgba(212,175,55,0.25)]" : "border-transparent bg-background"
        )}
      >
        {/* Barra superior */}
        <div className="hidden bg-gradient-to-r from-[#8a6d1d] via-[#d4af37] to-[#8a6d1d] py-1.5 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-[#241b04] sm:block">
          <Sparkles size={12} className="mr-1 inline" />
          Envío personalizado · Pago 50% al recibir y 50% a 8 días · Vendes 4 y ganas 1
        </div>

        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          <Logo />

          <div className="hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors hover:text-primary",
                  pathname.startsWith(l.href) ? "text-primary" : "text-foreground/80"
                )}
              >
                {l.label}
                {pathname.startsWith(l.href) && (
                  <motion.span layoutId="nav-underline" className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-transparent via-gold to-transparent" />
                )}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <CurrencySwitcher />
            <Link
              href="/wishlist"
              aria-label="Mi lista de deseos"
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-all hover:border-gold/60 hover:text-primary"
            >
              <Heart size={17} />
              {wishlist.count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-gradient-to-b from-[#e3c25c] to-[#d4af37] px-1 text-[10px] font-bold text-[#2a2005]">
                  {wishlist.count}
                </span>
              )}
            </Link>
            <ThemeToggle />
            {session ? (
              <Link
                href={session.role === "ADMIN" ? "/admin" : "/trabajadora"}
                className="hidden items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background transition-opacity hover:opacity-85 sm:flex"
              >
                <LayoutDashboard size={14} />
                {session.role === "ADMIN" ? "Panel Admin" : "Mi panel"}
              </Link>
            ) : (
              <Link href="/login" className="hidden rounded-full border border-gold/50 px-4 py-2 text-xs font-semibold text-primary transition-colors hover:bg-accent sm:block">
                Ingresar
              </Link>
            )}
            <button
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card lg:hidden"
              onClick={() => setOpen(!open)}
              aria-label="Abrir menú"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Menú móvil */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="fixed inset-x-0 top-16 z-40 border-b border-gold/25 bg-card/95 p-4 shadow-xl backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col gap-1">
              {LINKS.map((l) => (
                <Link key={l.href} href={l.href} className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium hover:bg-muted">
                  <ShoppingBag size={15} className="text-gold" /> {l.label}
                </Link>
              ))}
              <Link href="/wishlist" className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium hover:bg-muted">
                <Heart size={15} className="text-gold" /> Mi lista de deseos ({wishlist.count})
              </Link>
              <Link
                href={session ? (session.role === "ADMIN" ? "/admin" : "/trabajadora") : "/login"}
                className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-[#e3c25c] to-[#d4af37] px-4 py-3 text-sm font-bold text-[#2a2005]"
              >
                <LayoutDashboard size={15} />
                {session ? (session.role === "ADMIN" ? "Panel Admin" : "Mi panel") : "Ingresar"}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
