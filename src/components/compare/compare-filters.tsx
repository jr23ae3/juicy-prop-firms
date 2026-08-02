"use client";

import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatAccountSize, formatPercent } from "@/lib/format";
import { getDrawdownTypeLabel, getEvalTypeLabel } from "@/lib/plans/labels";
import type { CompareFilterMetadata, CompareFilters } from "@/types/compare";

type CompareFiltersBarProps = {
  metadata: CompareFilterMetadata;
  filters: CompareFilters;
  onChange: (filters: CompareFilters) => void;
  resultCount: number;
};

const MIN_SPLIT_OPTIONS = [0.8, 0.85, 0.9] as const;
const MAX_DAYS_TO_PAYOUT_OPTIONS = [5, 8, 10, 15] as const;
const MIN_MAX_PAYOUT_OPTIONS = [2500, 3000, 3500] as const;

export function CompareFiltersBar({
  metadata,
  filters,
  onChange,
  resultCount,
}: CompareFiltersBarProps) {
  const [searchInput, setSearchInput] = useState(filters.search ?? "");

  useEffect(() => {
    setSearchInput(filters.search ?? "");
  }, [filters.search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== (filters.search ?? "")) {
        onChange({ ...filters, search: searchInput || undefined });
      }
    }, 300);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- debounce search only
  }, [searchInput]);

  function update(partial: Partial<CompareFilters>) {
    onChange({ ...filters, ...partial });
  }

  function clearFilters() {
    setSearchInput("");
    onChange({});
  }

  const hasActiveFilters = Boolean(
    filters.firm ||
      filters.evalType ||
      filters.accountSize ||
      filters.maxBudget ||
      filters.search ||
      filters.drawdownType ||
      filters.minProfitSplit ||
      filters.maxDaysToPayout ||
      filters.minMaxPayout,
  );

  return (
    <div className="space-y-4 rounded-xl border border-border/60 bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold">Filter plans</h2>
          <p className="text-xs text-muted-foreground">
            {resultCount} plan{resultCount === 1 ? "" : "s"} shown
          </p>
        </div>
        {hasActiveFilters ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="gap-1.5 self-start sm:self-auto"
          >
            <X className="size-3.5" aria-hidden />
            Clear filters
          </Button>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <FilterField label="Search">
          <div className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Firm or plan…"
              className="pl-8"
              aria-label="Search firms or plans"
            />
          </div>
        </FilterField>

        <FilterField label="Firm">
          <Select
            value={filters.firm ?? "all"}
            onValueChange={(value) =>
              update({
                firm: !value || value === "all" ? undefined : value,
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All firms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All firms</SelectItem>
              {metadata.firms.map((firm) => (
                <SelectItem key={firm.slug} value={firm.slug}>
                  {firm.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FilterField>

        <FilterField label="Account size">
          <Select
            value={filters.accountSize ? String(filters.accountSize) : "all"}
            onValueChange={(value) =>
              update({
                accountSize:
                  !value || value === "all" ? undefined : Number(value),
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All sizes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sizes</SelectItem>
              {metadata.accountSizes.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {formatAccountSize(size)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FilterField>

        <FilterField label="Eval type">
          <Select
            value={filters.evalType ?? "all"}
            onValueChange={(value) =>
              update({
                evalType:
                  !value || value === "all"
                    ? undefined
                    : (value as CompareFilters["evalType"]),
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {metadata.evalTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {getEvalTypeLabel(type)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FilterField>

        <FilterField label="Max budget">
          <Select
            value={filters.maxBudget ? String(filters.maxBudget) : "all"}
            onValueChange={(value) =>
              update({
                maxBudget:
                  !value || value === "all" ? undefined : Number(value),
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Any budget" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any budget</SelectItem>
              {[100, 150, 200, 300, 500].map((budget) => (
                <SelectItem key={budget} value={String(budget)}>
                  Under ${budget}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FilterField>
      </div>

      <div className="border-t border-border/60 pt-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Drawdown & funded
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FilterField label="Draw down type">
            <Select
              value={filters.drawdownType ?? "all"}
              onValueChange={(value) =>
                update({
                  drawdownType:
                    !value || value === "all"
                      ? undefined
                      : (value as CompareFilters["drawdownType"]),
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                {metadata.drawdownTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {getDrawdownTypeLabel(type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>

          <FilterField label="Min split %">
            <Select
              value={
                filters.minProfitSplit
                  ? String(filters.minProfitSplit)
                  : "all"
              }
              onValueChange={(value) =>
                update({
                  minProfitSplit:
                    !value || value === "all" ? undefined : Number(value),
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Any split" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any split</SelectItem>
                {MIN_SPLIT_OPTIONS.map((split) => (
                  <SelectItem key={split} value={String(split)}>
                    {formatPercent(split)}+
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>

          <FilterField label="Max days to payout">
            <Select
              value={
                filters.maxDaysToPayout
                  ? String(filters.maxDaysToPayout)
                  : "all"
              }
              onValueChange={(value) =>
                update({
                  maxDaysToPayout:
                    !value || value === "all" ? undefined : Number(value),
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Any timeline" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any timeline</SelectItem>
                {MAX_DAYS_TO_PAYOUT_OPTIONS.map((days) => (
                  <SelectItem key={days} value={String(days)}>
                    Within {days} days
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>

          <FilterField label="Min max payout">
            <Select
              value={
                filters.minMaxPayout ? String(filters.minMaxPayout) : "all"
              }
              onValueChange={(value) =>
                update({
                  minMaxPayout:
                    !value || value === "all" ? undefined : Number(value),
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Any payout" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any payout</SelectItem>
                {MIN_MAX_PAYOUT_OPTIONS.map((payout) => (
                  <SelectItem key={payout} value={String(payout)}>
                    ${payout.toLocaleString()}+
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>
        </div>
      </div>
    </div>
  );
}

function FilterField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
