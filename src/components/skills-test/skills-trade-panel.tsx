"use client";

import { Target, TrendingDown, TrendingUp } from "lucide-react";

import { ArcadeToggleTabs } from "@/components/skills-test/arcade-toggle-tabs";
import type { FuturesReplaySymbol } from "@/lib/skills-test/futures-symbols";
import { formatReplayPrice } from "@/lib/skills-test/session-replay";
import {
  TRADING_STRATEGIES,
  type TradeDirection,
  type TradeOutcome,
  type TradingStrategy,
} from "@/lib/skills-test/trade-scenarios";
import type { GameChallenge } from "@/lib/skills-test/arcade-game";
import { cn } from "@/lib/utils";

type SkillsTradePanelProps = {
  symbol: FuturesReplaySymbol;
  entryBarIndex: number | null;
  entryLabel: string | null;
  entryPrice: number | null;
  direction: TradeDirection;
  strategy: TradingStrategy;
  outcome: TradeOutcome | null;
  canMarkEntry: boolean;
  gameMode?: boolean;
  challenge?: GameChallenge | null;
  onDirectionChange: (direction: TradeDirection) => void;
  onStrategyChange: (strategy: TradingStrategy) => void;
  onMarkEntry: () => void;
  onRunTrade: () => void;
  onClearTrade: () => void;
};

const DIRECTION_OPTIONS = [
  { value: "long" as const, label: "LONG" },
  { value: "short" as const, label: "SHORT" },
];

const STRATEGY_OPTIONS = TRADING_STRATEGIES.map((item) => ({
  value: item.id,
  label: item.shortLabel,
  description: item.label.toUpperCase(),
}));

const GRADE_COLORS: Record<TradeOutcome["grade"], string> = {
  S: "text-[#ffd700]",
  A: "text-primary",
  B: "text-accent",
  C: "text-muted-foreground",
  D: "text-destructive",
};

export function SkillsTradePanel({
  symbol,
  entryBarIndex,
  entryLabel,
  entryPrice,
  direction,
  strategy,
  outcome,
  canMarkEntry,
  gameMode = false,
  challenge = null,
  onDirectionChange,
  onStrategyChange,
  onMarkEntry,
  onRunTrade,
  onClearTrade,
}: SkillsTradePanelProps) {
  const selectedStrategy = TRADING_STRATEGIES.find((item) => item.id === strategy);
  const readyToRun = entryBarIndex !== null && !outcome;
  const controlsLocked = gameMode;

  return (
    <section className="skills-trade-panel" aria-label="Trade setup">
      <div className="skills-trade-panel-header">
        <p className="skills-trade-panel-kicker">
          {gameMode ? "★ MISSION CONTROLS ★" : "★ TRADE LAB ★"}
        </p>
        <p className="skills-trade-panel-copy">
          {gameMode && challenge
            ? challenge.missionDetail
            : "Mark a 1-minute entry, pick a side and strategy, then run the scenario to see your score."}
        </p>
      </div>

      <div className="skills-trade-panel-grid">
        <div className="skills-trade-panel-block">
          <p className="skills-trade-panel-label">1. SIDE</p>
          <ArcadeToggleTabs
            value={direction}
            onChange={onDirectionChange}
            options={DIRECTION_OPTIONS}
            ariaLabel="Trade direction"
            variant="compact"
            className={cn(
              "skills-trade-toggle",
              controlsLocked && "pointer-events-none opacity-70",
            )}
          />
        </div>

        <div className="skills-trade-panel-block">
          <p className="skills-trade-panel-label">2. STRATEGY</p>
          <ArcadeToggleTabs
            value={strategy}
            onChange={onStrategyChange}
            options={STRATEGY_OPTIONS}
            ariaLabel="Trading strategy"
            variant="compact"
            className={cn(
              "skills-trade-toggle skills-trade-strategy-tabs",
              controlsLocked && "pointer-events-none opacity-70",
            )}
          />
          {selectedStrategy ? (
            <p className="skills-trade-panel-hint">{selectedStrategy.description}</p>
          ) : null}
        </div>

        <div className="skills-trade-panel-block">
          <p className="skills-trade-panel-label">3. ENTRY</p>
          <div className="skills-trade-entry-card">
            {entryBarIndex !== null && entryLabel && entryPrice !== null ? (
              <>
                <p className="skills-trade-entry-value">{entryLabel}</p>
                <p className="skills-trade-entry-sub">
                  Bar {entryBarIndex + 1} ·{" "}
                  {formatReplayPrice(symbol, entryPrice)}
                </p>
              </>
            ) : (
              <p className="skills-trade-entry-sub">
                Pause replay, scrub the 1M chart, then click a candle or use the
                playhead button.
              </p>
            )}
          </div>
          <div className="skills-trade-entry-actions">
            <button
              type="button"
              className="arcade-btn arcade-btn--p2 skills-replay-btn"
              onClick={onMarkEntry}
              disabled={!canMarkEntry || Boolean(outcome)}
            >
              <Target className="size-3.5" aria-hidden />
              USE PLAYHEAD
            </button>
            <button
              type="button"
              className="arcade-btn arcade-btn--p1 skills-replay-btn"
              onClick={onRunTrade}
              disabled={!readyToRun}
            >
              {gameMode ? "SUBMIT ROUND" : "RUN TRADE"}
            </button>
            {!gameMode && (outcome || entryBarIndex !== null) ? (
              <button
                type="button"
                className="arcade-btn arcade-btn--p2 skills-replay-btn"
                onClick={onClearTrade}
              >
                CLEAR
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {outcome ? (
        <div className="skills-trade-result">
          <div className="skills-trade-result-score">
            <p className="skills-trade-panel-label">SCORE</p>
            <p className="skills-trade-result-value">{outcome.score}</p>
            <p className={cn("skills-trade-result-grade", GRADE_COLORS[outcome.grade])}>
              GRADE {outcome.grade}
            </p>
          </div>

          <div className="skills-trade-result-details">
            <div className="skills-trade-result-stat">
              <span>P&amp;L</span>
              <strong
                className={cn(
                  outcome.ticksPnl >= 0 ? "text-primary" : "text-destructive",
                )}
              >
                {outcome.ticksPnl >= 0 ? "+" : ""}
                {outcome.ticksPnl} ticks · ${outcome.dollarPnl.toFixed(2)}
              </strong>
            </div>
            <div className="skills-trade-result-stat">
              <span>R-MULTIPLE</span>
              <strong>
                {outcome.rMultiple >= 0 ? "+" : ""}
                {outcome.rMultiple.toFixed(2)}R
              </strong>
            </div>
            <div className="skills-trade-result-stat">
              <span>EXIT</span>
              <strong className="inline-flex items-center gap-1">
                {outcome.direction === "long" ? (
                  <TrendingUp className="size-3.5" aria-hidden />
                ) : (
                  <TrendingDown className="size-3.5" aria-hidden />
                )}
                {outcome.exitReason.replace("_", " ").toUpperCase()}
              </strong>
            </div>
            <p className="skills-trade-result-summary">{outcome.summary}</p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
