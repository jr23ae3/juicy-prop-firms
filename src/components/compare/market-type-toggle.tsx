"use client";

import type { MarketType } from "@/generated/prisma/client";

import { MARKET_TYPES, MARKET_TYPE_LABELS } from "@/lib/plans/market-type";
import { cn } from "@/lib/utils";

type MarketTypeToggleProps = {
  value: MarketType;
  onChange: (marketType: MarketType) => void;
};

export function MarketTypeToggle({ value, onChange }: MarketTypeToggleProps) {
  return (
    <div
      role="group"
      aria-label="Market type"
      className="inline-flex rounded-lg border border-border/60 bg-muted/40 p-1"
    >
      {MARKET_TYPES.map((marketType) => {
        const isActive = value === marketType;

        return (
          <button
            key={marketType}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(marketType)}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {MARKET_TYPE_LABELS[marketType]}
          </button>
        );
      })}
    </div>
  );
}
