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
import { SkillsGuideDialogue } from "@/components/skills-test/skills-guide-dialogue";
import { SkillsGameHud } from "@/components/skills-test/skills-game-hud";
import { SkillsGameOverlay } from "@/components/skills-test/skills-game-overlay";
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
  evaluateAchievements,
  summarizeRoundForStats,
  type AchievementDefinition,
} from "@/lib/skills-test/arcade-achievements";
import {
  ARCADE_STARTING_LIVES,
  ARCADE_TOTAL_ROUNDS,
  createBossTimeoutResult,
  createChallenge,
  evaluateRound,
  getDailySeedLabel,
  getHighScore,
  saveHighScore,
  type GameChallenge,
  type GamePhase,
  type PlayMode,
  type RoundResult,
} from "@/lib/skills-test/arcade-game";
import {
  getDailyLeaderboard,
  getPlayerInitials,
  getUnlockedAchievements,
  savePlayerInitials,
  saveUnlockedAchievements,
  type DailyLeaderboard,
} from "@/lib/skills-test/arcade-persistence";
import {
  isGlobalDailyLeader,
  loadLeaderboardWithFallback,
  submitGlobalLeaderboardScore,
} from "@/lib/skills-test/leaderboard-api";
import {
  getBarIndexFromChartX,
  simulateTrade,
  type TradeDirection,
  type TradeOutcome,
  type TradingStrategy,
} from "@/lib/skills-test/trade-scenarios";
import { cn } from "@/lib/utils";
import { useSkillsGuide } from "@/hooks/use-skills-guide";

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

const PLAY_MODE_OPTIONS = [
  { value: "practice" as const, label: "PRACTICE" },
  { value: "arcade" as const, label: "ARCADE" },
];

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
  const bossTimedOutRef = useRef(false);
  const sessionStatsRef = useRef({
    maxCombo: 0,
    sGrades: 0,
    bossRoundPassed: false,
    bestEntryLeadBars: 0,
  });

  const [symbol, setSymbol] = useState<FuturesReplaySymbol>("NQ");
  const [frameIndex, setFrameIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<ReplaySpeed>(5);
  const [entryBarIndex, setEntryBarIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<TradeDirection>("long");
  const [strategy, setStrategy] = useState<TradingStrategy>("breakout");
  const [outcome, setOutcome] = useState<TradeOutcome | null>(null);
  const [playMode, setPlayMode] = useState<PlayMode>("practice");
  const [gamePhase, setGamePhase] = useState<GamePhase>("ready");
  const [round, setRound] = useState(1);
  const [lives, setLives] = useState(ARCADE_STARTING_LIVES);
  const [totalScore, setTotalScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [challenge, setChallenge] = useState<GameChallenge | null>(null);
  const [lastRoundResult, setLastRoundResult] = useState<RoundResult | null>(
    null,
  );
  const [dailyLeaderboard, setDailyLeaderboard] = useState<DailyLeaderboard>({
    date: sessionDate,
    entries: [],
  });
  const [unlockedAchievementIds, setUnlockedAchievementIds] = useState<string[]>(
    [],
  );
  const [newlyUnlocked, setNewlyUnlocked] = useState<AchievementDefinition[]>(
    [],
  );
  const [playerInitials, setPlayerInitials] = useState("");
  const [bossSecondsLeft, setBossSecondsLeft] = useState<number | null>(null);

  const isArcadePlaying = playMode === "arcade" && gamePhase === "playing";
  const isArcadeLocked = playMode === "arcade" && gamePhase !== "ready";
  const dailySeed = getDailySeedLabel(sessionDate);

  useEffect(() => {
    setHighScore(getHighScore());
    setUnlockedAchievementIds(getUnlockedAchievements());
    setPlayerInitials(getPlayerInitials());
    void loadLeaderboardWithFallback(sessionDate)
      .then(setDailyLeaderboard)
      .catch(() => setDailyLeaderboard(getDailyLeaderboard(sessionDate)));
  }, [sessionDate]);

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

  const guide = useSkillsGuide({
    playMode,
    gamePhase,
    entryBarIndex,
    outcome,
    isBossRound: challenge?.isBossRound ?? false,
    round,
  });

  const clearTradeState = useCallback(() => {
    setEntryBarIndex(null);
    setOutcome(null);
  }, []);

  const finalizeGame = useCallback(
    async (score: number, wonRun: boolean, livesRemaining: number) => {
      const currentHigh = getHighScore();
      if (score > currentHigh) {
        saveHighScore(score);
        setHighScore(score);
        setIsNewHighScore(true);
      } else {
        setIsNewHighScore(false);
      }

      const stats = {
        totalScore: score,
        livesRemaining,
        roundsCompleted: round,
        maxCombo: sessionStatsRef.current.maxCombo,
        sGrades: sessionStatsRef.current.sGrades,
        bossRoundPassed: sessionStatsRef.current.bossRoundPassed,
        flawless: livesRemaining === ARCADE_STARTING_LIVES && wonRun,
        bestEntryLeadBars: sessionStatsRef.current.bestEntryLeadBars,
        finishedRun: true,
        wonRun,
      };

      const initials = playerInitials.trim() || getPlayerInitials() || "YOU";
      savePlayerInitials(initials);

      const board = await submitGlobalLeaderboardScore({
        sessionDate,
        initials,
        score,
        flawless: stats.flawless,
        roundsWon: wonRun,
      });
      setDailyLeaderboard(board);

      const previous = getUnlockedAchievements();
      const isLeader = isGlobalDailyLeader(board, score, initials);
      const achievementResult = evaluateAchievements(
        stats,
        previous,
        isLeader,
      );
      saveUnlockedAchievements(achievementResult.unlockedIds);
      setUnlockedAchievementIds(achievementResult.unlockedIds);
      setNewlyUnlocked(achievementResult.newlyUnlocked);
    },
    [playerInitials, round, sessionDate],
  );

  const beginRound = useCallback(
    (roundNum: number) => {
      const nextChallenge = createChallenge(roundNum, sessionDate, replays);
      setChallenge(nextChallenge);
      setSymbol(nextChallenge.symbol);
      setDirection(nextChallenge.direction);
      setStrategy(nextChallenge.strategy);
      setFrameIndex(nextChallenge.startBar);
      setPlaying(false);
      setEntryBarIndex(null);
      setOutcome(null);
      setLastRoundResult(null);
      setGamePhase("playing");
    },
    [replays, sessionDate],
  );

  const startArcadeGame = useCallback(() => {
    setPlayMode("arcade");
    setRound(1);
    setLives(ARCADE_STARTING_LIVES);
    setTotalScore(0);
    setCombo(0);
    setNewlyUnlocked([]);
    sessionStatsRef.current = {
      maxCombo: 0,
      sGrades: 0,
      bossRoundPassed: false,
      bestEntryLeadBars: 0,
    };
    beginRound(1);
  }, [beginRound]);

  const exitArcadeMode = useCallback(() => {
    setPlayMode("practice");
    setGamePhase("ready");
    setChallenge(null);
    setLastRoundResult(null);
    setFrameIndex(0);
    setPlaying(false);
    clearTradeState();
  }, [clearTradeState]);

  const applyRoundResult = useCallback(
    (roundResult: RoundResult, tradeGrade: string | null = null) => {
      if (!challenge) return;

      const summary = summarizeRoundForStats(
        roundResult,
        entryBarIndex,
        challenge.entryDeadlineBar,
        tradeGrade,
        challenge.isBossRound,
      );
      sessionStatsRef.current.maxCombo = Math.max(
        sessionStatsRef.current.maxCombo,
        roundResult.combo,
      );
      sessionStatsRef.current.sGrades += summary.sGrade;
      if (summary.bossPassed) {
        sessionStatsRef.current.bossRoundPassed = true;
      }
      sessionStatsRef.current.bestEntryLeadBars = Math.max(
        sessionStatsRef.current.bestEntryLeadBars,
        summary.entryLeadBars,
      );

      setLastRoundResult(roundResult);
      setTotalScore((current) => current + roundResult.points);
      setCombo(roundResult.combo);
      setLives((current) =>
        roundResult.lostLife ? Math.max(0, current - 1) : current,
      );
      setBossSecondsLeft(null);
      setGamePhase("round_end");
    },
    [challenge, entryBarIndex],
  );

  const handleBossTimeout = useCallback(() => {
    if (gamePhase !== "playing" || !challenge?.isBossRound || outcome) return;
    setPlaying(false);
    applyRoundResult(createBossTimeoutResult());
  }, [applyRoundResult, challenge, gamePhase, outcome]);

  useEffect(() => {
    if (!isArcadePlaying || !challenge?.isBossRound || outcome) {
      setBossSecondsLeft(null);
      return;
    }

    bossTimedOutRef.current = false;
    setBossSecondsLeft(challenge.bossTimeLimitSeconds);
    const timerId = window.setInterval(() => {
      setBossSecondsLeft((current) => {
        if (current === null) return current;
        if (current <= 1) {
          window.clearInterval(timerId);
          if (!bossTimedOutRef.current) {
            bossTimedOutRef.current = true;
            handleBossTimeout();
          }
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [
    challenge,
    handleBossTimeout,
    isArcadePlaying,
    outcome,
  ]);

  const handlePlayModeChange = (mode: PlayMode) => {
    if (mode === playMode) return;
    if (mode === "practice") {
      exitArcadeMode();
      return;
    }
    setPlayMode("arcade");
    setGamePhase("ready");
    setChallenge(null);
    clearTradeState();
  };

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

      if (challenge && playMode === "arcade") {
        const deadlineX =
          CHART_PADDING.left +
          challenge.entryDeadlineBar * barWidth +
          barWidth / 2;
        ctx.strokeStyle = "rgba(255, 215, 0, 0.75)";
        ctx.lineWidth = 1.25;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(deadlineX, CHART_PADDING.top);
        ctx.lineTo(deadlineX, height - 6);
        ctx.stroke();
        ctx.setLineDash([]);
      }

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
      challenge,
      entryBar,
      entryBarIndex,
      outcome,
      playMode,
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
    if (isArcadeLocked) return;
    setSymbol(next);
    setFrameIndex(0);
    setPlaying(false);
    clearTradeState();
  };

  const handleReset = () => {
    if (isArcadePlaying && challenge) {
      setFrameIndex(challenge.startBar);
      setPlaying(false);
      clearTradeState();
      return;
    }
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

    if (isArcadePlaying && challenge) {
      const roundResult = evaluateRound(
        result,
        entryBarIndex,
        challenge,
        combo,
      );
      applyRoundResult(roundResult, result.grade);
    }
  };

  const handleNextRound = () => {
    const nextScore = totalScore;
    const remainingLives = lives;

    if (remainingLives <= 0) {
      void finalizeGame(nextScore, false, remainingLives).then(() => {
        setGamePhase("game_over");
      });
      return;
    }

    if (round >= ARCADE_TOTAL_ROUNDS) {
      void finalizeGame(nextScore, true, remainingLives).then(() => {
        setGamePhase("complete");
      });
      return;
    }

    const nextRound = round + 1;
    setRound(nextRound);
    beginRound(nextRound);
  };

  const handleClearTrade = () => {
    clearTradeState();
  };

  const handleInitialsChange = (value: string) => {
    setPlayerInitials(value);
    savePlayerInitials(value);
  };

  const sharedOverlayProps = {
    dailyLeaderboard,
    dailySeed,
    unlockedAchievementIds,
    playerInitials,
    onPlayerInitialsChange: handleInitialsChange,
    onStart: startArcadeGame,
    onNextRound: handleNextRound,
    onExit: exitArcadeMode,
  };

  return (
    <div
      className={cn(
        "skills-replay-shell space-y-4",
        guide.highlight && `skills-guide-focus-${guide.highlight}`,
      )}
    >
      <div className="skills-replay-topbar">
        <div data-guide-target="mode" className="skills-replay-mode-wrap">
          <ArcadeToggleTabs
            value={playMode}
            onChange={handlePlayModeChange}
            options={PLAY_MODE_OPTIONS}
            ariaLabel="Skills test mode"
            className="skills-play-mode-tabs"
            panelId="skills-mode-tabs"
          />
        </div>
        <button
          type="button"
          className="arcade-btn arcade-btn--p2 skills-replay-btn skills-guide-trigger"
          onClick={guide.openContextualGuide}
        >
          ASK GUIDE
        </button>
      </div>

      {guide.activeFlow ? (
        <SkillsGuideDialogue
          flow={guide.activeFlow}
          step={guide.displayStep}
          stepIndex={guide.displayIndex}
          totalSteps={guide.displayTotal}
          onNext={guide.nextStep}
          onBack={guide.prevStep}
          onSkip={guide.skipGuide}
          onClose={guide.closeGuide}
        />
      ) : null}

      {!guide.activeFlow && guide.roundHint && playMode === "arcade" && gamePhase === "playing" ? (
        <div className="skills-guide-hint-banner">
          <p className="skills-guide-hint-banner-title">{guide.roundHint?.speaker}</p>
          <p className="skills-guide-hint-banner-text">{guide.roundHint?.lines[0]}</p>
          <button
            type="button"
            className="arcade-btn arcade-btn--p1 skills-replay-btn"
            onClick={guide.openContextualGuide}
          >
            TALK
          </button>
        </div>
      ) : null}

      {playMode === "arcade" && gamePhase === "playing" ? (
        <div data-guide-target="hud">
          <SkillsGameHud
            round={round}
            totalRounds={ARCADE_TOTAL_ROUNDS}
          lives={lives}
          totalScore={totalScore}
          combo={combo}
          highScore={highScore}
          challenge={challenge}
          entryBarIndex={entryBarIndex}
          bossSecondsLeft={bossSecondsLeft}
        />
        </div>
      ) : null}

      <div className="skills-replay-monitor relative" data-guide-target="overlay">
        {playMode === "arcade" && gamePhase === "ready" ? (
          <SkillsGameOverlay
            variant="intro"
            roundResult={null}
            totalScore={0}
            highScore={highScore}
            isNewHighScore={false}
            newlyUnlocked={[]}
            {...sharedOverlayProps}
          />
        ) : null}

        {playMode === "arcade" && gamePhase === "round_end" && lastRoundResult ? (
          <SkillsGameOverlay
            variant="round_end"
            roundResult={lastRoundResult}
            totalScore={totalScore}
            highScore={highScore}
            isNewHighScore={false}
            newlyUnlocked={[]}
            {...sharedOverlayProps}
          />
        ) : null}

        {playMode === "arcade" && gamePhase === "game_over" ? (
          <SkillsGameOverlay
            variant="game_over"
            roundResult={lastRoundResult}
            totalScore={totalScore}
            highScore={highScore}
            isNewHighScore={isNewHighScore}
            newlyUnlocked={newlyUnlocked}
            {...sharedOverlayProps}
          />
        ) : null}

        {playMode === "arcade" && gamePhase === "complete" ? (
          <SkillsGameOverlay
            variant="victory"
            roundResult={lastRoundResult}
            totalScore={totalScore}
            highScore={highScore}
            isNewHighScore={isNewHighScore}
            newlyUnlocked={newlyUnlocked}
            {...sharedOverlayProps}
          />
        ) : null}

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
          className={cn(
            "skills-replay-symbol-tabs",
            isArcadeLocked && "pointer-events-none opacity-60",
          )}
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
            data-guide-target="chart"
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

        <div className="skills-replay-controls" data-guide-target="controls">
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

      <div data-guide-target="trade-panel">
      <SkillsTradePanel
        symbol={symbol}
        entryBarIndex={entryBarIndex}
        entryLabel={entryBar?.label ?? null}
        entryPrice={entryBar?.close ?? null}
        direction={direction}
        strategy={strategy}
        outcome={outcome}
        canMarkEntry={!playing && !outcome && (!isArcadeLocked || isArcadePlaying)}
        gameMode={isArcadePlaying}
        challenge={challenge}
        onDirectionChange={(next) => {
          if (isArcadePlaying) return;
          setDirection(next);
          setOutcome(null);
        }}
        onStrategyChange={(next) => {
          if (isArcadePlaying) return;
          setStrategy(next);
          setOutcome(null);
        }}
        onMarkEntry={handleMarkEntry}
        onRunTrade={handleRunTrade}
        onClearTrade={handleClearTrade}
      />
      </div>

      <p className="skills-replay-footnote">
        <MonitorPlay className="inline size-3.5 align-text-bottom opacity-70" />{" "}
        {playMode === "arcade" ? (
          <>
            Arcade Run: clear 5 missions on the 1-minute chart. Beat your high
            score of {highScore}.
          </>
        ) : (
          <>
            390 one-minute bars for {replay.sessionLabel}. Click a candle to mark
            entry, choose a strategy, and run the scenario for your score.
          </>
        )}
      </p>
    </div>
  );
}
