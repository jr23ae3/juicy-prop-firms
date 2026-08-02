import { NextResponse } from "next/server";

import { siteConfig } from "@/config/site";
import { createCheckoutSession } from "@/services/subscription/subscription-service";
import { requireDbUser } from "@/server/user/require-db-user";
import { isStripeConfigured } from "@/lib/env";

export async function POST() {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { success: false, error: "Stripe is not configured" },
      { status: 503 },
    );
  }

  try {
    const { user } = await requireDbUser();
    const url = await createCheckoutSession(user, siteConfig.url);

    return NextResponse.json({ success: true, data: { url } });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create checkout session";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
