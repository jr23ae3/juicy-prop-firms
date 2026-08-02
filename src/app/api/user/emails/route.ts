import { NextResponse } from "next/server";

import { getRecentEmailsForUser } from "@/services/email/email-service";
import { getDbUserOptional } from "@/server/user/require-db-user";

export async function GET() {
  const session = await getDbUserOptional();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await getRecentEmailsForUser(session.user.id);
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to load email history" },
      { status: 500 },
    );
  }
}
