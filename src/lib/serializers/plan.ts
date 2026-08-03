import {
  calculateAllInCost,
  calculateNetPayout,
  calculateReturnMultiple,
  calculateSavings,
} from "@/lib/calculations";
import { toNumber, toNumberOrNull } from "@/lib/decimal";
import type {
  DiscountSummary,
  FirmSummary,
  PlanPricing,
  PlanRecord,
  PlanSummary,
  RankingSummary,
} from "@/types/plan";

function serializeDiscount(
  discount: PlanRecord["discounts"][number] | undefined,
): DiscountSummary | null {
  if (!discount) return null;

  return {
    id: discount.id,
    code: discount.code,
    discountPct: toNumberOrNull(discount.discountPct),
    discountAmt: toNumberOrNull(discount.discountAmt),
    waivesActivationFee: discount.waivesActivationFee,
    expiresAt: discount.expiresAt?.toISOString() ?? null,
    verifiedAt: discount.verifiedAt?.toISOString() ?? null,
  };
}

function serializeFirm(firm: PlanRecord["propFirm"]): FirmSummary {
  return {
    id: firm.id,
    slug: firm.slug,
    name: firm.name,
    description: firm.description,
    websiteUrl: firm.websiteUrl,
    logoUrl: firm.logoUrl,
    rankScore: firm.rankScore,
    rankPosition: firm.rankPosition,
  };
}

function getActiveDiscount(plan: PlanRecord) {
  const now = new Date();
  return plan.discounts.find(
    (d) =>
      d.isActive &&
      (!d.expiresAt || d.expiresAt > now),
  );
}

function serializePricing(plan: PlanRecord): PlanPricing {
  const evalPrice = toNumber(plan.evalPrice);
  const activationFee = toNumber(plan.activationFee);
  const discount = getActiveDiscount(plan);
  const discountInput = discount
    ? {
        discountPct: toNumberOrNull(discount.discountPct),
        discountAmt: toNumberOrNull(discount.discountAmt),
        waivesActivationFee: discount.waivesActivationFee,
      }
    : null;

  const discountedPrice = calculateAllInCost(evalPrice, 0, discountInput);
  const allInCost = calculateAllInCost(evalPrice, activationFee, discountInput);
  const activationFeeWaived = Boolean(
    discount?.waivesActivationFee && activationFee > 0,
  );
  const effectiveActivationFee = activationFeeWaived ? 0 : activationFee;
  const netPayout = calculateNetPayout(
    toNumberOrNull(plan.maxPayout),
    toNumberOrNull(plan.profitSplit),
    plan.accountSize,
  );

  return {
    evalPrice,
    activationFee,
    effectiveActivationFee,
    activationFeeWaived,
    discountedPrice,
    allInCost,
    savings: calculateSavings(evalPrice, discountInput),
    netPayout,
    returnMultiple: calculateReturnMultiple(netPayout, allInCost),
  };
}

export function serializePlan(plan: PlanRecord): PlanSummary {
  const discount = getActiveDiscount(plan);

  return {
    id: plan.id,
    slug: plan.slug,
    name: plan.name,
    accountSize: plan.accountSize,
    evalType: plan.evalType,
    profitTarget: toNumberOrNull(plan.profitTarget),
    resetFee: toNumber(plan.resetFee),
    maxDrawdown: toNumberOrNull(plan.maxDrawdown),
    dailyDrawdown: toNumberOrNull(plan.dailyDrawdown),
    drawdownType: plan.drawdownType,
    minimumDays: plan.minimumDays,
    profitSplit: toNumberOrNull(plan.profitSplit),
    maxPayout: toNumberOrNull(plan.maxPayout),
    minimumDaysToPayout: plan.minimumDaysToPayout,
    minimumTargetGoalCushion: toNumberOrNull(plan.minimumTargetGoalCushion),
    maxFundedAccounts: plan.maxFundedAccounts,
    fundedDrawdownType: plan.fundedDrawdownType,
    payoutFrequency: plan.payoutFrequency,
    firm: serializeFirm(plan.propFirm),
    discount: serializeDiscount(discount),
    pricing: serializePricing(plan),
  };
}

export function serializePlans(plans: PlanRecord[]): PlanSummary[] {
  return plans.map(serializePlan);
}

export function serializeRanking(
  ranking: {
    position: number;
    score: number;
    period: string;
    factors: unknown;
    propFirm: PlanRecord["propFirm"];
  },
): RankingSummary {
  return {
    position: ranking.position,
    score: ranking.score,
    period: ranking.period,
    firm: serializeFirm(ranking.propFirm),
    factors:
      ranking.factors && typeof ranking.factors === "object"
        ? (ranking.factors as Record<string, number>)
        : null,
  };
}
