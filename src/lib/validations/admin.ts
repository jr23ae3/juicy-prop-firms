import { z } from "zod";

const evalTypeSchema = z.enum([
  "CHALLENGE",
  "DIRECT_TO_FUNDED",
  "INSTANT_FUNDING",
]);

const drawdownTypeSchema = z.enum(["END_OF_DAY", "TRAILING", "STATIC"]);

export const createFirmSchema = z.object({
  slug: z
    .string()
    .min(2)
    .max(64)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  name: z.string().min(2).max(120),
  description: z.string().max(2000).optional(),
  websiteUrl: z.string().url().optional(),
  logoUrl: z.string().url().optional(),
  isActive: z.boolean().default(true),
});

export const createPlanSchema = z.object({
  propFirmId: z.string().cuid(),
  slug: z.string().min(2).max(64).regex(/^[a-z0-9-]+$/),
  name: z.string().min(2).max(120),
  accountSize: z.number().int().positive(),
  evalType: evalTypeSchema,
  evalPrice: z.number().positive(),
  activationFee: z.number().min(0).default(0),
  profitTarget: z.number().positive().optional(),
  maxDrawdown: z.number().positive().optional(),
  drawdownType: drawdownTypeSchema.optional(),
  profitSplit: z.number().min(0).max(1).optional(),
  maxPayout: z.number().positive().optional(),
  payoutFrequency: z.string().max(64).optional(),
  isActive: z.boolean().default(true),
});

export const createDiscountSchema = z.object({
  planId: z.string().cuid(),
  code: z.string().min(2).max(32),
  discountPct: z.number().min(0).max(1).optional(),
  discountAmt: z.number().positive().optional(),
  expiresAt: z.coerce.date().optional(),
  isActive: z.boolean().default(true),
});

export type CreateFirmInput = z.infer<typeof createFirmSchema>;
export type CreatePlanInput = z.infer<typeof createPlanSchema>;
export type CreateDiscountInput = z.infer<typeof createDiscountSchema>;
