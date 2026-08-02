import type { PlanSummary } from "@/types/plan";

import { DiscountBadge } from "@/components/compare/discount-badge";
import { EvalTypeBadge } from "@/components/compare/eval-type-badge";
import {
  formatAccountSize,
  formatCurrency,
  formatReturnMultiple,
} from "@/lib/format";

type CompareTableProps = {
  plans: PlanSummary[];
};

export function CompareTable({ plans }: CompareTableProps) {
  return (
    <div className="hidden overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm lg:block">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] border-collapse text-sm">
          <caption className="sr-only">
            Prop firm plan comparison with all-in costs and discount codes
          </caption>
          <thead>
            <tr className="border-b border-border/60 bg-muted/40 text-left">
              <th scope="col" className="px-4 py-3 font-medium">
                Rank
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Firm
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Plan
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Type
              </th>
              <th scope="col" className="px-4 py-3 font-medium text-right">
                Eval
              </th>
              <th scope="col" className="px-4 py-3 font-medium text-right">
                Activation
              </th>
              <th scope="col" className="px-4 py-3 font-medium text-right">
                All-in
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Code
              </th>
              <th scope="col" className="px-4 py-3 font-medium text-right">
                Return
              </th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <CompareTableRow key={plan.id} plan={plan} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CompareTableRow({ plan }: { plan: PlanSummary }) {
  const hasDiscount = plan.pricing.savings > 0;

  return (
    <tr className="border-b border-border/40 transition-colors last:border-0 hover:bg-muted/20">
      <td className="px-4 py-3 text-muted-foreground">
        #{plan.firm.rankPosition ?? "—"}
      </td>
      <td className="px-4 py-3 font-medium">{plan.firm.name}</td>
      <td className="px-4 py-3">
        <div>{plan.name}</div>
        <div className="text-xs text-muted-foreground">
          {formatAccountSize(plan.accountSize)}
        </div>
      </td>
      <td className="px-4 py-3">
        <EvalTypeBadge evalType={plan.evalType} />
      </td>
      <td className="px-4 py-3 text-right tabular-nums">
        {hasDiscount ? (
          <>
            <span className="mr-1.5 text-muted-foreground line-through">
              {formatCurrency(plan.pricing.evalPrice)}
            </span>
            <span>{formatCurrency(plan.pricing.discountedPrice)}</span>
          </>
        ) : (
          formatCurrency(plan.pricing.evalPrice)
        )}
      </td>
      <td className="px-4 py-3 text-right tabular-nums">
        {plan.pricing.activationFee > 0
          ? formatCurrency(plan.pricing.activationFee)
          : "—"}
      </td>
      <td className="px-4 py-3 text-right font-semibold text-primary tabular-nums">
        {formatCurrency(plan.pricing.allInCost)}
      </td>
      <td className="px-4 py-3">
        {plan.discount ? (
          <DiscountBadge discount={plan.discount} />
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </td>
      <td className="px-4 py-3 text-right tabular-nums">
        {formatReturnMultiple(plan.pricing.returnMultiple)}
      </td>
    </tr>
  );
}
