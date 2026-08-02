import { z } from "zod";

export const userPreferencesSchema = z.object({
  tradingStyle: z.enum(["scalper", "day-trader", "swing"]).optional(),
  experienceLevel: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  preferredSize: z.coerce.number().int().positive().optional(),
  maxBudget: z.coerce.number().min(50).max(2000).optional(),
  evalTypePreference: z
    .enum(["CHALLENGE", "DIRECT_TO_FUNDED", "any"])
    .optional(),
  priority: z
    .enum(["affordability", "payouts", "rules", "platform"])
    .optional(),
  alertsEnabled: z.coerce.boolean().optional(),
});

export const savePlanSchema = z.object({
  planId: z.string().min(1),
});

export const dealAlertSchema = z.object({
  planId: z.string().optional(),
  firmSlug: z.string().optional(),
  maxAllIn: z.coerce.number().min(0).max(2000).optional(),
  label: z.string().max(120).optional(),
});

export type UserPreferencesInput = z.infer<typeof userPreferencesSchema>;
export type DealAlertInput = z.infer<typeof dealAlertSchema>;
