// Enlaces de WhatsApp (sin pasarela: todo se gestiona personalmente por chat)

export function waLink(phone: string, message: string) {
  const clean = (phone || "").replace(/[^\d]/g, "");
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}

export function buyProductMessage(opts: {
  storeName: string;
  productName: string;
  variant?: string;
  priceText: string;
  url?: string;
  workerCode?: string;
}) {
  const lines = [
    `¡Hola ${opts.storeName}! 👋`,
    `Quiero comprar este producto:`,
    `• ${opts.productName}${opts.variant ? ` (${opts.variant})` : ""}`,
    `• Precio: ${opts.priceText}`,
  ];
  if (opts.url) lines.push(`• Link: ${opts.url}`);
  if (opts.workerCode) lines.push(`• Mi asesora: ${opts.workerCode}`);
  lines.push("", "¿Me ayudan con el proceso de pago y entrega? ✨");
  return lines.join("\n");
}

export function generalMessage(storeName: string) {
  return `¡Hola ${storeName}! 👋 Tengo una pregunta sobre la tienda.`;
}
