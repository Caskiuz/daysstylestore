"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        gold: "bg-gradient-to-b from-[#e3c25c] via-[#d4af37] to-[#b8942a] text-[#2a2005] shadow-[0_6px_20px_-6px_rgba(212,175,55,0.55)] hover:shadow-[0_10px_30px_-6px_rgba(212,175,55,0.7)] hover:brightness-110 active:scale-[0.97]",
        outline: "border border-gold/50 text-primary hover:bg-accent hover:border-gold active:scale-[0.97]",
        ghost: "text-foreground hover:bg-muted",
        dark: "bg-foreground text-background hover:opacity-85 active:scale-[0.97]",
        whatsapp: "bg-[#25D366] text-white hover:bg-[#1fb959] shadow-[0_6px_20px_-6px_rgba(37,211,102,0.55)] hover:shadow-[0_10px_30px_-6px_rgba(37,211,102,0.7)] active:scale-[0.97]",
        destructive: "bg-destructive text-white hover:bg-red-600 active:scale-[0.97]",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 px-4 text-xs",
        default: "h-10 px-5",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "gold", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="animate-spin" />}
      {children}
    </button>
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };
