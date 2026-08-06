import type { ReactNode } from "react";

import {
  CalculationTooltipBody,
} from "@/components/ui/calculation-tooltip";
import { calculateNetPayout } from "@/lib/calculations";
import {
  formatCurrency,
  formatPercent,
  formatReturnMultiple,
} from "@/lib/format";
import {
  getAllInTarget,
  getRiskRatio,
  getRiskReward,
} from "@/lib/plans/metrics";
import type { PlanSummary } from "@/types/plan";

export function getAllInTargetTooltip(plan: PlanSummary): ReactNode | null {
  const { profitTarget, minimumTargetGoalCushion } = plan;
  const result = getAllInTarget(profitTarget, minimumTargetGoalCushion);

  if (
    result == null ||
    profitTarget == null ||
    minimumTargetGoalCushion == null
  ) {
    return null;
  }

  return (
    <CalculationTooltipBody
      title="All-in Target"
      expression={
        <>
          {formatCurrency(profitTarget)} + {formatCurrency(minimumTargetGoalCushion)}{" "}
          = {formatCurrency(result)}
        </>
      }
    />
  );
}

export function getRiskRatioTooltip(plan: PlanSummary): ReactNode | null {
  const allInTarget = getAllInTarget(
    plan.profitTarget,
    plan.minimumTargetGoalCushion,
  );
  const ratio = getRiskRatio(
    plan.maxDrawdown,
    plan.profitTarget,
    plan.minimumTargetGoalCushion,
  );

  if (allInTarget == null || plan.maxDrawdown == null || ratio == null) {
    return null;
  }

  return (
    <CalculationTooltipBody
      title="Risk Ratio"
      expression={
        <>
          {formatCurrency(allInTarget)} ÷ {formatCurrency(plan.maxDrawdown)} ={" "}
          {formatReturnMultiple(ratio)}
        </>
      }
    />
  );
}

export function getRiskRewardTooltip(plan: PlanSummary): ReactNode | null {
  const allInTarget = getAllInTarget(
    plan.profitTarget,
    plan.minimumTargetGoalCushion,
  );
  const reward = getRiskReward(
    plan.maxPayout,
    plan.profitTarget,
    plan.minimumTargetGoalCushion,
  );

  if (allInTarget == null || plan.maxPayout == null || reward == null) {
    return null;
  }

  return (
    <CalculationTooltipBody
      title="Risk Reward"
      expression={
        <>
          {formatCurrency(plan.maxPayout)} ÷ {formatCurrency(allInTarget)} ={" "}
          {formatReturnMultiple(reward)}
        </>
      }
    />
  );
}

export function getAllInCostTooltip(plan: PlanSummary): ReactNode | null {
  const {
    discountedPrice,
    effectiveActivationFee,
    allInCost,
    activationFeeWaived,
  } = plan.pricing;

  return (
    <CalculationTooltipBody
      title="All-in Cost"
      expression={
        <>
          {formatCurrency(discountedPrice)} eval +{" "}
          {formatCurrency(effectiveActivationFee)} activation ={" "}
          {formatCurrency(allInCost)}
        </>
      }
      note={
        activationFeeWaived ? "Activation fee waived by discount." : undefined
      }
    />
  );
}

export function getReturnMultipleTooltip(plan: PlanSummary): ReactNode | null {
  const { allInCost, returnMultiple, netPayout } = plan.pricing;

  if (returnMultiple == null || netPayout == null) {
    return null;
  }

  const rawNet =
    plan.maxPayout != null && plan.profitSplit != null
      ? plan.maxPayout * plan.profitSplit
      : null;
  const cappedNet = calculateNetPayout(
    plan.maxPayout,
    plan.profitSplit,
    plan.accountSize,
  );
  const isCapped =
    rawNet != null && cappedNet != null && cappedNet < rawNet - 0.005;

  return (
    <CalculationTooltipBody
      title="Return"
      expression={
        <>
          {formatCurrency(netPayout)} net payout ÷ {formatCurrency(allInCost)}{" "}
          all-in = {formatReturnMultiple(returnMultiple)}
        </>
      }
      note={
        isCapped && plan.maxPayout != null && plan.profitSplit != null ? (
          <>
            Net payout uses {formatCurrency(plan.maxPayout)} max payout ×{" "}
            {formatPercent(plan.profitSplit)}, capped for account size.
          </>
        ) : undefined
      }
    />
  );
}
