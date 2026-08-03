import Link from "next/link";
import { notFound } from "next/navigation";

import { FirmAdminPanel } from "@/components/admin/firm-admin-panel";
import { Container } from "@/components/layout/container";
import { buttonVariants } from "@/components/ui/button";
import { toNumber } from "@/lib/decimal";
import { cn } from "@/lib/utils";
import { requireAdminUser } from "@/server/admin/require-admin-user";
import { getFirmForAdmin } from "@/services/admin/data-service";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ firmId: string }>;
};

export default async function AdminFirmPage({ params }: PageProps) {
  await requireAdminUser();
  const { firmId } = await params;
  const firm = await getFirmForAdmin(firmId);

  if (!firm) {
    notFound();
  }

  const serialized = {
    id: firm.id,
    slug: firm.slug,
    name: firm.name,
    description: firm.description,
    websiteUrl: firm.websiteUrl,
    isActive: firm.isActive,
    rankScore: firm.rankScore,
    rankPosition: firm.rankPosition,
    rankings: firm.rankings.map((r) => ({
      score: r.score,
      position: r.position,
      factors: r.factors as Record<string, number> | null,
    })),
    plans: firm.plans.map((plan) => {
      const discount = plan.discounts[0];

      return {
        id: plan.id,
        slug: plan.slug,
        name: plan.name,
        accountSize: plan.accountSize,
        evalType: plan.evalType,
        evalPrice: toNumber(plan.evalPrice),
        activationFee: toNumber(plan.activationFee),
        profitTarget: plan.profitTarget ? toNumber(plan.profitTarget) : null,
        maxDrawdown: plan.maxDrawdown ? toNumber(plan.maxDrawdown) : null,
        dailyDrawdown: plan.dailyDrawdown ? toNumber(plan.dailyDrawdown) : null,
        drawdownType: plan.drawdownType,
        minimumDays: plan.minimumDays,
        profitSplit: plan.profitSplit ? toNumber(plan.profitSplit) : null,
        maxPayout: plan.maxPayout ? toNumber(plan.maxPayout) : null,
        minimumDaysToPayout: plan.minimumDaysToPayout,
        minimumTargetGoalCushion: plan.minimumTargetGoalCushion
          ? toNumber(plan.minimumTargetGoalCushion)
          : null,
        maxFundedAccounts: plan.maxFundedAccounts,
        fundedDrawdownType: plan.fundedDrawdownType,
        payoutFrequency: plan.payoutFrequency,
        isActive: plan.isActive,
        discount: discount
          ? {
              code: discount.code,
              discountPct: discount.discountPct
                ? toNumber(discount.discountPct)
                : null,
              discountAmt: discount.discountAmt
                ? toNumber(discount.discountAmt)
                : null,
            }
          : null,
      };
    }),
  };

  return (
    <Container className="space-y-6 py-8">
      <Link
        href="/admin/firms"
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
      >
        ← All firms
      </Link>
      <FirmAdminPanel firm={serialized} />
    </Container>
  );
}
