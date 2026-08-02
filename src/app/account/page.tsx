import type { Metadata } from "next";
import Link from "next/link";

import { DealAlertsSection } from "@/components/account/deal-alerts-section";
import { EmailHistorySection } from "@/components/account/email-history-section";
import { PreferencesForm } from "@/components/account/preferences-form";
import { SavedPlansList } from "@/components/account/saved-plans-list";
import { SubscriptionCard } from "@/components/premium/subscription-card";
import { Container } from "@/components/layout/container";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { isDatabaseConfigured, isSupabaseConfigured } from "@/lib/env";
import { requireAuthUser } from "@/server/auth";
import { getUserBySupabaseId } from "@/server/users";
import { getUserPreferencesData } from "@/services/user/preferences-service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Account",
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const authUser = await requireAuthUser();
  const dbUser = authUser ? await getUserBySupabaseId(authUser.id) : null;
  const preferences =
    dbUser && isDatabaseConfigured()
      ? await getUserPreferencesData(dbUser.id)
      : null;

  return (
    <Container className="py-12">
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your account</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your profile, saved plans, preferences, and deal alerts.
          </p>
        </div>

        {dbUser?.role === "ADMIN" ? (
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle>Admin dashboard</CardTitle>
              <CardDescription>
                Manage prop firms, plans, rankings, and discount codes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin" className={cn(buttonVariants())}>
                Open admin
              </Link>
            </CardContent>
          </Card>
        ) : null}

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

        {dbUser ? (
          <>
            <SubscriptionCard />
            <SavedPlansList />
            <PreferencesForm initialPreferences={preferences} />
            <DealAlertsSection />
            <EmailHistorySection />
          </>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Saved plans & preferences</CardTitle>
              <CardDescription>
                Connect PostgreSQL to enable saved plans, preferences, and deal
                alerts.
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>System status</CardTitle>
            <CardDescription>Integration checks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <StatusRow label="Supabase Auth" ok={isSupabaseConfigured()} />
            <StatusRow label="PostgreSQL / Prisma" ok={isDatabaseConfigured()} />
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
