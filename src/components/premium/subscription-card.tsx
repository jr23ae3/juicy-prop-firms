"use client";

import Link from "next/link";
import { Crown, ExternalLink, Loader2 } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { premiumPlan } from "@/config/premium";
import { useBillingPortal, useCheckout, useSubscription } from "@/hooks/use-subscription";
import { useUser } from "@/hooks/use-user";
import { cn } from "@/lib/utils";

export function SubscriptionCard() {
  const { data: user } = useUser();
  const { data: subscription, isLoading } = useSubscription(Boolean(user));
  const checkout = useCheckout();
  const portal = useBillingPortal();

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Juicy Pro</CardTitle>
          <CardDescription>
            Sign in to manage your subscription.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/login?redirectTo=%2Faccount" className={buttonVariants()}>
            Sign in
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" aria-hidden />
          Loading subscription…
        </CardContent>
      </Card>
    );
  }

  const isPremium = subscription?.isPremium ?? false;
  const stripeConfigured = subscription?.stripeConfigured ?? false;

  return (
    <Card className={isPremium ? "border-primary/20 bg-primary/5" : undefined}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="size-5 text-primary" aria-hidden />
          {premiumPlan.name}
        </CardTitle>
        <CardDescription>
          {isPremium
            ? "You have full access to premium features."
            : `Upgrade for $${premiumPlan.priceMonthly}/mo — full AI advisor, deal alerts, unlimited saves.`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isPremium ? (
          <>
            <dl className="grid gap-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Status</dt>
                <dd className="font-medium capitalize">
                  {subscription?.status?.toLowerCase().replace("_", " ") ??
                    "Active"}
                </dd>
              </div>
              {subscription?.currentPeriodEnd ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">
                    {subscription.cancelAtPeriodEnd ? "Ends" : "Renews"}
                  </dt>
                  <dd className="font-medium">
                    {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                  </dd>
                </div>
              ) : null}
            </dl>
            {stripeConfigured ? (
              <Button
                type="button"
                variant="outline"
                disabled={portal.isPending}
                onClick={() => portal.mutate()}
                className="gap-2"
              >
                {portal.isPending ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : (
                  <ExternalLink className="size-4" aria-hidden />
                )}
                Manage billing
              </Button>
            ) : null}
          </>
        ) : (
          <>
            {!stripeConfigured ? (
              <p className="text-sm text-muted-foreground">
                Stripe is not configured. Set{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">
                  STRIPE_SECRET_KEY
                </code>{" "}
                and{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">
                  STRIPE_PRICE_ID
                </code>{" "}
                to enable checkout.
              </p>
            ) : null}
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                disabled={!stripeConfigured || checkout.isPending}
                onClick={() => checkout.mutate()}
                className="gap-2"
              >
                {checkout.isPending ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : (
                  <Crown className="size-4" aria-hidden />
                )}
                Upgrade to Pro
              </Button>
              <Link
                href="/pricing"
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                Compare plans
              </Link>
            </div>
            {checkout.isError ? (
              <p role="alert" className="text-sm text-destructive">
                {checkout.error.message}
              </p>
            ) : null}
          </>
        )}
      </CardContent>
    </Card>
  );
}
