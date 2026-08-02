export type PropFirmSlug = string;
export type PlanId = string;

export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export type {
  AdvisorInput,
  AdvisorRecommendation,
  AdvisorResponse,
} from "@/types/advisor";

export type {
  DealAlertSummary,
  SavedPlansResponse,
  UserPreferencesData,
} from "@/types/user";

export type {
  DiscountSummary,
  FirmRecord,
  FirmSummary,
  PlanFilters,
  PlanPricing,
  PlanRecord,
  PlanSummary,
  RankingSummary,
} from "@/types/plan";
