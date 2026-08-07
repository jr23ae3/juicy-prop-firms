"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import type { CompareFilters, CompareSortField } from "@/types/compare";
import type { PlanSummary } from "@/types/plan";

import { CalculatedValue } from "@/components/compare/calculated-value";
import { ActivationFeeDisplay } from "@/components/compare/activation-fee-display";
import { EvalTypeBadge } from "@/components/compare/eval-type-badge";
import { SavePlanButton } from "@/components/user/save-plan-button";
import { FirmLogo } from "@/components/ui/firm-logo";
import {
  formatAccountSize,
  formatCurrency,
  formatMinimumDays,
  formatOptionalCurrency,
  formatProfitSplit,
  formatReturnMultiple,
} from "@/lib/format";
import {
  getAllInCostTooltip,
  getAllInTargetTooltip,
  getReturnMultipleTooltip,
  getRiskRatioTooltip,
  getRewardRatioTooltip,
} from "@/lib/plans/calculation-tooltips";
import { getDrawdownTypeLabel } from "@/lib/plans/labels";
import { getAllInTarget, getRiskRatio, getRewardRatio } from "@/lib/plans/metrics";
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

const CELL = "px-3 py-3";
const STICKY_FIRST =
  "sticky left-0 min-w-[180px] border-r border-border/50 shadow-[2px_0_6px_-2px_rgba(0,0,0,0.08)]";

function stickyHeaderClass() {
  return cn(STICKY_FIRST, "z-[31] compare-sticky-cell--header");
}

function stickyBodyClass() {
  return cn(STICKY_FIRST, "z-[21] compare-sticky-cell");
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
    <div className="surface hidden overflow-hidden lg:block">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1180px] border-collapse text-sm">
          <caption className="sr-only">
            Prop firm plan comparison with all-in costs and funded terms.
            Click column headers to sort.
          </caption>
          <thead>
            <tr className="border-b border-border bg-background text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <SortableTh
                field="firmName"
                label="Firm / Plan"
                title="Firm rank, name, plan, and account size"
                sort={sort}
                direction={direction}
                sortable={sortable}
                onSort={handleSort}
                sticky
              />
              <SortableTh
                field="evalType"
                label="Type"
                sort={sort}
                direction={direction}
                sortable={sortable}
                onSort={handleSort}
              />
              <SortableTh
                field="maxDrawdown"
                label="Drawdown"
                title="Draw down type, target goal, daily/max limits, minimum days"
                sort={sort}
                direction={direction}
                sortable={sortable}
                onSort={handleSort}
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
                align="right"
              />
              <SortableTh
                field="allInCost"
                label="All-in"
                sort={sort}
                direction={direction}
                sortable={sortable}
                onSort={handleSort}
                align="right"
              />
              <SortableTh
                field="daysToPayout"
                label="Pay"
                title="Min days to payout and max payout"
                sort={sort}
                direction={direction}
                sortable={sortable}
                onSort={handleSort}
                align="right"
                className="compare-funded-col"
              />
              <SortableTh
                field="allInTarget"
                label="Target"
                title="Min target buffer and all-in target"
                sort={sort}
                direction={direction}
                sortable={sortable}
                onSort={handleSort}
                align="right"
              />
              <SortableTh
                field="riskRatio"
                label="Ratios"
                title="Risk ratio and reward ratio"
                sort={sort}
                direction={direction}
                sortable={sortable}
                onSort={handleSort}
                align="right"
              />
              <SortableTh
                field="profitSplit"
                label="Terms"
                title="Split %, max funded accounts, funded draw down type"
                sort={sort}
                direction={direction}
                sortable={sortable}
                onSort={handleSort}
                align="right"
              />
              <SortableTh
                field="returnMultiple"
                label="Return"
                sort={sort}
                direction={direction}
                sortable={sortable}
                onSort={handleSort}
                align="right"
              />
              <th scope="col" className={cn(CELL, "w-10 text-center font-medium")}>
                <span className="sr-only">Save</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <CompareTableRow key={plan.id} plan={plan} />
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
  className,
  sticky = false,
}: {
  field: CompareSortField;
  label: string;
  title?: string;
  sort: CompareSortField;
  direction: CompareFilters["direction"];
  sortable: boolean;
  onSort: (field: CompareSortField) => void;
  align?: "left" | "right";
  className?: string;
  sticky?: boolean;
}) {
  const isActive = sort === field;
  const stickyClass = sticky ? stickyHeaderClass() : undefined;

  if (!sortable) {
    return (
      <th
        scope="col"
        title={title}
        className={cn(
          CELL,
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
      title={title}
      aria-sort={
        isActive ? (direction === "asc" ? "ascending" : "descending") : "none"
      }
      className={cn(CELL, align === "right" && "text-right", stickyClass, className)}
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

function CompareTableRow({ plan }: { plan: PlanSummary }) {
  const hasDiscount = plan.pricing.savings > 0;

  return (
    <tr className="group compare-table-row last:border-0">
      <td className={cn(CELL, stickyBodyClass())}>
        <div className="flex items-start gap-2.5">
          <FirmLogo
            name={plan.firm.name}
            slug={plan.firm.slug}
            logoUrl={plan.firm.logoUrl}
            size="sm"
            className="mt-0.5"
          />
          <div className="min-w-0">
            <div className="font-medium leading-snug">
              <span className="text-muted-foreground">
                #{plan.firm.rankPosition ?? "—"}{" "}
              </span>
              {plan.firm.name}
            </div>
            <div className="mt-0.5 text-xs leading-snug text-muted-foreground">
              {plan.name} · {formatAccountSize(plan.accountSize)}
            </div>
          </div>
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
        <CalculatedValue tooltip={getAllInCostTooltip(plan)}>
          {formatCurrency(plan.pricing.allInCost)}
        </CalculatedValue>
      </td>
      <td className={cn(CELL, "text-right tabular-nums compare-funded-col")}>
        <FundedPayCell plan={plan} />
      </td>
      <td className={cn(CELL, "text-right tabular-nums")}>
        <FundedTargetCell plan={plan} />
      </td>
      <td className={cn(CELL, "text-right tabular-nums")}>
        <FundedRatiosCell plan={plan} />
      </td>
      <td className={cn(CELL, "text-right tabular-nums")}>
        <FundedTermsCell plan={plan} />
      </td>
      <td className={cn(CELL, "text-right tabular-nums")}>
        <CalculatedValue tooltip={getReturnMultipleTooltip(plan)}>
          {formatReturnMultiple(plan.pricing.returnMultiple)}
        </CalculatedValue>
      </td>
      <td className={cn(CELL, "text-center")}>
        <SavePlanButton planId={plan.id} />
      </td>
    </tr>
  );
}

function DrawdownCell({ plan }: { plan: PlanSummary }) {
  const type = getDrawdownTypeLabel(plan.drawdownType);
  const hasLimits =
    plan.profitTarget || plan.dailyDrawdown || plan.maxDrawdown;

  return (
    <div className="leading-snug">
      <div className="font-medium">{type ?? "—"}</div>
      {hasLimits ? (
        <div className="mt-0.5 text-[11px] tabular-nums text-muted-foreground">
          {formatOptionalCurrency(plan.profitTarget)} tgt ·{" "}
          {formatOptionalCurrency(plan.dailyDrawdown)} day ·{" "}
          {formatOptionalCurrency(plan.maxDrawdown)} max
        </div>
      ) : null}
      {plan.minimumDays ? (
        <div className="text-[11px] text-muted-foreground">
          {formatMinimumDays(plan.minimumDays)}
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
        <ActivationFeeDisplay plan={plan} />
      </div>
    </div>
  );
}

function FundedPayCell({ plan }: { plan: PlanSummary }) {
  return (
    <div className="leading-snug">
      <div>{formatMinimumDays(plan.minimumDaysToPayout)}</div>
      <div className="text-[11px] text-muted-foreground">
        {formatOptionalCurrency(plan.maxPayout)}
      </div>
    </div>
  );
}

function FundedTargetCell({ plan }: { plan: PlanSummary }) {
  const allInTarget = getAllInTarget(
    plan.profitTarget,
    plan.minimumTargetGoalCushion,
  );

  return (
    <div className="leading-snug">
      <div>{formatOptionalCurrency(plan.minimumTargetGoalCushion)}</div>
      <div className="text-[11px] text-muted-foreground">
        <CalculatedValue tooltip={getAllInTargetTooltip(plan)}>
          {formatOptionalCurrency(allInTarget)}
        </CalculatedValue>
      </div>
    </div>
  );
}

function FundedRatiosCell({ plan }: { plan: PlanSummary }) {
  const riskRatio = getRiskRatio(
    plan.maxDrawdown,
    plan.profitTarget,
    plan.minimumTargetGoalCushion,
  );
  const rewardRatio = getRewardRatio(
    plan.maxPayout,
    plan.profitTarget,
    plan.minimumTargetGoalCushion,
  );

  return (
    <div className="leading-snug">
      <div>
        <CalculatedValue tooltip={getRiskRatioTooltip(plan)}>
          {formatReturnMultiple(riskRatio)}
        </CalculatedValue>
      </div>
      <div className="text-[11px] text-muted-foreground">
        <CalculatedValue tooltip={getRewardRatioTooltip(plan)}>
          {formatReturnMultiple(rewardRatio)}
        </CalculatedValue>
      </div>
    </div>
  );
}

function FundedTermsCell({ plan }: { plan: PlanSummary }) {
  const fundedType = getDrawdownTypeLabel(plan.fundedDrawdownType);
  const accounts =
    plan.maxFundedAccounts != null && plan.maxFundedAccounts > 0
      ? `${plan.maxFundedAccounts} acct${plan.maxFundedAccounts === 1 ? "" : "s"}`
      : null;

  return (
    <div className="leading-snug">
      <div>{formatProfitSplit(plan.profitSplit)}</div>
      <div className="text-[11px] text-muted-foreground">
        {[accounts, fundedType].filter(Boolean).join(" · ") || "—"}
      </div>
    </div>
  );
}
