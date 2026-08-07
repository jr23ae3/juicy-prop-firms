"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { CompareEmptyState } from "@/components/compare/compare-empty-state";
import { CompareFiltersBar } from "@/components/compare/compare-filters";
import { ComparePlanGrid } from "@/components/compare/compare-plan-grid";
import { CompareSkeleton } from "@/components/compare/compare-skeleton";
import { CompareSortControls } from "@/components/compare/compare-sort-controls";
import { MarketTypeToggle } from "@/components/compare/market-type-toggle";
import { Container } from "@/components/layout/container";
import { ArcadePacmanBackground } from "@/components/marketing/arcade-pacman-background";
import { ArcadeStarfield } from "@/components/marketing/arcade-starfield";
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

  const hasSeedData = metadata.firms.length > 0 || marketType !== DEFAULT_MARKET_TYPE;

  if (!hasSeedData && !isLoading && marketType === DEFAULT_MARKET_TYPE) {
    return <CompareEmptyState variant="no-data" />;
  }

  return (
    <div className="site-canvas compare-workspace">
      <div className="compare-arcade-bg" aria-hidden>
        <ArcadePacmanBackground />
        <ArcadeStarfield />
      </div>

      <Container size="full" className="relative z-[1] py-8 md:py-12">
        <header className="compare-arcade-header">
          <div className="space-y-3">
            <p className="arcade-level-num text-[#ffd700]">★ LVL 1 · COMPARE ★</p>
            <h1 className="compare-arcade-title">PLAN SHOWDOWN</h1>
            <p className="arcade-subtitle">HOVER FOR STATS · CLICK TO REVEAL</p>
            <p className="compare-arcade-lead">
              Browse plans at a glance — hover for depth, click any card for a
              radial reveal of the full breakdown.
            </p>
          </div>
          <MarketTypeToggle
            value={marketType}
            onChange={handleMarketChange}
            className="compare-arcade-toggle"
          />
        </header>

        <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
          <aside className="compare-sidebar compare-arcade-sidebar shrink-0 p-4 lg:sticky lg:top-24 lg:w-72 lg:self-start">
            <CompareFiltersBar
              metadata={metadata}
              filters={filters}
              onChange={updateFilters}
              resultCount={plans.length}
              variant="sidebar"
            />
          </aside>

          <div className="min-w-0 flex-1 space-y-4">
            <div className="compare-arcade-toolbar">
              <div className="compare-arcade-score">
                <p className="arcade-hud-label">PLANS</p>
                <p className="arcade-hud-value">
                  {isLoading ? "…" : String(plans.length).padStart(2, "0")}
                </p>
              </div>
              <CompareSortControls filters={filters} onChange={updateFilters} />
            </div>

            {isLoading ? <CompareSkeleton /> : null}

            {isError ? (
              <p
                role="alert"
                className="compare-arcade-alert font-mono text-sm text-destructive"
              >
                GAME OVER — Failed to load plans. Check your database connection
                and try again.
              </p>
            ) : null}

            {!isLoading && !isError && plans.length === 0 ? (
              <CompareEmptyState variant="no-results" />
            ) : null}

            {!isLoading && !isError && plans.length > 0 ? (
              <ComparePlanGrid plans={plans} />
            ) : null}
          </div>
        </div>
      </Container>
    </div>
  );
}
