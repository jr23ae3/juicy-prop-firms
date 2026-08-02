import { NextResponse } from "next/server";

import {
  getUserPreferencesData,
  upsertUserPreferences,
} from "@/services/user/preferences-service";
import { userPreferencesSchema } from "@/lib/validations/user";
import { getDbUserOptional } from "@/server/user/require-db-user";

export async function GET() {
  const session = await getDbUserOptional();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await getUserPreferencesData(session.user.id);
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to load preferences" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  const session = await getDbUserOptional();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = userPreferencesSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  try {
    const data = await upsertUserPreferences(session.user.id, parsed.data);
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to save preferences" },
      { status: 500 },
    );
  }
}
