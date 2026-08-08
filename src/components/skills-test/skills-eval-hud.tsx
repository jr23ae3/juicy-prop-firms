"use client";

import type {
  EvalProgress,
  EvalSessionState,
  PlanEvalProfile,
} from "@/lib/skills-test/plan-eval-engine";
import { formatEvalMoney } from "@/lib/skills-test/plan-eval-engine";
import { cn } from "@/lib/utils";

type SkillsEvalHudProps = {
  profile: PlanEvalProfile;
  state: EvalSessionState;
  progress: EvalProgress;
  className?: string;
  embedded?: boolean;
};

export function SkillsEvalHud({
  profile,
  state,
  progress,
  className,
  embedded = false,
}: SkillsEvalHudProps) {
  const statusLabel =
    state.status === "passed"
      ? "EVAL PASSED"
      : state.status === "failed_max_dd"
        ? "MAX DD BREACH"
        : state.status === "failed_daily_dd"
          ? "DAILY DD BREACH"
          : "EVAL ACTIVE";

  const statusClass =
    state.status === "passed"
      ? "skills-eval-hud--passed"
      : state.status.startsWith("failed")
        ? "skills-eval-hud--failed"
        : "skills-eval-hud--active";

  const Wrapper = embedded ? "div" : "section";

  return (
    <Wrapper
      className={cn(
        "skills-eval-hud",
        !embedded && statusClass,
        embedded && "skills-eval-hud--embedded",
        className,
      )}
      aria-label={embedded ? undefined : "Eval progress"}
    >
      {!embedded ? (
        <div className="skills-eval-hud-header">
          <div>
            <p className="skills-eval-hud-kicker">★ {profile.firmName.toUpperCase()} EVAL ★</p>
            <p className="skills-eval-hud-title">{profile.planName}</p>
            <p className="skills-eval-hud-sub">
              {profile.drawdownLabel} rules · {progress.contracts} contract
              {progress.contracts === 1 ? "" : "s"} / trade
            </p>
          </div>
          <p className="skills-eval-hud-status">{statusLabel}</p>
        </div>
      ) : (
        <div className="skills-eval-hud-embedded-meta">
          <p className="skills-eval-hud-sub">
            {profile.drawdownLabel} rules · target ${profile.passTarget.toLocaleString()} · max
            DD ${profile.maxDrawdown.toLocaleString()}
          </p>
        </div>
      )}

      <div className="skills-eval-hud-stats">
        <div className="skills-eval-hud-stat">
          <p className="skills-eval-hud-stat-label">SESSION P&amp;L</p>
          <p
            className={cn(
              "skills-eval-hud-stat-value",
              progress.cumulativePnl >= 0 ? "text-primary" : "text-destructive",
            )}
          >
            {formatEvalMoney(progress.cumulativePnl)}
          </p>
        </div>
        <div className="skills-eval-hud-stat">
          <p className="skills-eval-hud-stat-label">TARGET</p>
          <p className="skills-eval-hud-stat-value">
            ${profile.passTarget.toLocaleString()}
          </p>
        </div>
        <div className="skills-eval-hud-stat">
          <p className="skills-eval-hud-stat-label">DD LEFT</p>
          <p className="skills-eval-hud-stat-value text-[#ffd700]">
            ${progress.drawdownRemaining.toLocaleString()}
          </p>
        </div>
        <div className="skills-eval-hud-stat">
          <p className="skills-eval-hud-stat-label">TRADES</p>
          <p className="skills-eval-hud-stat-value">{state.tradeCount}</p>
        </div>
      </div>

      <div className="skills-eval-hud-bars">
        <div className="skills-eval-hud-bar-block">
          <div className="skills-eval-hud-bar-meta">
            <span>Profit target</span>
            <span>{Math.round(progress.targetProgress)}%</span>
          </div>
          <div className="skills-eval-hud-bar skills-eval-hud-bar--target">
            <div
              className="skills-eval-hud-bar-fill"
              style={{ width: `${progress.targetProgress}%` }}
            />
          </div>
        </div>

        <div className="skills-eval-hud-bar-block">
          <div className="skills-eval-hud-bar-meta">
            <span>{profile.drawdownLabel} drawdown</span>
            <span>
              ${progress.drawdownUsed.toLocaleString()} / $
              {progress.maxDrawdown.toLocaleString()}
            </span>
          </div>
          <div className="skills-eval-hud-bar skills-eval-hud-bar--drawdown">
            <div
              className="skills-eval-hud-bar-fill"
              style={{ width: `${progress.drawdownProgress}%` }}
            />
          </div>
        </div>

        {progress.dailyDrawdownLimit ? (
          <div className="skills-eval-hud-bar-block">
            <div className="skills-eval-hud-bar-meta">
              <span>Daily drawdown</span>
              <span>
                ${progress.dailyDrawdownUsed.toLocaleString()} / $
                {progress.dailyDrawdownLimit.toLocaleString()}
              </span>
            </div>
            <div className="skills-eval-hud-bar skills-eval-hud-bar--daily">
              <div
                className="skills-eval-hud-bar-fill"
                style={{ width: `${progress.dailyDrawdownProgress ?? 0}%` }}
              />
            </div>
          </div>
        ) : null}
      </div>

      {state.failReason ? (
        <p className="skills-eval-hud-alert">{state.failReason}</p>
      ) : null}
      {state.status === "passed" ? (
        <p className="skills-eval-hud-alert skills-eval-hud-alert--pass">
          Profit target cleared — eval passed on this session tape.
        </p>
      ) : null}
    </Wrapper>
  );
}
