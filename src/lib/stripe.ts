import "server-only";

import Stripe from "stripe";

import { env, isStripeConfigured } from "@/lib/env";

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  if (!isStripeConfigured()) {
    throw new Error(
      "Stripe is not configured. Set STRIPE_SECRET_KEY and STRIPE_PRICE_ID in .env.local",
    );
  }

  if (!stripeClient) {
    stripeClient = new Stripe(env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-07-29.dahlia",
      typescript: true,
    });
  }

  return stripeClient;
}

export function mapStripeSubscriptionStatus(
  status: Stripe.Subscription.Status,
): import("@/generated/prisma/client").SubscriptionStatus {
  const map: Record<
    Stripe.Subscription.Status,
    import("@/generated/prisma/client").SubscriptionStatus
  > = {
    active: "ACTIVE",
    canceled: "CANCELED",
    past_due: "PAST_DUE",
    trialing: "TRIALING",
    incomplete: "INCOMPLETE",
    incomplete_expired: "INCOMPLETE_EXPIRED",
    unpaid: "UNPAID",
    paused: "PAUSED",
  };

  return map[status];
}
