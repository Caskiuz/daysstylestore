"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send, Sparkles, User, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "model"; content: string };

const SUGGESTIONS = [
  "¿Qué tallas tienen disponibles?",
  "¿Cómo pago mi pedido?",
  "¿Cómo funciona ser asesora?",
  "¿Cuánto tarda la entrega?",
];

const WELCOME: Msg = {
  role: "model",
  content:
    "¡Hola! ✨ Soy *Daisy*, la asistente IA de Days Style Store. Puedo ayudarte con tallas, precios, métodos de pago, entregas y cómo unirte como asesora. ¿Qué quieres saber?",
};

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading, open]);

  async function send(text?: string) {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    setInput("");
    setUnavailable(false);
    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setLoading(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.filter((m) => m !== WELCOME).slice(-12) }),
      });
      const data = await res.json();
      if (data.unavailable) {
        setUnavailable(true);
        setMessages((m) => [...m, { role: "model", content: data.reply as string }]);
      } else {
        setMessages((m) => [...m, { role: "model", content: data.reply || "Disculpa, no pude responder. Intenta de nuevo 💛" }]);
      }
    } catch {
      setMessages((m) => [...m, { role: "model", content: "Hubo un problema de conexión. Intenta de nuevo en unos segundos 💛" }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Botón flotante IA (izquierda, para no chocar con WhatsApp) */}
      <motion.button
        onClick={() => setOpen(!open)}
        aria-label="Asistente IA de la tienda"
        className="fixed bottom-5 left-5 z-40 flex h-13 items-center gap-2 rounded-full bg-gradient-to-r from-[#b8942a] via-[#d4af37] to-[#e9d489] px-4 py-3 font-bold text-[#2a2005] shadow-[0_8px_28px_-6px_rgba(212,175,55,0.65)] transition-transform hover:scale-105 cursor-pointer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, type: "spring", damping: 12 }}
      >
        <Sparkles size={18} />
        <span className="hidden text-sm sm:inline">Pregúntale a Daisy IA</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className="fixed bottom-20 left-4 z-50 flex h-[min(560px,75vh)] w-[min(400px,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-gold/40 bg-card shadow-2xl"
          >
            {/* Encabezado */}
            <div className="flex items-center gap-3 bg-gradient-to-r from-[#1a1508] via-[#2a2005] to-[#1a1508] px-4 py-3.5 text-white dark:from-[#131315] dark:via-[#1e1b12] dark:to-[#131315]">
              <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#e9d489] to-[#d4af37] text-[#2a2005]">
                <Bot size={20} />
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#1a1508] bg-emerald-400" />
              </span>
              <div className="flex-1 leading-tight">
                <p className="font-display font-bold text-gold-soft">Daisy · Asistente IA</p>
                <p className="text-[11px] text-white/60">En línea · responde al instante</p>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Cerrar chat" className="rounded-full p-1.5 text-white/70 hover:bg-white/10 hover:text-white cursor-pointer">
                <X size={17} />
              </button>
            </div>

            {/* Mensajes */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn("flex gap-2", m.role === "user" ? "justify-end" : "justify-start")}
                >
                  {m.role === "model" && (
                    <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#e9d489] to-[#d4af37] text-[#2a2005]">
                      <Sparkles size={13} />
                    </span>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                      m.role === "user"
                        ? "rounded-br-md bg-gradient-to-br from-[#e3c25c] to-[#d4af37] text-[#2a2005]"
                        : "rounded-bl-md border border-border bg-muted"
                    )}
                  >
                    <b className={m.content.includes("*") ? "hidden" : "hidden"} />
                    {renderRich(m.content)}
                  </div>
                  {m.role === "user" && (
                    <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
                      <User size={13} />
                    </span>
                  )}
                </motion.div>
              ))}

              {loading && (
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#e9d489] to-[#d4af37] text-[#2a2005]"><Sparkles size={13} /></span>
                  <div className="flex gap-1 rounded-2xl rounded-bl-md border border-border bg-muted px-4 py-3">
                    {[0, 1, 2].map((d) => (
                      <motion.span
                        key={d}
                        className="h-1.5 w-1.5 rounded-full bg-gold"
                        animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
                        transition={{ repeat: Infinity, duration: 0.9, delay: d * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sugerencias */}
            {messages.length <= 1 && (
              <div className="flex flex-wrap gap-1.5 px-4 pb-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-full border border-gold/40 bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground transition-colors hover:border-gold cursor-pointer"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Entrada */}
            <form
              onSubmit={(e) => { e.preventDefault(); send(); }}
              className="flex items-center gap-2 border-t border-border bg-card p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={unavailable ? "IA en configuración…" : "Escribe tu pregunta…"}
                className="h-10 flex-1 rounded-full border border-input bg-background px-4 text-sm outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-ring/40"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Enviar"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#e3c25c] to-[#d4af37] text-[#2a2005] shadow-md transition-all hover:brightness-110 disabled:opacity-40 cursor-pointer"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/** Convierte *negritas* de Gemini a <strong>. */
function renderRich(text: string) {
  const parts = text.split(/(\*[^*\n]+\*)/g);
  return parts.map((p, i) =>
    p.startsWith("*") && p.endsWith("*") && p.length > 2 ? <strong key={i}>{p.slice(1, -1)}</strong> : <span key={i}>{p}</span>
  );
}
