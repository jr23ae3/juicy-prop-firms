import Link from "next/link";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

type SiteBrandProps = {
  className?: string;
  invert?: boolean;
};

export function SiteBrand({ className, invert = false }: SiteBrandProps) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <span
        aria-hidden
        className={cn(
          "relative flex size-9 shrink-0 items-center justify-center rounded-full transition-transform group-hover:scale-105",
          invert ? "bg-primary text-primary-foreground" : "bg-foreground text-background",
        )}
      >
        <span
          className={cn(
            "absolute size-2.5 rounded-full",
            invert ? "bg-primary-foreground" : "bg-primary",
          )}
          style={{ top: "38%", left: "42%" }}
        />
      </span>
      <span
        className={cn(
          "font-heading text-base font-semibold tracking-tight sm:text-lg",
          invert && "text-background",
        )}
      >
        {siteConfig.name}
      </span>
    </Link>
  );
}
