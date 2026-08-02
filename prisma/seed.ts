import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/generated/prisma/client";
import { CURRENT_RANKING_PERIOD } from "../src/config/rankings";
import { createPgPool } from "../src/lib/pg-pool";
import { resolveDatabaseUrl } from "../src/lib/resolve-env";
import { SEED_FIRMS } from "./seed/data/firms";

if (!resolveDatabaseUrl()) {
  console.error(
    "DATABASE_URL or POSTGRES_URL is required to run the seed script.",
  );
  process.exit(1);
}

const pool = createPgPool();
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding Juicy Prop Firms database…");

  for (const firmData of SEED_FIRMS) {
    const firm = await prisma.propFirm.upsert({
      where: { slug: firmData.slug },
      create: {
        slug: firmData.slug,
        name: firmData.name,
        description: firmData.description,
        websiteUrl: firmData.websiteUrl,
        isActive: true,
        rankScore: firmData.rankScore,
        rankPosition: firmData.rankPosition,
      },
      update: {
        name: firmData.name,
        description: firmData.description,
        websiteUrl: firmData.websiteUrl,
        rankScore: firmData.rankScore,
        rankPosition: firmData.rankPosition,
        isActive: true,
      },
    });

    await prisma.firmRanking.upsert({
      where: {
        propFirmId_period: {
          propFirmId: firm.id,
          period: CURRENT_RANKING_PERIOD,
        },
      },
      create: {
        propFirmId: firm.id,
        score: firmData.rankScore,
        position: firmData.rankPosition,
        period: CURRENT_RANKING_PERIOD,
        factors: firmData.rankingFactors,
      },
      update: {
        score: firmData.rankScore,
        position: firmData.rankPosition,
        factors: firmData.rankingFactors,
      },
    });

    for (const planData of firmData.plans) {
      const plan = await prisma.plan.upsert({
        where: {
          propFirmId_slug: {
            propFirmId: firm.id,
            slug: planData.slug,
          },
        },
        create: {
          propFirmId: firm.id,
          slug: planData.slug,
          name: planData.name,
          accountSize: planData.accountSize,
          evalType: planData.evalType,
          evalPrice: planData.evalPrice,
          activationFee: planData.activationFee ?? 0,
          profitTarget: planData.profitTarget,
          maxDrawdown: planData.maxDrawdown,
          dailyDrawdown: planData.dailyDrawdown,
          drawdownType: planData.drawdownType,
          minimumDays: planData.minimumDays,
          profitSplit: planData.profitSplit,
          maxPayout: planData.maxPayout,
          payoutFrequency: planData.payoutFrequency,
          isActive: true,
        },
        update: {
          name: planData.name,
          accountSize: planData.accountSize,
          evalType: planData.evalType,
          evalPrice: planData.evalPrice,
          activationFee: planData.activationFee ?? 0,
          profitTarget: planData.profitTarget,
          maxDrawdown: planData.maxDrawdown,
          dailyDrawdown: planData.dailyDrawdown,
          drawdownType: planData.drawdownType,
          minimumDays: planData.minimumDays,
          profitSplit: planData.profitSplit,
          maxPayout: planData.maxPayout,
          payoutFrequency: planData.payoutFrequency,
          isActive: true,
        },
      });

      if (planData.discount) {
        await prisma.discount.deleteMany({ where: { planId: plan.id } });

        await prisma.discount.create({
          data: {
            planId: plan.id,
            code: planData.discount.code,
            discountPct: planData.discount.discountPct,
            discountAmt: planData.discount.discountAmt,
            isActive: true,
            verifiedAt: new Date(),
          },
        });
      }
    }

    console.log(`  ✓ ${firmData.name} (${firmData.plans.length} plans)`);
  }

  const [firmCount, planCount, discountCount] = await Promise.all([
    prisma.propFirm.count({ where: { isActive: true } }),
    prisma.plan.count({ where: { isActive: true } }),
    prisma.discount.count({ where: { isActive: true } }),
  ]);

  console.log(
    `\n✅ Seed complete: ${firmCount} firms, ${planCount} plans, ${discountCount} active discounts`,
  );
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
