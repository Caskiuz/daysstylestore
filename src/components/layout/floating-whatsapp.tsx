"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { waLink, generalMessage } from "@/lib/whatsapp";

export function FloatingWhatsApp({ whatsapp, storeName }: { whatsapp: string; storeName: string }) {
  if (!whatsapp) return null;
  return (
    <motion.a
      href={waLink(whatsapp, generalMessage(storeName))}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="wa-pulse fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_-6px_rgba(37,211,102,0.6)] transition-transform hover:scale-110"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", damping: 12 }}
    >
      <MessageCircle size={26} fill="currentColor" />
      <span className="absolute -left-1 -top-1 flex h-4 w-4">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-60" />
        <span className="relative inline-flex h-4 w-4 rounded-full border-2 border-background bg-[#25D366]" />
      </span>
    </motion.a>
  );
}
