"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import type { CompareFilters, CompareSortField } from "@/types/compare";
import type { PlanSummary } from "@/types/plan";

import { DiscountBadge } from "@/components/compare/discount-badge";
import { EvalTypeBadge } from "@/components/compare/eval-type-badge";
import { SavePlanButton } from "@/components/user/save-plan-button";
import {
  formatAccountSize,
  formatCompactCurrency,
  formatCurrency,
  formatMinimumDaysCompact,
  formatOptionalCurrency,
  formatProfitSplit,
  formatReturnMultiple,
} from "@/lib/format";
import { getDrawdownLabel } from "@/lib/plans/labels";
import {
  getDefaultSortDirection,
  toggleSortDirection,
} from "@/lib/plans/sort-plans";
import { cn } from "@/lib/utils";

type CompareTableProps = {
  plans: PlanSummary[];
  filters?: CompareFilters;
  onSortChange?: (filters: CompareFilters) => void;
};

const CELL = "px-2.5 py-2.5";
const FUNDED_GROUP_CLASS = "border-l border-border/60 bg-muted/20";
const FUNDED_CELL_BORDER = "border-l border-border/60";

export function CompareTable({ plans, filters, onSortChange }: CompareTableProps) {
  const sort = filters?.sort ?? "allInCost";
  const direction = filters?.direction ?? getDefaultSortDirection(sort);
  const sortable = Boolean(filters && onSortChange);

  function handleSort(field: CompareSortField) {
    if (!filters || !onSortChange) return;

    if (sort === field) {
      onSortChange({
        ...filters,
        sort: field,
        direction: toggleSortDirection(field, direction),
      });
      return;
    }

    onSortChange({
      ...filters,
      sort: field,
      direction: getDefaultSortDirection(field),
    });
  }

  return (
    <div className="hidden overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm lg:block">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1080px] border-collapse text-sm">
          <caption className="sr-only">
            Prop firm plan comparison. Click column headers to sort.
          </caption>
          <thead>
            <tr className="border-b border-border/60 bg-muted/40 text-left text-xs">
              <SortableTh
                field="firmName"
                label="Firm / Plan"
                title="Firm rank and plan details"
                sort={sort}
                direction={direction}
                sortable={sortable}
                onSort={handleSort}
                rowSpan={2}
                className="min-w-[160px]"
              />
              <SortableTh
                field="evalType"
                label="Type"
                sort={sort}
                direction={direction}
                sortable={sortable}
                onSort={handleSort}
                rowSpan={2}
              />
              <SortableTh
                field="maxDrawdown"
                label="Drawdown"
                title="Drawdown type, target, daily/max limits, minimum days"
                sort={sort}
                direction={direction}
                sortable={sortable}
                onSort={handleSort}
                rowSpan={2}
                className="min-w-[128px]"
              />
              <SortableTh
                field="evalPrice"
                label="Fees"
                title="Eval price and activation fee"
                sort={sort}
                direction={direction}
                sortable={sortable}
                onSort={handleSort}
                rowSpan={2}
                align="right"
              />
              <SortableTh
                field="allInCost"
                label="All-in"
                sort={sort}
                direction={direction}
                sortable={sortable}
                onSort={handleSort}
                rowSpan={2}
                align="right"
              />
              <th
                scope="colgroup"
                colSpan={3}
                className={cn(
                  CELL,
                  "py-2 text-center font-semibold uppercase tracking-wide text-muted-foreground",
                  FUNDED_GROUP_CLASS,
                )}
              >
                Funded
              </th>
              <SortableTh
                field="returnMultiple"
                label="Return"
                sort={sort}
                direction={direction}
                sortable={sortable}
                onSort={handleSort}
                rowSpan={2}
                align="right"
              />
              <th
                scope="col"
                rowSpan={2}
                className={cn(CELL, "font-medium")}
              >
                Code
              </th>
              <th
                scope="col"
                rowSpan={2}
                className={cn(CELL, "w-10 text-center font-medium")}
              >
                <span className="sr-only">Save</span>
              </th>
            </tr>
            <tr className="border-b border-border/60 bg-muted/30 text-left text-[11px]">
              <SortableTh
                field="daysToPayout"
                label="Pay"
                title="Minimum days to payout and max payout"
                sort={sort}
                direction={direction}
                sortable={sortable}
                onSort={handleSort}
                align="right"
                className={FUNDED_GROUP_CLASS}
                compact
              />
              <SortableTh
                field="minimumTargetGoalCushion"
                label="Cushion"
                title="Minimum target goal cushion"
                sort={sort}
                direction={direction}
                sortable={sortable}
                onSort={handleSort}
                align="right"
                compact
              />
              <SortableTh
                field="profitSplit"
                label="Split"
                title="Profit split and max funded accounts"
                sort={sort}
                direction={direction}
                sortable={sortable}
                onSort={handleSort}
                align="right"
                compact
              />
            </tr>
          </thead>
          <tbody>
            {plans.map((plan, index) => (
              <CompareTableRow key={plan.id} plan={plan} index={index} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SortableTh({
  field,
  label,
  title,
  sort,
  direction,
  sortable,
  onSort,
  align = "left",
  rowSpan,
  className,
  compact = false,
}: {
  field: CompareSortField;
  label: string;
  title?: string;
  sort: CompareSortField;
  direction: CompareFilters["direction"];
  sortable: boolean;
  onSort: (field: CompareSortField) => void;
  align?: "left" | "right";
  rowSpan?: number;
  className?: string;
  compact?: boolean;
}) {
  const isActive = sort === field;
  const padding = compact ? cn(CELL, "py-1.5") : CELL;

  if (!sortable) {
    return (
      <th
        scope="col"
        rowSpan={rowSpan}
        title={title}
        className={cn(
          padding,
          "font-medium",
          align === "right" && "text-right",
          className,
        )}
      >
        {label}
      </th>
    );
  }

  return (
    <th
      scope="col"
      rowSpan={rowSpan}
      title={title}
      aria-sort={
        isActive ? (direction === "asc" ? "ascending" : "descending") : "none"
      }
      className={cn(padding, align === "right" && "text-right", className)}
    >
      <button
        type="button"
        onClick={() => onSort(field)}
        title={title}
        className={cn(
          "group inline-flex max-w-full items-center gap-0.5 font-medium transition-colors hover:text-foreground",
          align === "right" && "ml-auto",
          isActive ? "text-foreground" : "text-muted-foreground",
        )}
      >
        <span className="truncate">{label}</span>
        <SortIcon active={isActive} direction={direction} />
      </button>
    </th>
  );
}

function SortIcon({
  active,
  direction,
}: {
  active: boolean;
  direction?: CompareFilters["direction"];
}) {
  if (active && direction === "asc") {
    return <ArrowUp className="size-3 shrink-0 text-primary" aria-hidden />;
  }

  if (active && direction === "desc") {
    return <ArrowDown className="size-3 shrink-0 text-primary" aria-hidden />;
  }

  return (
    <ArrowUpDown
      className="size-3 shrink-0 opacity-40 group-hover:opacity-70"
      aria-hidden
    />
  );
}

function CompareTableRow({
  plan,
  index,
}: {
  plan: PlanSummary;
  index: number;
}) {
  const hasDiscount = plan.pricing.savings > 0;
  const isStriped = index % 2 === 1;

  return (
    <tr
      className={cn(
        "border-b border-border/40 transition-colors last:border-0 hover:bg-primary/10",
        isStriped && "bg-muted/25",
      )}
    >
      <td className={CELL}>
        <div className="font-medium leading-snug">
          <span className="text-muted-foreground">
            #{plan.firm.rankPosition ?? "—"}{" "}
          </span>
          {plan.firm.name}
        </div>
        <div className="mt-0.5 text-xs leading-snug text-muted-foreground">
          {plan.name} · {formatAccountSize(plan.accountSize)}
        </div>
      </td>
      <td className={CELL}>
        <EvalTypeBadge evalType={plan.evalType} />
      </td>
      <td className={CELL}>
        <DrawdownCell plan={plan} />
      </td>
      <td className={cn(CELL, "text-right tabular-nums")}>
        <FeesCell plan={plan} hasDiscount={hasDiscount} />
      </td>
      <td className={cn(CELL, "text-right font-semibold text-primary tabular-nums")}>
        {formatCurrency(plan.pricing.allInCost)}
      </td>
      <td
        className={cn(CELL, "text-right tabular-nums", FUNDED_CELL_BORDER)}
      >
        <FundedPayCell plan={plan} />
      </td>
      <td className={cn(CELL, "text-right tabular-nums")}>
        {formatCompactCurrency(plan.minimumTargetGoalCushion)}
      </td>
      <td className={cn(CELL, "text-right tabular-nums")}>
        <FundedSplitCell plan={plan} />
      </td>
      <td className={cn(CELL, "text-right tabular-nums")}>
        {formatReturnMultiple(plan.pricing.returnMultiple)}
      </td>
      <td className={CELL}>
        {plan.discount ? (
          <DiscountBadge discount={plan.discount} />
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </td>
      <td className={cn(CELL, "text-center")}>
        <SavePlanButton planId={plan.id} />
      </td>
    </tr>
  );
}

function DrawdownCell({ plan }: { plan: PlanSummary }) {
  const type = getDrawdownLabel(plan.drawdownType);
  const hasLimits =
    plan.profitTarget || plan.dailyDrawdown || plan.maxDrawdown;

  return (
    <div className="leading-snug">
      <div className="font-medium">{type ?? "—"}</div>
      {hasLimits ? (
        <div className="mt-0.5 text-[11px] tabular-nums text-muted-foreground">
          {formatCompactCurrency(plan.profitTarget)} tgt ·{" "}
          {formatCompactCurrency(plan.dailyDrawdown)} day ·{" "}
          {formatCompactCurrency(plan.maxDrawdown)} max
        </div>
      ) : null}
      {plan.minimumDays ? (
        <div className="text-[11px] text-muted-foreground">
          {formatMinimumDaysCompact(plan.minimumDays)} min
        </div>
      ) : null}
    </div>
  );
}

function FeesCell({
  plan,
  hasDiscount,
}: {
  plan: PlanSummary;
  hasDiscount: boolean;
}) {
  return (
    <div className="leading-snug">
      <div>
        {hasDiscount ? (
          <>
            <span className="mr-1 text-muted-foreground line-through">
              {formatCurrency(plan.pricing.evalPrice)}
            </span>
            {formatCurrency(plan.pricing.discountedPrice)}
          </>
        ) : (
          formatCurrency(plan.pricing.evalPrice)
        )}
      </div>
      <div className="text-[11px] text-muted-foreground">
        {plan.pricing.activationFee > 0
          ? `+${formatCurrency(plan.pricing.activationFee)} act`
          : "No activation"}
      </div>
    </div>
  );
}

function FundedPayCell({ plan }: { plan: PlanSummary }) {
  return (
    <div className="leading-snug">
      <div>{formatMinimumDaysCompact(plan.minimumDaysToPayout)}</div>
      <div className="text-[11px] text-muted-foreground">
        {formatOptionalCurrency(plan.maxPayout)}
      </div>
    </div>
  );
}

function FundedSplitCell({ plan }: { plan: PlanSummary }) {
  return (
    <div className="leading-snug">
      <div>{formatProfitSplit(plan.profitSplit)}</div>
      {plan.maxFundedAccounts ? (
        <div className="text-[11px] text-muted-foreground">
          {plan.maxFundedAccounts} acct
          {plan.maxFundedAccounts === 1 ? "" : "s"}
        </div>
      ) : null}
    </div>
  );
}
