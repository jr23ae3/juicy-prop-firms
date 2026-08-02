"use client";

import type { ReactNode } from "react";

import { UpgradePrompt } from "@/components/premium/upgrade-prompt";
import { useSubscription } from "@/hooks/use-subscription";
import { useUser } from "@/hooks/use-user";

type PremiumGateProps = {
  children: ReactNode;
  feature?: string;
  fallback?: ReactNode;
  compact?: boolean;
};

export function PremiumGate({
  children,
  feature,
  fallback,
  compact,
}: PremiumGateProps) {
  const { data: user } = useUser();
  const { data: subscription, isLoading } = useSubscription(Boolean(user));

  if (!user) {
    return (
      fallback ?? <UpgradePrompt feature={feature} compact={compact} />
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border/60 px-4 py-6 text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (subscription?.isPremium) {
    return children;
  }

  return fallback ?? <UpgradePrompt feature={feature} compact={compact} />;
}
