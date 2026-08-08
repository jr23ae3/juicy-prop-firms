"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import type { GamePhase, PlayMode } from "@/lib/skills-test/arcade-game";
import {
  getGuideSteps,
  readGuideProgress,
  ROUND_HINTS,
  saveGuideProgress,
  type GuideFlow,
  type GuideHighlight,
  type GuideStep,
} from "@/lib/skills-test/game-guide";

type UseSkillsGuideOptions = {
  playMode: PlayMode;
  gamePhase: GamePhase;
  entryBarIndex: number | null;
  outcome: unknown;
  isBossRound: boolean;
  round: number;
};

export function useSkillsGuide({
  playMode,
  gamePhase,
  entryBarIndex,
  outcome,
  isBossRound,
  round,
}: UseSkillsGuideOptions) {
  const [activeFlow, setActiveFlow] = useState<GuideFlow | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [roundHint, setRoundHint] = useState<GuideStep | null>(null);
  const [roundHintDismissed, setRoundHintDismissed] = useState(false);

  const steps = useMemo(
    () => (activeFlow ? getGuideSteps(activeFlow) : []),
    [activeFlow],
  );
  const currentStep = steps[stepIndex] ?? null;
  const highlight = currentStep?.highlight ?? roundHint?.highlight ?? null;

  const startFlow = useCallback((flow: GuideFlow) => {
    setRoundHint(null);
    setRoundHintDismissed(false);
    setActiveFlow(flow);
    setStepIndex(0);
  }, []);

  const closeGuide = useCallback(() => {
    if (activeFlow === "onboarding") {
      saveGuideProgress({ onboarding: true });
    }
    if (activeFlow === "arcade") {
      saveGuideProgress({ arcade: true });
    }
    setActiveFlow(null);
    setStepIndex(0);
  }, [activeFlow]);

  const skipGuide = useCallback(() => {
    closeGuide();
  }, [closeGuide]);

  const nextStep = useCallback(() => {
    setStepIndex((value) => Math.min(value + 1, steps.length - 1));
  }, [steps.length]);

  const prevStep = useCallback(() => {
    setStepIndex((value) => Math.max(value - 1, 0));
  }, []);

  useEffect(() => {
    const progress = readGuideProgress();
    if (!progress.onboarding) {
      startFlow("onboarding");
    }
  }, [startFlow]);

  useEffect(() => {
    if (playMode !== "arcade" || gamePhase !== "ready") return;
    const progress = readGuideProgress();
    if (!progress.arcade && !activeFlow) {
      startFlow("arcade");
    }
  }, [activeFlow, gamePhase, playMode, startFlow]);

  useEffect(() => {
    if (playMode !== "arcade" || gamePhase !== "playing" || activeFlow) {
      setRoundHint(null);
      return;
    }

    if (roundHintDismissed) return;

    if (isBossRound && round === 5) {
      setRoundHint(ROUND_HINTS.boss);
      return;
    }

    if (entryBarIndex !== null && !outcome) {
      setRoundHint(ROUND_HINTS.ready_submit);
      return;
    }

    if (entryBarIndex === null) {
      setRoundHint(round === 1 ? ROUND_HINTS.round_start : ROUND_HINTS.need_entry);
    }
  }, [
    activeFlow,
    entryBarIndex,
    gamePhase,
    isBossRound,
    outcome,
    playMode,
    round,
    roundHintDismissed,
  ]);

  useEffect(() => {
    setRoundHintDismissed(false);
  }, [round, gamePhase]);

  const openContextualGuide = useCallback(() => {
    if (playMode === "arcade" && gamePhase === "playing" && roundHint) {
      setActiveFlow("round");
      setStepIndex(0);
      return;
    }
    if (playMode === "arcade") {
      startFlow("arcade");
      return;
    }
    startFlow("practice");
  }, [gamePhase, playMode, roundHint, startFlow]);

  const activeRoundStep =
    activeFlow === "round" && roundHint ? roundHint : null;
  const displayStep = activeFlow === "round" ? activeRoundStep : currentStep;
  const displayTotal = activeFlow === "round" ? 1 : steps.length;
  const displayIndex = activeFlow === "round" ? 0 : stepIndex;

  return {
    activeFlow,
    displayStep,
    displayIndex,
    displayTotal,
    highlight,
    startFlow,
    openContextualGuide,
    closeGuide: () => {
      if (activeFlow === "round") {
        setRoundHintDismissed(true);
        setActiveFlow(null);
        return;
      }
      closeGuide();
    },
    skipGuide: () => {
      if (activeFlow === "round") {
        setRoundHintDismissed(true);
        setActiveFlow(null);
        return;
      }
      skipGuide();
    },
    nextStep,
    prevStep,
    roundHint,
  };
}

export type { GuideHighlight };
