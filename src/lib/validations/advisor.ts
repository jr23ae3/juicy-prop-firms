import { z } from "zod";

import { MARKET_TYPES } from "@/lib/plans/market-type";

export const advisorInputSchema = z.object({
  marketType: z.enum(MARKET_TYPES),
  tradingStyle: z.enum(["scalper", "day-trader", "swing"]),
  experienceLevel: z.enum(["beginner", "intermediate", "advanced"]),
  accountSize: z.enum(["50000", "100000", "150000", "flexible"]),
  maxBudget: z.coerce.number().min(50).max(2000),
  evalTypePreference: z.enum(["CHALLENGE", "DIRECT_TO_FUNDED", "any"]),
  priority: z.enum(["affordability", "payouts", "rules", "platform"]),
  notes: z.string().max(500).optional(),
});

export type AdvisorFormInput = z.infer<typeof advisorInputSchema>;

export const aiAdvisorResponseSchema = z.object({
  summary: z.string().min(1),
  recommendations: z
    .array(
      z.object({
        planId: z.string().min(1),
        rank: z.number().int().min(1).max(5),
        matchScore: z.number().min(0).max(100),
        reasoning: z.string().min(1),
        highlights: z.array(z.string()).min(1).max(4),
      }),
    )
    .min(1)
    .max(3),
});

export type AiAdvisorResponse = z.infer<typeof aiAdvisorResponseSchema>;
