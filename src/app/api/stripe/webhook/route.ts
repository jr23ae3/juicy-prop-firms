import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { env } from "@/lib/env";
import { getStripe, mapStripeSubscriptionStatus } from "@/lib/stripe";
import {
  getSubscriptionPeriodEnd,
  getSubscriptionPriceId,
} from "@/lib/stripe-subscription";
import { db } from "@/lib/db";
import { sendSubscriptionConfirmationEmail } from "@/services/email/transactional-email-service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const webhookSecret = env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 503 },
    );
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(
          event.data.object as Stripe.Checkout.Session,
        );
        break;
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await handleSubscriptionChange(
          event.data.object as Stripe.Subscription,
        );
        break;
      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 },
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id;

  if (!subscriptionId) return;

  await syncStripeSubscription(subscriptionId);
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  await syncStripeSubscription(subscription.id);
}

async function syncStripeSubscription(stripeSubscriptionId: string) {
  const stripe = getStripe();
  const stripeSub = await stripe.subscriptions.retrieve(stripeSubscriptionId);

  const customerId =
    typeof stripeSub.customer === "string"
      ? stripeSub.customer
      : stripeSub.customer.id;

  const record = await db.subscription.findUnique({
    where: { stripeCustomerId: customerId },
  });

  if (!record) return;

  const previousStatus = record.status;
  const priceId = getSubscriptionPriceId(stripeSub);
  const newStatus = mapStripeSubscriptionStatus(stripeSub.status);

  await db.subscription.update({
    where: { id: record.id },
    data: {
      stripeSubscriptionId: stripeSub.id,
      stripePriceId: priceId,
      status: newStatus,
      currentPeriodEnd: getSubscriptionPeriodEnd(stripeSub),
      cancelAtPeriodEnd: stripeSub.cancel_at_period_end,
    },
  });

  if (newStatus === "ACTIVE" && previousStatus !== "ACTIVE") {
    const user = await db.user.findUnique({ where: { id: record.userId } });
    if (user) {
      void sendSubscriptionConfirmationEmail(user).catch(() => undefined);
    }
  }
}
