import type { CompareFilters } from "@/types/compare";
import type { PlanSummary } from "@/types/plan";

export function filterPlansByBudget(
  plans: PlanSummary[],
  maxBudget?: number,
): PlanSummary[] {
  if (!maxBudget) return plans;
  return plans.filter((plan) => plan.pricing.allInCost <= maxBudget);
}

export function parseCompareFiltersFromSearchParams(
  params: URLSearchParams,
): CompareFilters {
  const sort = params.get("sort");
  const direction = params.get("direction");

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
    sort:
      sort === "allInCost" ||
      sort === "returnMultiple" ||
      sort === "accountSize" ||
      sort === "firmRank"
        ? sort
        : undefined,
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

  const query = params.toString();
  return query ? `?${query}` : "";
}
