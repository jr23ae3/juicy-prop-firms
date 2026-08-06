"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COMPARE_SORT_FIELDS } from "@/lib/plans/compare-sort-config";
import { getDefaultSortDirection } from "@/lib/plans/sort-plans";
import type { CompareFilters, CompareSortField } from "@/types/compare";

const SORT_LABELS: Record<CompareSortField, string> = {
  firmRank: "Firm rank",
  firmName: "Firm name",
  accountSize: "Account size",
  evalType: "Eval type",
  drawdownType: "Draw down type",
  profitTarget: "Target goal",
  dailyDrawdown: "Daily draw down",
  maxDrawdown: "Max draw down",
  minimumDays: "Minimum days",
  evalPrice: "Eval price",
  activationFee: "Activation fee",
  allInCost: "All-in cost",
  daysToPayout: "Days to payout",
  minimumTargetGoalCushion: "Min target buffer",
  allInTarget: "All-in target",
  maxPayout: "Max payout",
  riskRatio: "Risk ratio",
  maxFundedAccounts: "Max funded accounts",
  fundedDrawdownType: "Funded draw down type",
  profitSplit: "Split %",
  returnMultiple: "Return multiple",
};

type CompareSortControlsProps = {
  filters: CompareFilters;
  onChange: (filters: CompareFilters) => void;
};

export function CompareSortControls({
  filters,
  onChange,
}: CompareSortControlsProps) {
  const sort = filters.sort ?? "allInCost";

  return (
    <div className="flex flex-wrap items-center gap-2 lg:hidden">
      <span className="text-xs font-medium text-muted-foreground">Sort by</span>
      <Select
        value={sort}
        onValueChange={(value) => {
          if (!value) return;
          const nextSort = value as CompareSortField;
          onChange({
            ...filters,
            sort: nextSort,
            direction: getDefaultSortDirection(nextSort),
          });
        }}
      >
        <SelectTrigger size="sm" className="min-w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {COMPARE_SORT_FIELDS.map((field) => (
            <SelectItem key={field} value={field}>
              {SORT_LABELS[field]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
