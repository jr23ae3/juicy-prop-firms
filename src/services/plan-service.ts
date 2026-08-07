import type { EvalType, Prisma } from "@/generated/prisma/client";
import { serializePlans } from "@/lib/serializers/plan";
import { db } from "@/lib/db";
import { isDatabaseConfigured } from "@/lib/env";
import type { PlanFilters, PlanSummary } from "@/types/plan";

const planInclude = {
  propFirm: true,
  discounts: {
    where: { isActive: true },
    orderBy: { verifiedAt: "desc" as const },
  },
} satisfies Prisma.PlanInclude;

function buildPlanWhere(filters?: PlanFilters): Prisma.PlanWhereInput {
  const where: Prisma.PlanWhereInput = { isActive: true };

  if (filters?.marketType) {
    where.marketType = filters.marketType;
  }

  if (filters?.firmSlug) {
    where.propFirm = { slug: filters.firmSlug };
  }

  if (filters?.evalType) {
    where.evalType = filters.evalType;
  }

  if (filters?.accountSize) {
    where.accountSize = filters.accountSize;
  }

  if (filters?.minAccountSize || filters?.maxAccountSize) {
    where.accountSize = {
      ...(filters.minAccountSize ? { gte: filters.minAccountSize } : {}),
      ...(filters.maxAccountSize ? { lte: filters.maxAccountSize } : {}),
    };
  }

  if (filters?.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { propFirm: { name: { contains: filters.search, mode: "insensitive" } } },
    ];
  }

  return where;
}

export async function getActivePlans(filters?: PlanFilters) {
  if (!isDatabaseConfigured()) return [];

  return db.plan.findMany({
    where: buildPlanWhere(filters),
    include: planInclude,
    orderBy: [{ propFirm: { rankPosition: "asc" } }, { accountSize: "asc" }],
  });
}

export async function getPlanById(id: string) {
  if (!isDatabaseConfigured()) return null;

  return db.plan.findUnique({
    where: { id },
    include: planInclude,
  });
}

export async function getPlanCount(filters?: Pick<PlanFilters, "evalType">) {
  if (!isDatabaseConfigured()) return 0;

  return db.plan.count({
    where: buildPlanWhere(filters),
  });
}

export async function getLowestAllInCostPlan(
  evalType?: EvalType,
): Promise<PlanSummary | null> {
  const plans = await getActivePlans({ evalType });
  if (plans.length === 0) return null;

  const serialized = serializePlans(plans);

  return serialized.reduce((lowest, plan) =>
    plan.pricing.allInCost < lowest.pricing.allInCost ? plan : lowest,
  );
}

export async function getDistinctAccountSizes(marketType?: PlanFilters["marketType"]) {
  if (!isDatabaseConfigured()) return [];

  const results = await db.plan.findMany({
    where: {
      isActive: true,
      ...(marketType ? { marketType } : {}),
    },
    select: { accountSize: true },
    distinct: ["accountSize"],
    orderBy: { accountSize: "asc" },
  });

  return results.map((r) => r.accountSize);
}
