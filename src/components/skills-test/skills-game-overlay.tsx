"use client";

import { useState } from "react";

import { SkillsAchievements } from "@/components/skills-test/skills-achievements";
import { SkillsLeaderboard } from "@/components/skills-test/skills-leaderboard";
import type { AchievementDefinition } from "@/lib/skills-test/arcade-achievements";
import type { RoundResult } from "@/lib/skills-test/arcade-game";
import type { DailyLeaderboard } from "@/lib/skills-test/arcade-persistence";
import { cn } from "@/lib/utils";

type SkillsGameOverlayProps = {
  variant: "intro" | "round_end" | "game_over" | "victory";
  roundResult: RoundResult | null;
  totalScore: number;
  highScore: number;
  isNewHighScore: boolean;
  dailyLeaderboard: DailyLeaderboard;
  dailySeed: string;
  unlockedAchievementIds: string[];
  newlyUnlocked: AchievementDefinition[];
  playerInitials: string;
  onPlayerInitialsChange: (value: string) => void;
  onStart: () => void;
  onNextRound: () => void;
  onExit: () => void;
};

export function SkillsGameOverlay({
  variant,
  roundResult,
  totalScore,
  highScore,
  isNewHighScore,
  dailyLeaderboard,
  dailySeed,
  unlockedAchievementIds,
  newlyUnlocked,
  playerInitials,
  onPlayerInitialsChange,
  onStart,
  onNextRound,
  onExit,
}: SkillsGameOverlayProps) {
  const [initialsDraft, setInitialsDraft] = useState(playerInitials);

  if (variant === "intro") {
    return (
      <div className="skills-game-overlay">
        <div className="skills-game-card skills-game-card--wide">
          <div className="skills-game-card-main">
            <p className="skills-game-card-kicker">★ ARCADE RUN ★</p>
            <h2 className="skills-game-card-title">TAPE QUEST</h2>
            <p className="skills-game-card-copy">
            Five rounds with a timed boss finale. Everyone gets the same daily
            seed ({dailySeed}). Submit your score to the global daily board,
            unlock badges, and stack combos for bigger scores.
            </p>
            <ul className="skills-game-card-list">
              <li>Rounds 1–4: find the entry before the deadline</li>
              <li>Round 5 boss: 75-second timer and 2x points</li>
              <li>Stop-outs and D grades cost a life</li>
            </ul>
            <div className="skills-game-card-actions">
              <button
                type="button"
                className="arcade-btn arcade-btn--p1 skills-replay-btn"
                onClick={onStart}
              >
                START GAME
              </button>
            </div>
          </div>

          <div className="skills-game-card-side">
            <SkillsLeaderboard board={dailyLeaderboard} />
            <SkillsAchievements
              unlockedIds={unlockedAchievementIds}
              compact
            />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "round_end" && roundResult) {
    return (
      <div className="skills-game-overlay">
        <div className="skills-game-card">
          <p className="skills-game-card-kicker">
            {roundResult.passed ? "★ ROUND CLEAR ★" : "★ ROUND FAIL ★"}
          </p>
          <h2
            className={cn(
              "skills-game-card-title",
              roundResult.passed ? "text-primary" : "text-destructive",
            )}
          >
            {roundResult.headline}
          </h2>
          <p className="skills-game-card-copy">{roundResult.detail}</p>
          <p className="skills-game-card-score">+{roundResult.points} PTS</p>
          <div className="skills-game-card-actions">
            <button
              type="button"
              className="arcade-btn arcade-btn--p1 skills-replay-btn"
              onClick={onNextRound}
            >
              NEXT ROUND
            </button>
            <button
              type="button"
              className="arcade-btn arcade-btn--p2 skills-replay-btn"
              onClick={onExit}
            >
              EXIT
            </button>
          </div>
        </div>
      </div>
    );
  }

  const endScreen = variant === "victory";

  return (
    <div className="skills-game-overlay">
      <div className="skills-game-card skills-game-card--wide">
        <div className="skills-game-card-main">
          <p className="skills-game-card-kicker">
            {endScreen ? "★ YOU WIN ★" : "★ GAME OVER ★"}
          </p>
          <h2
            className={cn(
              "skills-game-card-title",
              endScreen ? "text-[#ffd700]" : "text-destructive",
            )}
          >
            {endScreen ? "RUN COMPLETE" : "OUT OF LIVES"}
          </h2>
          <p className="skills-game-card-copy">
            Final score: {totalScore}.{" "}
            {isNewHighScore ? "New personal best!" : `High score ${highScore}.`}
          </p>

          <label className="skills-game-initials">
            <span className="skills-game-hud-label">INITIALS</span>
            <input
              type="text"
              maxLength={3}
              value={initialsDraft}
              onChange={(event) => {
                const value = event.target.value.toUpperCase();
                setInitialsDraft(value);
                onPlayerInitialsChange(value);
              }}
              className="skills-game-initials-input"
              placeholder="YOU"
            />
          </label>

          {newlyUnlocked.length > 0 ? (
            <SkillsAchievements
              unlockedIds={unlockedAchievementIds}
              newlyUnlocked={newlyUnlocked}
              compact
            />
          ) : null}

          <div className="skills-game-card-actions">
            <button
              type="button"
              className="arcade-btn arcade-btn--p1 skills-replay-btn"
              onClick={onStart}
            >
              PLAY AGAIN
            </button>
            <button
              type="button"
              className="arcade-btn arcade-btn--p2 skills-replay-btn"
              onClick={onExit}
            >
              PRACTICE MODE
            </button>
          </div>
        </div>

        <div className="skills-game-card-side">
          <SkillsLeaderboard
            board={dailyLeaderboard}
            highlightScore={totalScore}
          />
          <SkillsAchievements
            unlockedIds={unlockedAchievementIds}
            compact
          />
        </div>
      </div>
    </div>
  );
}
