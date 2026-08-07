import type { Metadata } from "next";

import { AdvisorQuestionnaire } from "@/components/advisor/advisor-questionnaire";
import { Container } from "@/components/layout/container";
import { ArcadeAdvisorCharacter } from "@/components/marketing/arcade-advisor-character";
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
          <div className="mb-4 pt-8">
            <ArcadeAdvisorCharacter size="lg" showBubble animate />
          </div>

          <p className="arcade-level-num text-[#ffd700]">★ NPC UNLOCKED ★</p>
          <h1 className="arcade-title mt-3 text-lg sm:text-xl md:text-2xl">
            ORACLE OJ
          </h1>
          <p className="arcade-subtitle mt-2">AI BOSS · FIRM MATCHMAKER</p>

          <p className="mx-auto mt-6 max-w-lg font-mono text-xs leading-relaxed text-muted-foreground sm:text-sm">
            Tell Oracle OJ how you trade and get matched with the best plans from
            our verified catalog — ranked by fit, all-in cost, and your
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
          <AdvisorQuestionnaire />
        </div>
      </Container>
    </div>
  );
}
