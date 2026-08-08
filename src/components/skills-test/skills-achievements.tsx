"use client";

import {
  ACHIEVEMENTS,
  getAchievementById,
  type AchievementDefinition,
} from "@/lib/skills-test/arcade-achievements";
import { cn } from "@/lib/utils";

type SkillsAchievementsProps = {
  unlockedIds: string[];
  newlyUnlocked?: AchievementDefinition[];
  compact?: boolean;
};

export function SkillsAchievements({
  unlockedIds,
  newlyUnlocked = [],
  compact = false,
}: SkillsAchievementsProps) {
  const unlockedSet = new Set(unlockedIds);
  const freshSet = new Set(newlyUnlocked.map((item) => item.id));

  return (
    <div className={cn("skills-achievements", compact && "skills-achievements--compact")}>
      <p className="skills-achievements-title">ACHIEVEMENTS</p>

      {newlyUnlocked.length > 0 ? (
        <div className="skills-achievements-new">
          {newlyUnlocked.map((achievement) => (
            <p key={achievement.id} className="skills-achievements-unlocked">
              ★ UNLOCKED · {achievement.title}
            </p>
          ))}
        </div>
      ) : null}

      <div className="skills-achievements-grid">
        {ACHIEVEMENTS.map((achievement) => {
          const unlocked = unlockedSet.has(achievement.id);
          const isNew = freshSet.has(achievement.id);

          return (
            <div
              key={achievement.id}
              className={cn(
                "skills-achievement-badge",
                unlocked && "skills-achievement-badge--unlocked",
                isNew && "skills-achievement-badge--new",
              )}
              title={achievement.description}
            >
              <span className="skills-achievement-badge-label">
                {achievement.badge}
              </span>
              <span className="skills-achievement-badge-title">
                {achievement.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function SkillsAchievementsSummary({ unlockedIds }: { unlockedIds: string[] }) {
  const count = unlockedIds.length;
  const total = ACHIEVEMENTS.length;
  const latest = unlockedIds
    .map((id) => getAchievementById(id))
    .filter(Boolean)
    .slice(-3);

  return (
    <p className="skills-achievements-summary">
      {count}/{total} unlocked
      {latest.length > 0
        ? ` · latest ${latest.map((item) => item?.badge).join(", ")}`
        : ""}
    </p>
  );
}
