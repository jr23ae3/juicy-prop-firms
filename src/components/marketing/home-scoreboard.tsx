"use client";

import Link from "next/link";
import { RefreshCw, Trophy } from "lucide-react";
import { useEffect, useState } from "react";

import type { DailyLeaderboard } from "@/lib/skills-test/arcade-persistence";
import { getHighScore } from "@/lib/skills-test/arcade-game";
import { fetchGlobalLeaderboard } from "@/lib/skills-test/leaderboard-api";
import { cn } from "@/lib/utils";

type HomeScoreboardProps = {
  initialBoard: DailyLeaderboard;
  sessionDate: string;
  dailySeed: string;
};

const rankTone: Record<number, string> = {
  1: "skills-scoreboard-row--gold",
  2: "skills-scoreboard-row--silver",
  3: "skills-scoreboard-row--bronze",
};

export function HomeScoreboard({
  initialBoard,
  sessionDate,
  dailySeed,
}: HomeScoreboardProps) {
  const [board, setBoard] = useState(initialBoard);
  const [highScore, setHighScore] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setHighScore(getHighScore());
    void fetchGlobalLeaderboard(sessionDate)
      .then(setBoard)
      .catch(() => setBoard(initialBoard));
  }, [initialBoard, sessionDate]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const next = await fetchGlobalLeaderboard(sessionDate);
      setBoard(next);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <section
      className="home-scoreboard"
      aria-labelledby="home-scoreboard-title"
    >
      <div className="home-scoreboard-copy">
        <p className="arcade-level-num text-[#ffd700]">★ TODAY&apos;S BOARD ★</p>
        <h2 id="home-scoreboard-title" className="home-scoreboard-title">
          DAILY HIGH SCORES
        </h2>
        <p className="home-scoreboard-lead">
          Everyone plays the same seeded Tape Quest missions on{" "}
          <span className="text-accent">{sessionDate}</span>. Post your run to
          the global board and chase rank #1.
        </p>
        <div className="home-scoreboard-meta">
          <span>Seed {dailySeed}</span>
          {highScore > 0 ? <span>Your best {highScore}</span> : null}
        </div>
        <div className="home-scoreboard-actions">
          <Link href="/skills-test" className="arcade-btn arcade-btn--p1">
            P1 · PLAY TAPE QUEST
          </Link>
          <button
            type="button"
            className="arcade-btn arcade-btn--p2 skills-replay-btn"
            onClick={() => void handleRefresh()}
            disabled={refreshing}
          >
            <RefreshCw
              className={cn("size-3.5", refreshing && "animate-spin")}
              aria-hidden
            />
            REFRESH
          </button>
        </div>
      </div>

      <div className="skills-scoreboard home-scoreboard-panel">
        <div className="skills-scoreboard-header">
          <div className="skills-scoreboard-heading">
            <Trophy className="size-4 text-[#ffd700]" aria-hidden />
            <div>
              <p className="skills-scoreboard-title">TOP 10</p>
              <p className="skills-scoreboard-sub">
                {board.entries.length} score
                {board.entries.length === 1 ? "" : "s"} today
              </p>
            </div>
          </div>
        </div>

        {board.entries.length === 0 ? (
          <p className="skills-scoreboard-empty">
            No scores yet — be the first name on the board.
          </p>
        ) : (
          <ol className="skills-scoreboard-list home-scoreboard-list">
            {board.entries.map((entry, index) => {
              const rank = index + 1;
              return (
                <li
                  key={`${entry.initials}-${entry.completedAt}-${entry.score}`}
                  className={cn("skills-scoreboard-row", rankTone[rank])}
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
      </div>
    </section>
  );
}
