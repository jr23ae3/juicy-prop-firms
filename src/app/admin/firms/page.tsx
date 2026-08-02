import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CURRENT_RANKING_PERIOD } from "@/config/rankings";
import { cn } from "@/lib/utils";
import { listFirmsForAdmin } from "@/services/admin/data-service";

export default async function AdminFirmsPage() {
  const firms = await listFirmsForAdmin();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Prop firms</h2>
          <p className="text-sm text-muted-foreground">
            {firms.length} firms · Ranking period {CURRENT_RANKING_PERIOD}
          </p>
        </div>
        <Link href="/admin/firms/new" className={cn(buttonVariants())}>
          Add firm
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All firms</CardTitle>
          <CardDescription>Click a firm to edit plans, rankings, and discounts</CardDescription>
        </CardHeader>
        <CardContent>
          {firms.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No firms yet.{" "}
              <Link href="/admin/firms/new" className="text-primary hover:underline">
                Add your first firm
              </Link>{" "}
              or run <code className="rounded bg-muted px-1">npm run db:seed</code>.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b border-border/60 text-left text-muted-foreground">
                    <th className="px-3 py-2 font-medium">#</th>
                    <th className="px-3 py-2 font-medium">Firm</th>
                    <th className="px-3 py-2 font-medium">Plans</th>
                    <th className="px-3 py-2 font-medium">Score</th>
                    <th className="px-3 py-2 font-medium">Status</th>
                    <th className="px-3 py-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {firms.map((firm) => (
                    <tr
                      key={firm.id}
                      className="border-b border-border/40 last:border-0"
                    >
                      <td className="px-3 py-3 tabular-nums">
                        {firm.rankPosition ?? "—"}
                      </td>
                      <td className="px-3 py-3">
                        <p className="font-medium">{firm.name}</p>
                        <p className="text-xs text-muted-foreground">{firm.slug}</p>
                      </td>
                      <td className="px-3 py-3 tabular-nums">
                        {firm._count.plans}
                      </td>
                      <td className="px-3 py-3 tabular-nums">
                        {firm.rankScore?.toFixed(1) ?? "—"}
                      </td>
                      <td className="px-3 py-3">
                        {firm.isActive ? (
                          <span className="text-emerald-600">Active</span>
                        ) : (
                          <span className="text-muted-foreground">Inactive</span>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <Link
                          href={`/admin/firms/${firm.id}`}
                          className="text-primary hover:underline"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
