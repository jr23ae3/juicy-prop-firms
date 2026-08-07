import { isOpenAIConfigured } from "@/lib/env";
import type { AdvisorInput, AdvisorResponse } from "@/types/advisor";
import { loadPlansWithPricing } from "@/server/data/plans";

import { getOpenAIRecommendations } from "./openai-advisor";
import {
  buildAdvisorSummary,
  filterPlansForAdvisor,
  toPlanCatalog,
} from "./plan-catalog";
import { getRuleBasedRecommendations } from "./rule-based-advisor";

export async function getAdvisorRecommendations(
  input: AdvisorInput,
): Promise<AdvisorResponse> {
  const allPlans = await loadPlansWithPricing({ marketType: input.marketType });
  const eligible = filterPlansForAdvisor(allPlans, input);

  if (eligible.length === 0) {
    return {
      summary:
        "No plans match your current filters for this market. Try increasing your budget, choosing a flexible account size, selecting any eval type, or switching to another market tab.",
      recommendations: [],
      poweredBy: "rules",
    };
  }

  if (isOpenAIConfigured()) {
    try {
      const catalog = toPlanCatalog(eligible);
      const aiResult = await getOpenAIRecommendations(
        eligible,
        catalog,
        input,
      );

      return {
        ...aiResult,
        poweredBy: "openai",
      };
    } catch {
      // Fall through to rule-based if OpenAI fails
    }
  }

  const recommendations = getRuleBasedRecommendations(eligible, input);

  return {
    summary: buildAdvisorSummary(input, eligible.length),
    recommendations,
    poweredBy: "rules",
  };
}
