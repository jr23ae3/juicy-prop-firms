import { NextResponse } from "next/server";

import type { EvalType } from "@/generated/prisma/client";
import { withPublicCache } from "@/lib/api/cache-headers";
import { DEFAULT_MARKET_TYPE, parseMarketType } from "@/lib/plans/market-type";
import { loadPlansWithPricing } from "@/server/data/plans";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const filters = {
    marketType: parseMarketType(
      searchParams.get("market") ?? DEFAULT_MARKET_TYPE,
    ),
    firmSlug: searchParams.get("firm") ?? undefined,
    evalType: (searchParams.get("evalType") as EvalType | null) ?? undefined,
    accountSize: searchParams.get("accountSize")
      ? Number(searchParams.get("accountSize"))
      : undefined,
    search: searchParams.get("q") ?? undefined,
  };

  try {
    const plans = await loadPlansWithPricing(filters);
    return NextResponse.json(
      { success: true, data: plans },
      withPublicCache(),
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to load plans" },
      { status: 500 },
    );
  }
}
