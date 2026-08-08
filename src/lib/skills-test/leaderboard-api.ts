import type { DailyLeaderboard } from "@/lib/skills-test/arcade-persistence";
import {
  getDailyLeaderboard,
  submitDailyScore,
} from "@/lib/skills-test/arcade-persistence";

type LeaderboardApiResponse = {
  success: boolean;
  data?: DailyLeaderboard;
  error?: string;
};

export async function fetchGlobalLeaderboard(
  sessionDate: string,
): Promise<DailyLeaderboard> {
  const response = await fetch(
    `/api/skills-test/leaderboard?date=${encodeURIComponent(sessionDate)}`,
    { cache: "no-store" },
  );

  const payload = (await response.json()) as LeaderboardApiResponse;

  if (!response.ok || !payload.success || !payload.data) {
    throw new Error(payload.error ?? "Failed to load global leaderboard.");
  }

  return payload.data;
}

export type SubmitGlobalScoreInput = {
  sessionDate: string;
  initials: string;
  score: number;
  flawless: boolean;
  roundsWon: boolean;
};

export async function submitGlobalLeaderboardScore(
  input: SubmitGlobalScoreInput,
): Promise<DailyLeaderboard> {
  try {
    const response = await fetch("/api/skills-test/leaderboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    const payload = (await response.json()) as LeaderboardApiResponse;

    if (!response.ok || !payload.success || !payload.data) {
      throw new Error(payload.error ?? "Failed to submit global score.");
    }

    submitDailyScore(input.sessionDate, input.initials, input.score, input.flawless);
    return payload.data;
  } catch {
    return submitDailyScore(
      input.sessionDate,
      input.initials,
      input.score,
      input.flawless,
    );
  }
}

export async function loadLeaderboardWithFallback(
  sessionDate: string,
): Promise<DailyLeaderboard> {
  try {
    return await fetchGlobalLeaderboard(sessionDate);
  } catch {
    return getDailyLeaderboard(sessionDate);
  }
}

export function isGlobalDailyLeader(
  board: DailyLeaderboard,
  score: number,
  initials: string,
) {
  const top = board.entries[0];
  if (!top) return true;
  const cleanInitials = initials.trim().slice(0, 3).toUpperCase() || "YOU";
  return top.score === score && top.initials === cleanInitials;
}
