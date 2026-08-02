import { serializePlan } from "@/lib/serializers/plan";
import { toNumberOrNull } from "@/lib/decimal";
import { db } from "@/lib/db";
import type { DealAlertInput } from "@/lib/validations/user";
import type { DealAlertSummary } from "@/types/user";

export async function getDealAlertsForUser(
  userId: string,
): Promise<DealAlertSummary[]> {
  const alerts = await db.dealAlert.findMany({
    where: { userId, isActive: true },
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

  return alerts.map((alert) => ({
    id: alert.id,
    planId: alert.planId,
    firmSlug: alert.firmSlug,
    maxAllIn: toNumberOrNull(alert.maxAllIn),
    label: alert.label,
    isActive: alert.isActive,
    createdAt: alert.createdAt.toISOString(),
    plan: alert.plan
      ? serializePlan({
          ...alert.plan,
          propFirm: alert.plan.propFirm,
          discounts: alert.plan.discounts,
        })
      : null,
  }));
}

export async function createDealAlert(userId: string, input: DealAlertInput) {
  if (!input.planId && !input.firmSlug) {
    throw new Error("Provide a plan or firm for the alert");
  }

  return db.dealAlert.create({
    data: {
      userId,
      planId: input.planId,
      firmSlug: input.firmSlug,
      maxAllIn: input.maxAllIn,
      label: input.label,
    },
  });
}

export async function deleteDealAlert(userId: string, alertId: string) {
  return db.dealAlert.deleteMany({
    where: { id: alertId, userId },
  });
}

export async function deactivateDealAlert(userId: string, alertId: string) {
  return db.dealAlert.updateMany({
    where: { id: alertId, userId },
    data: { isActive: false },
  });
}
