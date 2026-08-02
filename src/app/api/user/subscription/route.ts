import { NextResponse } from "next/server";

import { getSubscriptionSummary } from "@/services/subscription/subscription-service";
import { getDbUserOptional } from "@/server/user/require-db-user";

export async function GET() {
  const session = await getDbUserOptional();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await getSubscriptionSummary(session.user.id);
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to load subscription" },
      { status: 500 },
    );
  }
}
