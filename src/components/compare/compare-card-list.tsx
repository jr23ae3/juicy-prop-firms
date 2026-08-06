import type { PlanSummary } from "@/types/plan";

import { CalculatedValue } from "@/components/compare/calculated-value";
import { DiscountBadge } from "@/components/compare/discount-badge";
import { ActivationFeeDisplay } from "@/components/compare/activation-fee-display";
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
import {
  getAllInCostTooltip,
  getAllInTargetTooltip,
  getReturnMultipleTooltip,
  getRiskRatioTooltip,
  getRewardRatioTooltip,
} from "@/lib/plans/calculation-tooltips";
import { getAllInTarget, getRiskRatio, getRewardRatio } from "@/lib/plans/metrics";

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
        <SavePlanButton planId={plan.id} />
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-xs text-muted-foreground">Draw down type</dt>
          <dd className="mt-0.5">
            {getDrawdownTypeLabel(plan.drawdownType) ?? "—"}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Target goal</dt>
          <dd className="mt-0.5 tabular-nums">
            {formatOptionalCurrency(plan.profitTarget)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Daily draw down</dt>
          <dd className="mt-0.5 tabular-nums">
            {formatOptionalCurrency(plan.dailyDrawdown)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Max draw down</dt>
          <dd className="mt-0.5 tabular-nums">
            {formatOptionalCurrency(plan.maxDrawdown)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Minimum day</dt>
          <dd className="mt-0.5 tabular-nums">
            {formatMinimumDays(plan.minimumDays)}
          </dd>
        </div>
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
            <ActivationFeeDisplay plan={plan} />
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">All-in cost</dt>
          <dd className="mt-0.5 text-lg font-semibold text-primary tabular-nums">
            <CalculatedValue tooltip={getAllInCostTooltip(plan)}>
              {formatCurrency(plan.pricing.allInCost)}
            </CalculatedValue>
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Return multiple</dt>
          <dd className="mt-0.5 tabular-nums">
            <CalculatedValue tooltip={getReturnMultipleTooltip(plan)}>
              {formatReturnMultiple(plan.pricing.returnMultiple)}
            </CalculatedValue>
          </dd>
        </div>
      </dl>

      <div className="compare-funded-panel mt-4 rounded-lg p-3 pt-3">
        <p className="compare-funded-panel-label text-xs font-semibold uppercase tracking-wide">
          Funded
        </p>
        <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-xs text-muted-foreground">Min days to payout</dt>
            <dd className="mt-0.5 tabular-nums">
              {formatMinimumDays(plan.minimumDaysToPayout)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Min target buffer</dt>
            <dd className="mt-0.5 tabular-nums">
              {formatOptionalCurrency(plan.minimumTargetGoalCushion)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">All-in target</dt>
            <dd className="mt-0.5 tabular-nums">
              <CalculatedValue tooltip={getAllInTargetTooltip(plan)}>
                {formatOptionalCurrency(
                  getAllInTarget(plan.profitTarget, plan.minimumTargetGoalCushion),
                )}
              </CalculatedValue>
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Max payout</dt>
            <dd className="mt-0.5 tabular-nums">
              {formatOptionalCurrency(plan.maxPayout)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Risk ratio</dt>
            <dd className="mt-0.5 tabular-nums">
              <CalculatedValue tooltip={getRiskRatioTooltip(plan)}>
                {formatReturnMultiple(
                  getRiskRatio(
                    plan.maxDrawdown,
                    plan.profitTarget,
                    plan.minimumTargetGoalCushion,
                  ),
                )}
              </CalculatedValue>
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Reward ratio</dt>
            <dd className="mt-0.5 tabular-nums">
              <CalculatedValue tooltip={getRewardRatioTooltip(plan)}>
                {formatReturnMultiple(
                  getRewardRatio(
                    plan.maxPayout,
                    plan.profitTarget,
                    plan.minimumTargetGoalCushion,
                  ),
                )}
              </CalculatedValue>
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Max funded</dt>
            <dd className="mt-0.5 tabular-nums">
              {formatOptionalCount(plan.maxFundedAccounts)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Split %</dt>
            <dd className="mt-0.5 tabular-nums">
              {formatProfitSplit(plan.profitSplit)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Funded draw down type</dt>
            <dd className="mt-0.5">
              {getDrawdownTypeLabel(plan.fundedDrawdownType) ?? "—"}
            </dd>
          </div>
        </dl>
      </div>

      {plan.discount ? (
        <div className="mt-4 border-t border-border/60 pt-3">
          <DiscountBadge discount={plan.discount} />
        </div>
      ) : null}
    </li>
  );
}
