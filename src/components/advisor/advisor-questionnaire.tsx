"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useActionState, useState } from "react";

import { getAdvisorRecommendationsAction } from "@/actions/advisor";
import { AdvisorResults } from "@/components/advisor/advisor-results";
import { MarketTypeToggle } from "@/components/compare/market-type-toggle";
import { MarketTypeBadge } from "@/components/admin/market-type-select";
import { ArcadeAdvisorCharacter } from "@/components/marketing/arcade-advisor-character";
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
import { useUserPreferences } from "@/hooks/use-user-preferences";
import { useUser } from "@/hooks/use-user";
import {
  DEFAULT_MARKET_TYPE,
  marketTypeToParam,
  parseMarketType,
} from "@/lib/plans/market-type";
import { cn } from "@/lib/utils";
import type { MarketType } from "@/generated/prisma/client";
import type { AdvisorActionState } from "@/types/advisor";

const selectClassName = cn(
  "flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm shadow-xs outline-none",
  "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
  "disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30",
);

const initialState: AdvisorActionState = {};

type AdvisorQuestionnaireProps = {
  initialMarketType?: MarketType;
};

export function AdvisorQuestionnaire({
  initialMarketType = DEFAULT_MARKET_TYPE,
}: AdvisorQuestionnaireProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [marketType, setMarketType] = useState<MarketType>(initialMarketType);
  const [state, formAction, isPending] = useActionState(
    getAdvisorRecommendationsAction,
    initialState,
  );
  const { data: user } = useUser();
  const { data: prefs } = useUserPreferences(Boolean(user));

  const tradingStyle = prefs?.tradingStyle ?? "day-trader";
  const experienceLevel = prefs?.experienceLevel ?? "intermediate";
  const accountSize = prefs?.preferredSize
    ? String(prefs.preferredSize)
    : "50000";
  const evalTypePreference = prefs?.evalTypePreference ?? "any";
  const priority = prefs?.priority ?? "affordability";
  const maxBudget = prefs?.maxBudget ?? 200;
  const prefsReady = !user || prefs !== undefined;

  function handleMarketChange(nextMarketType: MarketType) {
    setMarketType(nextMarketType);

    const params = new URLSearchParams(searchParams.toString());
    if (nextMarketType === DEFAULT_MARKET_TYPE) {
      params.delete("market");
    } else {
      params.set("market", marketTypeToParam(nextMarketType));
    }

    const query = params.toString();
    router.replace(query ? `/advisor?${query}` : "/advisor", { scroll: false });
  }

  return (
    <div className="space-y-8">
      {user && prefs ? (
        <p className="text-center text-sm text-muted-foreground">
          Pre-filled from your saved preferences.{" "}
          <a href="/account" className="text-primary hover:underline">
            Edit in account
          </a>
        </p>
      ) : null}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <ArcadeAdvisorCharacter size="sm" animate={false} />
            Tell Oracle OJ about your trading
          </CardTitle>
          <CardDescription>
            Pick a market, answer a few questions, and get matched with prop
            firm plans for futures, forex, stocks, or crypto.
          </CardDescription>
        </CardHeader>
        <form action={formAction} key={`${prefsReady ? "ready" : "loading"}-${marketType}`}>
          <input type="hidden" name="marketType" value={marketType} />
          <CardContent className="space-y-6">
            {state.error ? (
              <p
                role="alert"
                className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              >
                {state.error}
              </p>
            ) : null}

            <div className="space-y-3 rounded-lg border border-primary/25 bg-primary/5 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="arcade-level-num text-[9px] text-[#ffd700]">
                    ★ SELECT MARKET ★
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Matches only plans in this market catalog.
                  </p>
                </div>
                <MarketTypeBadge marketType={marketType} />
              </div>
              <MarketTypeToggle
                value={marketType}
                onChange={handleMarketChange}
                className="compare-arcade-toggle w-full"
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <FormSelect
                name="tradingStyle"
                label="Trading style"
                defaultValue={tradingStyle}
                options={[
                  { value: "scalper", label: "Scalper" },
                  { value: "day-trader", label: "Day trader" },
                  { value: "swing", label: "Swing trader" },
                ]}
              />

              <FormSelect
                name="experienceLevel"
                label="Experience level"
                defaultValue={experienceLevel}
                options={[
                  { value: "beginner", label: "Beginner" },
                  { value: "intermediate", label: "Intermediate" },
                  { value: "advanced", label: "Advanced" },
                ]}
              />

              <FormSelect
                name="accountSize"
                label="Preferred account size"
                defaultValue={accountSize}
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
                defaultValue={evalTypePreference}
                options={[
                  { value: "any", label: "Any" },
                  { value: "CHALLENGE", label: "Challenge" },
                  { value: "DIRECT_TO_FUNDED", label: "Direct to Funded" },
                ]}
              />

              <FormSelect
                name="priority"
                label="Top priority"
                defaultValue={priority}
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
                  defaultValue={maxBudget}
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
                className={cn(selectClassName, "h-auto min-h-20 py-2")}
              />
            </div>

            <Button type="submit" disabled={isPending} className="gap-2">
              <ArcadeAdvisorCharacter size="xs" animate={false} />
              {isPending ? "Oracle thinking…" : "Get AI recommendations"}
            </Button>
          </CardContent>
        </form>
      </Card>

      {state.data ? (
        <AdvisorResults result={state.data} marketType={marketType} />
      ) : null}
    </div>
  );
}

export function AdvisorQuestionnaireFromUrl() {
  const searchParams = useSearchParams();
  const marketType = parseMarketType(searchParams.get("market"));

  return <AdvisorQuestionnaire initialMarketType={marketType} />;
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
