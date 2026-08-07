export const FUTURES_REPLAY_SYMBOLS = ["NQ", "MNQ", "ES", "MES"] as const;

export type FuturesReplaySymbol = (typeof FUTURES_REPLAY_SYMBOLS)[number];

export type FuturesSymbolMeta = {
  name: string;
  basePrice: number;
  tickSize: number;
  pointMove: number;
  volatility: number;
};

export const FUTURES_SYMBOL_META: Record<FuturesReplaySymbol, FuturesSymbolMeta> =
  {
    ES: {
      name: "E-mini S&P 500",
      basePrice: 5842,
      tickSize: 0.25,
      pointMove: 1,
      volatility: 1,
    },
    MES: {
      name: "Micro E-mini S&P",
      basePrice: 5842,
      tickSize: 0.25,
      pointMove: 1,
      volatility: 1,
    },
    NQ: {
      name: "E-mini Nasdaq-100",
      basePrice: 21450,
      tickSize: 0.25,
      pointMove: 1,
      volatility: 1.35,
    },
    MNQ: {
      name: "Micro Nasdaq-100",
      basePrice: 21450,
      tickSize: 0.25,
      pointMove: 1,
      volatility: 1.35,
    },
  };

export const REPLAY_SPEEDS = [1, 2, 5, 10, 30] as const;

export type ReplaySpeed = (typeof REPLAY_SPEEDS)[number];
