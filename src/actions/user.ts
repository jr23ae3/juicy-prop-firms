"use server";

import { revalidatePath } from "next/cache";

import { userPreferencesSchema } from "@/lib/validations/user";
import { upsertUserPreferences } from "@/services/user/preferences-service";
import { requireDbUser } from "@/server/user/require-db-user";

export type PreferencesActionState = {
  error?: string;
  success?: boolean;
};

export async function updatePreferencesAction(
  _prevState: PreferencesActionState,
  formData: FormData,
): Promise<PreferencesActionState> {
  try {
    const { user } = await requireDbUser();

    const parsed = userPreferencesSchema.safeParse({
      tradingStyle: formData.get("tradingStyle") || undefined,
      experienceLevel: formData.get("experienceLevel") || undefined,
      preferredSize: formData.get("preferredSize") || undefined,
      maxBudget: formData.get("maxBudget") || undefined,
      evalTypePreference: formData.get("evalTypePreference") || undefined,
      priority: formData.get("priority") || undefined,
      alertsEnabled: formData.get("alertsEnabled") === "true",
    });

    if (!parsed.success) {
      return {
        error: parsed.error.issues[0]?.message ?? "Invalid input",
      };
    }

    await upsertUserPreferences(user.id, parsed.data);
    revalidatePath("/account");
    revalidatePath("/advisor");

    return { success: true };
  } catch {
    return { error: "Failed to save preferences. Sign in and ensure DB is connected." };
  }
}
