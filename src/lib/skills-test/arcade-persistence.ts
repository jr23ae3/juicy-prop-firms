export type LeaderboardEntry = {
  initials: string;
  score: number;
  flawless: boolean;
  completedAt: string;
};

export type DailyLeaderboard = {
  date: string;
  entries: LeaderboardEntry[];
};

const LEADERBOARD_KEY = "juicy-trades-skills-daily-leaderboard";
const ACHIEVEMENTS_KEY = "juicy-trades-skills-achievements";
const MAX_LEADERBOARD_ENTRIES = 8;

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getDailyLeaderboard(date: string): DailyLeaderboard {
  const stored = readJson<DailyLeaderboard | null>(LEADERBOARD_KEY, null);
  if (!stored || stored.date !== date) {
    return { date, entries: [] };
  }
  return stored;
}

export function submitDailyScore(
  date: string,
  initials: string,
  score: number,
  flawless: boolean,
): DailyLeaderboard {
  const cleanInitials =
    initials.trim().slice(0, 3).toUpperCase() || "YOU";
  const board = getDailyLeaderboard(date);
  const nextEntries = [
    ...board.entries,
    {
      initials: cleanInitials,
      score,
      flawless,
      completedAt: new Date().toISOString(),
    },
  ]
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_LEADERBOARD_ENTRIES);

  const nextBoard: DailyLeaderboard = {
    date,
    entries: nextEntries,
  };
  writeJson(LEADERBOARD_KEY, nextBoard);
  return nextBoard;
}

export function isDailyLeader(date: string, score: number) {
  const board = getDailyLeaderboard(date);
  if (board.entries.length === 0) return true;
  return score >= (board.entries[0]?.score ?? 0);
}

export function getUnlockedAchievements(): string[] {
  return readJson<string[]>(ACHIEVEMENTS_KEY, []);
}

export function saveUnlockedAchievements(ids: string[]) {
  writeJson(ACHIEVEMENTS_KEY, ids);
}

export function getPlayerInitials(): string {
  if (typeof window === "undefined") return "YOU";
  return window.localStorage.getItem("juicy-trades-skills-initials") ?? "";
}

export function savePlayerInitials(initials: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    "juicy-trades-skills-initials",
    initials.trim().slice(0, 3).toUpperCase(),
  );
}
