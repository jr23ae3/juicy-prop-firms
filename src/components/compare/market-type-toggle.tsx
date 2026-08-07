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
        "inline-flex rounded-md border border-border bg-secondary/60 p-0.5 font-mono text-xs",
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
              "rounded px-3 py-1.5 uppercase tracking-wider transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
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
