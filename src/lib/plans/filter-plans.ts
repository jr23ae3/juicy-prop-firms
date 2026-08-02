import type { DrawdownType } from "@/generated/prisma/client";

import type { CompareFilters } from "@/types/compare";
import type { PlanSummary } from "@/types/plan";

import { isCompareSortField } from "@/lib/plans/compare-sort-config";

export function filterPlansByBudget(
  plans: PlanSummary[],
  maxBudget?: number,
): PlanSummary[] {
  if (!maxBudget) return plans;
  return plans.filter((plan) => plan.pricing.allInCost <= maxBudget);
}

export function filterPlansByDrawdownType(
  plans: PlanSummary[],
  drawdownType?: DrawdownType,
): PlanSummary[] {
  if (!drawdownType) return plans;
  return plans.filter((plan) => plan.drawdownType === drawdownType);
}

export function filterPlansByMinProfitSplit(
  plans: PlanSummary[],
  minProfitSplit?: number,
): PlanSummary[] {
  if (!minProfitSplit) return plans;
  return plans.filter(
    (plan) => plan.profitSplit != null && plan.profitSplit >= minProfitSplit,
  );
}

export function filterPlansByMaxDaysToPayout(
  plans: PlanSummary[],
  maxDaysToPayout?: number,
): PlanSummary[] {
  if (!maxDaysToPayout) return plans;
  return plans.filter(
    (plan) =>
      plan.minimumDaysToPayout != null &&
      plan.minimumDaysToPayout <= maxDaysToPayout,
  );
}

export function filterPlansByMinMaxPayout(
  plans: PlanSummary[],
  minMaxPayout?: number,
): PlanSummary[] {
  if (!minMaxPayout) return plans;
  return plans.filter(
    (plan) => plan.maxPayout != null && plan.maxPayout >= minMaxPayout,
  );
}

export function applyCompareFilters(
  plans: PlanSummary[],
  filters: CompareFilters,
): PlanSummary[] {
  return filterPlansByMinMaxPayout(
    filterPlansByMaxDaysToPayout(
      filterPlansByMinProfitSplit(
        filterPlansByDrawdownType(
          filterPlansByBudget(plans, filters.maxBudget),
          filters.drawdownType,
        ),
        filters.minProfitSplit,
      ),
      filters.maxDaysToPayout,
    ),
    filters.minMaxPayout,
  );
}

export function parseCompareFiltersFromSearchParams(
  params: URLSearchParams,
): CompareFilters {
  const sort = params.get("sort");
  const direction = params.get("direction");
  const drawdownType = params.get("drawdownType");

  return {
    firm: params.get("firm") || undefined,
    evalType: (params.get("evalType") as CompareFilters["evalType"]) || undefined,
    accountSize: params.get("accountSize")
      ? Number(params.get("accountSize"))
      : undefined,
    maxBudget: params.get("maxBudget")
      ? Number(params.get("maxBudget"))
      : undefined,
    search: params.get("q") || undefined,
    drawdownType:
      drawdownType === "END_OF_DAY" ||
      drawdownType === "TRAILING" ||
      drawdownType === "STATIC"
        ? drawdownType
        : undefined,
    minProfitSplit: params.get("minProfitSplit")
      ? Number(params.get("minProfitSplit"))
      : undefined,
    maxDaysToPayout: params.get("maxDaysToPayout")
      ? Number(params.get("maxDaysToPayout"))
      : undefined,
    minMaxPayout: params.get("minMaxPayout")
      ? Number(params.get("minMaxPayout"))
      : undefined,
    sort: isCompareSortField(sort) ? sort : undefined,
    direction: direction === "asc" || direction === "desc" ? direction : undefined,
  };
}

export function buildPlansQueryString(filters: CompareFilters): string {
  const params = new URLSearchParams();

  if (filters.firm) params.set("firm", filters.firm);
  if (filters.evalType) params.set("evalType", filters.evalType);
  if (filters.accountSize) params.set("accountSize", String(filters.accountSize));
  if (filters.maxBudget) params.set("maxBudget", String(filters.maxBudget));
  if (filters.search) params.set("q", filters.search);
  if (filters.drawdownType) params.set("drawdownType", filters.drawdownType);
  if (filters.minProfitSplit) {
    params.set("minProfitSplit", String(filters.minProfitSplit));
  }
  if (filters.maxDaysToPayout) {
    params.set("maxDaysToPayout", String(filters.maxDaysToPayout));
  }
  if (filters.minMaxPayout) {
    params.set("minMaxPayout", String(filters.minMaxPayout));
  }

  const query = params.toString();
  return query ? `?${query}` : "";
}
