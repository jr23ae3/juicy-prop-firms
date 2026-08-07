"use client";

import { useMemo, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/format";

export function RoiCalculator() {
  const [allInCost, setAllInCost] = useState("150");
  const [monthlyProfit, setMonthlyProfit] = useState("2000");
  const [profitSplit, setProfitSplit] = useState("90");

  const result = useMemo(() => {
    const cost = Number(allInCost);
    const profit = Number(monthlyProfit);
    const split = Number(profitSplit) / 100;

    if (!cost || !profit || !split || cost <= 0 || profit <= 0 || split <= 0) {
      return null;
    }

    const netMonthly = profit * split;
    const monthsToBreakEven = cost / netMonthly;
    const sixMonthReturn = (netMonthly * 6 - cost) / cost;

    return {
      netMonthly,
      monthsToBreakEven,
      sixMonthReturn,
    };
  }, [allInCost, monthlyProfit, profitSplit]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>ROI calculator</CardTitle>
        <CardDescription>
          Estimate how long it takes to recover your all-in eval cost based on
          expected monthly profit and payout split.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="allInCost">All-in cost ($)</Label>
            <Input
              id="allInCost"
              type="number"
              min={1}
              value={allInCost}
              onChange={(e) => setAllInCost(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="monthlyProfit">Expected monthly profit ($)</Label>
            <Input
              id="monthlyProfit"
              type="number"
              min={1}
              value={monthlyProfit}
              onChange={(e) => setMonthlyProfit(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profitSplit">Profit split (%)</Label>
            <Input
              id="profitSplit"
              type="number"
              min={1}
              max={100}
              value={profitSplit}
              onChange={(e) => setProfitSplit(e.target.value)}
            />
          </div>
        </div>

        {result ? (
          <dl className="surface-muted grid gap-4 p-4 sm:grid-cols-3">
            <div>
              <dt className="text-xs text-muted-foreground">Net monthly payout</dt>
              <dd className="mt-1 text-xl font-bold tabular-nums text-primary">
                {formatCurrency(result.netMonthly)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Months to break even</dt>
              <dd className="mt-1 text-xl font-bold tabular-nums">
                {result.monthsToBreakEven < 1
                  ? "< 1 mo"
                  : result.monthsToBreakEven.toFixed(1)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">6-month ROI</dt>
              <dd className="mt-1 text-xl font-bold tabular-nums">
                {(result.sixMonthReturn * 100).toFixed(0)}%
              </dd>
            </div>
          </dl>
        ) : (
          <p className="text-sm text-muted-foreground">
            Enter valid numbers to see your ROI estimate.
          </p>
        )}

        <p className="text-xs text-muted-foreground">
          Estimates only — actual results depend on your trading performance, firm
          rules, and payout policies. Compare real all-in costs on the{" "}
          <a href="/compare" className="text-primary hover:underline">
            compare table
          </a>
          .
        </p>
      </CardContent>
    </Card>
  );
}
