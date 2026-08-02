"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getDefaultSortDirection } from "@/lib/plans/sort-plans";
import type { CompareFilters, CompareSortField } from "@/types/compare";

const SORT_OPTIONS: { value: CompareSortField; label: string }[] = [
  { value: "allInCost", label: "All-in cost" },
  { value: "returnMultiple", label: "Return multiple" },
  { value: "maxPayout", label: "Max payout" },
  { value: "profitSplit", label: "Split %" },
  { value: "daysToPayout", label: "Days to payout" },
  { value: "accountSize", label: "Account size" },
  { value: "firmRank", label: "Firm rank" },
];

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
    <div className="flex flex-wrap items-center gap-2">
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
        <SelectTrigger size="sm" className="min-w-36">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
