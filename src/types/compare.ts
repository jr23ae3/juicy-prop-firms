import type { DrawdownType, EvalType } from "@/generated/prisma/client";

export type CompareSortField =
  | "firmRank"
  | "firmName"
  | "accountSize"
  | "evalType"
  | "drawdownType"
  | "profitTarget"
  | "dailyDrawdown"
  | "maxDrawdown"
  | "minimumDays"
  | "evalPrice"
  | "activationFee"
  | "allInCost"
  | "daysToPayout"
  | "minimumTargetGoalCushion"
  | "allInTarget"
  | "maxPayout"
  | "riskRatio"
  | "riskReward"
  | "maxFundedAccounts"
  | "fundedDrawdownType"
  | "profitSplit"
  | "returnMultiple";

export type CompareSortDirection = "asc" | "desc";

export type CompareFilters = {
  firm?: string;
  evalType?: EvalType;
  accountSize?: number;
  maxBudget?: number;
  search?: string;
  drawdownType?: DrawdownType;
  minProfitSplit?: number;
  maxDaysToPayout?: number;
  minMaxPayout?: number;
  sort?: CompareSortField;
  direction?: CompareSortDirection;
};

export type CompareFilterMetadata = {
  firms: { slug: string; name: string; rankPosition: number | null }[];
  accountSizes: number[];
  evalTypes: EvalType[];
  drawdownTypes: DrawdownType[];
};
