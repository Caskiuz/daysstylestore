"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ShareButton({ url, name, className }: { url: string; name: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const text = `¡Mira esta prenda de Days Style Store! ✨ ${name}`;
    if (navigator.share) {
      try { await navigator.share({ title: name, text, url }); return; } catch { /* cancelado */ }
    }
    await navigator.clipboard.writeText(`${text}\n${url}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Button variant="outline" size="sm" className={className} onClick={share}>
      {copied ? <><Check size={14} className="text-emerald-500" /> Copiado</> : <><Share2 size={14} /> Compartir</>}
    </Button>
  );
}
