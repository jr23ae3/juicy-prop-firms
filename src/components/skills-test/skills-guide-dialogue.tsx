"use client";

import { useEffect, useState } from "react";

import { ArcadeTapeScoutCharacter } from "@/components/skills-test/arcade-tape-scout-character";
import { ArcadeAdvisorCharacter } from "@/components/marketing/arcade-advisor-character";
import type {
  GuideFlow,
  GuideStep,
} from "@/lib/skills-test/game-guide";
import { getGuideSteps } from "@/lib/skills-test/game-guide";
import { cn } from "@/lib/utils";

type SkillsGuideDialogueProps = {
  flow: GuideFlow | null;
  step: GuideStep | null;
  stepIndex: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  onClose: () => void;
};

function GuideCharacter({
  character,
  enterFrom,
}: {
  character: GuideStep["character"];
  enterFrom: GuideStep["enterFrom"];
}) {
  const enterClass =
    enterFrom === "left"
      ? "skills-guide-character-enter-left"
      : "skills-guide-character-enter-right";

  if (character === "oracle") {
    return (
      <div className={cn("skills-guide-party-slot", enterClass)}>
        <ArcadeAdvisorCharacter size="md" showBubble={false} animate />
      </div>
    );
  }

  return (
    <div className={cn("skills-guide-party-slot", enterClass)}>
      <ArcadeTapeScoutCharacter size="md" animate />
    </div>
  );
}

export function SkillsGuideDialogue({
  flow,
  step,
  stepIndex,
  totalSteps,
  onNext,
  onBack,
  onSkip,
  onClose,
}: SkillsGuideDialogueProps) {
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    setLineIndex(0);
  }, [step?.id]);

  if (!flow || !step) return null;

  const lines = step.lines;
  const currentLine = lines[lineIndex] ?? lines[0] ?? "";
  const isLastLine = lineIndex >= lines.length - 1;
  const isLastStep = stepIndex >= totalSteps - 1;
  const flowLabel =
    flow === "onboarding"
      ? "TUTORIAL"
      : flow === "arcade"
        ? "ARCADE QUEST"
        : flow === "practice"
          ? "PRACTICE"
          : "HINT";

  const handleAdvance = () => {
    if (!isLastLine) {
      setLineIndex((value) => value + 1);
      return;
    }
    if (isLastStep) {
      onClose();
      return;
    }
    onNext();
  };

  return (
    <div className="skills-guide-overlay" role="dialog" aria-modal="true">
      <div className="skills-guide-dialogue">
        <div className="skills-guide-dialogue-party">
          <GuideCharacter character={step.character} enterFrom={step.enterFrom} />
        </div>

        <div className="skills-guide-dialogue-box">
          <div className="skills-guide-dialogue-meta">
            <span className="skills-guide-dialogue-kicker">★ {flowLabel} ★</span>
            <span className="skills-guide-dialogue-step">
              {stepIndex + 1}/{totalSteps}
            </span>
          </div>

          <p className="skills-guide-dialogue-speaker">{step.speaker}</p>
          <h3 className="skills-guide-dialogue-title">{step.title}</h3>
          <p className="skills-guide-dialogue-text">{currentLine}</p>

          {lines.length > 1 ? (
            <p className="skills-guide-dialogue-progress">
              Line {lineIndex + 1}/{lines.length}
            </p>
          ) : null}

          <div className="skills-guide-dialogue-actions">
            <button
              type="button"
              className="arcade-btn arcade-btn--p2 skills-replay-btn"
              onClick={onSkip}
            >
              SKIP
            </button>
            {stepIndex > 0 ? (
              <button
                type="button"
                className="arcade-btn arcade-btn--p2 skills-replay-btn"
                onClick={onBack}
              >
                BACK
              </button>
            ) : null}
            <button
              type="button"
              className="arcade-btn arcade-btn--p1 skills-replay-btn"
              onClick={handleAdvance}
            >
              {isLastLine ? (isLastStep ? "BEGIN" : "NEXT") : "CONTINUE"}
            </button>
          </div>
        </div>

        <div className="skills-guide-dialogue-party skills-guide-dialogue-party--right">
          {step.character === "oracle" ? (
            <ArcadeTapeScoutCharacter size="sm" animate className="opacity-35" />
          ) : (
            <ArcadeAdvisorCharacter size="sm" animate={false} className="opacity-35" />
          )}
        </div>
      </div>
    </div>
  );
}

export function getActiveGuideSteps(flow: GuideFlow | null) {
  return flow ? getGuideSteps(flow) : [];
}
