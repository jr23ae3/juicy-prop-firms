"use client";

import { Check, Circle } from "lucide-react";

import { ArcadeTapeScoutCharacter } from "@/components/skills-test/arcade-tape-scout-character";
import { ArcadeAdvisorCharacter } from "@/components/marketing/arcade-advisor-character";
import type {
  CopilotActionId,
  CopilotState,
} from "@/lib/skills-test/game-copilot";
import { cn } from "@/lib/utils";

type SkillsGameCopilotProps = {
  state: CopilotState;
  onAction: (action: CopilotActionId) => void;
  onOpenGuide: () => void;
  actionDisabled?: Partial<Record<CopilotActionId, boolean>>;
  className?: string;
};

const urgencyClass: Record<CopilotState["urgency"], string> = {
  calm: "skills-game-copilot--calm",
  focus: "skills-game-copilot--focus",
  warn: "skills-game-copilot--warn",
  urgent: "skills-game-copilot--urgent",
};

export function SkillsGameCopilot({
  state,
  onAction,
  onOpenGuide,
  actionDisabled = {},
  className,
}: SkillsGameCopilotProps) {
  if (!state.visible) return null;

  const renderAction = (
    action: CopilotActionId | null,
    label: string | null,
    variant: "p1" | "p2",
  ) => {
    if (!action || !label) return null;
    const disabled = actionDisabled[action] ?? false;

    return (
      <button
        type="button"
        className={cn(
          "arcade-btn skills-replay-btn",
          variant === "p1" ? "arcade-btn--p1" : "arcade-btn--p2",
        )}
        disabled={disabled}
        onClick={() => onAction(action)}
      >
        {label}
      </button>
    );
  };

  return (
    <aside
      className={cn("skills-game-copilot", urgencyClass[state.urgency], className)}
      aria-label="Live game co-pilot"
    >
      <div className="skills-game-copilot-main">
        <div className="skills-game-copilot-character">
          {state.character === "oracle" ? (
            <ArcadeAdvisorCharacter size="sm" showBubble={false} animate />
          ) : (
            <ArcadeTapeScoutCharacter size="sm" animate />
          )}
        </div>

        <div className="skills-game-copilot-copy">
          <p className="skills-game-copilot-speaker">{state.speaker}</p>
          <h3 className="skills-game-copilot-title">{state.title}</h3>
          <p className="skills-game-copilot-message">{state.message}</p>

          {state.checklist.length > 0 ? (
            <ul className="skills-game-copilot-checklist">
              {state.checklist.map((item) => (
                <li
                  key={item.id}
                  className={cn(
                    "skills-game-copilot-checklist-item",
                    item.done && "skills-game-copilot-checklist-item--done",
                    item.active && "skills-game-copilot-checklist-item--active",
                  )}
                >
                  {item.done ? (
                    <Check className="size-3.5 shrink-0" aria-hidden />
                  ) : (
                    <Circle className="size-3.5 shrink-0" aria-hidden />
                  )}
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          ) : null}

          {state.deadlineProgress !== null && state.barsToDeadline !== null ? (
            <div className="skills-game-copilot-progress">
              <div className="skills-game-copilot-progress-meta">
                <span>Entry window</span>
                <span>
                  {state.barsToDeadline >= 0
                    ? `${state.barsToDeadline} bars to deadline`
                    : "Past deadline"}
                </span>
              </div>
              <div className="skills-game-copilot-progress-track">
                <div
                  className="skills-game-copilot-progress-fill"
                  style={{ width: `${state.deadlineProgress}%` }}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="skills-game-copilot-actions">
        {renderAction(state.primaryAction, state.primaryActionLabel, "p1")}
        {renderAction(state.secondaryAction, state.secondaryActionLabel, "p2")}
        <button
          type="button"
          className="arcade-btn arcade-btn--p2 skills-replay-btn"
          onClick={onOpenGuide}
        >
          ASK GUIDE
        </button>
      </div>
    </aside>
  );
}
