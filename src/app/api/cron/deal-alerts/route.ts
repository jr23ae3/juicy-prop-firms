import { NextResponse } from "next/server";

import { env } from "@/lib/env";
import { processDealAlertNotifications } from "@/services/notifications/deal-alert-notification-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAuthorized(request: Request): boolean {
  const secret = env.CRON_SECRET;
  if (!secret) return false;

  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await processDealAlertNotifications();
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Cron job failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  return GET(request);
}
