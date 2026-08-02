import type { DrawdownType, EvalType } from "@/generated/prisma/client";

export const EVAL_TYPE_LABELS: Record<EvalType, string> = {
  CHALLENGE: "Challenge",
  DIRECT_TO_FUNDED: "Direct to Funded",
  INSTANT_FUNDING: "Instant Funding",
};

export const DRAWDOWN_TYPE_LABELS: Record<DrawdownType, string> = {
  END_OF_DAY: "EOD",
  TRAILING: "Trailing",
  STATIC: "Static",
};

export const DRAWDOWN_TYPE_FULL_LABELS: Record<DrawdownType, string> = {
  END_OF_DAY: "End of Day",
  TRAILING: "Trailing",
  STATIC: "Static",
};

export function getEvalTypeLabel(evalType: EvalType) {
  return EVAL_TYPE_LABELS[evalType];
}

export function getDrawdownLabel(drawdownType: DrawdownType | null) {
  if (!drawdownType) return null;
  return DRAWDOWN_TYPE_LABELS[drawdownType];
}

export function getDrawdownTypeLabel(drawdownType: DrawdownType | null) {
  if (!drawdownType) return null;
  return DRAWDOWN_TYPE_FULL_LABELS[drawdownType];
}
