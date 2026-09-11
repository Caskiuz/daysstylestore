import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className, size = 38 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="dss-gold" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F5E6B3" />
          <stop offset="0.5" stopColor="#D4AF37" />
          <stop offset="1" stopColor="#8A6D1D" />
        </linearGradient>
      </defs>
      {/* Marco doble */}
      <path
        d="M24 2.5 43 12v24L24 45.5 5 36V12L24 2.5Z"
        stroke="url(#dss-gold)"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M24 7 38.8 14.4v19.2L24 41 9.2 33.6V14.4L24 7Z"
        stroke="url(#dss-gold)"
        strokeWidth="0.9"
        strokeLinejoin="round"
        opacity="0.55"
      />
      {/* Monograma DS */}
      <text
        x="24"
        y="30.5"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontWeight="700"
        fontSize="17"
        fill="url(#dss-gold)"
      >
        DS
      </text>
      {/* Destello */}
      <path d="M33 10.5l1 2.2 2.2 1-2.2 1-1 2.2-1-2.2-2.2-1 2.2-1 1-2.2Z" fill="url(#dss-gold)" />
    </svg>
  );
}

export function Logo({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <Link href="/" className={cn("group flex items-center gap-2.5", className)}>
      <span className="transition-transform duration-500 group-hover:rotate-[15deg]">
        <LogoMark />
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-lg font-bold tracking-wide">
            <span className="text-gradient-gold">Days Style</span>
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-muted-foreground">
            Store
          </span>
        </span>
      )}
    </Link>
  );
}
