type DecimalLike = { toNumber(): number } | number | string | null | undefined;

export function toNumber(value: DecimalLike): number {
  if (value == null) return 0;
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value);
  return value.toNumber();
}

export function toNumberOrNull(value: DecimalLike): number | null {
  if (value == null) return null;
  return toNumber(value);
}

export function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

export function roundRatio(value: number, decimals = 2): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

export function decimalValuesEqual(a: DecimalLike, b: number): boolean {
  return toNumber(a) === b;
}
