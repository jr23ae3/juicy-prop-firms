"use client";

import { Sparkles } from "lucide-react";
import { useActionState } from "react";

import { getAdvisorRecommendationsAction } from "@/actions/advisor";
import { AdvisorResults } from "@/components/advisor/advisor-results";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { AdvisorActionState } from "@/types/advisor";

const selectClassName = cn(
  "flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm shadow-xs outline-none",
  "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
  "disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30",
);

const initialState: AdvisorActionState = {};

export function AdvisorQuestionnaire() {
  const [state, formAction, isPending] = useActionState(
    getAdvisorRecommendationsAction,
    initialState,
  );

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="size-5 text-primary" aria-hidden />
            Tell us about your trading
          </CardTitle>
          <CardDescription>
            Answer a few questions and we&apos;ll match you with the best prop
            firm plans for your style and budget.
          </CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="space-y-6">
            {state.error ? (
              <p
                role="alert"
                className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              >
                {state.error}
              </p>
            ) : null}

            <div className="grid gap-6 sm:grid-cols-2">
              <FormSelect
                name="tradingStyle"
                label="Trading style"
                defaultValue="day-trader"
                options={[
                  { value: "scalper", label: "Scalper" },
                  { value: "day-trader", label: "Day trader" },
                  { value: "swing", label: "Swing trader" },
                ]}
              />

              <FormSelect
                name="experienceLevel"
                label="Experience level"
                defaultValue="intermediate"
                options={[
                  { value: "beginner", label: "Beginner" },
                  { value: "intermediate", label: "Intermediate" },
                  { value: "advanced", label: "Advanced" },
                ]}
              />

              <FormSelect
                name="accountSize"
                label="Preferred account size"
                defaultValue="50000"
                options={[
                  { value: "50000", label: "$50K" },
                  { value: "100000", label: "$100K" },
                  { value: "150000", label: "$150K" },
                  { value: "flexible", label: "Flexible" },
                  ]}
              />

              <FormSelect
                name="evalTypePreference"
                label="Eval type preference"
                defaultValue="any"
                options={[
                  { value: "any", label: "Any" },
                  { value: "CHALLENGE", label: "Challenge" },
                  { value: "DIRECT_TO_FUNDED", label: "Direct to Funded" },
                ]}
              />

              <FormSelect
                name="priority"
                label="Top priority"
                defaultValue="affordability"
                options={[
                  { value: "affordability", label: "Lowest all-in cost" },
                  { value: "payouts", label: "Best payout potential" },
                  { value: "rules", label: "Trader-friendly rules" },
                  { value: "platform", label: "Best overall firm" },
                ]}
              />

              <div className="space-y-2">
                <Label htmlFor="maxBudget">Max budget (all-in)</Label>
                <Input
                  id="maxBudget"
                  name="maxBudget"
                  type="number"
                  min={50}
                  max={2000}
                  defaultValue={200}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Maximum you want to spend including activation fees.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional notes (optional)</Label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                maxLength={500}
                placeholder="e.g. I prefer daily payouts and EOD drawdowns…"
                className={cn(
                  selectClassName,
                  "h-auto min-h-20 py-2",
                )}
              />
            </div>

            <Button type="submit" disabled={isPending} className="gap-2">
              <Sparkles className="size-4" aria-hidden />
              {isPending ? "Finding matches…" : "Get AI recommendations"}
            </Button>
          </CardContent>
        </form>
      </Card>

      {state.data ? <AdvisorResults result={state.data} /> : null}
    </div>
  );
}

function FormSelect({
  name,
  label,
  defaultValue,
  options,
}: {
  name: string;
  label: string;
  defaultValue: string;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue}
        className={selectClassName}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
