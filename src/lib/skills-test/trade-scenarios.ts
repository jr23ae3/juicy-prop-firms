import {
  FUTURES_SYMBOL_META,
  type FuturesReplaySymbol,
} from "@/lib/skills-test/futures-symbols";
import type { ReplayBar } from "@/lib/skills-test/session-replay";

export type TradeDirection = "long" | "short";

export type TradingStrategy =
  | "breakout"
  | "pullback"
  | "mean_reversion"
  | "trend_follow";

export type StrategyDefinition = {
  id: TradingStrategy;
  label: string;
  shortLabel: string;
  description: string;
  stopTicks: number;
  targetTicks: number;
  maxHoldBars: number;
};

export const TRADING_STRATEGIES: StrategyDefinition[] = [
  {
    id: "breakout",
    label: "Breakout",
    shortLabel: "Break",
    description: "Play the expansion after a range break.",
    stopTicks: 8,
    targetTicks: 16,
    maxHoldBars: 30,
  },
  {
    id: "pullback",
    label: "Pullback",
    shortLabel: "Pull",
    description: "Enter on a retest into structure.",
    stopTicks: 6,
    targetTicks: 12,
    maxHoldBars: 25,
  },
  {
    id: "mean_reversion",
    label: "Mean Reversion",
    shortLabel: "Revert",
    description: "Fade an extended move back toward value.",
    stopTicks: 5,
    targetTicks: 8,
    maxHoldBars: 18,
  },
  {
    id: "trend_follow",
    label: "Trend Follow",
    shortLabel: "Trend",
    description: "Ride momentum with a wider stop.",
    stopTicks: 10,
    targetTicks: 24,
    maxHoldBars: 45,
  },
];

export type TradeSetup = {
  entryBarIndex: number;
  direction: TradeDirection;
  strategy: TradingStrategy;
};

export type TradeExitReason = "target" | "stop" | "timeout" | "session_close";

export type TradeOutcome = {
  entryBarIndex: number;
  exitBarIndex: number;
  entryPrice: number;
  exitPrice: number;
  stopPrice: number;
  targetPrice: number;
  exitReason: TradeExitReason;
  direction: TradeDirection;
  strategy: TradingStrategy;
  ticksPnl: number;
  dollarPnl: number;
  rMultiple: number;
  score: number;
  grade: "S" | "A" | "B" | "C" | "D";
  holdBars: number;
  summary: string;
};

const TICK_VALUES: Record<FuturesReplaySymbol, number> = {
  ES: 12.5,
  MES: 1.25,
  NQ: 5,
  MNQ: 0.5,
};

function getStrategy(strategy: TradingStrategy) {
  const match = TRADING_STRATEGIES.find((item) => item.id === strategy);
  if (!match) {
    throw new Error(`Unknown strategy: ${strategy}`);
  }
  return match;
}

function priceToTicks(
  symbol: FuturesReplaySymbol,
  priceDistance: number,
): number {
  const tickSize = FUTURES_SYMBOL_META[symbol].tickSize;
  return Math.round(priceDistance / tickSize);
}

function ticksToPrice(symbol: FuturesReplaySymbol, ticks: number): number {
  return ticks * FUTURES_SYMBOL_META[symbol].tickSize;
}

function gradeFromScore(score: number): TradeOutcome["grade"] {
  if (score >= 90) return "S";
  if (score >= 75) return "A";
  if (score >= 60) return "B";
  if (score >= 40) return "C";
  return "D";
}

function buildSummary(
  outcome: Omit<TradeOutcome, "summary" | "grade" | "score">,
  symbol: FuturesReplaySymbol,
): string {
  const strategy = getStrategy(outcome.strategy);
  const pnlLabel =
    outcome.ticksPnl >= 0
      ? `+${outcome.ticksPnl} ticks`
      : `${outcome.ticksPnl} ticks`;

  switch (outcome.exitReason) {
    case "target":
      return `${strategy.label} hit target — ${pnlLabel} ($${outcome.dollarPnl.toFixed(2)} on ${symbol}).`;
    case "stop":
      return `${strategy.label} stopped out — ${pnlLabel} ($${outcome.dollarPnl.toFixed(2)} on ${symbol}).`;
    case "timeout":
      return `${strategy.label} timed out after ${outcome.holdBars} bars — ${pnlLabel}.`;
    default:
      return `Held into the close — ${pnlLabel} ($${outcome.dollarPnl.toFixed(2)} on ${symbol}).`;
  }
}

export function simulateTrade(
  symbol: FuturesReplaySymbol,
  bars: ReplayBar[],
  setup: TradeSetup,
): TradeOutcome | null {
  const entryBar = bars[setup.entryBarIndex];
  if (!entryBar) return null;

  const strategy = getStrategy(setup.strategy);
  const tickSize = FUTURES_SYMBOL_META[symbol].tickSize;
  const entryPrice = entryBar.close;
  const stopDistance = ticksToPrice(symbol, strategy.stopTicks);
  const targetDistance = ticksToPrice(symbol, strategy.targetTicks);

  const stopPrice =
    setup.direction === "long"
      ? entryPrice - stopDistance
      : entryPrice + stopDistance;
  const targetPrice =
    setup.direction === "long"
      ? entryPrice + targetDistance
      : entryPrice - targetDistance;

  const lastIndex = Math.min(
    setup.entryBarIndex + strategy.maxHoldBars,
    bars.length - 1,
  );

  let exitBarIndex = lastIndex;
  let exitPrice = bars[lastIndex]?.close ?? entryPrice;
  let exitReason: TradeExitReason =
    lastIndex >= bars.length - 1 ? "session_close" : "timeout";

  for (let index = setup.entryBarIndex + 1; index <= lastIndex; index += 1) {
    const bar = bars[index];
    if (!bar) break;

    const hitStop =
      setup.direction === "long"
        ? bar.low <= stopPrice
        : bar.high >= stopPrice;
    const hitTarget =
      setup.direction === "long"
        ? bar.high >= targetPrice
        : bar.low <= targetPrice;

    if (hitStop && hitTarget) {
      exitBarIndex = index;
      exitPrice = stopPrice;
      exitReason = "stop";
      break;
    }

    if (hitStop) {
      exitBarIndex = index;
      exitPrice = stopPrice;
      exitReason = "stop";
      break;
    }

    if (hitTarget) {
      exitBarIndex = index;
      exitPrice = targetPrice;
      exitReason = "target";
      break;
    }

    if (index === lastIndex) {
      exitBarIndex = index;
      exitPrice = bar.close;
      exitReason =
        index >= bars.length - 1 ? "session_close" : "timeout";
    }
  }

  const rawPnl =
    setup.direction === "long"
      ? exitPrice - entryPrice
      : entryPrice - exitPrice;
  const ticksPnl = priceToTicks(symbol, rawPnl);
  const dollarPnl = ticksPnl * TICK_VALUES[symbol];
  const rMultiple =
    strategy.stopTicks === 0 ? 0 : rawPnl / stopDistance;

  let score = 50;
  if (exitReason === "target") {
    score = 88 + Math.min(strategy.targetTicks / 4, 12);
  } else if (exitReason === "stop") {
    score = Math.max(8, 42 - strategy.stopTicks);
  } else if (rawPnl > 0) {
    score = 58 + Math.min(ticksPnl, 20);
  } else if (rawPnl < 0) {
    score = Math.max(12, 48 + ticksPnl);
  } else {
    score = 45;
  }

  score = Math.round(Math.min(100, Math.max(0, score)));

  const partial: Omit<TradeOutcome, "summary" | "grade" | "score"> = {
    entryBarIndex: setup.entryBarIndex,
    exitBarIndex,
    entryPrice,
    exitPrice,
    stopPrice,
    targetPrice,
    exitReason,
    direction: setup.direction,
    strategy: setup.strategy,
    ticksPnl,
    dollarPnl,
    rMultiple,
    holdBars: exitBarIndex - setup.entryBarIndex,
  };

  return {
    ...partial,
    score,
    grade: gradeFromScore(score),
    summary: buildSummary(partial, symbol),
  };
}

export function getBarIndexFromChartX(
  clientX: number,
  canvasRect: DOMRect,
  barCount: number,
  paddingLeft: number,
  paddingRight: number,
  maxSelectableIndex: number,
): number | null {
  if (barCount <= 0) return null;

  const plotWidth = canvasRect.width - paddingLeft - paddingRight;
  if (plotWidth <= 0) return null;

  const relativeX = clientX - canvasRect.left - paddingLeft;
  if (relativeX < 0 || relativeX > plotWidth) return null;

  const barWidth = plotWidth / barCount;
  const index = Math.floor(relativeX / barWidth);
  return Math.max(0, Math.min(maxSelectableIndex, index));
}
