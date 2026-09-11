import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Permitir SVG propios (placeholders de productos) y fotos de Cloudinary
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};

export default nextConfig;
