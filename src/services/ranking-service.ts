import { CURRENT_RANKING_PERIOD } from "@/config/rankings";
import { db } from "@/lib/db";
import { isDatabaseConfigured } from "@/lib/env";

export async function getCurrentRankings(
  period: string = CURRENT_RANKING_PERIOD,
) {
  if (!isDatabaseConfigured()) return [];

  return db.firmRanking.findMany({
    where: { period },
    include: { propFirm: true },
    orderBy: { position: "asc" },
  });
}

export async function getRankingByFirmSlug(
  slug: string,
  period: string = CURRENT_RANKING_PERIOD,
) {
  if (!isDatabaseConfigured()) return null;

  return db.firmRanking.findFirst({
    where: {
      period,
      propFirm: { slug },
    },
    include: { propFirm: true },
  });
}
