import { serializePlan, serializePlans, serializeRanking } from "@/lib/serializers/plan";
import { getActiveFirms, getFirmBySlug } from "@/services/firm-service";
import { getActivePlans, getPlanById } from "@/services/plan-service";
import { getCurrentRankings } from "@/services/ranking-service";
import type { ApiResponse } from "@/types/index";
import type { PlanFilters, PlanSummary, RankingSummary } from "@/types/plan";

export async function loadPlansWithPricing(
  filters?: PlanFilters,
): Promise<PlanSummary[]> {
  const plans = await getActivePlans(filters);
  return serializePlans(plans);
}

export async function loadPlanWithPricing(
  id: string,
): Promise<PlanSummary | null> {
  const plan = await getPlanById(id);
  if (!plan) return null;
  return serializePlan(plan);
}

export async function loadRankings(): Promise<RankingSummary[]> {
  const rankings = await getCurrentRankings();
  return rankings.map(serializeRanking);
}

export async function loadFirmWithPlans(slug: string) {
  const firm = await getFirmBySlug(slug);
  if (!firm) return null;

  const plans = firm.plans.flatMap((plan) => {
    const withFirm = { ...plan, propFirm: firm };
    return [serializePlan(withFirm)];
  });

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
    ranking: firm.rankings[0]
      ? serializeRanking({ ...firm.rankings[0], propFirm: firm })
      : null,
  };
}

export async function loadPlatformStats(): Promise<
  ApiResponse<{ firms: number; plans: number; lowestAllIn: number | null }>
> {
  try {
    const firms = await getActiveFirms();
    const plans = await loadPlansWithPricing();

    const lowestAllIn =
      plans.length > 0
        ? Math.min(...plans.map((p) => p.pricing.allInCost))
        : null;

    return {
      success: true,
      data: {
        firms: firms.length,
        plans: plans.length,
        lowestAllIn,
      },
    };
  } catch {
    return {
      success: false,
      error: "Unable to load platform stats",
    };
  }
}

export type FeaturedFirm = {
  slug: string;
  name: string;
  logoUrl: string | null;
  rankPosition: number | null;
};

export async function loadHomepageData(): Promise<
  ApiResponse<{
    stats: { firms: number; plans: number; lowestAllIn: number | null };
    featuredFirms: FeaturedFirm[];
  }>
> {
  try {
    const firms = await getActiveFirms();
    const plans = await loadPlansWithPricing();

    const lowestAllIn =
      plans.length > 0
        ? Math.min(...plans.map((p) => p.pricing.allInCost))
        : null;

    const featuredFirms = [...firms]
      .sort(
        (a, b) =>
          (a.rankPosition ?? Number.MAX_SAFE_INTEGER) -
          (b.rankPosition ?? Number.MAX_SAFE_INTEGER),
      )
      .slice(0, 10)
      .map((firm) => ({
        slug: firm.slug,
        name: firm.name,
        logoUrl: firm.logoUrl,
        rankPosition: firm.rankPosition,
      }));

    return {
      success: true,
      data: {
        stats: {
          firms: firms.length,
          plans: plans.length,
          lowestAllIn,
        },
        featuredFirms,
      },
    };
  } catch {
    return {
      success: false,
      error: "Unable to load homepage data",
    };
  }
}
