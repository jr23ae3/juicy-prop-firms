"use client";

import { Heart } from "lucide-react";

import type { GameChallenge } from "@/lib/skills-test/arcade-game";
import { getComboLabel } from "@/lib/skills-test/arcade-game";
import { cn } from "@/lib/utils";

type SkillsGameHudProps = {
  round: number;
  totalRounds: number;
  lives: number;
  totalScore: number;
  combo: number;
  highScore: number;
  challenge: GameChallenge | null;
  entryBarIndex: number | null;
  bossSecondsLeft: number | null;
};

export function SkillsGameHud({
  round,
  totalRounds,
  lives,
  totalScore,
  combo,
  highScore,
  challenge,
  entryBarIndex,
  bossSecondsLeft,
}: SkillsGameHudProps) {
  const barsLeft =
    challenge && entryBarIndex === null
      ? challenge.entryDeadlineBar
      : challenge && entryBarIndex !== null
        ? Math.max(0, challenge.entryDeadlineBar - entryBarIndex)
        : null;

  return (
    <div className="skills-game-hud" aria-label="Arcade game status">
      <div className="skills-game-hud-stat">
        <p className="skills-game-hud-label">ROUND</p>
        <p className="skills-game-hud-value">
          {round}/{totalRounds}
        </p>
      </div>

      <div className="skills-game-hud-stat">
        <p className="skills-game-hud-label">SCORE</p>
        <p className="skills-game-hud-value">{totalScore}</p>
        <p className="skills-game-hud-sub">HI {highScore}</p>
      </div>

      <div className="skills-game-hud-stat">
        <p className="skills-game-hud-label">COMBO</p>
        <p className="skills-game-hud-value">{getComboLabel(combo)}</p>
        <p className="skills-game-hud-sub">{combo}x streak</p>
      </div>

      <div className="skills-game-hud-stat">
        <p className="skills-game-hud-label">LIVES</p>
        <div className="skills-game-lives" aria-label={`${lives} lives remaining`}>
          {Array.from({ length: 3 }).map((_, index) => (
            <Heart
              key={index}
              className={cn(
                "size-4",
                index < lives ? "fill-[#ff4d6d] text-[#ff4d6d]" : "text-white/20",
              )}
              aria-hidden
            />
          ))}
        </div>
      </div>

      {challenge ? (
        <div className="skills-game-mission">
          <p className="skills-game-hud-label">MISSION</p>
          <p className="skills-game-mission-title">{challenge.missionTitle}</p>
          <p className="skills-game-mission-detail">{challenge.missionDetail}</p>
          <p className="skills-game-mission-deadline">
            Daily seed {challenge.dailySeed}
          </p>
          {challenge.isBossRound && bossSecondsLeft !== null ? (
            <p
              className={cn(
                "skills-game-boss-timer",
                bossSecondsLeft <= 15 && "skills-game-boss-timer--urgent",
              )}
            >
              BOSS TIMER {bossSecondsLeft}s
            </p>
          ) : null}
          {barsLeft !== null ? (
            <p className="skills-game-mission-deadline">
              {entryBarIndex === null
                ? `Entry window closes at ${challenge.entryDeadlineLabel}`
                : `${barsLeft} bars before deadline`}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
