import type { EmailStatus, EmailType, Prisma } from "@/generated/prisma/client";

import { db } from "@/lib/db";
import { getFromEmail, getResend } from "@/lib/resend";
import { isResendConfigured } from "@/lib/env";

export type SendEmailInput = {
  userId: string;
  to: string;
  subject: string;
  html: string;
  type: EmailType;
  dealAlertId?: string;
  metadata?: Prisma.InputJsonValue;
};

export type SendEmailResult =
  | { success: true; id: string }
  | { success: false; error: string };

export async function sendEmail(
  input: SendEmailInput,
): Promise<SendEmailResult> {
  if (!isResendConfigured()) {
    return { success: false, error: "Resend is not configured" };
  }

  try {
    const resend = getResend();
    const { data, error } = await resend.emails.send({
      from: getFromEmail(),
      to: input.to,
      subject: input.subject,
      html: input.html,
    });

    if (error) {
      await logEmail({
        ...input,
        status: "FAILED",
        metadata: {
          error: error.message,
          ...(input.metadata && typeof input.metadata === "object"
            ? (input.metadata as Record<string, string>)
            : {}),
        },
      });
      return { success: false, error: error.message };
    }

    await logEmail({
      ...input,
      status: "SENT",
      metadata: {
        resendId: data?.id,
        ...(input.metadata && typeof input.metadata === "object"
          ? (input.metadata as Record<string, string>)
          : {}),
      },
    });

    return { success: true, id: data?.id ?? "unknown" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Send failed";
    await logEmail({
      ...input,
      status: "FAILED",
      metadata: {
        error: message,
        ...(input.metadata && typeof input.metadata === "object"
          ? (input.metadata as Record<string, string>)
          : {}),
      },
    });
    return { success: false, error: message };
  }
}

async function logEmail(
  input: SendEmailInput & {
    status: EmailStatus;
    metadata?: Prisma.InputJsonValue;
  },
) {
  if (!isResendConfigured()) return;

  await db.emailLog.create({
    data: {
      userId: input.userId,
      dealAlertId: input.dealAlertId,
      type: input.type,
      toEmail: input.to,
      subject: input.subject,
      status: input.status,
      metadata: input.metadata ?? undefined,
    },
  });
}

export async function getRecentEmailsForUser(userId: string, limit = 10) {
  return db.emailLog.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      type: true,
      subject: true,
      status: true,
      createdAt: true,
    },
  });
}
