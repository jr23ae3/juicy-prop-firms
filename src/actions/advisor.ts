"use server";

import { advisorInputSchema } from "@/lib/validations/advisor";
import { getAdvisorRecommendations } from "@/services/advisor/advisor-service";
import { saveAdvisorPreferences } from "@/services/user/preferences-service";
import { getDbUserOptional } from "@/server/user/require-db-user";
import type { AdvisorActionState } from "@/types/advisor";

export async function getAdvisorRecommendationsAction(
  _prevState: AdvisorActionState,
  formData: FormData,
): Promise<AdvisorActionState> {
  const parsed = advisorInputSchema.safeParse({
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

    return { data };
  } catch {
    return {
      error:
        "Unable to generate recommendations. Check your database connection and try again.",
    };
  }
}
