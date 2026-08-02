import type { Metadata } from "next";

import { AdvisorQuestionnaire } from "@/components/advisor/advisor-questionnaire";
import { Container } from "@/components/layout/container";
import { isOpenAIConfigured } from "@/lib/env";

export const metadata: Metadata = {
  title: "AI Advisor",
  description:
    "Get personalized futures prop firm recommendations based on your trading style, budget, and priorities.",
  openGraph: {
    title: "AI Prop Firm Advisor",
    description:
      "Answer a few questions and get matched with the best prop firm plans for you.",
  },
};

export default function AdvisorPage() {
  const aiEnabled = isOpenAIConfigured();

  return (
    <Container className="space-y-6 py-8 md:py-12">
      <header className="mx-auto max-w-2xl space-y-3 text-center">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          AI Prop Firm Advisor
        </h1>
        <p className="text-muted-foreground">
          Tell us how you trade and we&apos;ll recommend the best plans from our
          verified catalog — ranked by fit, all-in cost, and your priorities.
        </p>
        {!aiEnabled ? (
          <p className="text-sm text-muted-foreground">
            Running in smart-match mode. Add{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
              OPENAI_API_KEY
            </code>{" "}
            to enable full AI reasoning.
          </p>
        ) : null}
      </header>

      <div className="mx-auto max-w-2xl">
        <AdvisorQuestionnaire />
      </div>
    </Container>
  );
}
