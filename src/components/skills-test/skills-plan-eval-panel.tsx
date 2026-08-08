"use client";

import Link from "next/link";

import { SkillsEvalHud } from "@/components/skills-test/skills-eval-hud";
import { SkillsPlanSelector } from "@/components/skills-test/skills-plan-selector";
import type {
  EvalProgress,
  EvalSessionState,
  PlanEvalProfile,
} from "@/lib/skills-test/plan-eval-engine";
import type { PlanSummary } from "@/types/plan";
import { cn } from "@/lib/utils";

type SkillsPlanEvalPanelProps = {
  selectedPlanId: string | null;
  onPlanChange: (plan: PlanSummary | null) => void;
  evalProfile: PlanEvalProfile | null;
  evalSession: EvalSessionState;
  evalProgress: EvalProgress | null;
  className?: string;
};

function getEvalStatusLabel(status: EvalSessionState["status"]) {
  switch (status) {
    case "passed":
      return "EVAL PASSED";
    case "failed_max_dd":
      return "MAX DD BREACH";
    case "failed_daily_dd":
      return "DAILY DD BREACH";
    default:
      return "EVAL ACTIVE";
  }
}

export function SkillsPlanEvalPanel({
  selectedPlanId,
  onPlanChange,
  evalProfile,
  evalSession,
  evalProgress,
  className,
}: SkillsPlanEvalPanelProps) {
  const statusLabel = evalProfile ? getEvalStatusLabel(evalSession.status) : null;
  const panelStatusClass =
    evalSession.status === "passed"
      ? "skills-plan-eval-panel--passed"
      : evalSession.status.startsWith("failed")
        ? "skills-plan-eval-panel--failed"
        : evalProfile
          ? "skills-plan-eval-panel--active"
          : null;

  return (
    <section
      className={cn("skills-plan-eval-panel", panelStatusClass, className)}
      aria-label="Eval plan and progress"
      data-guide-target="plan"
    >
      <div className="skills-plan-eval-panel-header">
        <div className="skills-plan-eval-panel-heading">
          <p className="skills-plan-eval-panel-kicker">★ EVAL PLAN ★</p>
          {evalProfile ? (
            <p className="skills-plan-eval-panel-sub">
              {evalProfile.firmName} · {evalProfile.planName}
              {evalProgress
                ? ` · ${evalProgress.contracts} contract${evalProgress.contracts === 1 ? "" : "s"}/trade`
                : ""}
            </p>
          ) : (
            <p className="skills-plan-eval-panel-sub">
              Pick a prop firm plan — profit target and drawdown rules drive the
              simulator.
            </p>
          )}
        </div>

        <div className="skills-plan-eval-panel-actions">
          {statusLabel ? (
            <p className="skills-plan-eval-panel-status">{statusLabel}</p>
          ) : null}
          <Link
            href="/compare"
            className="arcade-btn arcade-btn--p2 skills-replay-btn"
          >
            BROWSE
          </Link>
        </div>
      </div>

      <SkillsPlanSelector
        selectedPlanId={selectedPlanId}
        onPlanChange={onPlanChange}
        embedded
        showSummary={!evalProfile}
      />

      {evalProfile && evalProgress ? (
        <SkillsEvalHud
          profile={evalProfile}
          state={evalSession}
          progress={evalProgress}
          embedded
        />
      ) : null}
    </section>
  );
}
