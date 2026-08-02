import Link from "next/link";

import { Container } from "@/components/layout/container";
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
    <Container className="space-y-10 py-8 md:py-12">
      <header className="mx-auto max-w-3xl space-y-3 text-center">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          How we rank & verify
        </h1>
        <p className="text-lg text-muted-foreground">
          Every price, rule, and discount on Juicy Prop Firms is checked against
          one source: the prop firm itself. Rankings are independent — no
          pay-for-placement, ever.
        </p>
      </header>

      <ol className="mx-auto grid max-w-3xl gap-4">
        {RANKING_METHODOLOGY_POINTS.map((point, index) => (
          <li
            key={point.title}
            className="rounded-xl border border-border/60 bg-card p-5 shadow-sm"
          >
            <div className="flex gap-4">
              <span
                aria-hidden
                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary"
              >
                {index + 1}
              </span>
              <div>
                <h2 className="font-semibold">{point.title}</h2>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {point.description}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ol>

      <section className="mx-auto max-w-3xl rounded-xl border border-border/60 bg-muted/30 p-6">
        <h2 className="text-lg font-semibold">Ranking factors</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Each firm receives scores across payout speed, affordability (true
          all-in cost), trader-friendly rules, and platform quality. These feed
          the overall power score shown on firm profiles and the rankings page.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/rankings" className={cn(buttonVariants())}>
            View power rankings
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
  );
}
