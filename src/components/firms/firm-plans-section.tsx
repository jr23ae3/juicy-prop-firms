import Link from "next/link";

import { CompareCardList } from "@/components/compare/compare-card-list";
import { CompareTable } from "@/components/compare/compare-table";
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
      <section className="rounded-xl border border-dashed border-border/60 px-6 py-10 text-center">
        <h2 className="text-lg font-semibold">No active plans</h2>
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
          <h2 id="firm-plans-heading" className="text-xl font-semibold">
            Plans & pricing
          </h2>
          <p className="text-sm text-muted-foreground">
            Verified pricing with discount codes and all-in costs.
          </p>
        </div>
        <Link
          href={`/compare?firm=${firmSlug}`}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          Open in compare table
        </Link>
      </div>

      <CompareCardList plans={plans} />
      <CompareTable plans={plans} />
    </section>
  );
}
