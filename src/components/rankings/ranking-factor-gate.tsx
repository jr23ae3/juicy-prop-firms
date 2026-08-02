"use client";

import { PremiumGate } from "@/components/premium/premium-gate";
import { RankingFactorBars } from "@/components/rankings/ranking-factor-bars";
import type { RankingSummary } from "@/types/plan";

type RankingFactorGateProps = {
  factors: RankingSummary["factors"];
  compact?: boolean;
};

export function RankingFactorGate({ factors, compact }: RankingFactorGateProps) {
  return (
    <PremiumGate feature="Ranking breakdowns" compact>
      <RankingFactorBars factors={factors} compact={compact} />
    </PremiumGate>
  );
}
