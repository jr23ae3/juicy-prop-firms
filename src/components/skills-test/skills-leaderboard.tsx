"use client";

import type { DailyLeaderboard } from "@/lib/skills-test/arcade-persistence";
import { cn } from "@/lib/utils";

type SkillsLeaderboardProps = {
  board: DailyLeaderboard;
  highlightScore?: number;
  className?: string;
};

export function SkillsLeaderboard({
  board,
  highlightScore,
  className,
}: SkillsLeaderboardProps) {
  return (
    <div className={cn("skills-leaderboard", className)}>
      <div className="skills-leaderboard-header">
        <p className="skills-leaderboard-title">GLOBAL DAILY BOARD</p>
        <p className="skills-leaderboard-sub">Seed {board.date}</p>
      </div>

      {board.entries.length === 0 ? (
        <p className="skills-leaderboard-empty">
          No scores yet today. Be the first on the board.
        </p>
      ) : (
        <ol className="skills-leaderboard-list">
          {board.entries.map((entry, index) => (
            <li
              key={`${entry.initials}-${entry.completedAt}`}
              className={cn(
                "skills-leaderboard-row",
                highlightScore === entry.score && "skills-leaderboard-row--highlight",
              )}
            >
              <span className="skills-leaderboard-rank">
                {(index + 1).toString().padStart(2, "0")}
              </span>
              <span className="skills-leaderboard-name">{entry.initials}</span>
              <span className="skills-leaderboard-score">{entry.score}</span>
              {entry.flawless ? (
                <span className="skills-leaderboard-tag">FLAWLESS</span>
              ) : null}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
