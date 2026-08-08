import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { MarketReplayScreen } from "@/components/skills-test/market-replay-screen";
import { ArcadePacmanBackground } from "@/components/marketing/arcade-pacman-background";
import { ArcadeStarfield } from "@/components/marketing/arcade-starfield";
import { getSessionDateKey } from "@/lib/skills-test/session-replay";

export const metadata: Metadata = {
  title: "Tape Quest",
  description:
    "Daily 1-minute futures training arcade for NQ, MNQ, ES, and MES. Practice entries, clear missions, chase the leaderboard, then compare prop firms.",
  openGraph: {
    title: "Tape Quest — 1M Futures Training Arcade",
    description:
      "Play the daily Tape Quest arcade with missions, co-pilot coaching, boss rounds, and a global leaderboard.",
  },
};

type SkillsTestPageProps = {
  searchParams: Promise<{ planId?: string }>;
};

export default async function SkillsTestPage({ searchParams }: SkillsTestPageProps) {
  const { planId } = await searchParams;
  const sessionDate = getSessionDateKey();

  return (
    <div className="site-canvas compare-workspace tape-quest-workspace">
      <ArcadeStarfield />
      <ArcadePacmanBackground />

      <Container
        size="full"
        className="relative z-[1] space-y-4 px-3 py-4 sm:px-4 md:py-5 lg:px-6"
      >
        <div className="tape-quest-header">
          <div className="tape-quest-header-brand">
            <p className="arcade-level-num text-[#ffd700]">★ NOW PLAYING ★</p>
            <div className="tape-quest-header-title-row">
              <h1 className="compare-arcade-title text-base sm:text-lg md:text-xl">
                TAPE QUEST
              </h1>
              <p className="tape-quest-header-meta">
                1M FUTURES · NQ · MNQ · ES · MES
              </p>
            </div>
          </div>
          <p className="tape-quest-header-copy">
            Pick an eval plan to simulate profit target and drawdown rules, then
            train in Practice or chase missions in Arcade.
          </p>
        </div>

        <MarketReplayScreen sessionDate={sessionDate} initialPlanId={planId ?? null} />
      </Container>
    </div>
  );
}
