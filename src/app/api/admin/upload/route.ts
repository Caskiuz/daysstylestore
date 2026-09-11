import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * Sube una imagen a Cloudinary vía REST (firma SHA-1 propia, sin SDK).
 * Requiere CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY y CLOUDINARY_API_SECRET.
 */
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloud || !apiKey || !apiSecret) {
    return NextResponse.json(
      { error: "Cloudinary no está configurado. Añade CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY y CLOUDINARY_API_SECRET en las variables de entorno (ver README). Mientras tanto puedes usar el botón de imagen de demo o pegar una URL." },
      { status: 400 }
    );
  }

  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file || !file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Archivo de imagen no válido" }, { status: 400 });
    }
    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json({ error: "La imagen supera 8MB" }, { status: 400 });
    }

    const timestamp = Math.round(Date.now() / 1000);
    const folder = "daystylestore";
    const signature = crypto
      .createHash("sha1")
      .update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`)
      .digest("hex");

    const upload = new FormData();
    upload.append("file", file);
    upload.append("api_key", apiKey);
    upload.append("timestamp", String(timestamp));
    upload.append("folder", folder);
    upload.append("signature", signature);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
      method: "POST",
      body: upload,
    });
    const data = await res.json();

    if (!res.ok || !data.secure_url) {
      return NextResponse.json({ error: data.error?.message || "Error subiendo a Cloudinary" }, { status: 502 });
    }

    return NextResponse.json({ url: data.secure_url, publicId: data.public_id });
  } catch (err) {
    console.error("[upload]", err);
    return NextResponse.json({ error: "Error inesperado al subir la imagen" }, { status: 500 });
  }
}
