import { z } from "zod";

import { MARKET_TYPES } from "@/lib/plans/market-type";

const evalTypeSchema = z.enum([
  "CHALLENGE",
  "DIRECT_TO_FUNDED",
  "INSTANT_FUNDING",
]);

const drawdownTypeSchema = z.enum(["END_OF_DAY", "TRAILING", "STATIC"]);

const slugSchema = z
  .string()
  .min(2)
  .max(64)
  .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens");

export const createFirmSchema = z.object({
  slug: slugSchema,
  name: z.string().min(2).max(120),
  description: z.string().max(2000).optional(),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  logoUrl: z.string().url().optional().or(z.literal("")),
  isActive: z.boolean().default(true),
});

export const updateFirmSchema = createFirmSchema.partial().extend({
  rankScore: z.coerce.number().min(0).max(100).optional(),
  rankPosition: z.coerce.number().int().positive().optional(),
  payoutSpeed: z.coerce.number().min(0).max(100).optional(),
  affordability: z.coerce.number().min(0).max(100).optional(),
  ruleFriendliness: z.coerce.number().min(0).max(100).optional(),
  platformQuality: z.coerce.number().min(0).max(100).optional(),
});

const marketTypeSchema = z.enum(MARKET_TYPES);

export const createPlanSchema = z.object({
  propFirmId: z.string().cuid(),
  slug: slugSchema,
  name: z.string().min(2).max(120),
  accountSize: z.coerce.number().int().positive(),
  marketType: marketTypeSchema.default("FUTURES"),
  evalType: evalTypeSchema,
  evalPrice: z.coerce.number().positive(),
  activationFee: z.coerce.number().min(0).default(0),
  resetFee: z.coerce.number().min(0).default(0),
  profitTarget: z.coerce.number().positive().optional(),
  maxDrawdown: z.coerce.number().positive().optional(),
  dailyDrawdown: z.coerce.number().positive().optional(),
  drawdownType: drawdownTypeSchema.optional(),
  minimumDays: z.coerce.number().int().positive().optional(),
  profitSplit: z.coerce.number().min(0).max(1).optional(),
  maxPayout: z.coerce.number().positive().optional(),
  minimumDaysToPayout: z.coerce.number().int().positive().optional(),
  minimumTargetGoalCushion: z.coerce.number().positive().optional(),
  maxFundedAccounts: z.coerce.number().int().positive().optional(),
  fundedDrawdownType: drawdownTypeSchema.optional(),
  payoutFrequency: z.string().max(64).optional(),
  isActive: z.boolean().default(true),
  discountCode: z.string().max(32).optional(),
  discountPct: z.coerce.number().min(0).max(1).optional(),
  discountAmt: z.coerce.number().positive().optional(),
  waivesActivationFee: z.boolean().default(false),
});

const optionalNumber = z.preprocess(
  (value) => (value === "" || value === null || value === undefined ? null : value),
  z.coerce.number().positive().nullable(),
);

const optionalInt = z.preprocess(
  (value) => (value === "" || value === null || value === undefined ? null : value),
  z.coerce.number().int().positive().nullable(),
);

const optionalSplit = z.preprocess(
  (value) => (value === "" || value === null || value === undefined ? null : value),
  z.coerce.number().min(0).max(1).nullable(),
);

const optionalDrawdownType = z.preprocess(
  (value) => (value === "" || value === null || value === undefined ? null : value),
  drawdownTypeSchema.nullable(),
);

const optionalFundedDrawdownType = z.preprocess(
  (value) => (value === "" || value === null || value === undefined ? null : value),
  drawdownTypeSchema.nullable(),
);

export const updatePlanSchema = z.object({
  slug: slugSchema,
  name: z.string().min(2).max(120),
  accountSize: z.coerce.number().int().positive(),
  marketType: marketTypeSchema,
  evalType: evalTypeSchema,
  evalPrice: z.coerce.number().positive(),
  activationFee: z.coerce.number().min(0).default(0),
  resetFee: z.coerce.number().min(0).default(0),
  profitTarget: optionalNumber,
  maxDrawdown: optionalNumber,
  dailyDrawdown: optionalNumber,
  drawdownType: optionalDrawdownType,
  minimumDays: optionalInt,
  profitSplit: optionalSplit,
  maxPayout: optionalNumber,
  minimumDaysToPayout: optionalInt,
  minimumTargetGoalCushion: optionalNumber,
  maxFundedAccounts: optionalInt,
  fundedDrawdownType: optionalFundedDrawdownType,
  payoutFrequency: z.preprocess(
    (value) => (value === "" || value === null || value === undefined ? null : value),
    z.string().max(64).nullable(),
  ),
  isActive: z.boolean(),
  discountCode: z.string().max(32).optional(),
  discountPct: z.coerce.number().min(0).max(1).optional(),
  discountAmt: z.coerce.number().positive().optional(),
  waivesActivationFee: z.boolean().default(false),
});

export const createDiscountSchema = z.object({
  planId: z.string().cuid(),
  code: z.string().min(2).max(32),
  discountPct: z.coerce.number().min(0).max(1).optional(),
  discountAmt: z.coerce.number().positive().optional(),
  waivesActivationFee: z.boolean().default(false),
  expiresAt: z.coerce.date().optional(),
  isActive: z.boolean().default(true),
});

export type CreateFirmInput = z.infer<typeof createFirmSchema>;
export type UpdateFirmInput = z.infer<typeof updateFirmSchema>;
export type CreatePlanInput = z.infer<typeof createPlanSchema>;
export type UpdatePlanInput = z.infer<typeof updatePlanSchema>;
export type CreateDiscountInput = z.infer<typeof createDiscountSchema>;

export function parseOptionalUrl(value: string | undefined) {
  if (!value) return undefined;
  return value;
}

export function parseFormBoolean(value: FormDataEntryValue | null) {
  return value === "true" || value === "on";
}
