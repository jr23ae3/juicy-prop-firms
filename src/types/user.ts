import type { PlanSummary } from "@/types/plan";

export type UserPreferencesData = {
  tradingStyle: string | null;
  experienceLevel: string | null;
  preferredSize: number | null;
  maxBudget: number | null;
  evalTypePreference: string | null;
  priority: string | null;
  alertsEnabled: boolean;
};

export type DealAlertSummary = {
  id: string;
  planId: string | null;
  firmSlug: string | null;
  maxAllIn: number | null;
  label: string | null;
  isActive: boolean;
  createdAt: string;
  plan?: PlanSummary | null;
};

export type SavedPlansResponse = {
  planIds: string[];
  plans: PlanSummary[];
};
