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
      case "maxPayout":
        return (a.maxPayout ?? -1) - (b.maxPayout ?? -1);
      case "profitSplit":
        return (a.profitSplit ?? -1) - (b.profitSplit ?? -1);
      case "daysToPayout":
        return (
          (a.minimumDaysToPayout ?? 999) - (b.minimumDaysToPayout ?? 999)
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
  if (sort === "returnMultiple" || sort === "maxPayout" || sort === "profitSplit") {
    return "desc";
  }
  return "asc";
}
