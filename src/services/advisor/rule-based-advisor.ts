import type { AdvisorInput, AdvisorRecommendation } from "@/types/advisor";
import type { PlanSummary } from "@/types/plan";

function scorePlan(plan: PlanSummary, input: AdvisorInput): number {
  let score = 0;

  switch (input.priority) {
    case "affordability":
      score += Math.max(0, 100 - plan.pricing.allInCost / 5);
      score += plan.pricing.savings > 0 ? 10 : 0;
      break;
    case "payouts":
      score += (plan.pricing.returnMultiple ?? 0) * 20;
      score += (plan.profitSplit ?? 0) * 30;
      if (plan.payoutFrequency?.toLowerCase().includes("daily")) score += 15;
      break;
    case "rules":
      if (plan.drawdownType === "END_OF_DAY") score += 25;
      if (plan.drawdownType === "STATIC") score += 15;
      if (plan.evalType === "DIRECT_TO_FUNDED") score += 10;
      break;
    case "platform":
      score += Math.max(0, 100 - (plan.firm.rankPosition ?? 10) * 8);
      break;
  }

  score += Math.max(0, 100 - (plan.firm.rankPosition ?? 10) * 6);

  if (input.experienceLevel === "beginner") {
    if (plan.evalType === "CHALLENGE") score += 8;
    if (plan.drawdownType === "END_OF_DAY") score += 8;
  }

  if (input.tradingStyle === "scalper" || input.tradingStyle === "day-trader") {
    if (plan.payoutFrequency?.toLowerCase().includes("daily")) score += 10;
  }

  return score;
}

function buildReasoning(plan: PlanSummary, input: AdvisorInput): string {
  const parts: string[] = [];

  parts.push(
    `${plan.firm.name}'s ${plan.name} fits your $${input.maxBudget} budget with a ${plan.pricing.allInCost.toFixed(0)} all-in cost.`,
  );

  if (input.priority === "affordability" && plan.pricing.savings > 0) {
    parts.push(
      `The ${plan.discount?.code ?? "active"} discount saves you $${plan.pricing.savings.toFixed(0)} upfront.`,
    );
  }

  if (input.priority === "payouts" && plan.pricing.returnMultiple) {
    parts.push(
      `Return multiple of ${plan.pricing.returnMultiple.toFixed(1)}x is strong for this account size.`,
    );
  }

  if (plan.firm.rankPosition && plan.firm.rankPosition <= 3) {
    parts.push(
      `Ranked #${plan.firm.rankPosition} on the Juice Index for overall firm quality.`,
    );
  }

  return parts.join(" ");
}

function buildHighlights(plan: PlanSummary): string[] {
  const highlights: string[] = [];

  if (plan.discount?.code) {
    highlights.push(`Code ${plan.discount.code}`);
  }

  highlights.push(`All-in ${plan.pricing.allInCost.toFixed(0)}`);

  if (plan.pricing.returnMultiple) {
    highlights.push(`${plan.pricing.returnMultiple.toFixed(1)}x return`);
  }

  if (plan.payoutFrequency) {
    highlights.push(`${plan.payoutFrequency} payouts`);
  }

  return highlights.slice(0, 4);
}

export function getRuleBasedRecommendations(
  plans: PlanSummary[],
  input: AdvisorInput,
): AdvisorRecommendation[] {
  const scored = plans
    .map((plan) => ({
      plan,
      score: scorePlan(plan, input),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return scored.map(({ plan, score }, index) => ({
    plan,
    rank: index + 1,
    matchScore: Math.min(100, Math.round(score)),
    reasoning: buildReasoning(plan, input),
    highlights: buildHighlights(plan),
  }));
}
