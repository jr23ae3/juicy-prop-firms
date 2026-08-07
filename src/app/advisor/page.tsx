import type { Metadata } from "next";
import { Suspense } from "react";

import { AdvisorQuestionnaireFromUrl } from "@/components/advisor/advisor-questionnaire";
import { Container } from "@/components/layout/container";
import { ArcadeAdvisorCharacter } from "@/components/marketing/arcade-advisor-character";
import { isOpenAIConfigured } from "@/lib/env";

export const metadata: Metadata = {
  title: "AI Advisor",
  description:
    "Get personalized prop firm recommendations for futures, forex, stocks, and crypto based on your trading style, budget, and priorities.",
  openGraph: {
    title: "AI Prop Firm Advisor",
    description:
      "Answer a few questions and get matched with the best prop firm plans for your market.",
  },
};

export default function AdvisorPage() {
  const aiEnabled = isOpenAIConfigured();

  return (
    <div className="site-canvas compare-workspace">
      <Container className="relative z-[1] space-y-8 py-8 md:py-12">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <div className="mb-4 pt-4">
            <ArcadeAdvisorCharacter size="lg" showBubble animate />
          </div>

          <p className="arcade-level-num text-[#ffd700]">★ NPC UNLOCKED ★</p>
          <h1 className="compare-arcade-title mt-3 text-lg sm:text-xl md:text-2xl">
            ORACLE OJ
          </h1>
          <p className="arcade-subtitle mt-2">
            AI BOSS · FUTURES · FOREX · STOCKS · CRYPTO
          </p>

          <p className="compare-arcade-lead mx-auto mt-6 max-w-lg">
            Choose your market, tell Oracle OJ how you trade, and get matched
            with verified plans — ranked by fit, all-in cost, and your
            priorities.
          </p>
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
          <Suspense fallback={<AdvisorQuestionnaireFallback />}>
            <AdvisorQuestionnaireFromUrl />
          </Suspense>
        </div>
      </Container>
    </div>
  );
}

function AdvisorQuestionnaireFallback() {
  return (
    <div className="rounded-lg border border-primary/25 bg-card/50 p-8 text-center font-mono text-sm text-muted-foreground">
      Loading advisor…
    </div>
  );
}
