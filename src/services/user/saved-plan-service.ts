import { serializePlan } from "@/lib/serializers/plan";
import { db } from "@/lib/db";
import { freeTierLimits } from "@/config/premium";
import { isUserPremium } from "@/services/subscription/subscription-service";
import type { SavedPlansResponse } from "@/types/user";

export async function getSavedPlansForUser(
  userId: string,
): Promise<SavedPlansResponse> {
  const saved = await db.savedPlan.findMany({
    where: { userId },
    include: {
      plan: {
        include: {
          propFirm: true,
          discounts: {
            where: { isActive: true },
            orderBy: { verifiedAt: "desc" },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const plans = saved.map((entry) =>
    serializePlan({
      ...entry.plan,
      propFirm: entry.plan.propFirm,
      discounts: entry.plan.discounts,
    }),
  );

  return {
    planIds: plans.map((p) => p.id),
    plans,
  };
}

export async function getSavedPlanIds(userId: string): Promise<string[]> {
  const saved = await db.savedPlan.findMany({
    where: { userId },
    select: { planId: true },
  });

  return saved.map((s) => s.planId);
}

export async function savePlanForUser(userId: string, planId: string) {
  const alreadySaved = await isPlanSaved(userId, planId);

  if (!alreadySaved) {
    const premium = await isUserPremium(userId);
    if (!premium) {
      const count = await db.savedPlan.count({ where: { userId } });
      if (count >= freeTierLimits.maxSavedPlans) {
        throw new Error("PREMIUM_REQUIRED");
      }
    }
  }

  return db.savedPlan.upsert({
    where: {
      userId_planId: { userId, planId },
    },
    create: { userId, planId },
    update: {},
  });
}

export async function unsavePlanForUser(userId: string, planId: string) {
  return db.savedPlan.deleteMany({
    where: { userId, planId },
  });
}

export async function isPlanSaved(userId: string, planId: string) {
  const count = await db.savedPlan.count({
    where: { userId, planId },
  });
  return count > 0;
}
