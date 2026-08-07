import type { EvalType } from "@/generated/prisma/client";

import { Badge } from "@/components/ui/badge";
import { getEvalTypeLabel } from "@/lib/plans/labels";
import { cn } from "@/lib/utils";

type EvalTypeBadgeProps = {
  evalType: EvalType;
  className?: string;
};

export function EvalTypeBadge({ evalType, className }: EvalTypeBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "whitespace-nowrap border-0 bg-primary/10 font-normal text-foreground",
        className,
      )}
    >
      {getEvalTypeLabel(evalType)}
    </Badge>
  );
}
