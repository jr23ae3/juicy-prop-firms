import type { User as SupabaseUser } from "@supabase/supabase-js";

import { db } from "@/lib/db";
import { isDatabaseConfigured } from "@/lib/env";
import type { User } from "@/generated/prisma/client";
import { sendWelcomeEmail } from "@/services/email/transactional-email-service";

export async function syncUserFromSupabase(
  supabaseUser: SupabaseUser,
): Promise<User | null> {
  if (!isDatabaseConfigured() || !supabaseUser.email) {
    return null;
  }

  const name =
    (supabaseUser.user_metadata?.full_name as string | undefined) ??
    (supabaseUser.user_metadata?.name as string | undefined) ??
    null;

  const avatarUrl =
    (supabaseUser.user_metadata?.avatar_url as string | undefined) ?? null;

  const existing = await db.user.findUnique({
    where: { supabaseId: supabaseUser.id },
  });

  const user = await db.user.upsert({
    where: { supabaseId: supabaseUser.id },
    create: {
      supabaseId: supabaseUser.id,
      email: supabaseUser.email,
      name,
      avatarUrl,
    },
    update: {
      email: supabaseUser.email,
      name,
      avatarUrl,
    },
  });

  if (!existing) {
    void sendWelcomeEmail(user).catch(() => undefined);
  }

  return user;
}

export async function getUserBySupabaseId(supabaseId: string) {
  if (!isDatabaseConfigured()) {
    return null;
  }

  return db.user.findUnique({
    where: { supabaseId },
  });
}
