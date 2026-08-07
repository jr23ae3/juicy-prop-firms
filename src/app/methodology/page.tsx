import Link from "next/link";
import {
  BadgeCheck,
  Ban,
  HandCoins,
  ShieldCheck,
  Wallet,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { IconTile } from "@/components/ui/icon-tile";
import { buttonVariants } from "@/components/ui/button";
import { RANKING_METHODOLOGY_POINTS } from "@/config/ranking-factors";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

const methodologyIcons = [
  ShieldCheck,
  Wallet,
  HandCoins,
  BadgeCheck,
  Ban,
] as const;

export const metadata: Metadata = {
  title: "How We Rank",
  description:
    "How Juicy Trade Firms verifies pricing, calculates all-in costs, and ranks futures prop firms without pay-for-placement.",
  openGraph: {
    title: "How We Rank Prop Firms",
    description:
      "Our verification and ranking methodology for futures prop firm comparisons.",
  },
};

export default function MethodologyPage() {
  return (
    <div className="site-canvas">
      <Container className="space-y-10 py-8 md:py-12">
        <PageHeader
          eyebrow="Methodology"
          title="How we rank & verify"
          description="Every price, rule, and discount on Juicy Trade Firms is checked against one source: the prop firm itself. Scores are independent — no pay-for-placement, ever."
          align="center"
        />

        <ol className="mx-auto grid max-w-3xl gap-4">
          {RANKING_METHODOLOGY_POINTS.map((point, index) => {
            const Icon = methodologyIcons[index] ?? ShieldCheck;
            return (
            <li key={point.title} className="surface p-5">
              <div className="flex gap-4">
                <IconTile icon={Icon} />
                <div>
                  <h2 className="font-semibold">{point.title}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {point.description}
                  </p>
                </div>
              </div>
            </li>
            );
          })}
        </ol>

        <section className="surface-muted mx-auto max-w-3xl p-6">
          <h2 className="font-heading text-lg font-semibold">Scoring factors</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Each firm receives scores across payout speed, affordability (true
            all-in cost), trader-friendly rules, and platform quality. These
            feed the overall Juice Index score shown on firm profiles.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/rankings" className={cn(buttonVariants(), "cta-arrow")}>
              View Juice Index
            </Link>
            <Link
              href="/compare"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Compare all plans
            </Link>
          </div>
        </section>
      </Container>
    </div>
  );
}
