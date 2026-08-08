import type { RoundResult } from "@/lib/skills-test/arcade-game";

export type AchievementDefinition = {
  id: string;
  title: string;
  description: string;
  badge: string;
};

export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: "first_run",
    title: "Coin In",
    description: "Finish your first Arcade Run.",
    badge: "1UP",
  },
  {
    id: "perfect_read",
    title: "Perfect Read",
    description: "Score an S grade on any round.",
    badge: "S",
  },
  {
    id: "combo_king",
    title: "Combo King",
    description: "Reach a 3x combo streak.",
    badge: "x3",
  },
  {
    id: "boss_slayer",
    title: "Boss Slayer",
    description: "Clear the Round 5 boss without a life lost.",
    badge: "BOSS",
  },
  {
    id: "flawless_run",
    title: "Flawless Run",
    description: "Clear all 5 rounds with 3 lives intact.",
    badge: "FLAW",
  },
  {
    id: "high_scorer",
    title: "High Scorer",
    description: "Finish a run with 1,500+ points.",
    badge: "1500",
  },
  {
    id: "speed_demon",
    title: "Speed Demon",
    description: "Mark entry 25+ bars before the deadline.",
    badge: "SPD",
  },
  {
    id: "daily_top",
    title: "Daily Top",
    description: "Take #1 on today's local leaderboard.",
    badge: "#1",
  },
];

export type GameSessionStats = {
  totalScore: number;
  livesRemaining: number;
  roundsCompleted: number;
  maxCombo: number;
  sGrades: number;
  bossRoundPassed: boolean;
  flawless: boolean;
  bestEntryLeadBars: number;
  finishedRun: boolean;
  wonRun: boolean;
};

export type AchievementUnlockResult = {
  newlyUnlocked: AchievementDefinition[];
  unlockedIds: string[];
};

export function getAchievementById(id: string) {
  return ACHIEVEMENTS.find((item) => item.id === id);
}

export function evaluateAchievements(
  stats: GameSessionStats,
  previouslyUnlocked: string[],
  isDailyLeader: boolean,
): AchievementUnlockResult {
  const unlocked = new Set(previouslyUnlocked);
  const newlyUnlocked: AchievementDefinition[] = [];

  const unlock = (id: string) => {
    if (unlocked.has(id)) return;
    const achievement = getAchievementById(id);
    if (!achievement) return;
    unlocked.add(id);
    newlyUnlocked.push(achievement);
  };

  if (stats.finishedRun) unlock("first_run");
  if (stats.sGrades > 0) unlock("perfect_read");
  if (stats.maxCombo >= 3) unlock("combo_king");
  if (stats.bossRoundPassed) unlock("boss_slayer");
  if (stats.flawless && stats.wonRun) unlock("flawless_run");
  if (stats.totalScore >= 1500) unlock("high_scorer");
  if (stats.bestEntryLeadBars >= 25) unlock("speed_demon");
  if (isDailyLeader) unlock("daily_top");

  return {
    newlyUnlocked,
    unlockedIds: [...unlocked],
  };
}

export function summarizeRoundForStats(
  roundResult: RoundResult,
  entryBarIndex: number | null,
  entryDeadlineBar: number,
  outcomeGrade: string | null,
  isBossRound: boolean,
) {
  return {
    sGrade: outcomeGrade === "S" ? 1 : 0,
    maxComboCandidate: roundResult.combo,
    bossPassed:
      isBossRound && roundResult.passed && !roundResult.lostLife,
    entryLeadBars:
      entryBarIndex === null
        ? 0
        : Math.max(0, entryDeadlineBar - entryBarIndex),
  };
}
