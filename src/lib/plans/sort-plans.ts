import type { DrawdownType, EvalType } from "@/generated/prisma/client";

import {
  DRAWDOWN_TYPE_FULL_LABELS,
  EVAL_TYPE_LABELS,
} from "@/lib/plans/labels";
import { getAllInTarget, getRiskRatio } from "@/lib/plans/metrics";
import type { CompareSortDirection, CompareSortField } from "@/types/compare";
import type { PlanSummary } from "@/types/plan";

const DEFAULT_SORT: CompareSortField = "allInCost";
const DEFAULT_DIRECTION: CompareSortDirection = "asc";

function compareNumbers(
  a: number | null | undefined,
  b: number | null | undefined,
) {
  const av = a ?? Number.POSITIVE_INFINITY;
  const bv = b ?? Number.POSITIVE_INFINITY;
  return av - bv;
}

function compareStrings(a: string | null | undefined, b: string | null | undefined) {
  return (a ?? "").localeCompare(b ?? "", undefined, { sensitivity: "base" });
}

function compareEvalType(a: EvalType, b: EvalType) {
  return compareStrings(EVAL_TYPE_LABELS[a], EVAL_TYPE_LABELS[b]);
}

function compareDrawdownType(a: DrawdownType | null, b: DrawdownType | null) {
  const av = a ? DRAWDOWN_TYPE_FULL_LABELS[a] : "";
  const bv = b ? DRAWDOWN_TYPE_FULL_LABELS[b] : "";
  return compareStrings(av, bv);
}

export function sortPlans(
  plans: PlanSummary[],
  sort: CompareSortField = DEFAULT_SORT,
  direction: CompareSortDirection = DEFAULT_DIRECTION,
): PlanSummary[] {
  const sorted = [...plans].sort((a, b) => {
    switch (sort) {
      case "firmRank":
        return compareNumbers(a.firm.rankPosition, b.firm.rankPosition);
      case "firmName":
        return compareStrings(a.firm.name, b.firm.name);
      case "accountSize":
        return a.accountSize - b.accountSize;
      case "evalType":
        return compareEvalType(a.evalType, b.evalType);
      case "drawdownType":
        return compareDrawdownType(a.drawdownType, b.drawdownType);
      case "profitTarget":
        return compareNumbers(a.profitTarget, b.profitTarget);
      case "dailyDrawdown":
        return compareNumbers(a.dailyDrawdown, b.dailyDrawdown);
      case "maxDrawdown":
        return compareNumbers(a.maxDrawdown, b.maxDrawdown);
      case "minimumDays":
        return compareNumbers(a.minimumDays, b.minimumDays);
      case "evalPrice":
        return (
          a.pricing.discountedPrice - b.pricing.discountedPrice ||
          compareStrings(a.name, b.name)
        );
      case "activationFee":
        return compareNumbers(a.pricing.activationFee, b.pricing.activationFee);
      case "allInCost":
        return a.pricing.allInCost - b.pricing.allInCost;
      case "daysToPayout":
        return compareNumbers(a.minimumDaysToPayout, b.minimumDaysToPayout);
      case "minimumTargetGoalCushion":
        return compareNumbers(
          a.minimumTargetGoalCushion,
          b.minimumTargetGoalCushion,
        );
      case "allInTarget":
        return compareNumbers(
          getAllInTarget(a.profitTarget, a.minimumTargetGoalCushion),
          getAllInTarget(b.profitTarget, b.minimumTargetGoalCushion),
        );
      case "maxPayout":
        return compareNumbers(a.maxPayout, b.maxPayout);
      case "riskRatio":
        return compareNumbers(
          getRiskRatio(
            a.maxPayout,
            a.profitTarget,
            a.minimumTargetGoalCushion,
          ),
          getRiskRatio(
            b.maxPayout,
            b.profitTarget,
            b.minimumTargetGoalCushion,
          ),
        );
      case "maxFundedAccounts":
        return compareNumbers(a.maxFundedAccounts, b.maxFundedAccounts);
      case "fundedDrawdownType":
        return compareDrawdownType(a.fundedDrawdownType, b.fundedDrawdownType);
      case "profitSplit":
        return compareNumbers(a.profitSplit, b.profitSplit);
      case "returnMultiple":
        return compareNumbers(a.pricing.returnMultiple, b.pricing.returnMultiple);
      default:
        return 0;
    }
  });

  if (direction === "desc") {
    sorted.reverse();
  }

  return sorted;
}

const DESC_DEFAULT_FIELDS = new Set<CompareSortField>([
  "returnMultiple",
  "maxPayout",
  "profitSplit",
  "maxFundedAccounts",
  "profitTarget",
  "minimumTargetGoalCushion",
  "allInTarget",
  "riskRatio",
]);

export function getDefaultSortDirection(
  sort: CompareSortField,
): CompareSortDirection {
  return DESC_DEFAULT_FIELDS.has(sort) ? "desc" : "asc";
}

export function toggleSortDirection(
  sort: CompareSortField,
  currentDirection?: CompareSortDirection,
): CompareSortDirection {
  if (currentDirection) {
    return currentDirection === "asc" ? "desc" : "asc";
  }

  return getDefaultSortDirection(sort);
}
