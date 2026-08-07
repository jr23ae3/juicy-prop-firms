import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

type SiteBrandProps = {
  className?: string;
  compact?: boolean;
  variant?: "default" | "arcade";
};

export function SiteBrand({
  className,
  compact = false,
  variant = "default",
}: SiteBrandProps) {
  const isArcade = variant === "arcade";

  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <div
        className={cn(
          "shrink-0 transition-transform group-hover:scale-105",
          isArcade && "border-2 border-primary/40 bg-[#04110a] p-0.5",
        )}
      >
        <Image
          src="/logo-mark.svg"
          alt=""
          width={compact ? 32 : 36}
          height={compact ? 32 : 36}
          className="shrink-0"
          priority
        />
      </div>
      <span className="flex flex-col gap-0.5">
        {isArcade ? (
          <>
            <span className="site-brand-arcade-tag">TRADE RESEARCH</span>
            <span
              className={cn(
                "site-brand-arcade-name transition-colors group-hover:text-primary",
                compact ? "text-[10px]" : "text-[11px] sm:text-xs",
              )}
            >
              {siteConfig.name.toUpperCase()}
            </span>
          </>
        ) : (
          <>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
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
          </>
        )}
      </span>
    </Link>
  );
}
