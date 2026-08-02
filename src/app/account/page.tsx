import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { isDatabaseConfigured, isSupabaseConfigured } from "@/lib/env";
import { requireAuthUser } from "@/server/auth";
import { getUserBySupabaseId } from "@/server/users";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Account",
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const authUser = await requireAuthUser();
  const dbUser = authUser ? await getUserBySupabaseId(authUser.id) : null;

  return (
    <Container className="py-12">
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your account</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your profile, saved plans, and preferences.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Synced from Supabase Auth and stored in PostgreSQL.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between gap-4 border-b border-border/60 py-2">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium">{authUser?.email}</span>
            </div>
            <div className="flex justify-between gap-4 border-b border-border/60 py-2">
              <span className="text-muted-foreground">Name</span>
              <span className="font-medium">
                {dbUser?.name ?? authUser?.user_metadata?.full_name ?? "—"}
              </span>
            </div>
            <div className="flex justify-between gap-4 py-2">
              <span className="text-muted-foreground">Database sync</span>
              <span className="font-medium">
                {dbUser ? "Connected" : "Pending (set DATABASE_URL)"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System status</CardTitle>
            <CardDescription>Milestone 2 integration checks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <StatusRow
              label="Supabase Auth"
              ok={isSupabaseConfigured()}
            />
            <StatusRow
              label="PostgreSQL / Prisma"
              ok={isDatabaseConfigured()}
            />
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}

function StatusRow({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border/60 px-3 py-2">
      <span>{label}</span>
      <span
        className={
          ok
            ? "font-medium text-emerald-600 dark:text-emerald-400"
            : "font-medium text-amber-600 dark:text-amber-400"
        }
      >
        {ok ? "Configured" : "Not configured"}
      </span>
    </div>
  );
}
