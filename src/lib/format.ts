export function formatCurrency(
  amount: number,
  options?: { maximumFractionDigits?: number },
) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: options?.maximumFractionDigits ?? 0,
  }).format(amount);
}

export function formatAccountSize(size: number) {
  if (size >= 1000) {
    return `$${Math.round(size / 1000)}K`;
  }
  return formatCurrency(size);
}

export function formatPercent(decimal: number) {
  return `${Math.round(decimal * 100)}%`;
}

export function formatReturnMultiple(value: number | null) {
  if (value == null) return "—";
  return `${value.toFixed(1)}x`;
}

export function formatOptionalCurrency(value: number | null | undefined) {
  if (value == null || value <= 0) return "—";
  return formatCurrency(value);
}

export function formatMinimumDays(days: number | null | undefined) {
  if (days == null || days <= 0) return "—";
  return days === 1 ? "1 day" : `${days} days`;
}

export function formatProfitSplit(split: number | null | undefined) {
  if (split == null) return "—";
  return formatPercent(split);
}

export function formatOptionalCount(value: number | null | undefined) {
  if (value == null || value <= 0) return "—";
  return String(value);
}
