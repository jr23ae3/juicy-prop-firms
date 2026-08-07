"use client";

import { useState } from "react";

import {
  ComparePlanDetails,
  ComparePlanSummary,
} from "@/components/compare/compare-plan-details";
import { RadialNoiseReveal } from "@/components/compare/radial-noise-reveal";
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
    <RadialNoiseReveal
      open={open}
      onOpenChange={(nextOpen) => onOpenChange(nextOpen ? plan.id : null)}
      ariaLabel={`${plan.firm.name} ${plan.name}, ${open ? "expanded" : "collapsed"}`}
      front={<ComparePlanSummary plan={plan} />}
      back={<ComparePlanDetails plan={plan} />}
    />
  );
}

type ComparePlanGridProps = {
  plans: PlanSummary[];
};

export function ComparePlanGrid({ plans }: ComparePlanGridProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {plans.map((plan) => (
        <li key={plan.id}>
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
