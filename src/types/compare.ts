import type { EvalType } from "@/generated/prisma/client";

export type CompareSortField =
  | "allInCost"
  | "returnMultiple"
  | "accountSize"
  | "firmRank";

export type CompareSortDirection = "asc" | "desc";

export type CompareFilters = {
  firm?: string;
  evalType?: EvalType;
  accountSize?: number;
  maxBudget?: number;
  search?: string;
  sort?: CompareSortField;
  direction?: CompareSortDirection;
};

export type CompareFilterMetadata = {
  firms: { slug: string; name: string; rankPosition: number | null }[];
  accountSizes: number[];
  evalTypes: EvalType[];
};
