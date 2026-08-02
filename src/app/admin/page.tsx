import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getAdminStats } from "@/services/admin/data-service";

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Prop firms" value={stats.firms} />
        <StatCard label="Active plans" value={stats.plans} />
        <StatCard label="Active discounts" value={stats.discounts} />
        <StatCard label="Users" value={stats.users} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick actions</CardTitle>
          <CardDescription>Manage catalog data without editing seed files</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Link href="/admin/firms/new" className={cn(buttonVariants())}>
            Add prop firm
          </Link>
          <Link
            href="/admin/firms"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Manage firms
          </Link>
          <Link
            href="/compare"
            className={cn(buttonVariants({ variant: "ghost" }))}
            target="_blank"
          >
            Preview compare table
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-3xl tabular-nums">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}
