import { db } from "@/lib/db";
import type { DailyLeaderboard, LeaderboardEntry } from "@/lib/skills-test/arcade-persistence";

export const SKILLS_LEADERBOARD_LIMIT = 10;
const SESSION_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const INITIALS_PATTERN = /^[A-Z0-9]{1,3}$/;

export type SubmitSkillsScoreInput = {
  sessionDate: string;
  initials: string;
  score: number;
  flawless: boolean;
  roundsWon: boolean;
};

function normalizeInitials(initials: string) {
  return initials.trim().slice(0, 3).toUpperCase() || "YOU";
}

function mapEntry(entry: {
  initials: string;
  score: number;
  flawless: boolean;
  createdAt: Date;
}): LeaderboardEntry {
  return {
    initials: entry.initials,
    score: entry.score,
    flawless: entry.flawless,
    completedAt: entry.createdAt.toISOString(),
  };
}

export function validateSessionDate(sessionDate: string) {
  return SESSION_DATE_PATTERN.test(sessionDate);
}

export function validateSubmitInput(input: SubmitSkillsScoreInput) {
  if (!validateSessionDate(input.sessionDate)) {
    return "Invalid session date.";
  }

  const initials = normalizeInitials(input.initials);
  if (!INITIALS_PATTERN.test(initials)) {
    return "Initials must be 1-3 letters or numbers.";
  }

  if (!Number.isInteger(input.score) || input.score < 0 || input.score > 15000) {
    return "Score must be between 0 and 15000.";
  }

  return null;
}

export async function loadSkillsLeaderboard(
  sessionDate: string,
  limit = SKILLS_LEADERBOARD_LIMIT,
): Promise<DailyLeaderboard> {
  const entries = await db.skillsLeaderboardEntry.findMany({
    where: { sessionDate },
    orderBy: [{ score: "desc" }, { createdAt: "asc" }],
    take: limit,
    select: {
      initials: true,
      score: true,
      flawless: true,
      createdAt: true,
    },
  });

  return {
    date: sessionDate,
    entries: entries.map(mapEntry),
  };
}

export async function submitSkillsLeaderboardScore(
  input: SubmitSkillsScoreInput,
): Promise<DailyLeaderboard> {
  const error = validateSubmitInput(input);
  if (error) {
    throw new Error(error);
  }

  const initials = normalizeInitials(input.initials);

  await db.skillsLeaderboardEntry.create({
    data: {
      sessionDate: input.sessionDate,
      initials,
      score: input.score,
      flawless: input.flawless,
      roundsWon: input.roundsWon,
    },
  });

  return loadSkillsLeaderboard(input.sessionDate);
}

export function isLeaderboardTopScore(
  board: DailyLeaderboard,
  score: number,
  initials: string,
) {
  const top = board.entries[0];
  if (!top) return true;
  const cleanInitials = normalizeInitials(initials);
  return top.score === score && top.initials === cleanInitials;
}
