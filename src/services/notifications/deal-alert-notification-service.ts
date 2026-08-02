import { toNumberOrNull } from "@/lib/decimal";
import { db } from "@/lib/db";
import { buildDealAlertEmail } from "@/lib/emails/templates";
import { isResendConfigured } from "@/lib/env";
import { loadPlansWithPricing } from "@/server/data/plans";
import { sendEmail } from "@/services/email/email-service";
import { isUserPremium } from "@/services/subscription/subscription-service";
import type { PlanSummary } from "@/types/plan";

const NOTIFY_COOLDOWN_HOURS = 24;
const PRICE_DROP_THRESHOLD = 5;

export type DealAlertRunResult = {
  checked: number;
  sent: number;
  skipped: number;
  errors: number;
  resendConfigured: boolean;
};

export async function processDealAlertNotifications(): Promise<DealAlertRunResult> {
  const result: DealAlertRunResult = {
    checked: 0,
    sent: 0,
    skipped: 0,
    errors: 0,
    resendConfigured: isResendConfigured(),
  };

  if (!isResendConfigured()) {
    return result;
  }

  const [alerts, allPlans] = await Promise.all([
    db.dealAlert.findMany({
      where: { isActive: true },
      include: {
        user: { include: { preferences: true } },
      },
    }),
    loadPlansWithPricing(),
  ]);

  for (const alert of alerts) {
    result.checked += 1;

    const alertsEnabled = alert.user.preferences?.alertsEnabled ?? true;
    if (!alertsEnabled) {
      result.skipped += 1;
      continue;
    }

    const premium = await isUserPremium(alert.userId);
    if (!premium) {
      result.skipped += 1;
      continue;
    }

    const matchingPlan = findBestMatchingPlan(alert, allPlans);
    if (!matchingPlan) {
      result.skipped += 1;
      continue;
    }

    const maxAllIn = toNumberOrNull(alert.maxAllIn);
    if (maxAllIn != null && matchingPlan.pricing.allInCost > maxAllIn) {
      result.skipped += 1;
      continue;
    }

    if (!shouldNotify(alert, matchingPlan)) {
      result.skipped += 1;
      continue;
    }

    const alertLabel =
      alert.label ??
      matchingPlan.firm.name ??
      alert.firmSlug ??
      "Deal alert";

    const { subject, html } = buildDealAlertEmail({
      alertLabel,
      plan: matchingPlan,
      maxAllIn,
    });

    const sendResult = await sendEmail({
      userId: alert.userId,
      to: alert.user.email,
      subject,
      html,
      type: "DEAL_ALERT",
      dealAlertId: alert.id,
      metadata: {
        planId: matchingPlan.id,
        allInCost: matchingPlan.pricing.allInCost,
      },
    });

    if (!sendResult.success) {
      result.errors += 1;
      continue;
    }

    await db.dealAlert.update({
      where: { id: alert.id },
      data: {
        lastNotifiedAt: new Date(),
        lastNotifiedAllIn: matchingPlan.pricing.allInCost,
      },
    });

    result.sent += 1;
  }

  return result;
}

function findBestMatchingPlan(
  alert: {
    planId: string | null;
    firmSlug: string | null;
  },
  plans: PlanSummary[],
): PlanSummary | null {
  if (alert.planId) {
    return plans.find((plan) => plan.id === alert.planId) ?? null;
  }

  if (alert.firmSlug) {
    const firmPlans = plans.filter((plan) => plan.firm.slug === alert.firmSlug);
    if (firmPlans.length === 0) return null;
    return firmPlans.reduce((best, plan) =>
      plan.pricing.allInCost < best.pricing.allInCost ? plan : best,
    );
  }

  return null;
}

function shouldNotify(
  alert: {
    lastNotifiedAt: Date | null;
    lastNotifiedAllIn: { toNumber(): number } | null;
  },
  plan: PlanSummary,
): boolean {
  if (!alert.lastNotifiedAt) {
    return true;
  }

  const lastPrice = toNumberOrNull(alert.lastNotifiedAllIn);
  const hoursSince =
    (Date.now() - alert.lastNotifiedAt.getTime()) / (1000 * 60 * 60);

  if (
    lastPrice != null &&
    plan.pricing.allInCost <= lastPrice - PRICE_DROP_THRESHOLD
  ) {
    return true;
  }

  if (hoursSince >= NOTIFY_COOLDOWN_HOURS) {
    if (lastPrice == null || plan.pricing.allInCost < lastPrice) {
      return true;
    }
  }

  return false;
}
