import { roundRatio } from "@/lib/decimal";

export function getAllInTarget(
  profitTarget: number | null | undefined,
  minimumTargetGoalCushion: number | null | undefined,
): number | null {
  if (profitTarget == null || profitTarget <= 0) return null;
  if (minimumTargetGoalCushion == null || minimumTargetGoalCushion <= 0) {
    return null;
  }

  return profitTarget + minimumTargetGoalCushion;
}

/** Max payout divided by all-in target (target goal + min target buffer). */
export function getRiskRatio(
  maxPayout: number | null | undefined,
  profitTarget: number | null | undefined,
  minimumTargetGoalCushion: number | null | undefined,
): number | null {
  const allInTarget = getAllInTarget(profitTarget, minimumTargetGoalCushion);
  if (allInTarget == null || maxPayout == null || maxPayout <= 0) {
    return null;
  }

  return roundRatio(maxPayout / allInTarget);
}
