import type { CompareSortDirection, CompareSortField } from "@/types/compare";
import type { PlanSummary } from "@/types/plan";

const DEFAULT_SORT: CompareSortField = "allInCost";
const DEFAULT_DIRECTION: CompareSortDirection = "asc";

export function sortPlans(
  plans: PlanSummary[],
  sort: CompareSortField = DEFAULT_SORT,
  direction: CompareSortDirection = DEFAULT_DIRECTION,
): PlanSummary[] {
  const sorted = [...plans].sort((a, b) => {
    switch (sort) {
      case "allInCost":
        return a.pricing.allInCost - b.pricing.allInCost;
      case "returnMultiple":
        return (
          (a.pricing.returnMultiple ?? -1) -
          (b.pricing.returnMultiple ?? -1)
        );
      case "accountSize":
        return a.accountSize - b.accountSize;
      case "firmRank":
        return (
          (a.firm.rankPosition ?? 999) - (b.firm.rankPosition ?? 999)
        );
      default:
        return 0;
    }
  });

  if (direction === "desc") {
    sorted.reverse();
  }

  return sorted;
}

export function getDefaultSortDirection(
  sort: CompareSortField,
): CompareSortDirection {
  if (sort === "returnMultiple") return "desc";
  return "asc";
}
