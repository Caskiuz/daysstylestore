"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3, Database, LayoutDashboard, LogOut, Menu, Package, Settings,
  ShoppingBag, Store, Tags, Users, X, Gift,
} from "lucide-react";
import { LogoMark } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { logoutAction } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/categorias", label: "Categorías", icon: Tags },
  { href: "/admin/trabajadoras", label: "Trabajadoras", icon: Users },
  { href: "/admin/premios", label: "Premios y canjes", icon: Gift },
  { href: "/admin/contabilidad", label: "Contabilidad", icon: BarChart3 },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings },
];

export function AdminShell({ userName, dbReady, children }: { userName: string; dbReady: boolean; children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav className="flex flex-1 flex-col gap-1 p-3">
      {NAV.map((item) => {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              "group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
              active ? "text-[#2a2005]" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {active && (
              <motion.span
                layoutId="admin-nav-active"
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#e9d489] to-[#d4af37] shadow-[0_4px_16px_-4px_rgba(212,175,55,0.5)]"
                transition={{ type: "spring", damping: 28, stiffness: 320 }}
              />
            )}
            <item.icon size={17} className="relative shrink-0" />
            <span className="relative">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background">
      {!dbReady && (
        <div className="flex items-center justify-center gap-2 bg-amber-500/90 px-4 py-2 text-center text-xs font-semibold text-black">
          <Database size={14} />
          Base de datos sin conectar: configura DATABASE_URL con Neon y ejecuta el seed (ver README). Los datos mostrados son demo.
        </div>
      )}

      <div className="flex">
        {/* Sidebar escritorio */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-card lg:flex">
          <div className="flex items-center gap-2.5 border-b border-border p-4">
            <LogoMark />
            <div className="leading-none">
              <p className="font-display text-base font-bold"><span className="text-gradient-gold">Days Style</span></p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">Panel Admin</p>
            </div>
          </div>
          {nav}
          <div className="border-t border-border p-3">
            <Link href="/" target="_blank" className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <Store size={17} /> Ver tienda
            </Link>
            <form action={logoutAction}>
              <button className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive cursor-pointer">
                <LogOut size={17} /> Cerrar sesión
              </button>
            </form>
          </div>
        </aside>

        {/* Sidebar móvil */}
        <AnimatePresence>
          {open && (
            <>
              <motion.div className="fixed inset-0 z-40 bg-black/50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
              <motion.aside
                initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
                transition={{ type: "spring", damping: 28, stiffness: 300 }}
                className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card lg:hidden"
              >
                <div className="flex items-center justify-between border-b border-border p-4">
                  <div className="flex items-center gap-2.5">
                    <LogoMark />
                    <p className="font-display text-base font-bold"><span className="text-gradient-gold">Panel Admin</span></p>
                  </div>
                  <button onClick={() => setOpen(false)} aria-label="Cerrar menú" className="rounded-full p-1.5 hover:bg-muted cursor-pointer"><X size={18} /></button>
                </div>
                {nav}
                <div className="border-t border-border p-3">
                  <Link href="/" target="_blank" className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm text-muted-foreground">
                    <Store size={17} /> Ver tienda
                  </Link>
                  <form action={logoutAction}>
                    <button className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm text-muted-foreground cursor-pointer">
                      <LogOut size={17} /> Cerrar sesión ({userName.split(" ")[0]})
                    </button>
                  </form>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Contenido */}
        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-lg sm:px-6">
            <button onClick={() => setOpen(true)} className="rounded-lg p-2 hover:bg-muted lg:hidden cursor-pointer" aria-label="Abrir menú">
              <Menu size={20} />
            </button>
            <p className="font-display font-bold">Panel de Administración</p>
            <div className="ml-auto flex items-center gap-2.5">
              <span className="hidden text-sm text-muted-foreground sm:block">Hola, {userName.split(" ")[0]} 👑</span>
              <ThemeToggle />
            </div>
          </header>
          <main className="p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
