import type { Metadata } from "next";
import Link from "next/link";

import { RankingsList } from "@/components/rankings/rankings-list";
import { Container } from "@/components/layout/container";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { loadRankingsPageData } from "@/server/data/rankings";

export const metadata: Metadata = {
  title: "Power Rankings",
  description:
    "Juicy Prop Firms power rankings — scored on payout reliability, affordability, trader-friendly rules, and platform quality.",
  openGraph: {
    title: "Futures Prop Firm Power Rankings",
    description:
      "Independent power rankings of premier futures prop firms based on verified data.",
  },
};

export const revalidate = 3600;

export default async function RankingsPage() {
  const { rankings, period } = await loadRankingsPageData();

  return (
    <Container className="space-y-8 py-8 md:py-12">
      <header className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-primary">
              Period: {period}
            </p>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Power rankings
            </h1>
            <p className="max-w-2xl text-muted-foreground">
              Premier futures prop firms ranked on verified pricing, payout
              reliability, trader-friendly rules, and platform quality. No firm
              can pay for placement.
            </p>
          </div>
          <Link
            href="/methodology"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            How we rank
          </Link>
        </div>
      </header>

      <RankingsList rankings={rankings} />

      <aside className="rounded-xl border border-border/60 bg-muted/30 p-6 text-sm text-muted-foreground">
        <p>
          Rankings reflect data as of{" "}
          <span className="font-medium text-foreground">{period}</span> and are
          re-evaluated when firms change pricing, rules, or payout performance.{" "}
          <Link
            href="/methodology"
            className="text-primary hover:underline underline-offset-4"
          >
            Read our full methodology
          </Link>
          .
        </p>
      </aside>
    </Container>
  );
}
