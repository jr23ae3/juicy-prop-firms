import Link from "next/link";

import { ComparePlanGrid } from "@/components/compare/compare-plan-grid";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PlanSummary } from "@/types/plan";

type FirmPlansSectionProps = {
  firmSlug: string;
  firmName: string;
  plans: PlanSummary[];
};

export function FirmPlansSection({
  firmSlug,
  firmName,
  plans,
}: FirmPlansSectionProps) {
  if (plans.length === 0) {
    return (
      <section className="surface-muted border-dashed px-6 py-10 text-center">
        <h2 className="font-heading text-lg font-semibold">No active plans</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Plans for {firmName} are not currently listed.
        </p>
      </section>
    );
  }

  return (
    <section aria-labelledby="firm-plans-heading" className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="firm-plans-heading" className="font-heading text-xl font-semibold">
            Plans & pricing
          </h2>
          <p className="text-sm text-muted-foreground">
            Click a plan to reveal the full breakdown with a radial transition.
          </p>
        </div>
        <Link
          href={`/compare?firm=${firmSlug}`}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          Compare all firms
        </Link>
      </div>

      <ComparePlanGrid plans={plans} />
    </section>
  );
}
