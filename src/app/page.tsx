import { HeroSection } from "@/components/marketing/hero-section";
import {
  createOrganizationJsonLd,
  createWebsiteJsonLd,
  JsonLdScript,
} from "@/lib/seo/metadata";
import { getDailySeedLabel } from "@/lib/skills-test/arcade-game";
import { getSessionDateKey } from "@/lib/skills-test/session-replay";
import { loadHomepageData } from "@/server/data/plans";
import { loadSkillsLeaderboard } from "@/server/data/skills-leaderboard";

export const revalidate = 300;

export default async function HomePage() {
  const result = await loadHomepageData();
  const stats = result.success ? result.data.stats : undefined;
  const featuredFirms = result.success ? result.data.featuredFirms : [];
  const sessionDate = getSessionDateKey();
  const dailySeed = getDailySeedLabel(sessionDate);

  let dailyLeaderboard: Awaited<ReturnType<typeof loadSkillsLeaderboard>> = {
    date: sessionDate,
    entries: [],
  };
  try {
    dailyLeaderboard = await loadSkillsLeaderboard(sessionDate);
  } catch {
    // Keep empty board when database is unavailable.
  }

  return (
    <>
      <JsonLdScript data={createWebsiteJsonLd()} />
      <JsonLdScript data={createOrganizationJsonLd()} />
      <HeroSection
        stats={stats}
        featuredFirms={featuredFirms}
        dailyLeaderboard={dailyLeaderboard}
        sessionDate={sessionDate}
        dailySeed={dailySeed}
      />
    </>
  );
}
