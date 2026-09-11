import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { getProducts, getSettings } from "@/lib/data";
import { convertFromUsd } from "@/lib/currency";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

type ChatMessage = { role: "user" | "model"; content: string };

async function buildSystemPrompt(): Promise<string> {
  const [settings, { products }] = await Promise.all([getSettings(), getProducts()]);

  const rates = { usdToCop: settings.usdToCop, usdToVes: settings.usdToVes };
  const catalogo = products
    .map((p) => {
      const sizes = [...new Set(p.variants.filter((v) => v.stock > 0).map((v) => `${v.size}/${v.color}`))];
      return `- ${p.name} (${p.categoryName}): USD $${p.priceUsd.toFixed(2)} · COP $${Math.round(convertFromUsd(p.priceUsd, "COP", rates)).toLocaleString("es-CO")}${sizes.length ? ` · Disponible: ${sizes.slice(0, 8).join(", ")}` : " · AGOTADO"}`;
    })
    .join("\n");

  const pagos = settings.paymentMethods.filter((m) => m.enabled).map((m) => `${m.name}: ${m.details}`).join("\n");

  return `Eres "Daisy", la asistente virtual de ${settings.storeName}, una tienda de ropa femenina por catálogo con asesoras personales.

## Contexto del negocio
- Venta 100% por WhatsApp con atención personal (número: +${settings.whatsapp}).
- Pago del cliente: 50% al recibir el pedido y 50% restante a los 15 días.
- Monedas: USD y pesos colombianos (COP). Tasa actual: 1 USD = ${settings.usdToCop} COP${settings.currenciesEnabled.includes("VES") ? `; bolívares VES: 1 USD = ${settings.usdToVes} Bs` : ""}.
- Entrega: personal por las asesoras o coordinación por WhatsApp.
- Programa de asesoras "vendes ${settings.rewardUnits}, ganas 1": cada ${settings.rewardUnits} prendas vendidas, la asesora gana 1 prenda gratis o su valor en efectivo; el saldo se puede acumular.

## Métodos de pago aceptados
${pagos || "Efectivo COP/USD, Bancolombia y Nequi (datos por WhatsApp)."}

## Catálogo actual (precios y disponibilidad)
${catalogo}

## Instrucciones
- Responde SIEMPRE en español, con tono cálido, cercano y breve (máx. 90 palabras).
- Usa máx. 2 emojis por respuesta. Puedes usar *negritas* para destacar.
- Si preguntan por productos, menciona los del catálogo con precios reales en COP y USD.
- Si preguntan tallas, recomienda según la guía general: S (6-8), M (8-10), L (12-14), XL (16-18) en US de mujer.
- Para cerrar compras o pagos, indica que se hace por WhatsApp con una asesora.
- Si preguntan por el estado de un PEDIDO específico, pide el nombre y recomienda escribir por WhatsApp (no tienes acceso a pedidos).
- No inventes productos, precios ni promociones que no estén arriba.
${settings.aiPrompt ? `\n## Estilo adicional definido por la tienda\n${settings.aiPrompt}` : ""}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { messages?: ChatMessage[] };
    const history = (body.messages || []).filter((m) => m.content?.trim()).slice(-12);
    if (history.length === 0) {
      return NextResponse.json({ reply: "¡Hola! ¿En qué te puedo ayudar hoy? ✨" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        unavailable: true,
        reply:
          "💛 Mi cerebro IA todavía está en configuración (la tienda debe activar la API key de Gemini). Por ahora escríbenos por WhatsApp con el botón verde ¡te respondemos al instante!",
      });
    }

    const settings = await getSettings();
    if (!settings.aiEnabled) {
      return NextResponse.json({ reply: "La asistente IA está temporalmente pausada. ¡Escríbenos por WhatsApp! 💛" });
    }

    const ai = new GoogleGenAI({ apiKey });
    const systemPrompt = await buildSystemPrompt();

    const contents = history.map((m) => ({
      role: m.role === "model" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-3.6-flash",
      contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.6,
        // Los modelos Gemini 3.x usan tokens de razonamiento interno:
        // presupuesto amplio para que la respuesta nunca se corte.
        maxOutputTokens: 4096,
      },
    });

    const reply = response.text?.trim();
    if (!reply) throw new Error("Respuesta vacía de Gemini");

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("[ai/chat]", err);
    return NextResponse.json(
      { reply: "Uy, tuve un problemita técnico 🙈 Intenta de nuevo o escríbenos por WhatsApp." },
      { status: 200 }
    );
  }
}
