import { NextResponse } from "next/server";

import { loadRankings } from "@/server/data/plans";

export async function GET() {
  try {
    const rankings = await loadRankings();
    return NextResponse.json({ success: true, data: rankings });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to load rankings" },
      { status: 500 },
    );
  }
}
