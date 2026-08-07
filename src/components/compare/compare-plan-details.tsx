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
import { cn } from "@/lib/utils";

type ComparePlanDetailsProps = {
  plan: PlanSummary;
};

function ArcadeChrome({
  title,
  badge,
}: {
  title: string;
  badge?: React.ReactNode;
}) {
  return (
    <div className="plan-card-arcade-chrome">
      <div className="flex min-w-0 items-center gap-2">
        <div className="plan-card-arcade-dots" aria-hidden>
          <span />
          <span />
          <span />
        </div>
        <span className="plan-card-arcade-chrome-title truncate">{title}</span>
      </div>
      {badge}
    </div>
  );
}

function Stat({
  label,
  children,
  highlight,
}: {
  label: string;
  children: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "plan-card-arcade-stat",
        highlight && "plan-card-arcade-stat--highlight",
      )}
    >
      <dt className="plan-card-arcade-stat-label">{label}</dt>
      <dd className="plan-card-arcade-stat-value">{children}</dd>
    </div>
  );
}

export function ComparePlanDetails({ plan }: ComparePlanDetailsProps) {
  const hasDiscount = plan.pricing.savings > 0;

  return (
    <div className="plan-card-arcade">
      <ArcadeChrome
        title="STAGE 2 · FULL STATS"
        badge={<EvalTypeBadge evalType={plan.evalType} variant="arcade" />}
      />

      <div className="plan-card-arcade-body p-4 sm:p-5">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="plan-card-arcade-logo-wrap">
              <FirmLogo
                name={plan.firm.name}
                slug={plan.firm.slug}
                logoUrl={plan.firm.logoUrl}
                size="md"
              />
            </div>
            <div>
              <p className="plan-card-arcade-rank">
                RANK #{plan.firm.rankPosition ?? "—"}
              </p>
              <p className="font-mono text-sm font-medium">{plan.firm.name}</p>
              <p className="font-mono text-xs text-muted-foreground">
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

        <dl className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <Stat label="Draw down">
            {getDrawdownTypeLabel(plan.drawdownType) ?? "—"}
          </Stat>
          <Stat label="Target">
            {formatOptionalCurrency(plan.profitTarget)}
          </Stat>
          <Stat label="Daily DD">
            {formatOptionalCurrency(plan.dailyDrawdown)}
          </Stat>
          <Stat label="Max DD">
            {formatOptionalCurrency(plan.maxDrawdown)}
          </Stat>
          <Stat label="Min days">
            {formatMinimumDays(plan.minimumDays)}
          </Stat>
          <Stat label="Eval $">
            {hasDiscount ? (
              <>
                <span className="mr-1 text-muted-foreground line-through">
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
          <Stat label="All-in" highlight>
            <CalculatedValue tooltip={getAllInCostTooltip(plan)}>
              {formatCurrency(plan.pricing.allInCost)}
            </CalculatedValue>
          </Stat>
          <Stat label="Return">
            <CalculatedValue tooltip={getReturnMultipleTooltip(plan)}>
              {formatReturnMultiple(plan.pricing.returnMultiple)}
            </CalculatedValue>
          </Stat>
        </dl>

        <div className="compare-funded-panel mt-5 pt-4">
          <p className="compare-funded-panel-label">★ BONUS ROUND ★</p>
          <dl className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            <Stat label="Payout days">
              {formatMinimumDays(plan.minimumDaysToPayout)}
            </Stat>
            <Stat label="Target buf">
              {formatOptionalCurrency(plan.minimumTargetGoalCushion)}
            </Stat>
            <Stat label="All-in tgt">
              <CalculatedValue tooltip={getAllInTargetTooltip(plan)}>
                {formatOptionalCurrency(
                  getAllInTarget(plan.profitTarget, plan.minimumTargetGoalCushion),
                )}
              </CalculatedValue>
            </Stat>
            <Stat label="Max pay">
              {formatOptionalCurrency(plan.maxPayout)}
            </Stat>
            <Stat label="Risk x">
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
            <Stat label="Reward x">
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
            <Stat label="Max accts">
              {formatOptionalCount(plan.maxFundedAccounts)}
            </Stat>
            <Stat label="Split">
              {formatProfitSplit(plan.profitSplit)}
            </Stat>
            <Stat label="Funded DD">
              {getDrawdownTypeLabel(plan.fundedDrawdownType) ?? "—"}
            </Stat>
          </dl>
        </div>

        {plan.discount ? (
          <div
            className="plan-card-arcade-promo mt-4"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
          >
            <p className="plan-card-arcade-stat-label mb-2">POWER-UP CODE</p>
            <DiscountBadge discount={plan.discount} />
          </div>
        ) : null}

        <p className="plan-card-arcade-footer mt-4">▼ PRESS TO CLOSE</p>
      </div>
    </div>
  );
}

export function ComparePlanSummary({ plan }: ComparePlanDetailsProps) {
  const hasDiscount = plan.pricing.savings > 0;
  const rankLabel = plan.firm.rankPosition
    ? String(plan.firm.rankPosition).padStart(2, "0")
    : "—";

  return (
    <div className="plan-card-arcade flex min-h-[280px] flex-col">
      <ArcadeChrome
        title={`HIGH SCORE · #${rankLabel}`}
        badge={<EvalTypeBadge evalType={plan.evalType} variant="arcade" />}
      />

      <div className="plan-card-arcade-body flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="plan-card-arcade-logo-wrap">
            <FirmLogo
              name={plan.firm.name}
              slug={plan.firm.slug}
              logoUrl={plan.firm.logoUrl}
              size="lg"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="plan-card-arcade-rank">{plan.firm.name}</p>
            <h3 className="plan-card-arcade-name">{plan.name}</h3>
            <p className="mt-1 font-mono text-xs text-accent">
              {formatAccountSize(plan.accountSize)} ACCOUNT
            </p>
          </div>
        </div>

        {hasDiscount ? (
          <p className="plan-card-arcade-promo-tag mt-3">★ DISCOUNT ACTIVE ★</p>
        ) : null}

        <div className="mt-auto grid grid-cols-2 gap-2 pt-6">
          <div className="plan-card-metric plan-card-metric--coins">
            <p className="plan-card-arcade-metric-label">COINS</p>
            <p className="plan-card-arcade-metric-value plan-card-arcade-metric-value--primary">
              <CalculatedValue tooltip={getAllInCostTooltip(plan)}>
                {formatCurrency(plan.pricing.allInCost)}
              </CalculatedValue>
            </p>
            {hasDiscount ? (
              <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                <span className="line-through">
                  {formatCurrency(plan.pricing.evalPrice)}
                </span>
              </p>
            ) : null}
          </div>
          <div className="plan-card-metric plan-card-metric--score text-right">
            <p className="plan-card-arcade-metric-label">MULT</p>
            <p className="plan-card-arcade-metric-value plan-card-arcade-metric-value--accent">
              <CalculatedValue tooltip={getReturnMultipleTooltip(plan)}>
                {formatReturnMultiple(plan.pricing.returnMultiple)}
              </CalculatedValue>
            </p>
          </div>
        </div>

        <div className="plan-card-arcade-life mt-3" aria-hidden>
          <span style={{ width: "72%" }} />
        </div>
      </div>
    </div>
  );
}
