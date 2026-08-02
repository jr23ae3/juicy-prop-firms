"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";

import { EvalTypeBadge } from "@/components/compare/eval-type-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSavedPlans } from "@/hooks/use-saved-plans";
import { useToggleSavePlan } from "@/hooks/use-toggle-save-plan";
import { formatAccountSize, formatCurrency } from "@/lib/format";

export function SavedPlansList() {
  const { data, isLoading, isError } = useSavedPlans();
  const toggleSave = useToggleSavePlan();

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading saved plans…</p>;
  }

  if (isError) {
    return (
      <p className="text-sm text-destructive">Failed to load saved plans.</p>
    );
  }

  const plans = data?.plans ?? [];

  if (plans.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Saved plans</CardTitle>
          <CardDescription>
            Bookmark plans from the compare table to track them here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/compare" className="text-sm text-primary hover:underline">
            Browse plans to compare →
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved plans</CardTitle>
        <CardDescription>
          {plans.length} plan{plans.length === 1 ? "" : "s"} bookmarked
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {plans.map((plan) => (
            <li
              key={plan.id}
              className="flex items-start justify-between gap-3 rounded-lg border border-border/60 p-3"
            >
              <div>
                <p className="font-medium">
                  <Link
                    href={`/firms/${plan.firm.slug}`}
                    className="hover:text-primary hover:underline"
                  >
                    {plan.firm.name}
                  </Link>
                  {" · "}
                  {plan.name}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatAccountSize(plan.accountSize)} ·{" "}
                  <EvalTypeBadge evalType={plan.evalType} /> ·{" "}
                  {formatCurrency(plan.pricing.allInCost)} all-in
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Remove saved plan"
                disabled={toggleSave.isPending}
                onClick={() =>
                  toggleSave.mutate({ planId: plan.id, isSaved: true })
                }
              >
                <Trash2 className="size-4" aria-hidden />
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
