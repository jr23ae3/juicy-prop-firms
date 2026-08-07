import type { PlanSummary } from "@/types/plan";

import { CalculatedValue } from "@/components/compare/calculated-value";
import { DiscountBadge } from "@/components/compare/discount-badge";
import { ActivationFeeDisplay } from "@/components/compare/activation-fee-display";
import { EvalTypeBadge } from "@/components/compare/eval-type-badge";
import { SavePlanButton } from "@/components/user/save-plan-button";
import { FirmLogo } from "@/components/ui/firm-logo";
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

type ComparePlanDetailsProps = {
  plan: PlanSummary;
};

function Stat({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-[11px] tracking-wider text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm tabular-nums">{children}</dd>
    </div>
  );
}

export function ComparePlanDetails({ plan }: ComparePlanDetailsProps) {
  const hasDiscount = plan.pricing.savings > 0;

  return (
    <div className="p-5 sm:p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <FirmLogo
            name={plan.firm.name}
            slug={plan.firm.slug}
            logoUrl={plan.firm.logoUrl}
            size="md"
          />
          <div>
            <p className="font-mono text-[10px] tracking-wider text-accent uppercase">
              Full breakdown
            </p>
            <p className="font-medium">{plan.firm.name}</p>
            <p className="text-sm text-muted-foreground">
              {plan.name} · {formatAccountSize(plan.accountSize)}
            </p>
          </div>
        </div>
        <div
          className="shrink-0"
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
        >
          <SavePlanButton planId={plan.id} />
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
        <Stat label="Draw down type">
          {getDrawdownTypeLabel(plan.drawdownType) ?? "—"}
        </Stat>
        <Stat label="Target goal">
          {formatOptionalCurrency(plan.profitTarget)}
        </Stat>
        <Stat label="Daily draw down">
          {formatOptionalCurrency(plan.dailyDrawdown)}
        </Stat>
        <Stat label="Max draw down">
          {formatOptionalCurrency(plan.maxDrawdown)}
        </Stat>
        <Stat label="Minimum days">
          {formatMinimumDays(plan.minimumDays)}
        </Stat>
        <Stat label="Eval price">
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
        </Stat>
        <Stat label="Activation">
          <ActivationFeeDisplay plan={plan} />
        </Stat>
        <Stat label="All-in cost">
          <span className="font-semibold text-primary">
            <CalculatedValue tooltip={getAllInCostTooltip(plan)}>
              {formatCurrency(plan.pricing.allInCost)}
            </CalculatedValue>
          </span>
        </Stat>
        <Stat label="Return multiple">
          <CalculatedValue tooltip={getReturnMultipleTooltip(plan)}>
            {formatReturnMultiple(plan.pricing.returnMultiple)}
          </CalculatedValue>
        </Stat>
      </dl>

      <div className="compare-funded-panel mt-5 pt-5">
        <p className="compare-funded-panel-label">After funding</p>
        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
          <Stat label="Min days to payout">
            {formatMinimumDays(plan.minimumDaysToPayout)}
          </Stat>
          <Stat label="Min target buffer">
            {formatOptionalCurrency(plan.minimumTargetGoalCushion)}
          </Stat>
          <Stat label="All-in target">
            <CalculatedValue tooltip={getAllInTargetTooltip(plan)}>
              {formatOptionalCurrency(
                getAllInTarget(plan.profitTarget, plan.minimumTargetGoalCushion),
              )}
            </CalculatedValue>
          </Stat>
          <Stat label="Max payout">
            {formatOptionalCurrency(plan.maxPayout)}
          </Stat>
          <Stat label="Risk ratio">
            <CalculatedValue tooltip={getRiskRatioTooltip(plan)}>
              {formatReturnMultiple(
                getRiskRatio(
                  plan.maxDrawdown,
                  plan.profitTarget,
                  plan.minimumTargetGoalCushion,
                ),
              )}
            </CalculatedValue>
          </Stat>
          <Stat label="Reward ratio">
            <CalculatedValue tooltip={getRewardRatioTooltip(plan)}>
              {formatReturnMultiple(
                getRewardRatio(
                  plan.maxPayout,
                  plan.profitTarget,
                  plan.minimumTargetGoalCushion,
                ),
              )}
            </CalculatedValue>
          </Stat>
          <Stat label="Max funded">
            {formatOptionalCount(plan.maxFundedAccounts)}
          </Stat>
          <Stat label="Split %">{formatProfitSplit(plan.profitSplit)}</Stat>
          <Stat label="Funded draw down">
            {getDrawdownTypeLabel(plan.fundedDrawdownType) ?? "—"}
          </Stat>
        </dl>
      </div>

      {plan.discount ? (
        <div
          className="mt-4 border-t border-border pt-4"
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
        >
          <DiscountBadge discount={plan.discount} />
        </div>
      ) : null}

      <p className="mt-4 font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
        Click anywhere to collapse
      </p>
    </div>
  );
}

export function ComparePlanSummary({ plan }: ComparePlanDetailsProps) {
  const hasDiscount = plan.pricing.savings > 0;

  return (
    <div className="flex min-h-[220px] flex-col p-5 sm:min-h-[240px] sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <FirmLogo
            name={plan.firm.name}
            slug={plan.firm.slug}
            logoUrl={plan.firm.logoUrl}
            size="lg"
          />
          <div className="min-w-0">
            <p className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
              #{plan.firm.rankPosition ?? "—"} · {plan.firm.name}
            </p>
            <h3 className="mt-1 text-lg leading-snug font-light">{plan.name}</h3>
            <p className="text-sm text-muted-foreground">
              {formatAccountSize(plan.accountSize)}
            </p>
          </div>
        </div>
        <EvalTypeBadge evalType={plan.evalType} />
      </div>

      <div className="mt-auto space-y-3 pt-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] tracking-wider text-muted-foreground uppercase">
              All-in cost
            </p>
            <p className="text-2xl font-light text-primary tabular-nums">
              <CalculatedValue tooltip={getAllInCostTooltip(plan)}>
                {formatCurrency(plan.pricing.allInCost)}
              </CalculatedValue>
            </p>
            {hasDiscount ? (
              <p className="mt-0.5 text-xs text-muted-foreground">
                <span className="line-through">
                  {formatCurrency(plan.pricing.evalPrice)}
                </span>{" "}
                after discount
              </p>
            ) : null}
          </div>
          <div className="text-right">
            <p className="text-[11px] tracking-wider text-muted-foreground uppercase">
              Return
            </p>
            <p className="text-lg tabular-nums">
              <CalculatedValue tooltip={getReturnMultipleTooltip(plan)}>
                {formatReturnMultiple(plan.pricing.returnMultiple)}
              </CalculatedValue>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
