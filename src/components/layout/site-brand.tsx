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
      className={cn("group inline-flex items-center gap-3", className)}
    >
      <Image
        src="/logo-mark.svg"
        alt=""
        width={compact ? 36 : 42}
        height={compact ? 36 : 42}
        className="shrink-0 transition-transform duration-300 group-hover:scale-105"
        priority
      />
      <span
        className={cn(
          "font-medium tracking-[-0.03em] text-white transition-opacity group-hover:opacity-80",
          compact ? "text-lg" : "text-xl sm:text-2xl",
        )}
      >
        {siteConfig.name}
      </span>
    </Link>
  );
}
