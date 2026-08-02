import type { PlanSummary } from "@/types/plan";

import { DiscountBadge } from "@/components/compare/discount-badge";
import { EvalTypeBadge } from "@/components/compare/eval-type-badge";
import { SavePlanButton } from "@/components/user/save-plan-button";
import {
  formatAccountSize,
  formatCurrency,
  formatMinimumDays,
  formatOptionalCount,
  formatOptionalCurrency,
  formatProfitSplit,
  formatReturnMultiple,
} from "@/lib/format";
import { getDrawdownTypeLabel } from "@/lib/plans/labels";
import { cn } from "@/lib/utils";

type CompareTableProps = {
  plans: PlanSummary[];
};

const FUNDED_GROUP_CLASS =
  "border-l border-border/60 bg-muted/20";

const FUNDED_CELL_BORDER = "border-l border-border/60";

export function CompareTable({ plans }: CompareTableProps) {
  return (
    <div className="hidden overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm lg:block">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1880px] border-collapse text-sm">
          <caption className="sr-only">
            Prop firm plan comparison with all-in costs, funded terms, and
            discount codes
          </caption>
          <thead>
            <tr className="border-b border-border/60 bg-muted/40 text-left">
              <th scope="col" rowSpan={2} className="px-4 py-3 font-medium">
                Rank
              </th>
              <th scope="col" rowSpan={2} className="px-4 py-3 font-medium">
                Firm
              </th>
              <th scope="col" rowSpan={2} className="px-4 py-3 font-medium">
                Plan
              </th>
              <th scope="col" rowSpan={2} className="px-4 py-3 font-medium">
                Type
              </th>
              <th scope="col" rowSpan={2} className="px-4 py-3 font-medium">
                Draw Down Type
              </th>
              <th
                scope="col"
                rowSpan={2}
                className="px-4 py-3 font-medium text-right"
              >
                Target Goal
              </th>
              <th
                scope="col"
                rowSpan={2}
                className="px-4 py-3 font-medium text-right"
              >
                Daily Draw Down
              </th>
              <th
                scope="col"
                rowSpan={2}
                className="px-4 py-3 font-medium text-right"
              >
                Max Draw Down
              </th>
              <th
                scope="col"
                rowSpan={2}
                className="px-4 py-3 font-medium text-right"
              >
                Minimum Day
              </th>
              <th
                scope="col"
                rowSpan={2}
                className="px-4 py-3 font-medium text-right"
              >
                Eval
              </th>
              <th
                scope="col"
                rowSpan={2}
                className="px-4 py-3 font-medium text-right"
              >
                Activation
              </th>
              <th
                scope="col"
                rowSpan={2}
                className="px-4 py-3 font-medium text-right"
              >
                All-in
              </th>
              <th
                scope="colgroup"
                colSpan={5}
                className={`px-4 py-2 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground ${FUNDED_GROUP_CLASS}`}
              >
                Funded
              </th>
              <th scope="col" rowSpan={2} className="px-4 py-3 font-medium">
                Code
              </th>
              <th
                scope="col"
                rowSpan={2}
                className="px-4 py-3 font-medium text-right"
              >
                Return
              </th>
              <th
                scope="col"
                rowSpan={2}
                className="px-4 py-3 text-center font-medium"
              >
                <span className="sr-only">Save</span>
              </th>
            </tr>
            <tr className="border-b border-border/60 bg-muted/30 text-left text-xs">
              <th
                scope="col"
                className={`px-4 py-2 font-medium text-right ${FUNDED_GROUP_CLASS}`}
              >
                Min Days to Payout
              </th>
              <th scope="col" className="px-4 py-2 font-medium text-right">
                Min Target Goal Cushion
              </th>
              <th scope="col" className="px-4 py-2 font-medium text-right">
                Max Payout
              </th>
              <th scope="col" className="px-4 py-2 font-medium text-right">
                Max Funded Accounts
              </th>
              <th scope="col" className="px-4 py-2 font-medium text-right">
                Split %
              </th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan, index) => (
              <CompareTableRow key={plan.id} plan={plan} index={index} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CompareTableRow({
  plan,
  index,
}: {
  plan: PlanSummary;
  index: number;
}) {
  const hasDiscount = plan.pricing.savings > 0;
  const isStriped = index % 2 === 1;

  return (
    <tr
      className={cn(
        "border-b border-border/40 transition-colors last:border-0 hover:bg-muted/40",
        isStriped && "bg-muted/25",
      )}
    >
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
      <td className="px-4 py-3">
        {getDrawdownTypeLabel(plan.drawdownType) ?? (
          <span className="text-muted-foreground">—</span>
        )}
      </td>
      <td className="px-4 py-3 text-right tabular-nums">
        {formatOptionalCurrency(plan.profitTarget)}
      </td>
      <td className="px-4 py-3 text-right tabular-nums">
        {formatOptionalCurrency(plan.dailyDrawdown)}
      </td>
      <td className="px-4 py-3 text-right tabular-nums">
        {formatOptionalCurrency(plan.maxDrawdown)}
      </td>
      <td className="px-4 py-3 text-right tabular-nums">
        {formatMinimumDays(plan.minimumDays)}
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
      <td
        className={cn(
          "px-4 py-3 text-right tabular-nums",
          FUNDED_CELL_BORDER,
          isStriped && "bg-muted/35",
        )}
      >
        {formatMinimumDays(plan.minimumDaysToPayout)}
      </td>
      <td className="px-4 py-3 text-right tabular-nums">
        {formatOptionalCurrency(plan.minimumTargetGoalCushion)}
      </td>
      <td className="px-4 py-3 text-right tabular-nums">
        {formatOptionalCurrency(plan.maxPayout)}
      </td>
      <td className="px-4 py-3 text-right tabular-nums">
        {formatOptionalCount(plan.maxFundedAccounts)}
      </td>
      <td className="px-4 py-3 text-right tabular-nums">
        {formatProfitSplit(plan.profitSplit)}
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
      <td className="px-4 py-3 text-center">
        <SavePlanButton planId={plan.id} />
      </td>
    </tr>
  );
}
