"use client";

import { useState } from "react";

import {
  ComparePlanDetails,
  ComparePlanSummary,
} from "@/components/compare/compare-plan-details";
import { RadialNoiseReveal } from "@/components/compare/radial-noise-reveal";
import { PlanCardShell } from "@/components/ui/plan-card-shell";
import type { PlanSummary } from "@/types/plan";

type ComparePlanExplorerCardProps = {
  plan: PlanSummary;
  open: boolean;
  onOpenChange: (planId: string | null) => void;
};

function ComparePlanExplorerCard({
  plan,
  open,
  onOpenChange,
}: ComparePlanExplorerCardProps) {
  return (
    <PlanCardShell interactive={!open}>
      <RadialNoiseReveal
        open={open}
        onOpenChange={(nextOpen) => onOpenChange(nextOpen ? plan.id : null)}
        ariaLabel={`${plan.firm.name} ${plan.name}, ${open ? "expanded" : "collapsed"}`}
        front={<ComparePlanSummary plan={plan} />}
        back={<ComparePlanDetails plan={plan} />}
      />
    </PlanCardShell>
  );
}

type ComparePlanGridProps = {
  plans: PlanSummary[];
};

export function ComparePlanGrid({ plans }: ComparePlanGridProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {plans.map((plan) => (
        <li key={plan.id} className="min-h-[280px]">
          <ComparePlanExplorerCard
            plan={plan}
            open={expandedId === plan.id}
            onOpenChange={setExpandedId}
          />
        </li>
      ))}
    </ul>
  );
}
