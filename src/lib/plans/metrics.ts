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
