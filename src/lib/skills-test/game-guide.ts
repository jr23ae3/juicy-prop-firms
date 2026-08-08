export type GuideFlow = "onboarding" | "practice" | "arcade" | "round";

export type GuideCharacterId = "oracle" | "scout";

export type GuideHighlight =
  | "mode"
  | "chart"
  | "controls"
  | "trade-panel"
  | "hud"
  | "overlay";

export type GuideStep = {
  id: string;
  character: GuideCharacterId;
  speaker: string;
  title: string;
  lines: string[];
  highlight: GuideHighlight | null;
  enterFrom: "left" | "right";
};

export const GUIDE_STORAGE_KEY = "juicy-trades-skills-guide-v1";

export type GuideProgress = {
  onboarding: boolean;
  arcade: boolean;
};

export const ONBOARDING_STEPS: GuideStep[] = [
  {
    id: "welcome",
    character: "oracle",
    speaker: "ORACLE OJ",
    title: "Welcome, trader.",
    lines: [
      "This is the Skills Test — a safe training floor before you risk real evals.",
      "I'll walk you through the tape like an old-school RPG quest.",
    ],
    highlight: null,
    enterFrom: "left",
  },
  {
    id: "modes",
    character: "scout",
    speaker: "TAPE SCOUT",
    title: "Pick your path.",
    lines: [
      "PRACTICE lets you experiment freely on the 1-minute chart.",
      "ARCADE is the full Tape Quest game — missions, lives, score, and boss round.",
    ],
    highlight: "mode",
    enterFrom: "right",
  },
  {
    id: "chart",
    character: "scout",
    speaker: "TAPE SCOUT",
    title: "Read the 1M chart.",
    lines: [
      "Each candle is one minute of regular trading hours.",
      "Scrub the timeline, press PLAY, or click a candle to jump there.",
    ],
    highlight: "chart",
    enterFrom: "right",
  },
  {
    id: "entry",
    character: "oracle",
    speaker: "ORACLE OJ",
    title: "Mark your entry.",
    lines: [
      "Pause the replay, then click a candle or hit USE PLAYHEAD.",
      "That locks in where you would have entered the trade.",
    ],
    highlight: "trade-panel",
    enterFrom: "left",
  },
  {
    id: "setup",
    character: "scout",
    speaker: "TAPE SCOUT",
    title: "Choose side + strategy.",
    lines: [
      "Pick LONG or SHORT, then a strategy style.",
      "Hit RUN TRADE to simulate what happens next in the session.",
    ],
    highlight: "trade-panel",
    enterFrom: "right",
  },
  {
    id: "arcade-tease",
    character: "oracle",
    speaker: "ORACLE OJ",
    title: "Ready for the quest?",
    lines: [
      "Switch to ARCADE when you want missions, combos, and the global daily board.",
      "Tap ASK GUIDE any time you need a hint. Good luck out there.",
    ],
    highlight: "mode",
    enterFrom: "left",
  },
];

export const PRACTICE_STEPS: GuideStep[] = [
  {
    id: "practice-intro",
    character: "scout",
    speaker: "TAPE SCOUT",
    title: "Practice mode.",
    lines: [
      "No lives, no timer — just reps.",
      "Try marking a few entries on different symbols before Arcade.",
    ],
    highlight: "chart",
    enterFrom: "right",
  },
  {
    id: "practice-entry",
    character: "oracle",
    speaker: "ORACLE OJ",
    title: "Your turn.",
    lines: [
      "Scrub to a setup, mark entry, pick LONG or SHORT, then RUN TRADE.",
    ],
    highlight: "trade-panel",
    enterFrom: "left",
  },
];

export const ARCADE_STEPS: GuideStep[] = [
  {
    id: "arcade-intro",
    character: "oracle",
    speaker: "ORACLE OJ",
    title: "Tape Quest begins.",
    lines: [
      "Five rounds. Three lives. Same daily seed for everyone.",
      "Each round gives you a contract, side, strategy, and entry deadline.",
    ],
    highlight: "overlay",
    enterFrom: "left",
  },
  {
    id: "arcade-mission",
    character: "scout",
    speaker: "TAPE SCOUT",
    title: "Follow the mission.",
    lines: [
      "Your side and strategy are locked — find the entry before the gold deadline line.",
      "Early entries earn bonus points. Stop-outs cost a life.",
    ],
    highlight: "hud",
    enterFrom: "right",
  },
  {
    id: "arcade-submit",
    character: "scout",
    speaker: "TAPE SCOUT",
    title: "Submit the round.",
    lines: [
      "When entry is set, press SUBMIT ROUND to reveal the outcome and score.",
    ],
    highlight: "trade-panel",
    enterFrom: "right",
  },
  {
    id: "arcade-boss",
    character: "oracle",
    speaker: "ORACLE OJ",
    title: "Round 5 is the boss.",
    lines: [
      "A 75-second timer starts. Double points if you clear it.",
      "Miss the window and you lose a life. Now hit START GAME.",
    ],
    highlight: "overlay",
    enterFrom: "left",
  },
];

export const ROUND_HINTS: Record<string, GuideStep> = {
  round_start: {
    id: "round-start",
    character: "scout",
    speaker: "TAPE SCOUT",
    title: "New mission.",
    lines: [
      "Scrub the chart toward the deadline. Mark entry, then SUBMIT ROUND.",
    ],
    highlight: "chart",
    enterFrom: "right",
  },
  need_entry: {
    id: "need-entry",
    character: "oracle",
    speaker: "ORACLE OJ",
    title: "Entry window open.",
    lines: [
      "Click a candle at or before the gold line — that's your entry deadline.",
    ],
    highlight: "chart",
    enterFrom: "left",
  },
  ready_submit: {
    id: "ready-submit",
    character: "scout",
    speaker: "TAPE SCOUT",
    title: "Entry locked.",
    lines: ["Nice. Hit SUBMIT ROUND to run the scenario and score this round."],
    highlight: "trade-panel",
    enterFrom: "right",
  },
  boss: {
    id: "boss-warning",
    character: "oracle",
    speaker: "ORACLE OJ",
    title: "Boss fight!",
    lines: [
      "Watch the timer. Mark entry and submit before it hits zero for 2x points.",
    ],
    highlight: "hud",
    enterFrom: "left",
  },
};

export function getGuideSteps(flow: GuideFlow): GuideStep[] {
  switch (flow) {
    case "onboarding":
      return ONBOARDING_STEPS;
    case "practice":
      return PRACTICE_STEPS;
    case "arcade":
      return ARCADE_STEPS;
    default:
      return [];
  }
}

export function readGuideProgress(): GuideProgress {
  if (typeof window === "undefined") {
    return { onboarding: false, arcade: false };
  }
  try {
    const raw = window.localStorage.getItem(GUIDE_STORAGE_KEY);
    if (!raw) return { onboarding: false, arcade: false };
    return JSON.parse(raw) as GuideProgress;
  } catch {
    return { onboarding: false, arcade: false };
  }
}

export function saveGuideProgress(patch: Partial<GuideProgress>) {
  if (typeof window === "undefined") return;
  const current = readGuideProgress();
  window.localStorage.setItem(
    GUIDE_STORAGE_KEY,
    JSON.stringify({ ...current, ...patch }),
  );
}
