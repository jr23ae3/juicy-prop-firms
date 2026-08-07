import Link from "next/link";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

type SiteBrandProps = {
  className?: string;
  compact?: boolean;
};

export function SiteBrand({ className, compact = false }: SiteBrandProps) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex flex-col gap-0.5", className)}
    >
      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
        trade research
      </span>
      <span
        className={cn(
          "font-sans font-light tracking-tight text-foreground transition-colors group-hover:text-primary",
          compact ? "text-sm" : "text-base sm:text-lg",
        )}
      >
        {siteConfig.name}
      </span>
    </Link>
  );
}
