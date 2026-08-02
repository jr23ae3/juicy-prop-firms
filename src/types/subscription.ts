import type { SubscriptionStatus } from "@/generated/prisma/client";

export type SubscriptionSummary = {
  status: SubscriptionStatus | null;
  isPremium: boolean;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  stripeConfigured: boolean;
};

export type CheckoutResponse = {
  url: string;
};

export type PortalResponse = {
  url: string;
};
