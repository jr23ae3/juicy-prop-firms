"use client";

import Link from "next/link";
import { Check, Crown, Loader2 } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { freeTierLimits, premiumFeatures, premiumPlan } from "@/config/premium";
import { useCheckout, useSubscription } from "@/hooks/use-subscription";
import { useUser } from "@/hooks/use-user";
import { cn } from "@/lib/utils";

export function PricingCards() {
  const { data: user } = useUser();
  const { data: subscription } = useSubscription(Boolean(user));
  const checkout = useCheckout();

  const isPremium = subscription?.isPremium ?? false;
  const stripeConfigured = subscription?.stripeConfigured ?? false;

  return (
    <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Free</CardTitle>
          <CardDescription>Compare and explore</CardDescription>
          <p className="pt-2 text-3xl font-bold">
            $0
            <span className="text-base font-normal text-muted-foreground">
              /mo
            </span>
          </p>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <PricingFeature>Full plan comparison table</PricingFeature>
            <PricingFeature>Top 3 rankings podium</PricingFeature>
            <PricingFeature>
              {freeTierLimits.advisorRecommendations} AI advisor match
            </PricingFeature>
            <PricingFeature>
              Save up to {freeTierLimits.maxSavedPlans} plans
            </PricingFeature>
          </ul>
        </CardContent>
        <CardFooter>
          <Link
            href="/compare"
            className={cn(buttonVariants({ variant: "outline" }), "w-full")}
          >
            Start comparing
          </Link>
        </CardFooter>
      </Card>

      <Card className="border-primary/30 shadow-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Crown className="size-5 text-primary" aria-hidden />
            <CardTitle>{premiumPlan.name}</CardTitle>
          </div>
          <CardDescription>{premiumPlan.tagline}</CardDescription>
          <p className="pt-2 text-3xl font-bold text-primary">
            ${premiumPlan.priceMonthly}
            <span className="text-base font-normal text-muted-foreground">
              /mo
            </span>
          </p>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {premiumFeatures.map((feature) => (
              <PricingFeature key={feature.id} highlight>
                {feature.title}
              </PricingFeature>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          {isPremium ? (
            <Link
              href="/account"
              className={cn(buttonVariants(), "w-full")}
            >
              Manage subscription
            </Link>
          ) : user ? (
            <Button
              type="button"
              className="w-full gap-2"
              disabled={!stripeConfigured || checkout.isPending}
              onClick={() => checkout.mutate()}
            >
              {checkout.isPending ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : (
                <Crown className="size-4" aria-hidden />
              )}
              Upgrade now
            </Button>
          ) : (
            <Link
              href="/signup?redirectTo=%2Fpricing"
              className={cn(buttonVariants(), "w-full gap-2")}
            >
              <Crown className="size-4" aria-hidden />
              Sign up to upgrade
            </Link>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

function PricingFeature({
  children,
  highlight = false,
}: {
  children: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <li className="flex items-start gap-2">
      <Check
        className={cn(
          "mt-0.5 size-4 shrink-0",
          highlight ? "text-primary" : "text-muted-foreground",
        )}
        aria-hidden
      />
      <span>{children}</span>
    </li>
  );
}
