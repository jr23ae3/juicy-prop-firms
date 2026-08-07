import Image from "next/image";

import { getFirmAvatarColors, getFirmInitials } from "@/lib/firm-avatar";
import { cn } from "@/lib/utils";

type FirmLogoProps = {
  name: string;
  slug: string;
  logoUrl?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
};

const sizeClasses = {
  xs: "size-6 text-[9px]",
  sm: "size-8 text-[10px]",
  md: "size-10 text-xs",
  lg: "size-14 text-sm",
  xl: "size-20 text-base",
} as const;

const imageSizes = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
} as const;

export function FirmLogo({
  name,
  slug,
  logoUrl,
  size = "md",
  className,
}: FirmLogoProps) {
  const initials = getFirmInitials(name);
  const colors = getFirmAvatarColors(slug);
  const dimension = imageSizes[size];

  if (logoUrl) {
    return (
      <div
        className={cn(
          "relative shrink-0 overflow-hidden rounded-md border border-border bg-card",
          sizeClasses[size],
          className,
        )}
      >
        <Image
          src={logoUrl}
          alt=""
          width={dimension}
          height={dimension}
          className="size-full object-cover"
          unoptimized
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-md border border-border/80 font-mono font-semibold uppercase",
        sizeClasses[size],
        className,
      )}
      style={{
        backgroundColor: colors.background,
        color: colors.foreground,
      }}
    >
      {initials}
    </div>
  );
}
