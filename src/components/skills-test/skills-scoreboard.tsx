"use client";

import { RefreshCw, Trophy } from "lucide-react";
import { useState } from "react";

import type { DailyLeaderboard } from "@/lib/skills-test/arcade-persistence";
import { cn } from "@/lib/utils";

type SkillsScoreboardProps = {
  board: DailyLeaderboard;
  dailySeed: string;
  sessionDate: string;
  playerInitials: string;
  highScore: number;
  currentRunScore?: number | null;
  highlightScore?: number;
  onPlayerInitialsChange: (value: string) => void;
  onRefresh: () => Promise<void> | void;
  className?: string;
};

function getProjectedRank(board: DailyLeaderboard, score: number) {
  if (score <= 0) return null;
  const sorted = [...board.entries].sort((a, b) => b.score - a.score);
  for (let index = 0; index < sorted.length; index += 1) {
    if (score >= (sorted[index]?.score ?? 0)) {
      return index + 1;
    }
  }
  return sorted.length + 1;
}

function getPlayerRank(
  board: DailyLeaderboard,
  initials: string,
  score?: number,
) {
  const clean = initials.trim().slice(0, 3).toUpperCase() || "YOU";
  const index = board.entries.findIndex(
    (entry) =>
      entry.initials === clean && (score === undefined || entry.score === score),
  );
  return index >= 0 ? index + 1 : null;
}

const rankTone: Record<number, string> = {
  1: "skills-scoreboard-row--gold",
  2: "skills-scoreboard-row--silver",
  3: "skills-scoreboard-row--bronze",
};

export function SkillsScoreboard({
  board,
  dailySeed,
  sessionDate,
  playerInitials,
  highScore,
  currentRunScore = null,
  highlightScore,
  onPlayerInitialsChange,
  onRefresh,
  className,
}: SkillsScoreboardProps) {
  const [refreshing, setRefreshing] = useState(false);
  const cleanInitials = playerInitials.trim().slice(0, 3).toUpperCase() || "YOU";
  const listedRank = getPlayerRank(board, cleanInitials, highlightScore);
  const projectedRank =
    currentRunScore && currentRunScore > 0
      ? getProjectedRank(board, currentRunScore)
      : null;

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <section
      className={cn("skills-scoreboard", className)}
      aria-label="Daily high score board"
      data-guide-target="scoreboard"
    >
      <div className="skills-scoreboard-header">
        <div className="skills-scoreboard-heading">
          <Trophy className="size-4 text-[#ffd700]" aria-hidden />
          <div>
            <p className="skills-scoreboard-title">HIGH SCORES</p>
            <p className="skills-scoreboard-sub">
              Daily board · {sessionDate} · seed {dailySeed}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="arcade-btn arcade-btn--p2 skills-replay-btn skills-scoreboard-refresh"
          onClick={() => void handleRefresh()}
          disabled={refreshing}
          aria-label="Refresh scoreboard"
        >
          <RefreshCw
            className={cn("size-3.5", refreshing && "animate-spin")}
            aria-hidden
          />
          REFRESH
        </button>
      </div>

      <div className="skills-scoreboard-stats">
        <div className="skills-scoreboard-stat">
          <p className="skills-scoreboard-stat-label">YOUR HI</p>
          <p className="skills-scoreboard-stat-value">{highScore}</p>
        </div>
        {currentRunScore !== null ? (
          <div className="skills-scoreboard-stat">
            <p className="skills-scoreboard-stat-label">THIS RUN</p>
            <p className="skills-scoreboard-stat-value skills-scoreboard-stat-value--live">
              {currentRunScore}
            </p>
          </div>
        ) : null}
        <div className="skills-scoreboard-stat">
          <p className="skills-scoreboard-stat-label">RANK</p>
          <p className="skills-scoreboard-stat-value">
            {listedRank
              ? `#${listedRank.toString().padStart(2, "0")}`
              : projectedRank
                ? `~#${projectedRank.toString().padStart(2, "0")}`
                : "—"}
          </p>
        </div>
        <label className="skills-scoreboard-initials">
          <span className="skills-scoreboard-stat-label">INITIALS</span>
          <input
            type="text"
            maxLength={3}
            value={playerInitials}
            onChange={(event) =>
              onPlayerInitialsChange(event.target.value.toUpperCase())
            }
            className="skills-scoreboard-initials-input"
            placeholder="YOU"
            aria-label="Scoreboard initials"
          />
        </label>
      </div>

      {board.entries.length === 0 ? (
        <p className="skills-scoreboard-empty">
          No scores posted yet today. Clear Tape Quest in Arcade mode to claim
          rank #1.
        </p>
      ) : (
        <ol className="skills-scoreboard-list">
          {board.entries.map((entry, index) => {
            const rank = index + 1;
            const isHighlighted =
              highlightScore === entry.score ||
              (entry.initials === cleanInitials &&
                (highlightScore === undefined || entry.score === highlightScore));

            return (
              <li
                key={`${entry.initials}-${entry.completedAt}-${entry.score}`}
                className={cn(
                  "skills-scoreboard-row",
                  rankTone[rank],
                  isHighlighted && "skills-scoreboard-row--you",
                )}
              >
                <span className="skills-scoreboard-rank">
                  {rank.toString().padStart(2, "0")}
                </span>
                <span className="skills-scoreboard-name">{entry.initials}</span>
                <span className="skills-scoreboard-score">{entry.score}</span>
                {entry.flawless ? (
                  <span className="skills-scoreboard-tag">FLAWLESS</span>
                ) : (
                  <span className="skills-scoreboard-tag skills-scoreboard-tag--ghost">
                    RUN
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
