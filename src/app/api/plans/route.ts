import { NextResponse } from "next/server";

import { loadPlansWithPricing } from "@/server/data/plans";
import type { EvalType } from "@/generated/prisma/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const filters = {
    firmSlug: searchParams.get("firm") ?? undefined,
    evalType: (searchParams.get("evalType") as EvalType | null) ?? undefined,
    accountSize: searchParams.get("accountSize")
      ? Number(searchParams.get("accountSize"))
      : undefined,
    search: searchParams.get("q") ?? undefined,
  };

  try {
    const plans = await loadPlansWithPricing(filters);
    return NextResponse.json({ success: true, data: plans });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to load plans" },
      { status: 500 },
    );
  }
}
