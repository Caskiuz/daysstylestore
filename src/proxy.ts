import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

/**
 * Protección de rutas (Next 16: proxy.ts reemplaza a middleware.ts).
 * Verifica el JWT de sesión en el edge y redirige según el rol.
 */
export default async function proxy(req: NextRequest) {
  const token = req.cookies.get("dss_session")?.value;
  const secret = new TextEncoder().encode(process.env.AUTH_SECRET || "dev-secret-days-style-store");

  let role: string | null = null;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, secret);
      role = (payload.role as string) || null;
    } catch {
      role = null;
    }
  }

  const path = req.nextUrl.pathname;

  if (path.startsWith("/admin")) {
    if (!role) return NextResponse.redirect(new URL("/login", req.url));
    if (role !== "ADMIN") return NextResponse.redirect(new URL("/trabajadora", req.url));
  }

  if (path.startsWith("/trabajadora")) {
    if (!role) return NextResponse.redirect(new URL("/login", req.url));
    if (role !== "WORKER") return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/trabajadora/:path*"],
};
