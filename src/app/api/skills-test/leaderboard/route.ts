import { NextResponse } from "next/server";
import { z } from "zod";

import { withPublicCache } from "@/lib/api/cache-headers";
import {
  loadSkillsLeaderboard,
  submitSkillsLeaderboardScore,
  validateSessionDate,
} from "@/server/data/skills-leaderboard";

const submitSchema = z.object({
  sessionDate: z.string(),
  initials: z.string(),
  score: z.number().int(),
  flawless: z.boolean(),
  roundsWon: z.boolean(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionDate = searchParams.get("date");

  if (!sessionDate || !validateSessionDate(sessionDate)) {
    return NextResponse.json(
      { success: false, error: "A valid date query parameter is required." },
      { status: 400 },
    );
  }

  try {
    const data = await loadSkillsLeaderboard(sessionDate);
    return NextResponse.json({ success: true, data }, withPublicCache());
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to load leaderboard." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = submitSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid leaderboard submission." },
        { status: 400 },
      );
    }

    const data = await submitSkillsLeaderboardScore(parsed.data);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to submit score.";
    const status = message.includes("must") || message.includes("Invalid") ? 400 : 500;

    return NextResponse.json({ success: false, error: message }, { status });
  }
}
