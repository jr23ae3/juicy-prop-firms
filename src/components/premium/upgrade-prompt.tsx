"use client";

import Link from "next/link";
import { Crown, Sparkles } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { premiumPlan } from "@/config/premium";
import { cn } from "@/lib/utils";

type UpgradePromptProps = {
  feature?: string;
  className?: string;
  compact?: boolean;
};

export function UpgradePrompt({
  feature,
  className,
  compact = false,
}: UpgradePromptProps) {
  if (compact) {
    return (
      <div
        className={cn(
          "flex flex-wrap items-center justify-between gap-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm",
          className,
        )}
      >
        <span className="flex items-center gap-2">
          <Crown className="size-4 text-primary" aria-hidden />
          {feature ? `${feature} is a Juicy Pro feature` : "Upgrade to Juicy Pro"}
        </span>
        <Link href="/pricing" className={cn(buttonVariants({ size: "sm" }))}>
          Upgrade
        </Link>
      </div>
    );
  }

  return (
    <Card className={cn("border-primary/20 bg-primary/5", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="size-5 text-primary" aria-hidden />
          Unlock with {premiumPlan.name}
        </CardTitle>
        <CardDescription>
          {feature
            ? `${feature} requires a Juicy Pro subscription.`
            : "Get the full platform — AI advisor, deal alerts, unlimited saves, and ranking breakdowns."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Link href="/pricing" className={cn(buttonVariants(), "gap-2")}>
          <Crown className="size-4" aria-hidden />
          View pricing — ${premiumPlan.priceMonthly}/mo
        </Link>
      </CardContent>
    </Card>
  );
}
