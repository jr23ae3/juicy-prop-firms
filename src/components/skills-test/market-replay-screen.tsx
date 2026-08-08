"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { MonitorPlay, Pause, Play, RotateCcw } from "lucide-react";

import { ArcadeToggleTabs } from "@/components/skills-test/arcade-toggle-tabs";
import { SkillsTradePanel } from "@/components/skills-test/skills-trade-panel";
import {
  FUTURES_REPLAY_SYMBOLS,
  FUTURES_SYMBOL_META,
  REPLAY_SPEEDS,
  type FuturesReplaySymbol,
  type ReplaySpeed,
} from "@/lib/skills-test/futures-symbols";
import {
  formatReplayPrice,
  generateSessionReplay,
  type SessionReplay,
} from "@/lib/skills-test/session-replay";
import {
  getBarIndexFromChartX,
  simulateTrade,
  type TradeDirection,
  type TradeOutcome,
  type TradingStrategy,
} from "@/lib/skills-test/trade-scenarios";
import { cn } from "@/lib/utils";

type MarketReplayScreenProps = {
  sessionDate: string;
};

const SYMBOL_TAB_OPTIONS = FUTURES_REPLAY_SYMBOLS.map((ticker) => ({
  value: ticker,
  label: ticker,
  description: ticker === "NQ" || ticker === "MNQ" ? "NASDAQ" : "S&P",
}));

const SPEED_TAB_OPTIONS = REPLAY_SPEEDS.map((value) => ({
  value,
  label: `${value}X`,
}));

const CHART_PADDING = { top: 16, right: 56, bottom: 28, left: 12 };
const VOLUME_RATIO = 0.22;

function formatSignedChange(value: number, symbol: FuturesReplaySymbol) {
  const prefix = value >= 0 ? "+" : "";
  return `${prefix}${formatReplayPrice(symbol, value)}`;
}

export function MarketReplayScreen({ sessionDate }: MarketReplayScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);
  const accumulatorRef = useRef<number>(0);

  const [symbol, setSymbol] = useState<FuturesReplaySymbol>("NQ");
  const [frameIndex, setFrameIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<ReplaySpeed>(5);
  const [entryBarIndex, setEntryBarIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<TradeDirection>("long");
  const [strategy, setStrategy] = useState<TradingStrategy>("breakout");
  const [outcome, setOutcome] = useState<TradeOutcome | null>(null);

  const replays = useMemo(
    () =>
      Object.fromEntries(
        FUTURES_REPLAY_SYMBOLS.map((ticker) => [
          ticker,
          generateSessionReplay(ticker, sessionDate),
        ]),
      ) as Record<FuturesReplaySymbol, SessionReplay>,
    [sessionDate],
  );

  const replay = replays[symbol];
  const meta = FUTURES_SYMBOL_META[symbol];
  const visibleBarIndex = outcome?.exitBarIndex ?? frameIndex;
  const currentBar =
    replay.bars[visibleBarIndex] ?? replay.bars[replay.bars.length - 1];
  const entryBar =
    entryBarIndex !== null ? replay.bars[entryBarIndex] : undefined;
  const progress =
    replay.bars.length <= 1
      ? 0
      : (frameIndex / (replay.bars.length - 1)) * 100;
  const sessionChangePositive = replay.change >= 0;

  const clearTradeState = useCallback(() => {
    setEntryBarIndex(null);
    setOutcome(null);
  }, []);

  const drawChart = useCallback(
    (canvas: HTMLCanvasElement, width: number, height: number) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const chartHeight = height * (1 - VOLUME_RATIO);
      const volumeTop = chartHeight;
      const plotWidth = width - CHART_PADDING.left - CHART_PADDING.right;
      const plotHeight = chartHeight - CHART_PADDING.top - CHART_PADDING.bottom;

      ctx.fillStyle = "#020812";
      ctx.fillRect(0, 0, width, height);

      const priceBars = replay.bars;
      const priceMin = Math.min(...priceBars.map((bar) => bar.low));
      const priceMax = Math.max(...priceBars.map((bar) => bar.high));
      const priceRange = Math.max(priceMax - priceMin, meta.tickSize * 4);
      const paddedMin = priceMin - priceRange * 0.04;
      const paddedMax = priceMax + priceRange * 0.04;
      const maxVolume = Math.max(...priceBars.map((bar) => bar.volume), 1);
      const barWidth = plotWidth / Math.max(priceBars.length, 1);

      const priceToY = (price: number) =>
        CHART_PADDING.top +
        plotHeight -
        ((price - paddedMin) / (paddedMax - paddedMin)) * plotHeight;

      ctx.strokeStyle = "rgba(0, 185, 122, 0.12)";
      ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i += 1) {
        const y = CHART_PADDING.top + (plotHeight / 4) * i;
        ctx.beginPath();
        ctx.moveTo(CHART_PADDING.left, y);
        ctx.lineTo(width - CHART_PADDING.right, y);
        ctx.stroke();

        const price = paddedMax - ((paddedMax - paddedMin) / 4) * i;
        ctx.fillStyle = "rgba(54, 255, 255, 0.55)";
        ctx.font = "10px var(--font-mono, monospace)";
        ctx.textAlign = "right";
        ctx.fillText(formatReplayPrice(symbol, price), width - 8, y + 3);
      }

      for (const bar of priceBars) {
        const x = CHART_PADDING.left + bar.index * barWidth + barWidth * 0.15;
        const w = Math.max(barWidth * 0.7, 1);
        const isUp = bar.close >= bar.open;
        const bodyTop = priceToY(Math.max(bar.open, bar.close));
        const bodyBottom = priceToY(Math.min(bar.open, bar.close));
        const highY = priceToY(bar.high);
        const lowY = priceToY(bar.low);
        const isVisible = bar.index <= visibleBarIndex;
        const isFutureEntry =
          entryBarIndex !== null &&
          bar.index > entryBarIndex &&
          bar.index <= visibleBarIndex;
        const isEntry = entryBarIndex === bar.index;
        const isExit = outcome?.exitBarIndex === bar.index;

        ctx.globalAlpha = isVisible ? 1 : 0.1;
        ctx.strokeStyle = isUp ? "#00B97A" : "#ff4d6d";
        ctx.fillStyle = isUp ? "#00B97A" : "#ff4d6d";

        if (isEntry) {
          ctx.strokeStyle = "#ffd700";
          ctx.fillStyle = "#ffd700";
        } else if (isExit) {
          ctx.strokeStyle = "#36FFFF";
          ctx.fillStyle = "#36FFFF";
        } else if (isFutureEntry) {
          ctx.globalAlpha = 0.72;
        }

        ctx.beginPath();
        ctx.moveTo(x + w / 2, highY);
        ctx.lineTo(x + w / 2, lowY);
        ctx.stroke();

        const bodyHeight = Math.max(bodyBottom - bodyTop, 1);
        ctx.fillRect(x, bodyTop, w, bodyHeight);
      }

      ctx.globalAlpha = 1;

      for (const bar of priceBars) {
        if (bar.index > visibleBarIndex) continue;
        const x = CHART_PADDING.left + bar.index * barWidth + barWidth * 0.15;
        const w = Math.max(barWidth * 0.7, 1);
        const volHeight = (bar.volume / maxVolume) * (height - volumeTop - 8);
        const isUp = bar.close >= bar.open;
        ctx.fillStyle = isUp
          ? "rgba(0, 185, 122, 0.45)"
          : "rgba(255, 77, 109, 0.45)";
        ctx.fillRect(x, height - volHeight - 4, w, volHeight);
      }

      const drawPriceLine = (
        price: number,
        color: string,
        dash: number[] = [],
      ) => {
        const y = priceToY(price);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.setLineDash(dash);
        ctx.beginPath();
        ctx.moveTo(CHART_PADDING.left, y);
        ctx.lineTo(width - CHART_PADDING.right, y);
        ctx.stroke();
        ctx.setLineDash([]);
      };

      if (outcome) {
        drawPriceLine(outcome.stopPrice, "rgba(255, 77, 109, 0.75)", [5, 4]);
        drawPriceLine(outcome.targetPrice, "rgba(0, 185, 122, 0.75)", [5, 4]);
        drawPriceLine(outcome.entryPrice, "rgba(255, 215, 0, 0.85)");
        drawPriceLine(outcome.exitPrice, "rgba(54, 255, 255, 0.85)", [2, 3]);
      } else if (entryBar) {
        drawPriceLine(entryBar.close, "rgba(255, 215, 0, 0.85)");
      }

      const playheadX =
        CHART_PADDING.left + visibleBarIndex * barWidth + barWidth / 2;
      ctx.strokeStyle = "#36FFFF";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(playheadX, CHART_PADDING.top);
      ctx.lineTo(playheadX, height - 6);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "rgba(54, 255, 255, 0.85)";
      ctx.font = "9px var(--font-arcade, monospace)";
      ctx.textAlign = "left";
      ctx.fillText("1M", CHART_PADDING.left + 4, CHART_PADDING.top + 10);

      ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = "rgba(54, 255, 255, 0.04)";
      for (let y = 0; y < height; y += 3) {
        ctx.fillRect(0, y, width, 1);
      }
    },
    [
      entryBar,
      entryBarIndex,
      outcome,
      replay.bars,
      symbol,
      visibleBarIndex,
    ],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      drawChart(canvas, rect.width, rect.height);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    return () => observer.disconnect();
  }, [drawChart]);

  useEffect(() => {
    if (!playing || outcome) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    const tick = (timestamp: number) => {
      if (!lastTickRef.current) lastTickRef.current = timestamp;
      const delta = timestamp - lastTickRef.current;
      lastTickRef.current = timestamp;
      accumulatorRef.current += delta * (speed / 1000);

      while (accumulatorRef.current >= 1) {
        accumulatorRef.current -= 1;
        setFrameIndex((current) => {
          if (current >= replay.bars.length - 1) {
            setPlaying(false);
            return current;
          }
          return current + 1;
        });
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTickRef.current = 0;
      accumulatorRef.current = 0;
    };
  }, [outcome, playing, replay.bars.length, speed]);

  const handleSymbolChange = (next: FuturesReplaySymbol) => {
    setSymbol(next);
    setFrameIndex(0);
    setPlaying(false);
    clearTradeState();
  };

  const handleReset = () => {
    setFrameIndex(0);
    setPlaying(false);
    clearTradeState();
  };

  const handleMarkEntry = () => {
    setPlaying(false);
    setEntryBarIndex(frameIndex);
    setOutcome(null);
  };

  const handleChartClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (outcome) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const index = getBarIndexFromChartX(
      event.clientX,
      rect,
      replay.bars.length,
      CHART_PADDING.left,
      CHART_PADDING.right,
      frameIndex,
    );

    if (index === null) return;

    setPlaying(false);
    setEntryBarIndex(index);
    setFrameIndex(index);
    setOutcome(null);
  };

  const handleRunTrade = () => {
    if (entryBarIndex === null) return;

    setPlaying(false);
    const result = simulateTrade(symbol, replay.bars, {
      entryBarIndex,
      direction,
      strategy,
    });

    if (!result) return;

    setOutcome(result);
    setFrameIndex(result.exitBarIndex);
  };

  const handleClearTrade = () => {
    clearTradeState();
  };

  return (
    <div className="skills-replay-shell space-y-4">
      <div className="skills-replay-monitor">
        <div className="skills-replay-monitor-bar">
          <span className="skills-replay-monitor-dot skills-replay-monitor-dot--red" />
          <span className="skills-replay-monitor-dot skills-replay-monitor-dot--yellow" />
          <span className="skills-replay-monitor-dot skills-replay-monitor-dot--green" />
          <span className="skills-replay-monitor-title">
            1M SESSION REPLAY · {sessionDate}
          </span>
        </div>

        <ArcadeToggleTabs
          value={symbol}
          onChange={handleSymbolChange}
          options={SYMBOL_TAB_OPTIONS}
          ariaLabel="Futures symbol"
          panelId="skills-replay-panel"
          className="skills-replay-symbol-tabs"
        />

        <div
          id="skills-replay-panel"
          role="tabpanel"
          aria-labelledby={`skills-replay-panel-tab-${symbol}`}
        >
          <div className="skills-replay-hud">
            <div>
              <p className="skills-replay-hud-label">SYMBOL</p>
              <p className="skills-replay-hud-value">{symbol}</p>
              <p className="skills-replay-hud-sub">{meta.name}</p>
            </div>
            <div>
              <p className="skills-replay-hud-label">LAST</p>
              <p className="skills-replay-hud-value">
                {formatReplayPrice(symbol, currentBar.close)}
              </p>
              <p
                className={cn(
                  "skills-replay-hud-sub",
                  sessionChangePositive ? "text-primary" : "text-destructive",
                )}
              >
                {formatSignedChange(replay.change, symbol)} (
                {replay.changePct >= 0 ? "+" : ""}
                {replay.changePct.toFixed(2)}%)
              </p>
            </div>
            <div>
              <p className="skills-replay-hud-label">TIMEFRAME</p>
              <p className="skills-replay-hud-value">1 MIN</p>
              <p className="skills-replay-hud-sub">{currentBar.label}</p>
            </div>
            <div className="hidden sm:block">
              <p className="skills-replay-hud-label">OHLC</p>
              <p className="skills-replay-hud-sub font-mono text-[10px] leading-relaxed">
                O {formatReplayPrice(symbol, currentBar.open)} · H{" "}
                {formatReplayPrice(symbol, currentBar.high)} · L{" "}
                {formatReplayPrice(symbol, currentBar.low)} · C{" "}
                {formatReplayPrice(symbol, currentBar.close)}
              </p>
            </div>
          </div>

          <div
            ref={containerRef}
            className={cn(
              "skills-replay-canvas-wrap",
              !outcome && "skills-replay-canvas-wrap--interactive",
            )}
            aria-label={`${symbol} 1-minute session replay chart`}
          >
            <canvas
              ref={canvasRef}
              className="skills-replay-canvas"
              onClick={handleChartClick}
            />
            <div className="skills-replay-canvas-overlay" aria-hidden />
          </div>
        </div>

        <div className="skills-replay-controls">
          <div className="skills-replay-transport">
            <button
              type="button"
              className="arcade-btn arcade-btn--p1 skills-replay-btn"
              onClick={() => setPlaying((value) => !value)}
              disabled={Boolean(outcome)}
              aria-label={playing ? "Pause replay" : "Play replay"}
            >
              {playing ? (
                <Pause className="size-3.5" aria-hidden />
              ) : (
                <Play className="size-3.5" aria-hidden />
              )}
              {playing ? "PAUSE" : "PLAY"}
            </button>
            <button
              type="button"
              className="arcade-btn arcade-btn--p2 skills-replay-btn"
              onClick={handleReset}
            >
              <RotateCcw className="size-3.5" aria-hidden />
              RESET
            </button>
          </div>

          <div className="skills-replay-speed-wrap">
            <p className="skills-replay-controls-label">SPEED</p>
            <ArcadeToggleTabs
              value={speed}
              onChange={setSpeed}
              options={SPEED_TAB_OPTIONS}
              ariaLabel="Replay speed"
              variant="compact"
              className="skills-replay-speed-tabs"
            />
          </div>
        </div>

        <label className="skills-replay-scrubber">
          <span className="sr-only">Scrub 1-minute session replay</span>
          <input
            type="range"
            min={0}
            max={replay.bars.length - 1}
            value={frameIndex}
            disabled={Boolean(outcome)}
            onChange={(event) => {
              setPlaying(false);
              setFrameIndex(Number(event.target.value));
            }}
            style={{
              background: `linear-gradient(to right, #00B97A ${progress}%, rgba(0, 185, 122, 0.15) ${progress}%)`,
            }}
          />
        </label>
      </div>

      <SkillsTradePanel
        symbol={symbol}
        entryBarIndex={entryBarIndex}
        entryLabel={entryBar?.label ?? null}
        entryPrice={entryBar?.close ?? null}
        direction={direction}
        strategy={strategy}
        outcome={outcome}
        canMarkEntry={!playing && !outcome}
        onDirectionChange={(next) => {
          setDirection(next);
          setOutcome(null);
        }}
        onStrategyChange={(next) => {
          setStrategy(next);
          setOutcome(null);
        }}
        onMarkEntry={handleMarkEntry}
        onRunTrade={handleRunTrade}
        onClearTrade={handleClearTrade}
      />

      <p className="skills-replay-footnote">
        <MonitorPlay className="inline size-3.5 align-text-bottom opacity-70" />{" "}
        390 one-minute bars for {replay.sessionLabel}. Click a candle to mark
        entry, choose a strategy, and run the scenario for your score.
      </p>
    </div>
  );
}
