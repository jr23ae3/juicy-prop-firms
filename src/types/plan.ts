import type {
  Discount,
  DrawdownType,
  EvalType,
  Plan,
  PropFirm,
} from "@/generated/prisma/client";

export type FirmSummary = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  websiteUrl: string | null;
  logoUrl: string | null;
  rankScore: number | null;
  rankPosition: number | null;
};

export type DiscountSummary = {
  id: string;
  code: string;
  discountPct: number | null;
  discountAmt: number | null;
  waivesActivationFee: boolean;
  expiresAt: string | null;
  verifiedAt: string | null;
};

export type PlanPricing = {
  evalPrice: number;
  activationFee: number;
  effectiveActivationFee: number;
  activationFeeWaived: boolean;
  discountedPrice: number;
  allInCost: number;
  savings: number;
  netPayout: number | null;
  returnMultiple: number | null;
};

export type PlanSummary = {
  id: string;
  slug: string;
  name: string;
  accountSize: number;
  evalType: EvalType;
  profitTarget: number | null;
  resetFee: number;
  maxDrawdown: number | null;
  dailyDrawdown: number | null;
  drawdownType: DrawdownType | null;
  minimumDays: number | null;
  profitSplit: number | null;
  maxPayout: number | null;
  minimumDaysToPayout: number | null;
  minimumTargetGoalCushion: number | null;
  maxFundedAccounts: number | null;
  fundedDrawdownType: DrawdownType | null;
  payoutFrequency: string | null;
  firm: FirmSummary;
  discount: DiscountSummary | null;
  pricing: PlanPricing;
};

export type RankingSummary = {
  position: number;
  score: number;
  period: string;
  firm: FirmSummary;
  factors: Record<string, number> | null;
};

export type PlanFilters = {
  firmSlug?: string;
  evalType?: EvalType;
  accountSize?: number;
  minAccountSize?: number;
  maxAccountSize?: number;
  maxAllInCost?: number;
  search?: string;
};

export type PlanRecord = Plan & {
  propFirm: PropFirm;
  discounts: Discount[];
};

export type FirmRecord = PropFirm & {
  plans: (Plan & { discounts: Discount[] })[];
  rankings: {
    position: number;
    score: number;
    period: string;
    factors: unknown;
  }[];
};
