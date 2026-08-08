import { getOpenAIClient } from "@/lib/openai/client";
import {
  aiAdvisorResponseSchema,
  type AdvisorFormInput,
} from "@/lib/validations/advisor";
import type {
  AdvisorInput,
  AdvisorRecommendation,
  PlanCatalogEntry,
} from "@/types/advisor";
import type { PlanSummary } from "@/types/plan";

const SYSTEM_PROMPT = `You are the Juicy Trades AI advisor — an expert on prop firm evaluations across futures, forex, stocks, and crypto markets.

Your job: recommend the best 1-3 plans from the provided catalog for the trader's selected market based on their questionnaire answers.

Rules:
- ONLY recommend plans from the catalog using exact planId values
- Prioritize the trader's stated priority (affordability, payouts, rules, platform)
- Consider experience level: beginners need simpler rules and lower all-in costs
- Scalpers/day traders benefit from daily payouts and EOD drawdowns
- Be direct and honest — mention trade-offs (e.g. hidden activation fees already reflected in allInCost)
- Never invent firms, plans, prices, or discount codes
- Return valid JSON matching the schema exactly`;

function buildUserPrompt(
  input: AdvisorInput,
  catalog: PlanCatalogEntry[],
): string {
  return JSON.stringify(
    {
      traderProfile: input,
      availablePlans: catalog,
      instructions:
        "Return the top 1-3 best matching plans with rank (1=best), matchScore (0-100), reasoning (2-3 sentences), and highlights (short bullet strings).",
    },
    null,
    2,
  );
}

export async function getOpenAIRecommendations(
  plans: PlanSummary[],
  catalog: PlanCatalogEntry[],
  input: AdvisorInput,
): Promise<{ summary: string; recommendations: AdvisorRecommendation[] }> {
  const client = getOpenAIClient();

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.4,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `${buildUserPrompt(input, catalog)}\n\nRespond with JSON: { "summary": string, "recommendations": [{ "planId", "rank", "matchScore", "reasoning", "highlights" }] }`,
      },
    ],
  });

  const content = completion.choices[0]?.message?.content;

  if (!content) {
    throw new Error("Empty response from OpenAI");
  }

  const parsed = aiAdvisorResponseSchema.parse(JSON.parse(content));
  const planMap = new Map(plans.map((p) => [p.id, p]));

  const recommendations: AdvisorRecommendation[] = parsed.recommendations
    .sort((a, b) => a.rank - b.rank)
    .flatMap((rec) => {
      const plan = planMap.get(rec.planId);
      if (!plan) return [];
      return [
        {
          plan,
          rank: rec.rank,
          matchScore: rec.matchScore,
          reasoning: rec.reasoning,
          highlights: rec.highlights,
        },
      ];
    });

  if (recommendations.length === 0) {
    throw new Error("AI returned invalid plan IDs");
  }

  return {
    summary: parsed.summary,
    recommendations,
  };
}

export type { AdvisorFormInput };
