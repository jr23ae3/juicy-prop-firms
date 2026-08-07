import { CURRENT_RANKING_PERIOD } from "@/config/rankings";
import type {
  CreateDiscountInput,
  CreateFirmInput,
  CreatePlanInput,
  UpdateFirmInput,
  UpdatePlanInput,
} from "@/lib/validations/admin";
import { db } from "@/lib/db";
import { toNumber, decimalValuesEqual } from "@/lib/decimal";
import { isDatabaseConfigured } from "@/lib/env";
import {
  logEvalPriceChange,
} from "@/services/admin/eval-price-history";
import { logResetFeeChange } from "@/services/admin/reset-fee-history";

function assertDb() {
  if (!isDatabaseConfigured()) {
    throw new Error("Database not configured");
  }
}

export async function getAdminStats() {
  assertDb();

  const [firms, plans, discounts, users] = await Promise.all([
    db.propFirm.count(),
    db.plan.count({ where: { isActive: true } }),
    db.discount.count({ where: { isActive: true } }),
    db.user.count(),
  ]);

  return { firms, plans, discounts, users };
}

export async function listFirmsForAdmin() {
  assertDb();

  return db.propFirm.findMany({
    orderBy: [{ rankPosition: "asc" }, { name: "asc" }],
    include: {
      _count: { select: { plans: { where: { isActive: true } } } },
      rankings: {
        where: { period: CURRENT_RANKING_PERIOD },
        take: 1,
      },
    },
  });
}

export async function getFirmForAdmin(firmId: string) {
  assertDb();

  return db.propFirm.findUnique({
    where: { id: firmId },
    include: {
      plans: {
        orderBy: { accountSize: "asc" },
        include: {
          discounts: {
            where: { isActive: true },
            orderBy: { verifiedAt: "desc" },
            take: 1,
          },
          evalPriceHistory: {
            orderBy: { createdAt: "desc" },
            take: 20,
            include: {
              changedByUser: {
                select: { email: true, name: true },
              },
            },
          },
          resetFeeHistory: {
            orderBy: { createdAt: "desc" },
            take: 20,
            include: {
              changedByUser: {
                select: { email: true, name: true },
              },
            },
          },
        },
      },
      rankings: {
        where: { period: CURRENT_RANKING_PERIOD },
        take: 1,
      },
    },
  });
}

export async function createFirm(input: CreateFirmInput) {
  assertDb();

  return db.propFirm.create({
    data: {
      slug: input.slug,
      name: input.name,
      description: input.description,
      websiteUrl: input.websiteUrl || null,
      logoUrl: input.logoUrl || null,
      isActive: input.isActive,
    },
  });
}

export async function createFirmWithRanking(
  input: CreateFirmInput & {
    rankScore?: number;
    rankPosition?: number;
    payoutSpeed?: number;
    affordability?: number;
    ruleFriendliness?: number;
    platformQuality?: number;
  },
) {
  assertDb();

  const firm = await createFirm(input);

  if (input.rankScore != null && input.rankPosition != null) {
    const factors: Record<string, number> = {};
    if (input.payoutSpeed != null) factors.payoutSpeed = input.payoutSpeed;
    if (input.affordability != null) factors.affordability = input.affordability;
    if (input.ruleFriendliness != null) {
      factors.ruleFriendliness = input.ruleFriendliness;
    }
    if (input.platformQuality != null) {
      factors.platformQuality = input.platformQuality;
    }

    await db.propFirm.update({
      where: { id: firm.id },
      data: {
        rankScore: input.rankScore,
        rankPosition: input.rankPosition,
      },
    });

    await db.firmRanking.upsert({
      where: {
        propFirmId_period: {
          propFirmId: firm.id,
          period: CURRENT_RANKING_PERIOD,
        },
      },
      create: {
        propFirmId: firm.id,
        score: input.rankScore,
        position: input.rankPosition,
        period: CURRENT_RANKING_PERIOD,
        factors: Object.keys(factors).length > 0 ? factors : undefined,
      },
      update: {
        score: input.rankScore,
        position: input.rankPosition,
        factors: Object.keys(factors).length > 0 ? factors : undefined,
      },
    });
  }

  return firm;
}

export async function updateFirmWithRanking(
  firmId: string,
  input: UpdateFirmInput,
) {
  assertDb();

  const {
    rankScore,
    rankPosition,
    payoutSpeed,
    affordability,
    ruleFriendliness,
    platformQuality,
    ...firmFields
  } = input;

  const firm = await db.propFirm.update({
    where: { id: firmId },
    data: {
      ...(firmFields.slug !== undefined ? { slug: firmFields.slug } : {}),
      ...(firmFields.name !== undefined ? { name: firmFields.name } : {}),
      ...(firmFields.description !== undefined
        ? { description: firmFields.description || null }
        : {}),
      ...(firmFields.websiteUrl !== undefined
        ? { websiteUrl: firmFields.websiteUrl || null }
        : {}),
      ...(firmFields.logoUrl !== undefined
        ? { logoUrl: firmFields.logoUrl || null }
        : {}),
      ...(firmFields.isActive !== undefined
        ? { isActive: firmFields.isActive }
        : {}),
      ...(rankScore !== undefined ? { rankScore } : {}),
      ...(rankPosition !== undefined ? { rankPosition } : {}),
    },
  });

  if (rankScore != null && rankPosition != null) {
    const factors: Record<string, number> = {};
    if (payoutSpeed != null) factors.payoutSpeed = payoutSpeed;
    if (affordability != null) factors.affordability = affordability;
    if (ruleFriendliness != null) factors.ruleFriendliness = ruleFriendliness;
    if (platformQuality != null) factors.platformQuality = platformQuality;

    await db.firmRanking.upsert({
      where: {
        propFirmId_period: {
          propFirmId: firmId,
          period: CURRENT_RANKING_PERIOD,
        },
      },
      create: {
        propFirmId: firmId,
        score: rankScore,
        position: rankPosition,
        period: CURRENT_RANKING_PERIOD,
        factors: Object.keys(factors).length > 0 ? factors : undefined,
      },
      update: {
        score: rankScore,
        position: rankPosition,
        ...(Object.keys(factors).length > 0 ? { factors } : {}),
      },
    });
  }

  return firm;
}

export async function createPlan(
  input: CreatePlanInput,
  options?: { changedByUserId?: string },
) {
  assertDb();

  const {
    discountCode,
    discountPct,
    discountAmt,
    waivesActivationFee,
    propFirmId,
    ...planData
  } = input;

  const plan = await db.$transaction(async (tx) => {
    const created = await tx.plan.create({
      data: {
        propFirmId,
        slug: planData.slug,
        name: planData.name,
        accountSize: planData.accountSize,
        marketType: planData.marketType,
        evalType: planData.evalType,
        evalPrice: planData.evalPrice,
        activationFee: planData.activationFee ?? 0,
        resetFee: planData.resetFee ?? 0,
        profitTarget: planData.profitTarget,
        maxDrawdown: planData.maxDrawdown,
        dailyDrawdown: planData.dailyDrawdown,
        drawdownType: planData.drawdownType,
        minimumDays: planData.minimumDays,
        profitSplit: planData.profitSplit,
        maxPayout: planData.maxPayout,
        minimumDaysToPayout: planData.minimumDaysToPayout,
        minimumTargetGoalCushion: planData.minimumTargetGoalCushion,
        maxFundedAccounts: planData.maxFundedAccounts,
        fundedDrawdownType: planData.fundedDrawdownType,
        payoutFrequency: planData.payoutFrequency,
        isActive: planData.isActive,
      },
    });

    await logEvalPriceChange(tx, {
      planId: created.id,
      evalPrice: planData.evalPrice,
      previousEvalPrice: null,
      changedByUserId: options?.changedByUserId,
    });

    await logResetFeeChange(tx, {
      planId: created.id,
      resetFee: planData.resetFee ?? 0,
      previousResetFee: null,
      changedByUserId: options?.changedByUserId,
    });

    return created;
  });

  if (discountCode) {
    await createDiscount({
      planId: plan.id,
      code: discountCode,
      discountPct,
      discountAmt,
      waivesActivationFee,
      isActive: true,
    });
  }

  return plan;
}

export async function updatePlan(
  planId: string,
  input: UpdatePlanInput,
  options?: { changedByUserId?: string },
) {
  assertDb();

  const { discountCode, discountPct, discountAmt, waivesActivationFee, ...planData } = input;

  const plan = await db.$transaction(async (tx) => {
    const existing = await tx.plan.findUnique({
      where: { id: planId },
      select: { evalPrice: true, resetFee: true },
    });

    if (!existing) {
      throw new Error("Plan not found");
    }

    const updated = await tx.plan.update({
      where: { id: planId },
      data: {
        slug: planData.slug,
        name: planData.name,
        accountSize: planData.accountSize,
        marketType: planData.marketType,
        evalType: planData.evalType,
        evalPrice: planData.evalPrice,
        activationFee: planData.activationFee ?? 0,
        resetFee: planData.resetFee ?? 0,
        profitTarget: planData.profitTarget,
        maxDrawdown: planData.maxDrawdown,
        dailyDrawdown: planData.dailyDrawdown,
        drawdownType: planData.drawdownType,
        minimumDays: planData.minimumDays,
        profitSplit: planData.profitSplit,
        maxPayout: planData.maxPayout,
        minimumDaysToPayout: planData.minimumDaysToPayout,
        minimumTargetGoalCushion: planData.minimumTargetGoalCushion,
        maxFundedAccounts: planData.maxFundedAccounts,
        fundedDrawdownType: planData.fundedDrawdownType,
        payoutFrequency: planData.payoutFrequency,
        isActive: planData.isActive,
      },
    });

    if (!decimalValuesEqual(existing.evalPrice, planData.evalPrice)) {
      await logEvalPriceChange(tx, {
        planId,
        evalPrice: planData.evalPrice,
        previousEvalPrice: toNumber(existing.evalPrice),
        changedByUserId: options?.changedByUserId,
      });
    }

    const nextResetFee = planData.resetFee ?? 0;
    if (!decimalValuesEqual(existing.resetFee, nextResetFee)) {
      await logResetFeeChange(tx, {
        planId,
        resetFee: nextResetFee,
        previousResetFee: toNumber(existing.resetFee),
        changedByUserId: options?.changedByUserId,
      });
    }

    return updated;
  });

  if (discountCode) {
    await createDiscount({
      planId: plan.id,
      code: discountCode,
      discountPct,
      discountAmt,
      waivesActivationFee,
      isActive: true,
    });
  }

  return plan;
}

export async function deletePlan(planId: string) {
  assertDb();

  return db.plan.delete({
    where: { id: planId },
  });
}

export async function createDiscount(input: CreateDiscountInput) {
  assertDb();

  await db.discount.updateMany({
    where: { planId: input.planId, isActive: true },
    data: { isActive: false },
  });

  return db.discount.create({
    data: {
      planId: input.planId,
      code: input.code,
      discountPct: input.discountPct,
      discountAmt: input.discountAmt,
      waivesActivationFee: input.waivesActivationFee ?? false,
      expiresAt: input.expiresAt,
      isActive: input.isActive,
      verifiedAt: new Date(),
    },
  });
}

export async function deactivatePlan(planId: string) {
  assertDb();

  return db.plan.update({
    where: { id: planId },
    data: { isActive: false },
  });
}

export async function deactivateFirm(firmId: string) {
  assertDb();

  return db.propFirm.update({
    where: { id: firmId },
    data: { isActive: false },
  });
}
