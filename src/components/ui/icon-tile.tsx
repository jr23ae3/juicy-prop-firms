import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type IconTileProps = {
  icon: LucideIcon;
  className?: string;
  iconClassName?: string;
};

export function IconTile({ icon: Icon, className, iconClassName }: IconTileProps) {
  return (
    <div
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-lg border border-border/80 bg-white/[0.04]",
        className,
      )}
    >
      <Icon className={cn("size-5 text-primary", iconClassName)} aria-hidden />
    </div>
  );
}
