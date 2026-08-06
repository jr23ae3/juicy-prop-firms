import type { PlanFormValues } from "@/components/admin/plan-form-fields";

type PlanToDuplicate = PlanFormValues & {
  id: string;
  isActive: boolean;
};

export function planToDuplicateTemplate(plan: PlanToDuplicate): PlanFormValues {
  return {
    slug: `${plan.slug}-copy`,
    name: `${plan.name} (copy)`,
    accountSize: plan.accountSize,
    evalType: plan.evalType,
    evalPrice: plan.evalPrice,
    activationFee: plan.activationFee,
    resetFee: plan.resetFee,
    profitTarget: plan.profitTarget,
    dailyDrawdown: plan.dailyDrawdown,
    maxDrawdown: plan.maxDrawdown,
    minimumDays: plan.minimumDays,
    drawdownType: plan.drawdownType,
    profitSplit: plan.profitSplit,
    maxPayout: plan.maxPayout,
    payoutFrequency: plan.payoutFrequency,
    minimumDaysToPayout: plan.minimumDaysToPayout,
    minimumTargetGoalCushion: plan.minimumTargetGoalCushion,
    maxFundedAccounts: plan.maxFundedAccounts,
    fundedDrawdownType: plan.fundedDrawdownType,
    discount: plan.discount
      ? {
          code: plan.discount.code,
          discountPct: plan.discount.discountPct,
          discountAmt: plan.discount.discountAmt,
          waivesActivationFee: plan.discount.waivesActivationFee,
        }
      : null,
  };
}
