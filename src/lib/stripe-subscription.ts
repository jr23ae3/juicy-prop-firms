import type Stripe from "stripe";

export function getSubscriptionPeriodEnd(
  subscription: Stripe.Subscription,
): Date | null {
  const itemEnd = subscription.items.data[0]?.current_period_end;
  if (itemEnd) {
    return new Date(itemEnd * 1000);
  }
  return null;
}

export function getSubscriptionPriceId(
  subscription: Stripe.Subscription,
): string | null {
  return subscription.items.data[0]?.price.id ?? null;
}
