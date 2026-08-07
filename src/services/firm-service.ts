import type { MarketType, Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { isDatabaseConfigured } from "@/lib/env";

export async function getActiveFirmsForMarket(marketType: MarketType = "FUTURES") {
  if (!isDatabaseConfigured()) return [];

  return db.propFirm.findMany({
    where: {
      isActive: true,
      plans: { some: { isActive: true, marketType } },
    },
    orderBy: { rankPosition: "asc" },
    select: {
      slug: true,
      name: true,
      rankPosition: true,
    },
  });
}

const firmInclude = {
  plans: {
    where: { isActive: true },
    include: {
      discounts: {
        where: { isActive: true },
        orderBy: { verifiedAt: "desc" as const },
      },
    },
    orderBy: { accountSize: "asc" as const },
  },
  rankings: {
    orderBy: { position: "asc" as const },
    take: 1,
  },
} satisfies Prisma.PropFirmInclude;

export async function getActiveFirms() {
  if (!isDatabaseConfigured()) return [];

  return db.propFirm.findMany({
    where: { isActive: true },
    orderBy: { rankPosition: "asc" },
    include: firmInclude,
  });
}

export async function getFirmBySlug(slug: string) {
  if (!isDatabaseConfigured()) return null;

  return db.propFirm.findUnique({
    where: { slug },
    include: firmInclude,
  });
}

export async function getFirmCount() {
  if (!isDatabaseConfigured()) return 0;

  return db.propFirm.count({ where: { isActive: true } });
}

export async function getActiveFirmSlugs() {
  if (!isDatabaseConfigured()) return [];

  const firms = await db.propFirm.findMany({
    where: { isActive: true },
    select: { slug: true },
    orderBy: { rankPosition: "asc" },
  });

  return firms.map((f) => f.slug);
}
