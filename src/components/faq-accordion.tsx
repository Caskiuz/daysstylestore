"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/animations/reveal";

export function FAQAccordion({ faqs }: { faqs: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {faqs.map((f, i) => (
        <Reveal key={i} delay={i * 0.05}>
          <div
            className={cn(
              "overflow-hidden rounded-2xl border transition-colors",
              open === i ? "border-gold/50 bg-card shadow-[var(--shadow-gold)]" : "border-border bg-card"
            )}
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold cursor-pointer"
              aria-expanded={open === i}
            >
              {f.q}
              <motion.span
                animate={{ rotate: open === i ? 45 : 0 }}
                className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors", open === i ? "bg-gold text-[#2a2005]" : "bg-muted text-muted-foreground")}
              >
                <Plus size={15} />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="border-t border-border/60 px-5 py-4 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
