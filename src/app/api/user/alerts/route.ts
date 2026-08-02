import { NextResponse } from "next/server";

import {
  createDealAlert,
  deleteDealAlert,
  getDealAlertsForUser,
} from "@/services/user/deal-alert-service";
import { isUserPremium } from "@/services/subscription/subscription-service";
import { dealAlertSchema } from "@/lib/validations/user";
import { getDbUserOptional } from "@/server/user/require-db-user";

export async function GET() {
  const session = await getDbUserOptional();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await getDealAlertsForUser(session.user.id);
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to load alerts" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const session = await getDbUserOptional();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = dealAlertSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const premium = await isUserPremium(session.user.id);
  if (!premium) {
    return NextResponse.json(
      { success: false, error: "PREMIUM_REQUIRED" },
      { status: 403 },
    );
  }

  try {
    await createDealAlert(session.user.id, parsed.data);
    const data = await getDealAlertsForUser(session.user.id);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create alert";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const session = await getDbUserOptional();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const alertId = new URL(request.url).searchParams.get("id");

  if (!alertId) {
    return NextResponse.json({ error: "Missing alert id" }, { status: 400 });
  }

  try {
    await deleteDealAlert(session.user.id, alertId);
    const data = await getDealAlertsForUser(session.user.id);
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to delete alert" },
      { status: 500 },
    );
  }
}
