export const premiumPlan = {
  id: "juicy-pro",
  name: "Juicy Pro",
  tagline: "Unlock the full platform",
  priceMonthly: 9.99,
  currency: "USD",
} as const;

export const freeTierLimits = {
  maxSavedPlans: 3,
  advisorRecommendations: 1,
} as const;

export const premiumFeatures = [
  {
    id: "advisor",
    title: "Full AI Advisor",
    description: "Top 3 personalized matches with AI reasoning",
  },
  {
    id: "alerts",
    title: "Deal alerts",
    description: "Track price drops and get notified (email in M9)",
  },
  {
    id: "saved",
    title: "Unlimited saved plans",
    description: "Bookmark as many plans as you want",
  },
  {
    id: "rankings",
    title: "Ranking breakdowns",
    description: "See detailed factor scores for every firm",
  },
] as const;

export type PremiumFeatureId = (typeof premiumFeatures)[number]["id"];
