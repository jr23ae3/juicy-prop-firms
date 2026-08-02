import { NextResponse } from "next/server";

import { withPublicCache } from "@/lib/api/cache-headers";
import { getActiveFirms } from "@/services/firm-service";
import { getDistinctAccountSizes } from "@/services/plan-service";
import type { CompareFilterMetadata } from "@/types/compare";

export async function GET() {
  try {
    const [firms, accountSizes] = await Promise.all([
      getActiveFirms(),
      getDistinctAccountSizes(),
    ]);

    const metadata: CompareFilterMetadata = {
      firms: firms.map((f) => ({
        slug: f.slug,
        name: f.name,
        rankPosition: f.rankPosition,
      })),
      accountSizes,
      evalTypes: ["CHALLENGE", "DIRECT_TO_FUNDED", "INSTANT_FUNDING"],
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
