import { roundCurrency } from "@/lib/decimal";

export type DiscountInput = {
  discountPct?: number | null;
  discountAmt?: number | null;
};

export function applyDiscount(
  evalPrice: number,
  discount?: DiscountInput | null,
): number {
  if (!discount) return evalPrice;

  if (discount.discountPct != null && discount.discountPct > 0) {
    return roundCurrency(evalPrice * (1 - discount.discountPct));
  }

  if (discount.discountAmt != null && discount.discountAmt > 0) {
    return roundCurrency(Math.max(0, evalPrice - discount.discountAmt));
  }

  return evalPrice;
}

/** Discounted eval price + activation fee — the true cost to reach funded status. */
export function calculateAllInCost(
  evalPrice: number,
  activationFee: number,
  discount?: DiscountInput | null,
): number {
  const discountedPrice = applyDiscount(evalPrice, discount);
  return roundCurrency(discountedPrice + activationFee);
}

export function calculateSavings(
  evalPrice: number,
  discount?: DiscountInput | null,
): number {
  return roundCurrency(evalPrice - applyDiscount(evalPrice, discount));
}
