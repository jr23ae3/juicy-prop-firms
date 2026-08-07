import Image from "next/image";
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
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <Image
        src="/logo-mark.svg"
        alt=""
        width={compact ? 32 : 36}
        height={compact ? 32 : 36}
        className="shrink-0 transition-transform group-hover:scale-105"
        priority
      />
      <span className="flex flex-col gap-0.5">
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
      </span>
    </Link>
  );
}
