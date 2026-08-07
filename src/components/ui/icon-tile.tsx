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
        "flex size-10 shrink-0 items-center justify-center rounded-md border border-primary/25 bg-primary/10",
        className,
      )}
    >
      <Icon className={cn("size-5 text-primary", iconClassName)} aria-hidden />
    </div>
  );
}
