import "server-only";

import { Resend } from "resend";

import { env, isResendConfigured } from "@/lib/env";

let resendClient: Resend | null = null;

export function getResend(): Resend {
  if (!isResendConfigured()) {
    throw new Error(
      "Resend is not configured. Set RESEND_API_KEY and RESEND_FROM_EMAIL in .env.local",
    );
  }

  if (!resendClient) {
    resendClient = new Resend(env.RESEND_API_KEY!);
  }

  return resendClient;
}

export function getFromEmail(): string {
  return env.RESEND_FROM_EMAIL ?? "Juicy Trades <onboarding@resend.dev>";
}
