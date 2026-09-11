import * as React from "react";
import { cn } from "@/lib/utils";

function Badge({ className, children, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

function GoldBadge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <Badge className={cn("bg-gradient-to-r from-[#e9d489] to-[#d4af37] text-[#2a2005] shadow-sm", className)}>
      {children}
    </Badge>
  );
}

function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-2xl border border-border bg-card text-card-foreground shadow-sm", className)} {...props} />;
}

function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1 p-5 pb-0", className)} {...props} />;
}

function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("font-display text-lg font-semibold leading-tight", className)} {...props} />;
}

function CardBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5", className)} {...props} />;
}

function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded-xl", className)} />;
}

function EmptyState({ icon, title, subtitle, action }: { icon?: React.ReactNode; title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border py-14 text-center">
      {icon && <div className="text-gold">{icon}</div>}
      <p className="font-display text-lg font-semibold">{title}</p>
      {subtitle && <p className="max-w-sm text-sm text-muted-foreground">{subtitle}</p>}
      {action}
    </div>
  );
}

export { Badge, GoldBadge, Card, CardHeader, CardTitle, CardBody, Skeleton, EmptyState };
