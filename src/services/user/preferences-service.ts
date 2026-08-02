import { toNumberOrNull } from "@/lib/decimal";
import { db } from "@/lib/db";
import type { UserPreferencesInput } from "@/lib/validations/user";
import type { UserPreferencesData } from "@/types/user";

function serializePreferences(
  prefs: NonNullable<Awaited<ReturnType<typeof getUserPreferences>>>,
): UserPreferencesData {
  return {
    tradingStyle: prefs.tradingStyle,
    experienceLevel: prefs.experienceLevel,
    preferredSize: prefs.preferredSize,
    maxBudget: toNumberOrNull(prefs.maxBudget),
    evalTypePreference: prefs.evalTypePreference,
    priority: prefs.priority,
    alertsEnabled: prefs.alertsEnabled,
  };
}

export async function getUserPreferences(userId: string) {
  return db.userPreferences.findUnique({
    where: { userId },
  });
}

export async function getUserPreferencesData(
  userId: string,
): Promise<UserPreferencesData | null> {
  const prefs = await getUserPreferences(userId);
  if (!prefs) return null;
  return serializePreferences(prefs);
}

export async function upsertUserPreferences(
  userId: string,
  input: UserPreferencesInput,
) {
  const prefs = await db.userPreferences.upsert({
    where: { userId },
    create: {
      userId,
      tradingStyle: input.tradingStyle,
      experienceLevel: input.experienceLevel,
      preferredSize: input.preferredSize,
      maxBudget: input.maxBudget,
      evalTypePreference: input.evalTypePreference,
      priority: input.priority,
      alertsEnabled: input.alertsEnabled ?? true,
    },
    update: {
      tradingStyle: input.tradingStyle,
      experienceLevel: input.experienceLevel,
      preferredSize: input.preferredSize,
      maxBudget: input.maxBudget,
      evalTypePreference: input.evalTypePreference,
      priority: input.priority,
      ...(input.alertsEnabled !== undefined
        ? { alertsEnabled: input.alertsEnabled }
        : {}),
    },
  });

  return serializePreferences(prefs);
}

export async function saveAdvisorPreferences(
  userId: string,
  input: {
    tradingStyle: string;
    experienceLevel: string;
    accountSize: string;
    maxBudget: number;
    evalTypePreference: string;
    priority: string;
  },
) {
  const preferredSize =
    input.accountSize === "flexible" ? undefined : Number(input.accountSize);

  return upsertUserPreferences(userId, {
    tradingStyle: input.tradingStyle as UserPreferencesInput["tradingStyle"],
    experienceLevel:
      input.experienceLevel as UserPreferencesInput["experienceLevel"],
    preferredSize,
    maxBudget: input.maxBudget,
    evalTypePreference:
      input.evalTypePreference as UserPreferencesInput["evalTypePreference"],
    priority: input.priority as UserPreferencesInput["priority"],
  });
}
