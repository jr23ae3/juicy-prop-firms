import { CURRENT_RANKING_PERIOD } from "@/config/rankings";
import { serializeRanking } from "@/lib/serializers/plan";
import { getActiveFirmSlugs } from "@/services/firm-service";
import { getCurrentRankings } from "@/services/ranking-service";
import type { RankingSummary } from "@/types/plan";

export async function loadRankingsPageData(): Promise<{
  rankings: RankingSummary[];
  period: string;
}> {
  try {
    const rankings = await getCurrentRankings();
    return {
      rankings: rankings.map(serializeRanking),
      period: CURRENT_RANKING_PERIOD,
    };
  } catch {
    return { rankings: [], period: CURRENT_RANKING_PERIOD };
  }
}

export async function loadFirmSlugsForSitemap(): Promise<string[]> {
  try {
    return await getActiveFirmSlugs();
  } catch {
    return [];
  }
}
