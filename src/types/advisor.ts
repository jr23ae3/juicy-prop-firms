import type { MarketType } from "@/generated/prisma/client";
import type { PlanSummary } from "@/types/plan";

export type AdvisorInput = {
  marketType: MarketType;
  tradingStyle: "scalper" | "day-trader" | "swing";
  experienceLevel: "beginner" | "intermediate" | "advanced";
  accountSize: "50000" | "100000" | "150000" | "flexible";
  maxBudget: number;
  evalTypePreference: "CHALLENGE" | "DIRECT_TO_FUNDED" | "any";
  priority: "affordability" | "payouts" | "rules" | "platform";
  notes?: string;
};

export type AdvisorRecommendation = {
  plan: PlanSummary;
  rank: number;
  matchScore: number;
  reasoning: string;
  highlights: string[];
};

export type AdvisorResponse = {
  summary: string;
  recommendations: AdvisorRecommendation[];
  poweredBy: "openai" | "rules";
  premiumLocked?: boolean;
  lockedCount?: number;
};

export type AdvisorActionState = {
  error?: string;
  data?: AdvisorResponse;
};

export type PlanCatalogEntry = {
  id: string;
  firmName: string;
  firmSlug: string;
  firmRank: number | null;
  planName: string;
  accountSize: number;
  marketType: string;
  evalType: string;
  allInCost: number;
  returnMultiple: number | null;
  profitSplit: number | null;
  payoutFrequency: string | null;
  drawdownType: string | null;
  discountCode: string | null;
};
