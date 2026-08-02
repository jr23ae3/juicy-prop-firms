import { redirect } from "next/navigation";

import type { User } from "@/generated/prisma/client";
import { requireDbUser } from "@/server/user/require-db-user";

export async function requireAdminUser(): Promise<{
  authUser: NonNullable<Awaited<ReturnType<typeof requireDbUser>>["authUser"]>;
  user: User;
}> {
  const session = await requireDbUser();

  if (session.user.role !== "ADMIN") {
    redirect("/account");
  }

  return session;
}

export async function isAdminUser(userId: string): Promise<boolean> {
  const { db } = await import("@/lib/db");
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  return user?.role === "ADMIN";
}
