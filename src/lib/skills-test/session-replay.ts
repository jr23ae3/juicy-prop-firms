import {
  FUTURES_SYMBOL_META,
  type FuturesReplaySymbol,
} from "@/lib/skills-test/futures-symbols";

export type ReplayBar = {
  index: number;
  label: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type SessionReplay = {
  symbol: FuturesReplaySymbol;
  sessionDate: string;
  sessionLabel: string;
  bars: ReplayBar[];
  open: number;
  high: number;
  low: number;
  close: number;
  change: number;
  changePct: number;
};

const SESSION_MINUTES = 390;
const SESSION_OPEN_HOUR = 9;
const SESSION_OPEN_MINUTE = 30;

function hashSeed(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createRng(seed: number) {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function roundToTick(value: number, tickSize: number) {
  return Math.round(value / tickSize) * tickSize;
}

function formatSessionTime(minuteIndex: number) {
  const totalMinutes = SESSION_OPEN_HOUR * 60 + SESSION_OPEN_MINUTE + minuteIndex;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const period = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHour}:${minutes.toString().padStart(2, "0")} ${period} ET`;
}

export function getSessionDateKey(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
  }).format(date);
}

export function getSessionDisplayDate(sessionDate: string) {
  const parsed = new Date(`${sessionDate}T12:00:00`);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "America/New_York",
  }).format(parsed);
}

export function generateSessionReplay(
  symbol: FuturesReplaySymbol,
  sessionDate = getSessionDateKey(),
): SessionReplay {
  const meta = FUTURES_SYMBOL_META[symbol];
  const rng = createRng(hashSeed(`${symbol}:${sessionDate}`));
  const bars: ReplayBar[] = [];

  let price = meta.basePrice * (0.996 + rng() * 0.008);
  let drift = (rng() - 0.48) * meta.volatility * 0.08;

  for (let index = 0; index < SESSION_MINUTES; index += 1) {
    const minuteOfDay = index / SESSION_MINUTES;

    if (index === 120) drift += (rng() - 0.5) * 0.25;
    if (index === 240) drift += (rng() - 0.5) * 0.2;
    if (index > 330) drift *= 0.985;

    const open = price;
    const move =
      drift +
      (rng() - 0.5) * meta.volatility * 0.55 +
      Math.sin(minuteOfDay * Math.PI * 6) * meta.volatility * 0.08;
    const close = roundToTick(
      open + move * meta.pointMove,
      meta.tickSize,
    );
    const wick = meta.volatility * (0.15 + rng() * 0.45);
    const high = roundToTick(
      Math.max(open, close) + wick * meta.pointMove,
      meta.tickSize,
    );
    const low = roundToTick(
      Math.min(open, close) - wick * meta.pointMove,
      meta.tickSize,
    );
    const volume = Math.round(120 + rng() * 900 + meta.volatility * 200);

    bars.push({
      index,
      label: formatSessionTime(index),
      open,
      high,
      low,
      close,
      volume,
    });

    price = close;
    drift += (rng() - 0.5) * 0.015;
  }

  const sessionOpen = bars[0]?.open ?? meta.basePrice;
  const sessionClose = bars[bars.length - 1]?.close ?? sessionOpen;
  const sessionHigh = Math.max(...bars.map((bar) => bar.high));
  const sessionLow = Math.min(...bars.map((bar) => bar.low));
  const change = sessionClose - sessionOpen;
  const changePct = sessionOpen === 0 ? 0 : (change / sessionOpen) * 100;

  return {
    symbol,
    sessionDate,
    sessionLabel: getSessionDisplayDate(sessionDate),
    bars,
    open: sessionOpen,
    high: sessionHigh,
    low: sessionLow,
    close: sessionClose,
    change,
    changePct,
  };
}

export function formatReplayPrice(symbol: FuturesReplaySymbol, value: number) {
  const decimals = symbol === "ES" || symbol === "MES" ? 2 : 2;
  return value.toFixed(decimals);
}
