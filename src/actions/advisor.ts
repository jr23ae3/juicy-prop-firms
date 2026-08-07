"use server";

import { advisorInputSchema } from "@/lib/validations/advisor";
import { freeTierLimits } from "@/config/premium";
import { getAdvisorRecommendations } from "@/services/advisor/advisor-service";
import { isUserPremium } from "@/services/subscription/subscription-service";
import { saveAdvisorPreferences } from "@/services/user/preferences-service";
import { getDbUserOptional } from "@/server/user/require-db-user";
import type { AdvisorActionState } from "@/types/advisor";

export async function getAdvisorRecommendationsAction(
  _prevState: AdvisorActionState,
  formData: FormData,
): Promise<AdvisorActionState> {
  const parsed = advisorInputSchema.safeParse({
    marketType: formData.get("marketType"),
    tradingStyle: formData.get("tradingStyle"),
    experienceLevel: formData.get("experienceLevel"),
    accountSize: formData.get("accountSize"),
    maxBudget: formData.get("maxBudget"),
    evalTypePreference: formData.get("evalTypePreference"),
    priority: formData.get("priority"),
    notes: formData.get("notes") || undefined,
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Invalid form input",
    };
  }

  try {
    const data = await getAdvisorRecommendations(parsed.data);

    const session = await getDbUserOptional();
    if (session) {
      await saveAdvisorPreferences(session.user.id, parsed.data);
    }

    const isPremium = session
      ? await isUserPremium(session.user.id)
      : false;

    if (isPremium || data.recommendations.length <= freeTierLimits.advisorRecommendations) {
      return { data };
    }

    const lockedCount =
      data.recommendations.length - freeTierLimits.advisorRecommendations;

    return {
      data: {
        ...data,
        recommendations: data.recommendations.slice(
          0,
          freeTierLimits.advisorRecommendations,
        ),
        premiumLocked: true,
        lockedCount,
      },
    };
  } catch {
    return {
      error:
        "Unable to generate recommendations. Check your database connection and try again.",
    };
  }
}
