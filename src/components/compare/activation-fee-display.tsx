import { formatCurrency } from "@/lib/format";
import type { PlanSummary } from "@/types/plan";

export function ActivationFeeDisplay({ plan }: { plan: PlanSummary }) {
  if (plan.pricing.activationFeeWaived) {
    return (
      <span>
        <span className="mr-1.5 text-muted-foreground line-through">
          {formatCurrency(plan.pricing.activationFee)}
        </span>
        <span className="text-emerald-600">Waived</span>
      </span>
    );
  }

  if (plan.pricing.activationFee > 0) {
    return <>{formatCurrency(plan.pricing.activationFee)}</>;
  }

  return <span className="text-muted-foreground">—</span>;
}
