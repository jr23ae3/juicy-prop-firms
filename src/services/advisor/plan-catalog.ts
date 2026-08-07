import type { AdvisorInput, PlanCatalogEntry } from "@/types/advisor";
import type { PlanSummary } from "@/types/plan";
import { MARKET_TYPE_LABELS } from "@/lib/plans/market-type";

export function toPlanCatalog(plans: PlanSummary[]): PlanCatalogEntry[] {
  return plans.map((plan) => ({
    id: plan.id,
    firmName: plan.firm.name,
    firmSlug: plan.firm.slug,
    firmRank: plan.firm.rankPosition,
    planName: plan.name,
    accountSize: plan.accountSize,
    marketType: plan.marketType,
    evalType: plan.evalType,
    allInCost: plan.pricing.allInCost,
    returnMultiple: plan.pricing.returnMultiple,
    profitSplit: plan.profitSplit,
    payoutFrequency: plan.payoutFrequency,
    drawdownType: plan.drawdownType,
    discountCode: plan.discount?.code ?? null,
  }));
}

export function filterPlansForAdvisor(
  plans: PlanSummary[],
  input: AdvisorInput,
): PlanSummary[] {
  return plans.filter((plan) => {
    if (plan.marketType !== input.marketType) return false;

    if (plan.pricing.allInCost > input.maxBudget) return false;

    if (
      input.accountSize !== "flexible" &&
      plan.accountSize !== Number(input.accountSize)
    ) {
      return false;
    }

    if (
      input.evalTypePreference !== "any" &&
      plan.evalType !== input.evalTypePreference
    ) {
      return false;
    }

    return true;
  });
}

export function buildAdvisorSummary(input: AdvisorInput, count: number): string {
  const marketLabel = MARKET_TYPE_LABELS[input.marketType].toLowerCase();
  const sizeLabel =
    input.accountSize === "flexible"
      ? "flexible account sizes"
      : `$${Number(input.accountSize) / 1000}K accounts`;

  return `Based on your ${marketLabel} preferences as a ${input.experienceLevel} ${input.tradingStyle} prioritizing ${input.priority}, we found ${count} matching plan${count === 1 ? "" : "s"} within your $${input.maxBudget} budget for ${sizeLabel}.`;
}
