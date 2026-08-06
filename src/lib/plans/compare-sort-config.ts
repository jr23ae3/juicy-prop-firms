import type { CompareSortField } from "@/types/compare";

export const COMPARE_SORT_FIELDS = [
  "firmRank",
  "firmName",
  "accountSize",
  "evalType",
  "drawdownType",
  "profitTarget",
  "dailyDrawdown",
  "maxDrawdown",
  "minimumDays",
  "evalPrice",
  "activationFee",
  "allInCost",
  "daysToPayout",
  "minimumTargetGoalCushion",
  "allInTarget",
  "maxPayout",
  "riskRatio",
  "riskReward",
  "maxFundedAccounts",
  "fundedDrawdownType",
  "profitSplit",
  "returnMultiple",
] as const satisfies readonly CompareSortField[];

export function isCompareSortField(value: string | null): value is CompareSortField {
  return COMPARE_SORT_FIELDS.includes(value as CompareSortField);
}
