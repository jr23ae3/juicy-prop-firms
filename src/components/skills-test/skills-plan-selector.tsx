"use client";

import Link from "next/link";
import { useMemo } from "react";

import { usePlans } from "@/hooks/use-plans";
import type { PlanSummary } from "@/types/plan";
import { cn } from "@/lib/utils";

type SkillsPlanSelectorProps = {
  selectedPlanId: string | null;
  onPlanChange: (plan: PlanSummary | null) => void;
  className?: string;
};

function formatPlanLabel(plan: PlanSummary) {
  const size =
    plan.accountSize >= 1000 ? `${plan.accountSize / 1000}K` : plan.accountSize;
  return `${plan.firm.name} · ${size} · $${plan.profitTarget ?? "?"} / $${plan.maxDrawdown ?? "?"} DD`;
}

export function SkillsPlanSelector({
  selectedPlanId,
  onPlanChange,
  className,
}: SkillsPlanSelectorProps) {
  const { data: plans = [], isLoading, isError } = usePlans({
    marketType: "FUTURES",
  });

  const selectablePlans = useMemo(
    () =>
      plans.filter(
        (plan) =>
          plan.profitTarget != null &&
          plan.profitTarget > 0 &&
          plan.maxDrawdown != null &&
          plan.maxDrawdown > 0,
      ),
    [plans],
  );

  const selectedPlan =
    selectablePlans.find((plan) => plan.id === selectedPlanId) ?? null;

  return (
    <section
      className={cn("skills-plan-selector", className)}
      aria-label="Eval plan selection"
      data-guide-target="plan"
    >
      <div className="skills-plan-selector-header">
        <div>
          <p className="skills-plan-selector-kicker">★ EVAL PLAN ★</p>
          <p className="skills-plan-selector-copy">
            Pick a prop firm plan — profit target and drawdown rules drive the
            simulator.
          </p>
        </div>
        <Link href="/compare" className="arcade-btn arcade-btn--p2 skills-replay-btn">
          BROWSE
        </Link>
      </div>

      <label className="skills-plan-selector-field">
        <span className="skills-plan-selector-label">ACTIVE PLAN</span>
        <select
          className="skills-plan-selector-select"
          value={selectedPlanId ?? ""}
          disabled={isLoading || isError}
          onChange={(event) => {
            const value = event.target.value;
            if (!value) {
              onPlanChange(null);
              return;
            }
            const plan = selectablePlans.find((item) => item.id === value) ?? null;
            onPlanChange(plan);
          }}
        >
          <option value="">
            {isLoading
              ? "Loading plans..."
              : isError
                ? "Could not load plans"
                : "Free play (no plan rules)"}
          </option>
          {selectablePlans.map((plan) => (
            <option key={plan.id} value={plan.id}>
              {formatPlanLabel(plan)}
            </option>
          ))}
        </select>
      </label>

      {selectedPlan ? (
        <div className="skills-plan-selector-summary">
          <div>
            <p className="skills-plan-selector-stat-label">TARGET</p>
            <p className="skills-plan-selector-stat-value">
              ${selectedPlan.profitTarget?.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="skills-plan-selector-stat-label">MAX DD</p>
            <p className="skills-plan-selector-stat-value text-destructive">
              ${selectedPlan.maxDrawdown?.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="skills-plan-selector-stat-label">DAILY DD</p>
            <p className="skills-plan-selector-stat-value">
              {selectedPlan.dailyDrawdown
                ? `$${selectedPlan.dailyDrawdown.toLocaleString()}`
                : "—"}
            </p>
          </div>
          <div>
            <p className="skills-plan-selector-stat-label">DD TYPE</p>
            <p className="skills-plan-selector-stat-value">
              {selectedPlan.drawdownType ?? "STATIC"}
            </p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
