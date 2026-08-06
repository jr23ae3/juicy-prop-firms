"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import type { CompareFilters, CompareSortField } from "@/types/compare";
import type { PlanSummary } from "@/types/plan";

import { CalculatedValue } from "@/components/compare/calculated-value";
import { DiscountBadge } from "@/components/compare/discount-badge";
import { ActivationFeeDisplay } from "@/components/compare/activation-fee-display";
import { EvalTypeBadge } from "@/components/compare/eval-type-badge";
import { SavePlanButton } from "@/components/user/save-plan-button";
import {
  formatAccountSize,
  formatCurrency,
  formatMinimumDays,
  formatOptionalCount,
  formatOptionalCurrency,
  formatProfitSplit,
  formatReturnMultiple,
} from "@/lib/format";
import { getDrawdownTypeLabel } from "@/lib/plans/labels";
import {
  getAllInCostTooltip,
  getAllInTargetTooltip,
  getReturnMultipleTooltip,
  getRiskRatioTooltip,
  getRiskRewardTooltip,
} from "@/lib/plans/calculation-tooltips";
import { getAllInTarget, getRiskRatio, getRiskReward } from "@/lib/plans/metrics";
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

const FUNDED_GROUP_CLASS = "compare-funded-border compare-funded-group-header";
const FUNDED_HEADER_SUB_CLASS = "compare-funded-header-sub";
const FUNDED_CELL_BORDER = "compare-funded-border";

function fundedBodyClass(striped: boolean, isFirst = false) {
  return cn(
    isFirst && FUNDED_CELL_BORDER,
    striped ? "compare-funded-cell--striped" : "compare-funded-cell",
    "transition-colors",
  );
}

type StickyColumn = "rank" | "firm" | "plan";

const STICKY_Z_INDEX: Record<StickyColumn, string> = {
  rank: "z-[21]",
  firm: "z-[22]",
  plan: "z-[23]",
};

const STICKY_HEADER_Z_INDEX: Record<StickyColumn, string> = {
  rank: "z-[31]",
  firm: "z-[32]",
  plan: "z-[33]",
};

const STICKY_COLUMN_CLASS: Record<StickyColumn, string> = {
  rank: "sticky left-0 min-w-[52px] w-[52px]",
  firm: "sticky left-[52px] min-w-[128px] w-[128px]",
  plan: "sticky left-[180px] min-w-[152px] w-[152px] border-r border-border/60 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.12)]",
};

function stickyHeaderClass(column: StickyColumn) {
  return cn(
    STICKY_COLUMN_CLASS[column],
    STICKY_HEADER_Z_INDEX[column],
    "compare-sticky-cell--header",
  );
}

function stickyBodyClass(column: StickyColumn, striped: boolean) {
  return cn(
    STICKY_COLUMN_CLASS[column],
    STICKY_Z_INDEX[column],
    striped ? "compare-sticky-cell--striped" : "compare-sticky-cell",
    "transition-colors",
  );
}

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
        <table className="w-full min-w-[2360px] border-collapse text-sm">
          <caption className="sr-only">
            Prop firm plan comparison with all-in costs, funded terms, and
            discount codes. Click column headers to sort.
          </caption>
          <thead>
            <tr className="border-b border-border/60 bg-muted/40 text-left">
              <SortableTh
                field="firmRank"
                label="Rank"
                sort={sort}
                direction={direction}
                sortable={sortable}
                onSort={handleSort}
                rowSpan={2}
                stickyColumn="rank"
              />
              <SortableTh
                field="firmName"
                label="Firm"
                sort={sort}
                direction={direction}
                sortable={sortable}
                onSort={handleSort}
                rowSpan={2}
                stickyColumn="firm"
              />
              <SortableTh
                field="accountSize"
                label="Plan"
                sort={sort}
                direction={direction}
                sortable={sortable}
                onSort={handleSort}
                rowSpan={2}
                stickyColumn="plan"
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
                field="drawdownType"
                label="Draw Down Type"
                sort={sort}
                direction={direction}
                sortable={sortable}
                onSort={handleSort}
                rowSpan={2}
              />
              <SortableTh
                field="profitTarget"
                label="Target Goal"
                sort={sort}
                direction={direction}
                sortable={sortable}
                onSort={handleSort}
                rowSpan={2}
                align="right"
              />
              <SortableTh
                field="dailyDrawdown"
                label="Daily Draw Down"
                sort={sort}
                direction={direction}
                sortable={sortable}
                onSort={handleSort}
                rowSpan={2}
                align="right"
              />
              <SortableTh
                field="maxDrawdown"
                label="Max Draw Down"
                sort={sort}
                direction={direction}
                sortable={sortable}
                onSort={handleSort}
                rowSpan={2}
                align="right"
              />
              <SortableTh
                field="minimumDays"
                label="Minimum Day"
                sort={sort}
                direction={direction}
                sortable={sortable}
                onSort={handleSort}
                rowSpan={2}
                align="right"
              />
              <SortableTh
                field="evalPrice"
                label="Eval"
                sort={sort}
                direction={direction}
                sortable={sortable}
                onSort={handleSort}
                rowSpan={2}
                align="right"
              />
              <SortableTh
                field="activationFee"
                label="Activation"
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
                colSpan={9}
                className={cn(
                  "px-4 py-2 text-center text-xs font-semibold uppercase tracking-wide",
                  FUNDED_GROUP_CLASS,
                )}
              >
                Funded
              </th>
              <th scope="col" rowSpan={2} className="px-4 py-3 font-medium">
                Code
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
                className="px-4 py-3 text-center font-medium"
              >
                <span className="sr-only">Save</span>
              </th>
            </tr>
            <tr className="border-b border-border/60 text-left text-xs">
              <SortableTh
                field="daysToPayout"
                label="Min Days to Payout"
                sort={sort}
                direction={direction}
                sortable={sortable}
                onSort={handleSort}
                align="right"
                className={cn(FUNDED_CELL_BORDER, FUNDED_HEADER_SUB_CLASS)}
                compact
              />
              <SortableTh
                field="minimumTargetGoalCushion"
                label="Min Target Buffer"
                sort={sort}
                direction={direction}
                sortable={sortable}
                onSort={handleSort}
                align="right"
                className={FUNDED_HEADER_SUB_CLASS}
                compact
              />
              <SortableTh
                field="allInTarget"
                label="All-in Target"
                sort={sort}
                direction={direction}
                sortable={sortable}
                onSort={handleSort}
                align="right"
                className={FUNDED_HEADER_SUB_CLASS}
                compact
              />
              <SortableTh
                field="maxPayout"
                label="Max Payout"
                sort={sort}
                direction={direction}
                sortable={sortable}
                onSort={handleSort}
                align="right"
                className={FUNDED_HEADER_SUB_CLASS}
                compact
              />
              <SortableTh
                field="riskRatio"
                label="Risk Ratio"
                sort={sort}
                direction={direction}
                sortable={sortable}
                onSort={handleSort}
                align="right"
                className={FUNDED_HEADER_SUB_CLASS}
                compact
              />
              <SortableTh
                field="riskReward"
                label="Risk Reward"
                sort={sort}
                direction={direction}
                sortable={sortable}
                onSort={handleSort}
                align="right"
                className={FUNDED_HEADER_SUB_CLASS}
                compact
              />
              <SortableTh
                field="maxFundedAccounts"
                label="Max Funded Accounts"
                sort={sort}
                direction={direction}
                sortable={sortable}
                onSort={handleSort}
                align="right"
                className={FUNDED_HEADER_SUB_CLASS}
                compact
              />
              <SortableTh
                field="profitSplit"
                label="Split %"
                sort={sort}
                direction={direction}
                sortable={sortable}
                onSort={handleSort}
                align="right"
                className={FUNDED_HEADER_SUB_CLASS}
                compact
              />
              <SortableTh
                field="fundedDrawdownType"
                label="Funded Draw Down Type"
                sort={sort}
                direction={direction}
                sortable={sortable}
                onSort={handleSort}
                align="left"
                className={FUNDED_HEADER_SUB_CLASS}
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
  sort,
  direction,
  sortable,
  onSort,
  align = "left",
  rowSpan,
  className,
  compact = false,
  stickyColumn,
}: {
  field: CompareSortField;
  label: string;
  sort: CompareSortField;
  direction: CompareFilters["direction"];
  sortable: boolean;
  onSort: (field: CompareSortField) => void;
  align?: "left" | "right";
  rowSpan?: number;
  className?: string;
  compact?: boolean;
  stickyColumn?: StickyColumn;
}) {
  const isActive = sort === field;
  const padding = compact ? "px-4 py-2" : "px-4 py-3";
  const stickyClass = stickyColumn ? stickyHeaderClass(stickyColumn) : undefined;

  if (!sortable) {
    return (
      <th
        scope="col"
        rowSpan={rowSpan}
        className={cn(
          padding,
          "font-medium",
          align === "right" && "text-right",
          stickyClass,
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
      aria-sort={
        isActive ? (direction === "asc" ? "ascending" : "descending") : "none"
      }
      className={cn(
        padding,
        align === "right" && "text-right",
        stickyClass,
        className,
      )}
    >
      <button
        type="button"
        onClick={() => onSort(field)}
        className={cn(
          "group inline-flex max-w-full items-center gap-1 font-medium transition-colors hover:text-foreground",
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
    return <ArrowUp className="size-3.5 shrink-0 text-primary" aria-hidden />;
  }

  if (active && direction === "desc") {
    return <ArrowDown className="size-3.5 shrink-0 text-primary" aria-hidden />;
  }

  return (
    <ArrowUpDown
      className="size-3.5 shrink-0 opacity-40 group-hover:opacity-70"
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
        "group border-b border-border/40 transition-colors last:border-0 hover:bg-primary/10",
        isStriped && "bg-muted/25",
      )}
    >
      <td className={cn("px-4 py-3 text-muted-foreground", stickyBodyClass("rank", isStriped))}>
        #{plan.firm.rankPosition ?? "—"}
      </td>
      <td className={cn("px-4 py-3 font-medium", stickyBodyClass("firm", isStriped))}>
        <span className="block truncate">{plan.firm.name}</span>
      </td>
      <td className={cn("px-4 py-3", stickyBodyClass("plan", isStriped))}>
        <div className="truncate">{plan.name}</div>
        <div className="text-xs text-muted-foreground">
          {formatAccountSize(plan.accountSize)}
        </div>
      </td>
      <td className="px-4 py-3">
        <EvalTypeBadge evalType={plan.evalType} />
      </td>
      <td className="px-4 py-3">
        {getDrawdownTypeLabel(plan.drawdownType) ?? (
          <span className="text-muted-foreground">—</span>
        )}
      </td>
      <td className="px-4 py-3 text-right tabular-nums">
        {formatOptionalCurrency(plan.profitTarget)}
      </td>
      <td className="px-4 py-3 text-right tabular-nums">
        {formatOptionalCurrency(plan.dailyDrawdown)}
      </td>
      <td className="px-4 py-3 text-right tabular-nums">
        {formatOptionalCurrency(plan.maxDrawdown)}
      </td>
      <td className="px-4 py-3 text-right tabular-nums">
        {formatMinimumDays(plan.minimumDays)}
      </td>
      <td className="px-4 py-3 text-right tabular-nums">
        {hasDiscount ? (
          <>
            <span className="mr-1.5 text-muted-foreground line-through">
              {formatCurrency(plan.pricing.evalPrice)}
            </span>
            <span>{formatCurrency(plan.pricing.discountedPrice)}</span>
          </>
        ) : (
          formatCurrency(plan.pricing.evalPrice)
        )}
      </td>
      <td className="px-4 py-3 text-right tabular-nums">
        <ActivationFeeDisplay plan={plan} />
      </td>
      <td className="px-4 py-3 text-right font-semibold text-primary tabular-nums">
        <CalculatedValue tooltip={getAllInCostTooltip(plan)}>
          {formatCurrency(plan.pricing.allInCost)}
        </CalculatedValue>
      </td>
      <td className={cn("px-4 py-3 text-right tabular-nums", fundedBodyClass(isStriped, true))}>
        {formatMinimumDays(plan.minimumDaysToPayout)}
      </td>
      <td className={cn("px-4 py-3 text-right tabular-nums", fundedBodyClass(isStriped))}>
        {formatOptionalCurrency(plan.minimumTargetGoalCushion)}
      </td>
      <td className={cn("px-4 py-3 text-right tabular-nums", fundedBodyClass(isStriped))}>
        <CalculatedValue tooltip={getAllInTargetTooltip(plan)}>
          {formatOptionalCurrency(
            getAllInTarget(plan.profitTarget, plan.minimumTargetGoalCushion),
          )}
        </CalculatedValue>
      </td>
      <td className={cn("px-4 py-3 text-right tabular-nums", fundedBodyClass(isStriped))}>
        {formatOptionalCurrency(plan.maxPayout)}
      </td>
      <td className={cn("px-4 py-3 text-right tabular-nums", fundedBodyClass(isStriped))}>
        <CalculatedValue tooltip={getRiskRatioTooltip(plan)}>
          {formatReturnMultiple(
            getRiskRatio(
              plan.maxDrawdown,
              plan.profitTarget,
              plan.minimumTargetGoalCushion,
            ),
          )}
        </CalculatedValue>
      </td>
      <td className={cn("px-4 py-3 text-right tabular-nums", fundedBodyClass(isStriped))}>
        <CalculatedValue tooltip={getRiskRewardTooltip(plan)}>
          {formatReturnMultiple(
            getRiskReward(
              plan.maxPayout,
              plan.profitTarget,
              plan.minimumTargetGoalCushion,
            ),
          )}
        </CalculatedValue>
      </td>
      <td className={cn("px-4 py-3 text-right tabular-nums", fundedBodyClass(isStriped))}>
        {formatOptionalCount(plan.maxFundedAccounts)}
      </td>
      <td className={cn("px-4 py-3 text-right tabular-nums", fundedBodyClass(isStriped))}>
        {formatProfitSplit(plan.profitSplit)}
      </td>
      <td className={cn("px-4 py-3", fundedBodyClass(isStriped))}>
        {getDrawdownTypeLabel(plan.fundedDrawdownType) ?? (
          <span className="text-muted-foreground">—</span>
        )}
      </td>
      <td className="px-4 py-3">
        {plan.discount ? (
          <DiscountBadge discount={plan.discount} />
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </td>
      <td className="px-4 py-3 text-right tabular-nums">
        <CalculatedValue tooltip={getReturnMultipleTooltip(plan)}>
          {formatReturnMultiple(plan.pricing.returnMultiple)}
        </CalculatedValue>
      </td>
      <td className="px-4 py-3 text-center">
        <SavePlanButton planId={plan.id} />
      </td>
    </tr>
  );
}
