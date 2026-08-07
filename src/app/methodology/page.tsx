import Link from "next/link";

import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { buttonVariants } from "@/components/ui/button";
import { RANKING_METHODOLOGY_POINTS } from "@/config/ranking-factors";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How We Rank",
  description:
    "How Juicy Prop Firms verifies pricing, calculates all-in costs, and ranks futures prop firms without pay-for-placement.",
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
          description="Every price, rule, and discount on Juicy Prop Firms is checked against one source: the prop firm itself. Scores are independent — no pay-for-placement, ever."
          align="center"
        />

        <ol className="mx-auto grid max-w-3xl gap-4">
          {RANKING_METHODOLOGY_POINTS.map((point, index) => (
            <li key={point.title} className="surface p-5">
              <div className="flex gap-4">
                <span
                  aria-hidden
                  className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/15 font-heading text-sm font-semibold text-primary"
                >
                  {index + 1}
                </span>
                <div>
                  <h2 className="font-heading font-semibold">{point.title}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {point.description}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>

        <section className="surface-muted mx-auto max-w-3xl p-6">
          <h2 className="font-heading text-lg font-semibold">Scoring factors</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Each firm receives scores across payout speed, affordability (true
            all-in cost), trader-friendly rules, and platform quality. These
            feed the overall Juice Index score shown on firm profiles.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/rankings" className={cn(buttonVariants(), "rounded-full")}>
              View Juice Index
            </Link>
            <Link
              href="/compare"
              className={cn(buttonVariants({ variant: "outline" }), "rounded-full")}
            >
              Compare all plans
            </Link>
          </div>
        </section>
      </Container>
    </div>
  );
}
