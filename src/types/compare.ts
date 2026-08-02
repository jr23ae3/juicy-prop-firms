import type { DrawdownType, EvalType } from "@/generated/prisma/client";

export type CompareSortField =
  | "allInCost"
  | "returnMultiple"
  | "accountSize"
  | "firmRank"
  | "maxPayout"
  | "profitSplit"
  | "daysToPayout";

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
