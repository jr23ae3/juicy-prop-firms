import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import { RankingsList } from "@/components/rankings/rankings-list";
import { Container } from "@/components/layout/container";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { loadRankingsPageData } from "@/server/data/rankings";

export const metadata: Metadata = {
  title: "Juice Index",
  description:
    "The Juice Index ranks futures prop firms on payout reliability, affordability, trader-friendly rules, and platform quality.",
  openGraph: {
    title: "Juice Index — Futures Prop Firm Rankings",
    description:
      "Independent firm rankings based on verified pricing and rules — no pay-for-placement.",
  },
};

export const revalidate = 3600;

export default async function RankingsPage() {
  const { rankings, period } = await loadRankingsPageData();

  return (
    <div className="site-canvas">
      <Container className="space-y-10 py-8 md:py-12">
        <PageHeader
          eyebrow={`Updated ${period}`}
          title="Juice Index"
          description="Premier futures prop firms scored on verified pricing, payout reliability, trader-friendly rules, and platform quality. No firm can pay for placement."
          actions={
            <Link
              href="/methodology"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Scoring methodology
            </Link>
          }
        />

        <RankingsList rankings={rankings} />

        <aside className="surface-muted p-6 text-sm text-muted-foreground">
          <p>
            Scores reflect data as of{" "}
            <span className="font-medium text-foreground">{period}</span> and
            are re-evaluated when firms change pricing, rules, or payout
            performance.{" "}
            <Link
              href="/methodology"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Read the full methodology
            </Link>
            .
          </p>
        </aside>
      </Container>
    </div>
  );
}
