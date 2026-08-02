"use client";

import { useActionState } from "react";

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
import { updatePreferencesAction } from "@/actions/user";
import { useUserPreferences } from "@/hooks/use-user-preferences";

const selectClassName = cn(
  "flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm shadow-xs outline-none",
  "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30",
);

type PreferencesFormProps = {
  initialPreferences?: {
    tradingStyle?: string | null;
    experienceLevel?: string | null;
    preferredSize?: number | null;
    maxBudget?: number | null;
    evalTypePreference?: string | null;
    priority?: string | null;
    alertsEnabled?: boolean;
  } | null;
};

export function PreferencesForm({ initialPreferences }: PreferencesFormProps) {
  const { data: livePreferences } = useUserPreferences();
  const prefs = livePreferences ?? initialPreferences;

  const [state, formAction, isPending] = useActionState(
    updatePreferencesAction,
    {},
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trading preferences</CardTitle>
        <CardDescription>
          Used to pre-fill the AI Advisor and personalize your experience.
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          {state.error ? (
            <p role="alert" className="text-sm text-destructive">
              {state.error}
            </p>
          ) : null}
          {state.success ? (
            <p className="text-sm text-emerald-600 dark:text-emerald-400">
              Preferences saved.
            </p>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <FieldSelect
              name="tradingStyle"
              label="Trading style"
              defaultValue={prefs?.tradingStyle ?? "day-trader"}
              options={[
                { value: "scalper", label: "Scalper" },
                { value: "day-trader", label: "Day trader" },
                { value: "swing", label: "Swing trader" },
              ]}
            />
            <FieldSelect
              name="experienceLevel"
              label="Experience"
              defaultValue={prefs?.experienceLevel ?? "intermediate"}
              options={[
                { value: "beginner", label: "Beginner" },
                { value: "intermediate", label: "Intermediate" },
                { value: "advanced", label: "Advanced" },
              ]}
            />
            <FieldSelect
              name="preferredSize"
              label="Preferred size"
              defaultValue={String(prefs?.preferredSize ?? 50000)}
              options={[
                { value: "50000", label: "$50K" },
                { value: "100000", label: "$100K" },
                { value: "150000", label: "$150K" },
              ]}
            />
            <FieldSelect
              name="evalTypePreference"
              label="Eval type"
              defaultValue={prefs?.evalTypePreference ?? "any"}
              options={[
                { value: "any", label: "Any" },
                { value: "CHALLENGE", label: "Challenge" },
                { value: "DIRECT_TO_FUNDED", label: "Direct to Funded" },
              ]}
            />
            <FieldSelect
              name="priority"
              label="Top priority"
              defaultValue={prefs?.priority ?? "affordability"}
              options={[
                { value: "affordability", label: "Lowest all-in cost" },
                { value: "payouts", label: "Best payouts" },
                { value: "rules", label: "Trader-friendly rules" },
                { value: "platform", label: "Best overall firm" },
              ]}
            />
            <div className="space-y-2">
              <Label htmlFor="maxBudget">Max budget</Label>
              <Input
                id="maxBudget"
                name="maxBudget"
                type="number"
                min={50}
                max={2000}
                defaultValue={prefs?.maxBudget ?? 200}
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="alertsEnabled"
              defaultChecked={prefs?.alertsEnabled ?? true}
              value="true"
              className="size-4 rounded border-input"
            />
            Email me about price drops and new deals
          </label>

          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving…" : "Save preferences"}
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}

function FieldSelect({
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
