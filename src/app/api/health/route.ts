import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import {
  isDatabaseConfigured,
  isOpenAIConfigured,
  isResendConfigured,
  isStripeConfigured,
  isSupabaseConfigured,
} from "@/lib/env";

export const dynamic = "force-dynamic";

export async function GET() {
  const timestamp = new Date().toISOString();
  const checks = {
    database: false,
    supabase: isSupabaseConfigured(),
    stripe: isStripeConfigured(),
    resend: isResendConfigured(),
    openai: isOpenAIConfigured(),
  };

  if (isDatabaseConfigured()) {
    try {
      await db.$queryRaw`SELECT 1`;
      checks.database = true;
    } catch {
      checks.database = false;
    }
  }

  const healthy = checks.database || !isDatabaseConfigured();
  const status = healthy ? "ok" : "degraded";

  return NextResponse.json(
    {
      status,
      timestamp,
      version: process.env.npm_package_version ?? "0.1.0",
      checks,
    },
    { status: healthy ? 200 : 503 },
  );
}
