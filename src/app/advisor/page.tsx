import type { Metadata } from "next";
import Image from "next/image";

import { AdvisorQuestionnaire } from "@/components/advisor/advisor-questionnaire";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
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
    <div className="site-canvas">
      <Container className="space-y-8 py-8 md:py-12">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <Image
            src="/illustrations/advisor.svg"
            alt=""
            width={200}
            height={160}
            className="mb-6 opacity-90"
          />
          <PageHeader
            eyebrow="Personalized matching"
            title="AI advisor"
            description="Tell us how you trade and we'll recommend the best plans from our verified catalog — ranked by fit, all-in cost, and your priorities."
            align="center"
            className="border-0 pb-0"
          />
        </div>

        {!aiEnabled ? (
          <p className="mx-auto max-w-2xl text-center text-sm text-muted-foreground">
            Running in smart-match mode. Add{" "}
            <code className="rounded-md bg-muted px-1.5 py-0.5 text-xs">
              OPENAI_API_KEY
            </code>{" "}
            to enable full AI reasoning.
          </p>
        ) : null}

        <div className="mx-auto max-w-2xl">
          <AdvisorQuestionnaire />
        </div>
      </Container>
    </div>
  );
}
