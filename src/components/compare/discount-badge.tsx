"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPercent } from "@/lib/format";
import type { DiscountSummary } from "@/types/plan";

type DiscountBadgeProps = {
  discount: DiscountSummary;
};

export function DiscountBadge({ discount }: DiscountBadgeProps) {
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(discount.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable
    }
  }

  const savingsLabel =
    discount.discountPct != null
      ? formatPercent(discount.discountPct)
      : discount.discountAmt != null
        ? `$${discount.discountAmt} off`
        : null;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <Badge variant="secondary" className="font-mono">
        {discount.code}
        {savingsLabel ? ` · ${savingsLabel}` : null}
        {discount.waivesActivationFee ? " · waived activation" : null}
      </Badge>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        onClick={copyCode}
        aria-label={`Copy discount code ${discount.code}`}
        className="size-6"
      >
        {copied ? (
          <Check className="size-3 text-emerald-600" aria-hidden />
        ) : (
          <Copy className="size-3" aria-hidden />
        )}
      </Button>
    </div>
  );
}
