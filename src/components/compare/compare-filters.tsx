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
import { getEvalTypeLabel } from "@/lib/plans/labels";
import { formatAccountSize } from "@/lib/format";
import type { CompareFilterMetadata, CompareFilters } from "@/types/compare";

type CompareFiltersBarProps = {
  metadata: CompareFilterMetadata;
  filters: CompareFilters;
  onChange: (filters: CompareFilters) => void;
  resultCount: number;
};

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
      filters.search,
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
                firm:
                  !value || value === "all" ? undefined : value,
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
