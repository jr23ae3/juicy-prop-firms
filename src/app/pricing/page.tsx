import type { Metadata } from "next";

import { PricingCards } from "@/components/premium/pricing-cards";
import { Container } from "@/components/layout/container";
import { premiumFeatures, premiumPlan } from "@/config/premium";

export const metadata: Metadata = {
  title: "Pricing",
  description: `Compare free vs ${premiumPlan.name} — unlock AI advisor, deal alerts, and unlimited saved plans.`,
};

export default function PricingPage() {
  return (
    <Container className="space-y-10 py-12">
      <header className="mx-auto max-w-2xl space-y-3 text-center">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Simple, transparent pricing
        </h1>
        <p className="text-muted-foreground">
          Compare prop firms for free. Upgrade to {premiumPlan.name} when you
          want the full AI advisor, deal alerts, and unlimited bookmarks.
        </p>
      </header>

      <PricingCards />

      <section className="mx-auto max-w-2xl space-y-4">
        <h2 className="text-lg font-semibold">What&apos;s included in Pro</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {premiumFeatures.map((feature) => (
            <li
              key={feature.id}
              className="rounded-lg border border-border/60 bg-card p-4 text-sm"
            >
              <p className="font-medium">{feature.title}</p>
              <p className="mt-1 text-muted-foreground">{feature.description}</p>
            </li>
          ))}
        </ul>
      </section>
    </Container>
  );
}
