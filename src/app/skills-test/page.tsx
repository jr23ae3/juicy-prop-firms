import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { MarketReplayScreen } from "@/components/skills-test/market-replay-screen";
import { ArcadePacmanBackground } from "@/components/marketing/arcade-pacman-background";
import { ArcadeStarfield } from "@/components/marketing/arcade-starfield";
import { getSessionDateKey } from "@/lib/skills-test/session-replay";

export const metadata: Metadata = {
  title: "Skills Test",
  description:
    "Replay today's futures session for NQ, MNQ, ES, and MES. Practice reading price action before you trade evals.",
  openGraph: {
    title: "Skills Test — Futures Session Replay",
    description:
      "Screen replay of the RTH session for NQ, MNQ, ES, and MES futures.",
  },
};

export default function SkillsTestPage() {
  const sessionDate = getSessionDateKey();

  return (
    <div className="site-canvas compare-workspace">
      <ArcadeStarfield />
      <ArcadePacmanBackground />

      <Container className="relative z-[1] space-y-8 py-8 md:py-12">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <p className="arcade-level-num text-[#ffd700]">★ TRAINING MODE ★</p>
          <h1 className="compare-arcade-title mt-3 text-lg sm:text-xl md:text-2xl">
            SKILLS TEST
          </h1>
          <p className="arcade-subtitle mt-2">
            FUTURES REPLAY · NQ · MNQ · ES · MES
          </p>
          <p className="compare-arcade-lead mx-auto mt-6 max-w-2xl">
            Watch today&apos;s regular trading hours session unfold bar by bar.
            Switch contracts, scrub the timeline, and train your eye before
            you step into a prop eval.
          </p>
        </div>

        <div className="mx-auto max-w-5xl">
          <MarketReplayScreen sessionDate={sessionDate} />
        </div>
      </Container>
    </div>
  );
}
