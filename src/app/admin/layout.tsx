import type { Metadata } from "next";

import { AdminNav } from "@/components/admin/admin-nav";
import { Container } from "@/components/layout/container";
import { requireAdminUser } from "@/server/admin/require-admin-user";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminUser();

  return (
    <Container className="space-y-6 py-8 md:py-10">
      <div className="space-y-1">
        <p className="text-sm font-medium text-primary">Administration</p>
        <p className="text-sm text-muted-foreground">
          Manage prop firms, plans, rankings, and discount codes
        </p>
      </div>
      <AdminNav />
      {children}
    </Container>
  );
}
