import type { Metadata } from "next";

import { PricingCards } from "@/components/premium/pricing-cards";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { premiumFeatures, premiumPlan } from "@/config/premium";

export const metadata: Metadata = {
  title: "Pricing",
  description: `Compare free vs ${premiumPlan.name} — unlock AI advisor, deal alerts, and unlimited saved plans.`,
};

export default function PricingPage() {
  return (
    <div className="site-canvas">
      <Container className="space-y-10 py-12">
        <PageHeader
          eyebrow="Membership"
          title="Simple, transparent pricing"
          description={`Compare prop firms for free. Upgrade to ${premiumPlan.name} when you want the full AI advisor, deal alerts, and unlimited bookmarks.`}
          align="center"
        />

        <PricingCards />

        <section className="mx-auto max-w-2xl space-y-4">
          <h2 className="font-heading text-lg font-semibold">
            What&apos;s included in Pro
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {premiumFeatures.map((feature) => (
              <li key={feature.id} className="surface p-4 text-sm">
                <p className="font-medium">{feature.title}</p>
                <p className="mt-1 text-muted-foreground">{feature.description}</p>
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </div>
  );
}
