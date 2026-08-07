import type { MarketType } from "@/generated/prisma/client";

export const MARKET_TYPES = [
  "FUTURES",
  "FOREX",
  "STOCKS",
  "CRYPTO",
] as const satisfies readonly MarketType[];

export const DEFAULT_MARKET_TYPE: MarketType = "FUTURES";

export const MARKET_TYPE_LABELS: Record<MarketType, string> = {
  FUTURES: "Futures",
  FOREX: "Forex",
  STOCKS: "Stocks",
  CRYPTO: "Crypto",
};

const MARKET_TYPE_SET = new Set<string>(MARKET_TYPES);

export function parseMarketType(value: string | null | undefined): MarketType {
  const normalized = value?.toUpperCase();
  if (normalized && MARKET_TYPE_SET.has(normalized)) {
    return normalized as MarketType;
  }

  return DEFAULT_MARKET_TYPE;
}

export function marketTypeToParam(marketType: MarketType): string {
  return marketType.toLowerCase();
}
