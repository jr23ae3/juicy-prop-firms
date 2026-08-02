import { redirect } from "next/navigation";

import type { User } from "@/generated/prisma/client";
import { getAuthUser, requireAuthUser } from "@/server/auth";
import { getUserBySupabaseId, syncUserFromSupabase } from "@/server/users";
import { isDatabaseConfigured } from "@/lib/env";

export async function requireDbUser(): Promise<{
  authUser: NonNullable<Awaited<ReturnType<typeof getAuthUser>>>;
  user: User;
}> {
  const authUser = await requireAuthUser();

  if (!isDatabaseConfigured()) {
    redirect("/account");
  }

  let user = await getUserBySupabaseId(authUser.id);

  if (!user) {
    user = await syncUserFromSupabase(authUser);
  }

  if (!user) {
    throw new Error("Unable to sync user to database");
  }

  return { authUser, user };
}

export async function getDbUserOptional() {
  const authUser = await getAuthUser();
  if (!authUser || !isDatabaseConfigured()) return null;

  const user = await getUserBySupabaseId(authUser.id);
  return user ? { authUser, user } : null;
}
