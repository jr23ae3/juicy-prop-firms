import type { Metadata } from "next";
import { Suspense } from "react";

import { ComparePageClient } from "@/components/compare/compare-page-client";
import { CompareSkeleton } from "@/components/compare/compare-skeleton";
import { getActiveFirms } from "@/services/firm-service";
import { getDistinctAccountSizes } from "@/services/plan-service";
import type { CompareFilterMetadata } from "@/types/compare";

export const metadata: Metadata = {
  title: "Compare Plans",
  description:
    "Compare futures prop firm plans with live pricing, verified discount codes, and transparent all-in costs.",
  openGraph: {
    title: "Compare Prop Firm Plans",
    description:
      "Side-by-side comparison of futures prop firm evaluations with true all-in pricing.",
  },
};

async function getFilterMetadata(): Promise<CompareFilterMetadata> {
  try {
    const [firms, accountSizes] = await Promise.all([
      getActiveFirms(),
      getDistinctAccountSizes(),
    ]);

    return {
      firms: firms.map((f) => ({
        slug: f.slug,
        name: f.name,
        rankPosition: f.rankPosition,
      })),
      accountSizes,
      evalTypes: ["CHALLENGE", "DIRECT_TO_FUNDED", "INSTANT_FUNDING"],
    };
  } catch {
    return {
      firms: [],
      accountSizes: [],
      evalTypes: ["CHALLENGE", "DIRECT_TO_FUNDED", "INSTANT_FUNDING"],
    };
  }
}

export default async function ComparePage() {
  const metadata = await getFilterMetadata();

  return (
    <Suspense fallback={<CompareSkeleton />}>
      <ComparePageClient metadata={metadata} />
    </Suspense>
  );
}
