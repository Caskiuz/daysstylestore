import type { Metadata } from "next";
import { Ruler, Footprints, Scissors, Clock, PenLine } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
import { SectionTitle } from "@/components/home/sections";

export const metadata: Metadata = {
  title: "Guía de tallas",
  description: "Encuentra tu talla perfecta en Days Style Store: tablas de medidas, consejos para medirte y asesoría personal gratuita por WhatsApp.",
};

const TOP_TABLE = {
  headers: ["Talla", "US", "Busto (cm)", "Cintura (cm)", "Cadera (cm)"],
  rows: [
    ["S", "2–4", "80–84", "62–66", "86–90"],
    ["M", "6–8", "85–89", "67–71", "91–95"],
    ["L", "10–12", "90–94", "72–76", "96–100"],
    ["XL", "14–16", "95–100", "77–83", "101–106"],
    ["XXL", "18–20", "101–107", "84–90", "107–113"],
  ],
};

const PANTS_TABLE = {
  headers: ["Talla", "US", "Cintura (cm)", "Cadera (cm)", "Largo interno (cm)"],
  rows: [
    ["26", "2", "66–69", "88–91", "76"],
    ["28", "4", "70–73", "92–95", "77"],
    ["30", "6", "74–77", "96–99", "78"],
    ["32", "8", "78–82", "100–104", "79"],
    ["34", "10", "83–87", "105–109", "79"],
  ],
};

const CALZADO_TABLE = {
  headers: ["Talla (EU)", "Largo del pie (cm)"],
  rows: [
    ["34", "21,5 - 22"],
    ["35", "22 - 22,5"],
    ["36", "22,5 - 23,5"],
    ["37", "23,5 - 24"],
    ["38", "24 - 24,5"],
    ["39", "24,5 - 25"],
    ["40", "25 - 25,5"],
  ],
};

function SizeTable({ title, data }: { title: string; data: typeof CALZADO_TABLE }) {
  return (
    <Reveal from="scale">
      <div className="overflow-hidden rounded-2xl border border-gold/30">
        <div className="bg-gradient-to-r from-[#8a6d1d] via-[#d4af37] to-[#8a6d1d] px-5 py-3 font-display font-bold text-[#241b04]">
          {title}
        </div>
        <div className="overflow-x-auto bg-card">
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                {data.headers.map((h) => <th key={h} className="px-5 py-3 font-semibold">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row) => (
                <tr key={row[0]} className="border-b border-border/60 transition-colors last:border-0 hover:bg-accent/50">
                  {row.map((cell, i) => (
                    <td key={i} className={`px-5 py-3 ${i === 0 ? "font-bold text-primary" : "text-muted-foreground"}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Reveal>
  );
}

export default function TallasPage() {
  const tips = [
    { icon: Scissors, title: "Mide con cinta suave", text: "Para ropa, mide busto, cintura y caderas con una cinta métrica sobre la ropa ajustada, sin apretar." },
    { icon: Footprints, title: "Pisa una hoja", text: "Para calzado, apoya el pie sobre una hoja, marca el talón y el dedo más largo, y mide la distancia." },
    { icon: Clock, title: "Mide al final del día", text: "Tanto el cuerpo como el pie se expanden con las horas. Toma tus medidas por la tarde, de pie y relajada." },
    { icon: PenLine, title: "Mide ambos pies", text: "Un pie suele ser un poco más grande. Guíate por el más largo y, si dudas entre dos tallas, elige la mayor." },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-soft/50 to-gold/20 text-primary">
          <Ruler size={26} />
        </div>
        <h1 className="font-display text-4xl font-bold">Tu <span className="text-gradient-gold">talla perfecta</span></h1>
        <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
          Medirte bien es la clave para que cada prenda te quede espectacular. Si dudas, escríbenos: te asesoramos gratis por WhatsApp.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {tips.map((t, i) => (
          <Reveal key={t.title} delay={i * 0.08}>
            <div className="h-full rounded-2xl border border-border bg-card p-5">
              <t.icon size={22} className="text-gold" />
              <h3 className="mt-3 font-display font-semibold">{t.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{t.text}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-12 space-y-10">
        <div>
          <SectionTitle kicker="Blusas · Vestidos · Tops" title="Tallas superiores" />
          <div className="mt-6"><SizeTable title="Superiores" data={TOP_TABLE} /></div>
        </div>
        <div>
          <SectionTitle kicker="Jeans · Pantalones · Faldas" title="Tallas inferiores" />
          <div className="mt-6"><SizeTable title="Inferiores" data={PANTS_TABLE} /></div>
        </div>
        <div>
          <SectionTitle kicker="Sandalias · Chanclas" title="Tallas de calzado" />
          <div className="mt-6"><SizeTable title="Calzado (tallas EU)" data={CALZADO_TABLE} /></div>
        </div>
      </div>

      <Reveal from="fade" className="mt-12">
        <div className="rounded-2xl border border-gold/30 bg-accent p-6 text-center text-sm leading-relaxed text-accent-foreground">
          <p className="font-display text-lg font-bold">¿Aún con dudas? 🤔</p>
          <p className="mt-2">
            Escríbenos por WhatsApp con tus medidas y la prenda que te gusta. Una asesora te recomendará la talla ideal para ti, sin costo.
          </p>
        </div>
      </Reveal>
    </div>
  );
}
