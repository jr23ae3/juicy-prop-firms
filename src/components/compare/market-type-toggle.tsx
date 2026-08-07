"use client";

import type { MarketType } from "@/generated/prisma/client";

import { MARKET_TYPES, MARKET_TYPE_LABELS } from "@/lib/plans/market-type";
import { cn } from "@/lib/utils";

type MarketTypeToggleProps = {
  value: MarketType;
  onChange: (marketType: MarketType) => void;
  className?: string;
};

export function MarketTypeToggle({
  value,
  onChange,
  className,
}: MarketTypeToggleProps) {
  return (
    <div
      role="group"
      aria-label="Market type"
      className={cn(
        "inline-flex rounded-full border border-border/70 bg-muted/50 p-1",
        className,
      )}
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
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
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
