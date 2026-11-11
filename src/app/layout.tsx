import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { CurrencyProvider } from "@/components/currency-provider";
import { getSettings } from "@/lib/data";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${s.storeName} — ${s.tagline}`,
      template: `%s · ${s.storeName}`,
    },
    description:
      "Tienda de moda femenina con asesoras personales. Compra fácil por WhatsApp, pagos en pesos o dólares y entrega a tu puerta. Vendes 4, ganas 1: únete a nuestro equipo.",
    keywords: ["tienda de ropa", "moda femenina", "Days Style Store", "ropa por WhatsApp", "moda Colombia", "asesoras de moda"],
    openGraph: {
      title: `${s.storeName} — ${s.tagline}`,
      description: "Moda femenina con asesoras personales. Compra por WhatsApp con pago 50% al recibir y 50% a 8 días.",
      type: "website",
      locale: "es_CO",
      siteName: s.storeName,
    },
    robots: { index: true, follow: true },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${playfair.variable} ${inter.variable} font-sans antialiased`}>
        <ThemeProvider>
          <CurrencyProvider rates={{ usdToCop: s.usdToCop, usdToVes: s.usdToVes }} enabled={s.currenciesEnabled}>
            {children}
          </CurrencyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
