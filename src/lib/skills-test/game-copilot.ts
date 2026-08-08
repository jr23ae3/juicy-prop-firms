import type { GameChallenge, GamePhase, PlayMode } from "@/lib/skills-test/arcade-game";
import type { TradeDirection, TradingStrategy } from "@/lib/skills-test/trade-scenarios";

export type CopilotUrgency = "calm" | "focus" | "warn" | "urgent";

export type CopilotActionId =
  | "jump_window"
  | "mark_playhead"
  | "pause"
  | "submit"
  | "clear_entry";

export type CopilotChecklistItem = {
  id: string;
  label: string;
  done: boolean;
  active: boolean;
};

export type CopilotState = {
  visible: boolean;
  speaker: string;
  character: "oracle" | "scout";
  title: string;
  message: string;
  urgency: CopilotUrgency;
  checklist: CopilotChecklistItem[];
  primaryAction: CopilotActionId | null;
  primaryActionLabel: string | null;
  secondaryAction: CopilotActionId | null;
  secondaryActionLabel: string | null;
  barsToDeadline: number | null;
  deadlineProgress: number | null;
};

type CopilotInput = {
  playMode: PlayMode;
  gamePhase: GamePhase;
  challenge: GameChallenge | null;
  frameIndex: number;
  playing: boolean;
  entryBarIndex: number | null;
  hasOutcome: boolean;
  round: number;
  lives: number;
  combo: number;
  bossSecondsLeft: number | null;
};

function getStrategyTip(strategy: TradingStrategy, direction: TradeDirection) {
  const side = direction === "long" ? "LONG" : "SHORT";
  switch (strategy) {
    case "breakout":
      return `Breakout mission: find a range break toward ${side} before the gold line.`;
    case "pullback":
      return `Pullback mission: wait for a retest, then join ${side} before the deadline.`;
    case "mean_reversion":
      return `Mean reversion: fade the stretch back toward value, then submit ${side}.`;
    case "trend_follow":
      return `Trend follow: ride momentum already moving ${side} into the entry window.`;
    default:
      return `Find a clean ${side} setup before the gold deadline line.`;
  }
}

function buildChecklist(
  challenge: GameChallenge,
  entryBarIndex: number | null,
): CopilotChecklistItem[] {
  const entryDone =
    entryBarIndex !== null && entryBarIndex <= challenge.entryDeadlineBar;
  const submitActive = entryDone;

  return [
    {
      id: "entry",
      label: `Mark entry before ${challenge.entryDeadlineLabel}`,
      done: entryDone,
      active: !entryDone,
    },
    {
      id: "submit",
      label: "Submit round",
      done: false,
      active: submitActive,
    },
  ];
}

function emptyState(): CopilotState {
  return {
    visible: false,
    speaker: "",
    character: "scout",
    title: "",
    message: "",
    urgency: "calm",
    checklist: [],
    primaryAction: null,
    primaryActionLabel: null,
    secondaryAction: null,
    secondaryActionLabel: null,
    barsToDeadline: null,
    deadlineProgress: null,
  };
}

export function getCopilotState(input: CopilotInput): CopilotState {
  const {
    playMode,
    gamePhase,
    challenge,
    frameIndex,
    playing,
    entryBarIndex,
    hasOutcome,
    round,
    lives,
    combo,
    bossSecondsLeft,
  } = input;

  if (
    playMode !== "arcade" ||
    gamePhase !== "playing" ||
    !challenge ||
    hasOutcome
  ) {
    return emptyState();
  }

  const barsToDeadline = challenge.entryDeadlineBar - frameIndex;
  const windowSpan = Math.max(
    1,
    challenge.entryDeadlineBar - challenge.startBar,
  );
  const deadlineProgress = Math.min(
    100,
    Math.max(
      0,
      ((frameIndex - challenge.startBar) / windowSpan) * 100,
    ),
  );

  const checklist = buildChecklist(challenge, entryBarIndex);
  const strategyTip = getStrategyTip(challenge.strategy, challenge.direction);

  const baseState: CopilotState = {
    visible: true,
    speaker: "TAPE SCOUT",
    character: "scout",
    title: challenge.missionTitle,
    message: strategyTip,
    urgency: "focus",
    checklist,
    primaryAction: "jump_window",
    primaryActionLabel: "GO TO WINDOW",
    secondaryAction: playing ? "pause" : "mark_playhead",
    secondaryActionLabel: playing ? "PAUSE TAPE" : "USE PLAYHEAD",
    barsToDeadline,
    deadlineProgress,
  };

  if (
    challenge.isBossRound &&
    bossSecondsLeft !== null &&
    bossSecondsLeft <= 20 &&
    entryBarIndex === null
  ) {
    return {
      ...baseState,
      speaker: "ORACLE OJ",
      character: "oracle",
      title: "Boss timer running",
      message: `Only ${bossSecondsLeft}s left. Mark entry and submit for 2x points.`,
      urgency: bossSecondsLeft <= 10 ? "urgent" : "warn",
      primaryAction: "mark_playhead",
      primaryActionLabel: "USE PLAYHEAD",
      secondaryAction: "jump_window",
      secondaryActionLabel: "GO TO WINDOW",
    };
  }

  if (entryBarIndex !== null && entryBarIndex > challenge.entryDeadlineBar) {
    return {
      ...baseState,
      speaker: "ORACLE OJ",
      character: "oracle",
      title: "Entry too late",
      message: `That entry is after ${challenge.entryDeadlineLabel}. Clear it and pick a candle on or before the gold line.`,
      urgency: "warn",
      primaryAction: "clear_entry",
      primaryActionLabel: "CLEAR ENTRY",
      secondaryAction: "jump_window",
      secondaryActionLabel: "GO TO WINDOW",
    };
  }

  if (entryBarIndex !== null) {
    return {
      ...baseState,
      speaker: "TAPE SCOUT",
      character: "scout",
      title: "Entry locked",
      message:
        combo > 0
          ? `${combo}x combo on the line — submit now to keep the streak alive.`
          : "Nice read. Submit the round to reveal the outcome and score.",
      urgency: "calm",
      primaryAction: "submit",
      primaryActionLabel: "SUBMIT ROUND",
      secondaryAction: "clear_entry",
      secondaryActionLabel: "CHANGE ENTRY",
    };
  }

  if (frameIndex > challenge.entryDeadlineBar) {
    return {
      ...baseState,
      speaker: "ORACLE OJ",
      character: "oracle",
      title: "Deadline passed",
      message:
        "The playhead moved past the gold line. Scrub back into the entry window before marking.",
      urgency: "urgent",
      primaryAction: "jump_window",
      primaryActionLabel: "GO TO WINDOW",
      secondaryAction: "pause",
      secondaryActionLabel: "PAUSE TAPE",
    };
  }

  if (barsToDeadline <= 8) {
    return {
      ...baseState,
      speaker: "ORACLE OJ",
      character: "oracle",
      title: "Deadline closing",
      message: `${barsToDeadline} bar${barsToDeadline === 1 ? "" : "s"} left. Pause and click a candle before the gold line.`,
      urgency: barsToDeadline <= 3 ? "urgent" : "warn",
      primaryAction: "mark_playhead",
      primaryActionLabel: "USE PLAYHEAD",
      secondaryAction: "pause",
      secondaryActionLabel: "PAUSE TAPE",
    };
  }

  if (playing) {
    return {
      ...baseState,
      title: "Reading the tape",
      message:
        "Replay is rolling. Pause when you see your setup, then click a candle or use the playhead.",
      urgency: "focus",
      primaryAction: "pause",
      primaryActionLabel: "PAUSE TAPE",
      secondaryAction: "jump_window",
      secondaryActionLabel: "GO TO WINDOW",
    };
  }

  if (lives === 1) {
    return {
      ...baseState,
      speaker: "ORACLE OJ",
      character: "oracle",
      title: "Last life",
      message: `${strategyTip} One life left — early entries with clean stops are safer.`,
      urgency: "warn",
    };
  }

  if (round === 1) {
    return {
      ...baseState,
      title: "Mission briefing",
      message: `${strategyTip} Scrub toward the gold line, mark entry, then submit.`,
      urgency: "calm",
    };
  }

  if (combo >= 2) {
    return {
      ...baseState,
      title: "Combo active",
      message: `${getStrategyTip(challenge.strategy, challenge.direction)} ${combo}x combo — aim for grade B or better.`,
      urgency: "focus",
    };
  }

  return baseState;
}
