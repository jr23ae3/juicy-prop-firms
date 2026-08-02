import type { PlanSummary } from "@/types/plan";

import { DiscountBadge } from "@/components/compare/discount-badge";
import { EvalTypeBadge } from "@/components/compare/eval-type-badge";
import {
  formatAccountSize,
  formatCurrency,
  formatReturnMultiple,
} from "@/lib/format";

type CompareCardListProps = {
  plans: PlanSummary[];
};

export function CompareCardList({ plans }: CompareCardListProps) {
  return (
    <ul className="grid gap-3 lg:hidden">
      {plans.map((plan) => (
        <ComparePlanCard key={plan.id} plan={plan} />
      ))}
    </ul>
  );
}

function ComparePlanCard({ plan }: { plan: PlanSummary }) {
  const hasDiscount = plan.pricing.savings > 0;

  return (
    <li className="rounded-xl border border-border/60 bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-muted-foreground">
            #{plan.firm.rankPosition ?? "—"} · {plan.firm.name}
          </p>
          <h3 className="mt-0.5 font-semibold">{plan.name}</h3>
          <p className="text-sm text-muted-foreground">
            {formatAccountSize(plan.accountSize)}
          </p>
        </div>
        <EvalTypeBadge evalType={plan.evalType} />
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-xs text-muted-foreground">Eval price</dt>
          <dd className="mt-0.5 tabular-nums">
            {hasDiscount ? (
              <>
                <span className="mr-1.5 text-muted-foreground line-through">
                  {formatCurrency(plan.pricing.evalPrice)}
                </span>
                {formatCurrency(plan.pricing.discountedPrice)}
              </>
            ) : (
              formatCurrency(plan.pricing.evalPrice)
            )}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Activation</dt>
          <dd className="mt-0.5 tabular-nums">
            {plan.pricing.activationFee > 0
              ? formatCurrency(plan.pricing.activationFee)
              : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">All-in cost</dt>
          <dd className="mt-0.5 text-lg font-semibold text-primary tabular-nums">
            {formatCurrency(plan.pricing.allInCost)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Return multiple</dt>
          <dd className="mt-0.5 tabular-nums">
            {formatReturnMultiple(plan.pricing.returnMultiple)}
          </dd>
        </div>
      </dl>

      {plan.discount ? (
        <div className="mt-4 border-t border-border/60 pt-3">
          <DiscountBadge discount={plan.discount} />
        </div>
      ) : null}
    </li>
  );
}
