import { NextResponse } from "next/server";

import {
  getSavedPlanIds,
  getSavedPlansForUser,
  savePlanForUser,
  unsavePlanForUser,
} from "@/services/user/saved-plan-service";
import { savePlanSchema } from "@/lib/validations/user";
import { getDbUserOptional } from "@/server/user/require-db-user";

export async function GET() {
  const session = await getDbUserOptional();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await getSavedPlansForUser(session.user.id);
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to load saved plans" },
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
  const parsed = savePlanSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid plan ID" }, { status: 400 });
  }

  try {
    await savePlanForUser(session.user.id, parsed.data.planId);
    const planIds = await getSavedPlanIds(session.user.id);
    return NextResponse.json({ success: true, data: { planIds } });
  } catch (error) {
    if (error instanceof Error && error.message === "PREMIUM_REQUIRED") {
      return NextResponse.json(
        { success: false, error: "PREMIUM_REQUIRED" },
        { status: 403 },
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to save plan" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  const session = await getDbUserOptional();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const planId = new URL(request.url).searchParams.get("planId");

  if (!planId) {
    return NextResponse.json({ error: "Missing planId" }, { status: 400 });
  }

  try {
    await unsavePlanForUser(session.user.id, planId);
    const planIds = await getSavedPlanIds(session.user.id);
    return NextResponse.json({ success: true, data: { planIds } });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to remove saved plan" },
      { status: 500 },
    );
  }
}
