import Link from "next/link";
import { Mail, MapPin, MessageCircle, Sparkles } from "lucide-react";
import { LogoMark } from "@/components/logo";
import { FacebookIcon, InstagramIcon, TikTokIcon } from "@/components/social-icons";
import { waLink, generalMessage } from "@/lib/whatsapp";
import type { StoreSettings } from "@/lib/types";

export function Footer({ settings }: { settings: StoreSettings }) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-20 border-t border-gold/20 bg-gradient-to-b from-transparent to-[color-mix(in_srgb,var(--gold)_6%,transparent)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <LogoMark size={42} />
            <div className="leading-none">
              <p className="font-display text-lg font-bold"><span className="text-gradient-gold">Days Style</span></p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-muted-foreground">Store</p>
            </div>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            {settings.tagline}. Moda femenina con asesoras personales y pagos fáciles en pesos o dólares, todo gestionado por WhatsApp.
          </p>
          <div className="flex gap-2">
            {settings.instagram && (
              <a href={`https://instagram.com/${settings.instagram}`} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition-all hover:border-gold hover:text-primary">
                <InstagramIcon size={16} />
              </a>
            )}
            {settings.facebook && (
              <a href={`https://facebook.com/${settings.facebook}`} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition-all hover:border-gold hover:text-primary">
                <FacebookIcon size={16} />
              </a>
            )}
            {settings.tiktok && (
              <a href={`https://tiktok.com/@${settings.tiktok}`} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition-all hover:border-gold hover:text-primary">
                <Sparkles size={16} />
              </a>
            )}
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-primary">Tienda</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li><Link href="/shop" className="transition-colors hover:text-primary">Todos los productos</Link></li>
            <li><Link href="/shop?cat=blusas" className="transition-colors hover:text-primary">Blusas & Tops</Link></li>
            <li><Link href="/shop?cat=pantalones" className="transition-colors hover:text-primary">Pantalones & Jeans</Link></li>
            <li><Link href="/shop?cat=vestidos" className="transition-colors hover:text-primary">Vestidos</Link></li>
            <li><Link href="/tallas" className="transition-colors hover:text-primary">Guía de tallas</Link></li>
            <li><Link href="/wishlist" className="transition-colors hover:text-primary">Lista de deseos</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-primary">Ayuda</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li><Link href="/faq" className="transition-colors hover:text-primary">Preguntas frecuentes</Link></li>
            <li><Link href="/contacto" className="transition-colors hover:text-primary">Contacto</Link></li>
            <li><Link href="/politicas/cambios" className="transition-colors hover:text-primary">Política de cambios</Link></li>
            <li><Link href="/politicas/privacidad" className="transition-colors hover:text-primary">Privacidad</Link></li>
            <li><Link href="/politicas/terminos" className="transition-colors hover:text-primary">Términos</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-primary">Contacto</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li>
              <a href={waLink(settings.whatsapp, generalMessage(settings.storeName))} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 transition-colors hover:text-primary">
                <MessageCircle size={16} className="text-gold" /> WhatsApp: +{settings.whatsapp}
              </a>
            </li>
            {settings.email && (
              <li className="flex items-center gap-2"><Mail size={16} className="text-gold" /> {settings.email}</li>
            )}
            {settings.address && (
              <li className="flex items-center gap-2"><MapPin size={16} className="text-gold" /> {settings.address}</li>
            )}
          </ul>
          <div className="mt-5 rounded-xl border border-gold/30 bg-accent p-3 text-xs leading-relaxed text-accent-foreground">
            <p className="font-bold">Métodos de pago</p>
            <p className="mt-1">{settings.paymentMethods.filter((m) => m.enabled).map((m) => m.name).join(" · ")}</p>
          </div>
        </div>
      </div>

      <div className="gold-line" />
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:px-6">
        <p>© {year} {settings.storeName}. Todos los derechos reservados.</p>
        <p>Hecho con <span className="text-gold">♥</span> para brillar cada día</p>
      </div>
    </footer>
  );
}
