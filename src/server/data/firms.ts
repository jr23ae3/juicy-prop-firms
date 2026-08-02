import { serializePlan, serializeRanking } from "@/lib/serializers/plan";
import { getFirmBySlug } from "@/services/firm-service";
import type { FirmSummary, PlanSummary, RankingSummary } from "@/types/plan";

export type FirmPageData = {
  firm: FirmSummary;
  plans: PlanSummary[];
  ranking: RankingSummary | null;
  lowestAllIn: number | null;
};

export async function loadFirmPageData(
  slug: string,
): Promise<FirmPageData | null> {
  try {
    const firm = await getFirmBySlug(slug);
    if (!firm || !firm.isActive) return null;

    const plans = firm.plans.map((plan) =>
      serializePlan({ ...plan, propFirm: firm, discounts: plan.discounts }),
    );

    const ranking = firm.rankings[0]
      ? serializeRanking({ ...firm.rankings[0], propFirm: firm })
      : null;

    const lowestAllIn =
      plans.length > 0
        ? Math.min(...plans.map((p) => p.pricing.allInCost))
        : null;

    return {
      firm: {
        id: firm.id,
        slug: firm.slug,
        name: firm.name,
        description: firm.description,
        websiteUrl: firm.websiteUrl,
        logoUrl: firm.logoUrl,
        rankScore: firm.rankScore,
        rankPosition: firm.rankPosition,
      },
      plans,
      ranking,
      lowestAllIn,
    };
  } catch {
    return null;
  }
}
