import type { PlanSummary } from "@/types/plan";

export type AdvisorInput = {
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
  evalType: string;
  allInCost: number;
  returnMultiple: number | null;
  profitSplit: number | null;
  payoutFrequency: string | null;
  drawdownType: string | null;
  discountCode: string | null;
};
