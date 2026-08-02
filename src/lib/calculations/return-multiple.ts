import { roundRatio } from "@/lib/decimal";

/**
 * Net payout caps by account size — normalizes outlier advertised payouts.
 * Based on PickAPropFirm ROI methodology (first payout benchmark).
 */
export const NET_PAYOUT_CAPS: Record<number, number> = {
  25000: 1500,
  50000: 2500,
  100000: 3500,
  150000: 4500,
  200000: 5500,
  250000: 6500,
  300000: 7500,
};

export function getNetPayoutCap(accountSize: number): number {
  const sizes = Object.keys(NET_PAYOUT_CAPS)
    .map(Number)
    .sort((a, b) => a - b);

  let cap = NET_PAYOUT_CAPS[sizes[0]!]!;

  for (const size of sizes) {
    if (accountSize >= size) {
      cap = NET_PAYOUT_CAPS[size]!;
    }
  }

  return cap;
}

export function calculateNetPayout(
  maxPayout: number | null | undefined,
  profitSplit: number | null | undefined,
  accountSize: number,
): number | null {
  if (maxPayout == null || profitSplit == null) {
    return null;
  }

  const rawNet = maxPayout * profitSplit;
  const cap = getNetPayoutCap(accountSize);

  return Math.min(rawNet, cap);
}

/**
 * Return multiple = net first payout / all-in cost.
 * Compare plans of the same account size and eval type only.
 */
export function calculateReturnMultiple(
  netPayout: number | null,
  allInCost: number,
): number | null {
  if (netPayout == null || allInCost <= 0) {
    return null;
  }

  return roundRatio(netPayout / allInCost);
}
