import { db } from "@/lib/db";
import {
  buildSubscriptionConfirmationEmail,
  buildWelcomeEmail,
} from "@/lib/emails/templates";
import { isResendConfigured } from "@/lib/env";
import { sendEmail } from "@/services/email/email-service";

export async function sendWelcomeEmail(user: {
  id: string;
  email: string;
  name: string | null;
}) {
  if (!isResendConfigured()) return;

  const existing = await db.emailLog.findFirst({
    where: { userId: user.id, type: "WELCOME" },
  });

  if (existing) return;

  const { subject, html } = buildWelcomeEmail(user.name);
  await sendEmail({
    userId: user.id,
    to: user.email,
    subject,
    html,
    type: "WELCOME",
  });
}

export async function sendSubscriptionConfirmationEmail(user: {
  id: string;
  email: string;
  name: string | null;
}) {
  if (!isResendConfigured()) return;

  const recent = await db.emailLog.findFirst({
    where: {
      userId: user.id,
      type: "SUBSCRIPTION_CONFIRMATION",
      createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    },
  });

  if (recent) return;

  const { subject, html } = buildSubscriptionConfirmationEmail(user.name);
  await sendEmail({
    userId: user.id,
    to: user.email,
    subject,
    html,
    type: "SUBSCRIPTION_CONFIRMATION",
  });
}
