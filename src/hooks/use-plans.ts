"use client";

import { useQuery } from "@tanstack/react-query";

import { applyCompareFilters } from "@/lib/plans/filter-plans";
import {
  DEFAULT_MARKET_TYPE,
  marketTypeToParam,
} from "@/lib/plans/market-type";
import { getDefaultSortDirection, sortPlans } from "@/lib/plans/sort-plans";
import type { CompareFilters } from "@/types/compare";
import type { ApiResponse, PlanSummary } from "@/types";

async function fetchPlans(filters: CompareFilters): Promise<PlanSummary[]> {
  const params = new URLSearchParams();

  params.set(
    "market",
    marketTypeToParam(filters.marketType ?? DEFAULT_MARKET_TYPE),
  );
  if (filters.firm) params.set("firm", filters.firm);
  if (filters.evalType) params.set("evalType", filters.evalType);
  if (filters.accountSize) params.set("accountSize", String(filters.accountSize));
  if (filters.search) params.set("q", filters.search);

  const response = await fetch(`/api/plans?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch plans");
  }

  const json = (await response.json()) as ApiResponse<PlanSummary[]>;

  if (!json.success) {
    throw new Error(json.error);
  }

  return json.data;
}

export function usePlans(filters: CompareFilters) {
  const sort = filters.sort ?? "allInCost";
  const direction = filters.direction ?? getDefaultSortDirection(sort);

  return useQuery({
    queryKey: ["plans", filters],
    queryFn: () => fetchPlans(filters),
    select: (plans) => {
      const filtered = applyCompareFilters(plans, filters);
      return sortPlans(filtered, sort, direction);
    },
  });
}
