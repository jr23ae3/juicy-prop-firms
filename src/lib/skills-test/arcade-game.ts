import {
  FUTURES_REPLAY_SYMBOLS,
  type FuturesReplaySymbol,
} from "@/lib/skills-test/futures-symbols";
import type { SessionReplay } from "@/lib/skills-test/session-replay";
import {
  TRADING_STRATEGIES,
  type TradeDirection,
  type TradeOutcome,
  type TradingStrategy,
} from "@/lib/skills-test/trade-scenarios";

export type PlayMode = "practice" | "arcade";

export type GamePhase =
  | "ready"
  | "playing"
  | "round_end"
  | "game_over"
  | "complete";

export const ARCADE_TOTAL_ROUNDS = 5;
export const ARCADE_STARTING_LIVES = 3;
export const ARCADE_BOSS_ROUND = 5;
export const ARCADE_BOSS_TIME_SECONDS = 75;
export const HIGH_SCORE_STORAGE_KEY = "juicy-trades-skills-high-score";

export type GameChallenge = {
  round: number;
  totalRounds: number;
  symbol: FuturesReplaySymbol;
  direction: TradeDirection;
  strategy: TradingStrategy;
  entryDeadlineBar: number;
  entryDeadlineLabel: string;
  startBar: number;
  missionTitle: string;
  missionDetail: string;
  isBossRound: boolean;
  bossTimeLimitSeconds: number;
  pointMultiplier: number;
  dailySeed: string;
};

export type RoundResult = {
  points: number;
  lostLife: boolean;
  combo: number;
  headline: string;
  detail: string;
  passed: boolean;
};

function hashSeed(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createRng(seed: number) {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function getStrategyLabel(strategy: TradingStrategy) {
  return (
    TRADING_STRATEGIES.find((item) => item.id === strategy)?.label ?? strategy
  );
}

export function getHighScore() {
  if (typeof window === "undefined") return 0;
  const value = window.localStorage.getItem(HIGH_SCORE_STORAGE_KEY);
  const parsed = value ? Number.parseInt(value, 10) : 0;
  return Number.isFinite(parsed) ? parsed : 0;
}

export function saveHighScore(score: number) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(HIGH_SCORE_STORAGE_KEY, String(score));
}

export function createChallenge(
  round: number,
  sessionDate: string,
  replays: Record<FuturesReplaySymbol, SessionReplay>,
): GameChallenge {
  const rng = createRng(hashSeed(`${sessionDate}:arcade:${round}`));
  const symbol =
    FUTURES_REPLAY_SYMBOLS[
      Math.floor(rng() * FUTURES_REPLAY_SYMBOLS.length)
    ] ?? "NQ";
  const replay = replays[symbol];
  const direction: TradeDirection = rng() > 0.5 ? "long" : "short";
  const strategy =
    TRADING_STRATEGIES[Math.floor(rng() * TRADING_STRATEGIES.length)]?.id ??
    "breakout";
  const isBossRound = round === ARCADE_BOSS_ROUND;
  const minDeadline = isBossRound
    ? Math.floor(replay.bars.length * 0.22)
    : Math.floor(replay.bars.length * 0.18);
  const maxDeadline = isBossRound
    ? Math.floor(replay.bars.length * 0.38)
    : Math.floor(replay.bars.length * 0.55);
  const entryDeadlineBar = Math.min(
    maxDeadline,
    minDeadline + Math.floor(rng() * Math.max(1, maxDeadline - minDeadline)),
  );
  const deadlineBar = replay.bars[entryDeadlineBar];
  const startBar = Math.max(
    0,
    entryDeadlineBar - (isBossRound ? 22 : 35) - Math.floor(rng() * (isBossRound ? 12 : 25)),
  );
  const side = direction === "long" ? "LONG" : "SHORT";
  const dailySeed = `${sessionDate}-${hashSeed(`${sessionDate}:daily`).toString(36).toUpperCase().slice(0, 6)}`;

  return {
    round,
    totalRounds: ARCADE_TOTAL_ROUNDS,
    symbol,
    direction,
    strategy,
    entryDeadlineBar,
    entryDeadlineLabel: deadlineBar?.label ?? "Deadline",
    startBar,
    missionTitle: isBossRound
      ? `BOSS ROUND · ${symbol} · ${side}`
      : `ROUND ${round} · ${symbol} · ${side}`,
    missionDetail: isBossRound
      ? `${getStrategyLabel(strategy)} · ${ARCADE_BOSS_TIME_SECONDS}s timer · 2x points`
      : `${getStrategyLabel(strategy)} · entry before ${deadlineBar?.label ?? "deadline"}`,
    isBossRound,
    bossTimeLimitSeconds: ARCADE_BOSS_TIME_SECONDS,
    pointMultiplier: isBossRound ? 2 : 1,
    dailySeed,
  };
}

export function evaluateRound(
  outcome: TradeOutcome | null,
  entryBarIndex: number | null,
  challenge: GameChallenge,
  combo: number,
): RoundResult {
  if (entryBarIndex === null) {
    return {
      points: 0,
      lostLife: true,
      combo: 0,
      headline: "NO ENTRY",
      detail: "You must mark an entry before time runs out.",
      passed: false,
    };
  }

  if (entryBarIndex > challenge.entryDeadlineBar) {
    return {
      points: 0,
      lostLife: true,
      combo: 0,
      headline: "LATE ENTRY",
      detail: `Entry had to be on or before ${challenge.entryDeadlineLabel}.`,
      passed: false,
    };
  }

  if (!outcome) {
    return {
      points: 0,
      lostLife: true,
      combo: 0,
      headline: "NO TRADE",
      detail: "Run the scenario to finish the round.",
      passed: false,
    };
  }

  const lostLife = outcome.grade === "D" || outcome.exitReason === "stop";
  const comboNext =
    !lostLife && (outcome.grade === "S" || outcome.grade === "A" || outcome.grade === "B")
      ? combo + 1
      : 0;
  const multiplier = 1 + combo * 0.25;
  const speedBonus = Math.max(0, challenge.entryDeadlineBar - entryBarIndex) * 4;
  const gradeBonus =
    outcome.grade === "S"
      ? 120
      : outcome.grade === "A"
        ? 80
        : outcome.grade === "B"
          ? 40
          : 0;
  const points = Math.round(
    (outcome.score + speedBonus + gradeBonus) * multiplier * challenge.pointMultiplier,
  );

  const headline =
    outcome.grade === "S"
      ? "PERFECT READ"
      : outcome.grade === "A"
        ? "SOLID TRADE"
        : lostLife
          ? "STOPPED OUT"
          : "ROUND COMPLETE";

  const detail = lostLife
    ? "You lost a life. Tighten the entry and protect the stop."
    : `+${points} pts · ${comboNext}x combo ready · grade ${outcome.grade}`;

  return {
    points,
    lostLife,
    combo: comboNext,
    headline,
    detail,
    passed: !lostLife,
  };
}

export function getComboLabel(combo: number) {
  if (combo >= 4) return "ULTRA";
  if (combo >= 3) return "MEGA";
  if (combo >= 2) return "SUPER";
  if (combo >= 1) return "NICE";
  return "—";
}

export function getDailySeedLabel(sessionDate: string) {
  return `${sessionDate}-${hashSeed(`${sessionDate}:daily`).toString(36).toUpperCase().slice(0, 6)}`;
}

export function createBossTimeoutResult(): RoundResult {
  return {
    points: 0,
    lostLife: true,
    combo: 0,
    headline: "BOSS TIMEOUT",
    detail: "The boss window closed before you submitted your trade.",
    passed: false,
  };
}
