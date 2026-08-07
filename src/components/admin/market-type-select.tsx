import type { MarketType } from "@/generated/prisma/client";

import { adminSelectClassName } from "@/components/admin/admin-form-fields";
import {
  MARKET_TYPES,
  MARKET_TYPE_LABELS,
} from "@/lib/plans/market-type";
import { cn } from "@/lib/utils";

type MarketTypeSelectProps = {
  id?: string;
  name?: string;
  defaultValue?: MarketType | string;
  required?: boolean;
  className?: string;
};

export function MarketTypeSelect({
  id = "marketType",
  name = "marketType",
  defaultValue = "FUTURES",
  required = true,
  className,
}: MarketTypeSelectProps) {
  return (
    <select
      id={id}
      name={name}
      className={cn(adminSelectClassName, className)}
      required={required}
      defaultValue={defaultValue}
    >
      {MARKET_TYPES.map((marketType) => (
        <option key={marketType} value={marketType}>
          {MARKET_TYPE_LABELS[marketType]}
        </option>
      ))}
    </select>
  );
}

export function MarketTypeBadge({
  marketType,
  className,
}: {
  marketType: MarketType | string;
  className?: string;
}) {
  const label =
    marketType in MARKET_TYPE_LABELS
      ? MARKET_TYPE_LABELS[marketType as MarketType]
      : marketType;

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-primary",
        className,
      )}
    >
      {label}
    </span>
  );
}
