import type { SubscriptionStatus, User } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { env, isStripeConfigured } from "@/lib/env";
import { getStripe, mapStripeSubscriptionStatus } from "@/lib/stripe";
import {
  getSubscriptionPeriodEnd,
  getSubscriptionPriceId,
} from "@/lib/stripe-subscription";
import type { SubscriptionSummary } from "@/types/subscription";

const PREMIUM_STATUSES: SubscriptionStatus[] = ["ACTIVE", "TRIALING"];

export function isPremiumStatus(status: SubscriptionStatus | null | undefined) {
  return status != null && PREMIUM_STATUSES.includes(status);
}

export async function isUserPremium(userId: string): Promise<boolean> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { role: true, subscription: { select: { status: true } } },
  });

  if (!user) return false;
  if (user.role === "ADMIN") return true;

  return isPremiumStatus(user.subscription?.status);
}

export async function getSubscriptionSummary(
  userId: string,
): Promise<SubscriptionSummary> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      role: true,
      subscription: true,
    },
  });

  const stripeConfigured = isStripeConfigured();
  const sub = user?.subscription;
  const isPremium =
    user?.role === "ADMIN" || isPremiumStatus(sub?.status ?? null);

  return {
    status: sub?.status ?? null,
    isPremium,
    currentPeriodEnd: sub?.currentPeriodEnd?.toISOString() ?? null,
    cancelAtPeriodEnd: sub?.cancelAtPeriodEnd ?? false,
    stripeConfigured,
  };
}

export async function getOrCreateStripeCustomer(user: User): Promise<string> {
  const existing = await db.subscription.findUnique({
    where: { userId: user.id },
  });

  if (existing?.stripeCustomerId) {
    return existing.stripeCustomerId;
  }

  const stripe = getStripe();
  const customer = await stripe.customers.create({
    email: user.email,
    name: user.name ?? undefined,
    metadata: { userId: user.id },
  });

  await db.subscription.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      stripeCustomerId: customer.id,
      status: "INCOMPLETE",
    },
    update: {
      stripeCustomerId: customer.id,
    },
  });

  return customer.id;
}

export async function syncSubscriptionFromStripe(
  stripeSubscriptionId: string,
) {
  const stripe = getStripe();
  const stripeSub = await stripe.subscriptions.retrieve(stripeSubscriptionId);

  const customerId =
    typeof stripeSub.customer === "string"
      ? stripeSub.customer
      : stripeSub.customer.id;

  const record = await db.subscription.findUnique({
    where: { stripeCustomerId: customerId },
  });

  if (!record) {
    throw new Error(`No subscription record for customer ${customerId}`);
  }

  const priceId = getSubscriptionPriceId(stripeSub);

  return db.subscription.update({
    where: { id: record.id },
    data: {
      stripeSubscriptionId: stripeSub.id,
      stripePriceId: priceId,
      status: mapStripeSubscriptionStatus(stripeSub.status),
      currentPeriodEnd: getSubscriptionPeriodEnd(stripeSub),
      cancelAtPeriodEnd: stripeSub.cancel_at_period_end,
    },
  });
}

export async function createCheckoutSession(
  user: User,
  returnUrl: string,
): Promise<string> {
  const stripe = getStripe();
  const customerId = await getOrCreateStripeCustomer(user);
  const priceId = env.STRIPE_PRICE_ID;

  if (!priceId) {
    throw new Error("Missing STRIPE_PRICE_ID");
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${returnUrl}/account?checkout=success`,
    cancel_url: `${returnUrl}/pricing?checkout=canceled`,
    allow_promotion_codes: true,
    metadata: { userId: user.id },
    subscription_data: {
      metadata: { userId: user.id },
    },
  });

  if (!session.url) {
    throw new Error("Failed to create checkout session");
  }

  return session.url;
}

export async function createBillingPortalSession(
  user: User,
  returnUrl: string,
): Promise<string> {
  const stripe = getStripe();
  const customerId = await getOrCreateStripeCustomer(user);

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${returnUrl}/account`,
  });

  return session.url;
}
