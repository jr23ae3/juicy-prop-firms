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
    <div className="site-canvas compare-workspace">
      <ArcadeStarfield />
      <ArcadePacmanBackground />

      <Container className="relative z-[1] space-y-8 py-8 md:py-12">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <p className="arcade-level-num text-[#ffd700]">★ NOW PLAYING ★</p>
          <h1 className="compare-arcade-title mt-3 text-lg sm:text-xl md:text-2xl">
            TAPE QUEST
          </h1>
          <p className="arcade-subtitle mt-2">
            1M FUTURES ARCADE · NQ · MNQ · ES · MES
          </p>
          <p className="compare-arcade-lead mx-auto mt-6 max-w-2xl">
            Select a prop firm eval plan to simulate its profit target and
            drawdown rules, then train on the daily 1-minute chart in{" "}
            <strong className="font-normal text-primary">Practice</strong> or
            chase missions in{" "}
            <strong className="font-normal text-primary">Arcade</strong>.
          </p>
        </div>

        <div className="mx-auto max-w-7xl">
          <MarketReplayScreen sessionDate={sessionDate} initialPlanId={planId ?? null} />
        </div>
      </Container>
    </div>
  );
}
