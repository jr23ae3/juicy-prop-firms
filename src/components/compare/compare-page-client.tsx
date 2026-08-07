"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { CompareCardList } from "@/components/compare/compare-card-list";
import { CompareEmptyState } from "@/components/compare/compare-empty-state";
import { CompareFiltersBar } from "@/components/compare/compare-filters";
import { CompareSkeleton } from "@/components/compare/compare-skeleton";
import { CompareSortControls } from "@/components/compare/compare-sort-controls";
import { CompareTable } from "@/components/compare/compare-table";
import { MarketTypeToggle } from "@/components/compare/market-type-toggle";
import { Container } from "@/components/layout/container";
import { useCompareMetadata } from "@/hooks/use-compare-metadata";
import { usePlans } from "@/hooks/use-plans";
import { parseCompareFiltersFromSearchParams } from "@/lib/plans/filter-plans";
import {
  DEFAULT_MARKET_TYPE,
  marketTypeToParam,
} from "@/lib/plans/market-type";
import type { CompareFilterMetadata, CompareFilters } from "@/types/compare";
import type { MarketType } from "@/generated/prisma/client";

type ComparePageClientProps = {
  initialMetadata: CompareFilterMetadata;
};

function filtersToSearchParams(filters: CompareFilters): URLSearchParams {
  const params = new URLSearchParams();

  const marketType = filters.marketType ?? DEFAULT_MARKET_TYPE;
  if (marketType !== DEFAULT_MARKET_TYPE) {
    params.set("market", marketTypeToParam(marketType));
  }
  if (filters.firm) params.set("firm", filters.firm);
  if (filters.evalType) params.set("evalType", filters.evalType);
  if (filters.accountSize) params.set("accountSize", String(filters.accountSize));
  if (filters.maxBudget) params.set("maxBudget", String(filters.maxBudget));
  if (filters.search) params.set("q", filters.search);
  if (filters.drawdownType) params.set("drawdownType", filters.drawdownType);
  if (filters.minProfitSplit) {
    params.set("minProfitSplit", String(filters.minProfitSplit));
  }
  if (filters.maxDaysToPayout) {
    params.set("maxDaysToPayout", String(filters.maxDaysToPayout));
  }
  if (filters.minMaxPayout) {
    params.set("minMaxPayout", String(filters.minMaxPayout));
  }
  if (filters.sort) params.set("sort", filters.sort);
  if (filters.direction) params.set("direction", filters.direction);

  return params;
}

export function ComparePageClient({ initialMetadata }: ComparePageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters = useMemo(
    () => parseCompareFiltersFromSearchParams(searchParams),
    [searchParams],
  );

  const marketType = filters.marketType ?? DEFAULT_MARKET_TYPE;
  const { data: metadata = initialMetadata } = useCompareMetadata(marketType);
  const { data: plans = [], isLoading, isError } = usePlans(filters);

  const updateFilters = useCallback(
    (next: CompareFilters) => {
      const params = filtersToSearchParams(next);
      const query = params.toString();
      router.replace(query ? `/compare?${query}` : "/compare", {
        scroll: false,
      });
    },
    [router],
  );

  function handleMarketChange(nextMarketType: MarketType) {
    updateFilters({
      ...filters,
      marketType: nextMarketType,
      firm: undefined,
      accountSize: undefined,
    });
  }

  const hasSeedData = metadata.firms.length > 0 || marketType === "FOREX";

  if (!hasSeedData && !isLoading && marketType === DEFAULT_MARKET_TYPE) {
    return <CompareEmptyState variant="no-data" />;
  }

  return (
    <Container size="full" className="space-y-6 py-8 md:py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Compare prop firm plans
          </h1>
          <p className="max-w-3xl text-muted-foreground">
            Live pricing with verified discount codes and transparent all-in
            costs — eval price plus activation fees, surfaced upfront.
          </p>
        </header>
        <MarketTypeToggle value={marketType} onChange={handleMarketChange} />
      </div>

      <CompareFiltersBar
        metadata={metadata}
        filters={filters}
        onChange={updateFilters}
        resultCount={plans.length}
      />

      <CompareSortControls filters={filters} onChange={updateFilters} />

      {isLoading ? <CompareSkeleton /> : null}

      {isError ? (
        <p role="alert" className="text-sm text-destructive">
          Failed to load plans. Check your database connection and try again.
        </p>
      ) : null}

      {!isLoading && !isError && plans.length === 0 ? (
        <CompareEmptyState variant="no-results" />
      ) : null}

      {!isLoading && !isError && plans.length > 0 ? (
        <>
          <CompareCardList plans={plans} />
          <CompareTable
            plans={plans}
            filters={filters}
            onSortChange={updateFilters}
          />
        </>
      ) : null}
    </Container>
  );
}
