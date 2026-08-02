import type { AdvisorInput, PlanCatalogEntry } from "@/types/advisor";
import type { PlanSummary } from "@/types/plan";

export function toPlanCatalog(plans: PlanSummary[]): PlanCatalogEntry[] {
  return plans.map((plan) => ({
    id: plan.id,
    firmName: plan.firm.name,
    firmSlug: plan.firm.slug,
    firmRank: plan.firm.rankPosition,
    planName: plan.name,
    accountSize: plan.accountSize,
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
  const sizeLabel =
    input.accountSize === "flexible"
      ? "flexible account sizes"
      : `$${Number(input.accountSize) / 1000}K accounts`;

  return `Based on your preferences as a ${input.experienceLevel} ${input.tradingStyle} prioritizing ${input.priority}, we found ${count} matching plan${count === 1 ? "" : "s"} within your $${input.maxBudget} budget for ${sizeLabel}.`;
}
