import { NextResponse } from "next/server";

import { withPublicCache } from "@/lib/api/cache-headers";
import { DEFAULT_MARKET_TYPE, parseMarketType } from "@/lib/plans/market-type";
import { getActiveFirmsForMarket } from "@/services/firm-service";
import { getDistinctAccountSizes } from "@/services/plan-service";
import type { CompareFilterMetadata } from "@/types/compare";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const marketType = parseMarketType(
    searchParams.get("market") ?? DEFAULT_MARKET_TYPE,
  );

  try {
    const [firms, accountSizes] = await Promise.all([
      getActiveFirmsForMarket(marketType),
      getDistinctAccountSizes(marketType),
    ]);

    const metadata: CompareFilterMetadata = {
      firms: firms.map((f) => ({
        slug: f.slug,
        name: f.name,
        rankPosition: f.rankPosition,
      })),
      accountSizes,
      evalTypes: ["CHALLENGE", "DIRECT_TO_FUNDED", "INSTANT_FUNDING"],
      drawdownTypes: ["END_OF_DAY", "TRAILING", "STATIC"],
    };

    return NextResponse.json(
      { success: true, data: metadata },
      withPublicCache(),
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to load filter metadata" },
      { status: 500 },
    );
  }
}
