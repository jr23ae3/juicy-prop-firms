import { z } from "zod";

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

export const createPlanSchema = z.object({
  propFirmId: z.string().cuid(),
  slug: slugSchema,
  name: z.string().min(2).max(120),
  accountSize: z.coerce.number().int().positive(),
  evalType: evalTypeSchema,
  evalPrice: z.coerce.number().positive(),
  activationFee: z.coerce.number().min(0).default(0),
  profitTarget: z.coerce.number().positive().optional(),
  maxDrawdown: z.coerce.number().positive().optional(),
  drawdownType: drawdownTypeSchema.optional(),
  profitSplit: z.coerce.number().min(0).max(1).optional(),
  maxPayout: z.coerce.number().positive().optional(),
  payoutFrequency: z.string().max(64).optional(),
  isActive: z.boolean().default(true),
  discountCode: z.string().max(32).optional(),
  discountPct: z.coerce.number().min(0).max(1).optional(),
  discountAmt: z.coerce.number().positive().optional(),
});

export const createDiscountSchema = z.object({
  planId: z.string().cuid(),
  code: z.string().min(2).max(32),
  discountPct: z.coerce.number().min(0).max(1).optional(),
  discountAmt: z.coerce.number().positive().optional(),
  expiresAt: z.coerce.date().optional(),
  isActive: z.boolean().default(true),
});

export type CreateFirmInput = z.infer<typeof createFirmSchema>;
export type UpdateFirmInput = z.infer<typeof updateFirmSchema>;
export type CreatePlanInput = z.infer<typeof createPlanSchema>;
export type CreateDiscountInput = z.infer<typeof createDiscountSchema>;

export function parseOptionalUrl(value: string | undefined) {
  if (!value) return undefined;
  return value;
}

export function parseFormBoolean(value: FormDataEntryValue | null) {
  return value === "true" || value === "on";
}
