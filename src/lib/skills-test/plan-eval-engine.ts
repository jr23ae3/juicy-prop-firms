import type { DrawdownType } from "@/generated/prisma/client";

import { getAllInTarget } from "@/lib/plans/metrics";
import { DRAWDOWN_TYPE_FULL_LABELS } from "@/lib/plans/labels";
import type { FuturesReplaySymbol } from "@/lib/skills-test/futures-symbols";
import type { PlanSummary } from "@/types/plan";
import type { TradeOutcome } from "@/lib/skills-test/trade-scenarios";

const TICK_VALUES: Record<FuturesReplaySymbol, number> = {
  ES: 12.5,
  MES: 1.25,
  NQ: 5,
  MNQ: 0.5,
};

export type PlanEvalProfile = {
  planId: string;
  planName: string;
  firmName: string;
  accountSize: number;
  evalType: PlanSummary["evalType"];
  profitTarget: number;
  passTarget: number;
  maxDrawdown: number;
  dailyDrawdown: number | null;
  drawdownType: DrawdownType;
  drawdownLabel: string;
};

export type EvalSessionStatus =
  | "active"
  | "passed"
  | "failed_max_dd"
  | "failed_daily_dd";

export type EvalSessionState = {
  cumulativePnl: number;
  peakPnl: number;
  sessionLowPnl: number;
  tradeCount: number;
  status: EvalSessionStatus;
  failReason: string | null;
  lastTradePnl: number | null;
};

export type EvalProgress = {
  cumulativePnl: number;
  profitTarget: number;
  passTarget: number;
  targetProgress: number;
  drawdownUsed: number;
  maxDrawdown: number;
  drawdownProgress: number;
  drawdownRemaining: number;
  dailyDrawdownUsed: number;
  dailyDrawdownLimit: number | null;
  dailyDrawdownProgress: number | null;
  contracts: number;
};

export function createPlanEvalProfile(
  plan: PlanSummary,
): PlanEvalProfile | null {
  if (plan.profitTarget == null || plan.profitTarget <= 0) return null;
  if (plan.maxDrawdown == null || plan.maxDrawdown <= 0) return null;

  const passTarget =
    getAllInTarget(plan.profitTarget, plan.minimumTargetGoalCushion) ??
    plan.profitTarget;
  const drawdownType = plan.drawdownType ?? "STATIC";

  return {
    planId: plan.id,
    planName: plan.name,
    firmName: plan.firm.name,
    accountSize: plan.accountSize,
    evalType: plan.evalType,
    profitTarget: plan.profitTarget,
    passTarget,
    maxDrawdown: plan.maxDrawdown,
    dailyDrawdown: plan.dailyDrawdown,
    drawdownType,
    drawdownLabel: DRAWDOWN_TYPE_FULL_LABELS[drawdownType],
  };
}

export function createEvalSession(): EvalSessionState {
  return {
    cumulativePnl: 0,
    peakPnl: 0,
    sessionLowPnl: 0,
    tradeCount: 0,
    status: "active",
    failReason: null,
    lastTradePnl: null,
  };
}

export function getPlanContractMultiplier(
  plan: PlanSummary,
  symbol: FuturesReplaySymbol,
): number {
  const tickValue = TICK_VALUES[symbol];
  const typicalStopTicks = 8;
  const typicalStopDollar = typicalStopTicks * tickValue;
  const maxDrawdown = plan.maxDrawdown ?? 2000;
  const riskBudget = maxDrawdown * 0.1;
  return Math.max(
    1,
    Math.min(25, Math.round(riskBudget / Math.max(typicalStopDollar, 1))),
  );
}

export function scaleTradeOutcomeForPlan(
  outcome: TradeOutcome,
  contracts: number,
): TradeOutcome {
  if (contracts <= 1) return outcome;

  const dollarPnl = outcome.dollarPnl * contracts;
  return {
    ...outcome,
    dollarPnl,
    summary: `${outcome.summary.replace(
      `$${outcome.dollarPnl.toFixed(2)}`,
      `$${dollarPnl.toFixed(2)}`,
    )} · ${contracts} contracts`,
  };
}

export function getDrawdownUsed(
  state: EvalSessionState,
  profile: PlanEvalProfile,
): number {
  switch (profile.drawdownType) {
    case "TRAILING":
      return Math.max(0, state.peakPnl - state.cumulativePnl);
    case "END_OF_DAY":
    case "STATIC":
    default:
      return Math.max(0, -state.cumulativePnl);
  }
}

export function getDailyDrawdownUsed(state: EvalSessionState): number {
  return Math.max(0, -state.sessionLowPnl);
}

export function applyTradeToEval(
  state: EvalSessionState,
  profile: PlanEvalProfile,
  scaledDollarPnl: number,
): EvalSessionState {
  if (state.status !== "active") return state;

  const cumulativePnl = state.cumulativePnl + scaledDollarPnl;
  const peakPnl = Math.max(state.peakPnl, cumulativePnl);
  const sessionLowPnl = Math.min(state.sessionLowPnl, cumulativePnl);

  const next: EvalSessionState = {
    ...state,
    cumulativePnl,
    peakPnl,
    sessionLowPnl,
    tradeCount: state.tradeCount + 1,
    lastTradePnl: scaledDollarPnl,
  };

  const draftForChecks = next;

  if (cumulativePnl >= profile.passTarget) {
    return {
      ...next,
      status: "passed",
      failReason: null,
    };
  }

  const drawdownUsed = getDrawdownUsed(draftForChecks, profile);
  if (drawdownUsed >= profile.maxDrawdown) {
    return {
      ...next,
      status: "failed_max_dd",
      failReason: `${profile.drawdownLabel} max drawdown of $${profile.maxDrawdown.toLocaleString()} breached.`,
    };
  }

  if (profile.dailyDrawdown && profile.dailyDrawdown > 0) {
    const dailyUsed = getDailyDrawdownUsed(draftForChecks);
    if (dailyUsed >= profile.dailyDrawdown) {
      return {
        ...next,
        status: "failed_daily_dd",
        failReason: `Daily drawdown limit of $${profile.dailyDrawdown.toLocaleString()} breached.`,
      };
    }
  }

  return next;
}

export function getEvalProgress(
  state: EvalSessionState,
  profile: PlanEvalProfile,
  symbol: FuturesReplaySymbol,
  plan: PlanSummary,
): EvalProgress {
  const contracts = getPlanContractMultiplier(plan, symbol);
  const drawdownUsed = getDrawdownUsed(state, profile);
  const dailyDrawdownUsed = getDailyDrawdownUsed(state);

  return {
    cumulativePnl: state.cumulativePnl,
    profitTarget: profile.profitTarget,
    passTarget: profile.passTarget,
    targetProgress: Math.min(
      100,
      Math.max(0, (state.cumulativePnl / profile.passTarget) * 100),
    ),
    drawdownUsed,
    maxDrawdown: profile.maxDrawdown,
    drawdownProgress: Math.min(
      100,
      Math.max(0, (drawdownUsed / profile.maxDrawdown) * 100),
    ),
    drawdownRemaining: Math.max(0, profile.maxDrawdown - drawdownUsed),
    dailyDrawdownUsed,
    dailyDrawdownLimit: profile.dailyDrawdown,
    dailyDrawdownProgress:
      profile.dailyDrawdown && profile.dailyDrawdown > 0
        ? Math.min(
            100,
            Math.max(0, (dailyDrawdownUsed / profile.dailyDrawdown) * 100),
          )
        : null,
    contracts,
  };
}

export function getEvalLivesFromDrawdown(
  profile: PlanEvalProfile,
  state: EvalSessionState,
  maxLives = 3,
): number {
  const drawdownUsed = getDrawdownUsed(state, profile);
  const remainingRatio = Math.max(
    0,
    1 - drawdownUsed / profile.maxDrawdown,
  );
  return Math.max(0, Math.ceil(remainingRatio * maxLives));
}

export function formatEvalMoney(value: number) {
  const prefix = value >= 0 ? "+$" : "-$";
  return `${prefix}${Math.abs(value).toLocaleString(undefined, {
    maximumFractionDigits: 0,
  })}`;
}
