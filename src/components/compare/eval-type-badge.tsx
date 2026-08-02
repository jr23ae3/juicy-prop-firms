import type { EvalType } from "@/generated/prisma/client";

import { Badge } from "@/components/ui/badge";
import { getEvalTypeLabel } from "@/lib/plans/labels";

type EvalTypeBadgeProps = {
  evalType: EvalType;
};

export function EvalTypeBadge({ evalType }: EvalTypeBadgeProps) {
  return (
    <Badge variant="outline" className="whitespace-nowrap">
      {getEvalTypeLabel(evalType)}
    </Badge>
  );
}
