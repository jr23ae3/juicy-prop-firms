import type { MarketType } from "@/generated/prisma/client";

export const MARKET_TYPES = ["FUTURES", "FOREX"] as const satisfies readonly MarketType[];

export const DEFAULT_MARKET_TYPE: MarketType = "FUTURES";

export const MARKET_TYPE_LABELS: Record<MarketType, string> = {
  FUTURES: "Futures",
  FOREX: "Forex",
};

export function parseMarketType(value: string | null | undefined): MarketType {
  if (value?.toUpperCase() === "FOREX") {
    return "FOREX";
  }

  return DEFAULT_MARKET_TYPE;
}

export function marketTypeToParam(marketType: MarketType): string {
  return marketType.toLowerCase();
}
