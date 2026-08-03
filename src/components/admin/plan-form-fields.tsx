"use client";

import { adminInputClassName, adminSelectClassName } from "@/components/admin/admin-form-fields";
import { cn } from "@/lib/utils";

export type PlanFormValues = {
  slug: string;
  name: string;
  accountSize: number;
  evalType: string;
  evalPrice: number;
  activationFee: number;
  profitTarget: number | null;
  dailyDrawdown: number | null;
  maxDrawdown: number | null;
  minimumDays: number | null;
  drawdownType: string | null;
  profitSplit: number | null;
  maxPayout: number | null;
  payoutFrequency: string | null;
  minimumDaysToPayout: number | null;
  minimumTargetGoalCushion: number | null;
  maxFundedAccounts: number | null;
  fundedDrawdownType: string | null;
  discount?: {
    code: string;
    discountPct: number | null;
    discountAmt: number | null;
    waivesActivationFee: boolean;
  } | null;
};

function formatNumber(value: number | null | undefined) {
  return value == null ? "" : String(value);
}

function FormField({
  name,
  label,
  type = "text",
  required,
  defaultValue,
  placeholder,
  step,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
  placeholder?: string;
  step?: string;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        step={step}
        className={adminInputClassName}
      />
    </div>
  );
}

export function PlanFormFields({
  values,
  idPrefix = "",
  showDiscount = true,
}: {
  values?: PlanFormValues;
  idPrefix?: string;
  showDiscount?: boolean;
}) {
  const prefix = idPrefix ? `${idPrefix}-` : "";

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          name="name"
          label="Plan name"
          required
          defaultValue={values?.name}
        />
        <FormField
          name="slug"
          label="Plan slug"
          required
          placeholder="50k-challenge"
          defaultValue={values?.slug}
        />
        <FormField
          name="accountSize"
          label="Account size"
          type="number"
          required
          defaultValue={formatNumber(values?.accountSize)}
        />
        <div className="space-y-2">
          <label htmlFor={`${prefix}evalType`} className="text-sm font-medium">
            Eval type
          </label>
          <select
            id={`${prefix}evalType`}
            name="evalType"
            className={adminSelectClassName}
            required
            defaultValue={values?.evalType ?? "CHALLENGE"}
          >
            <option value="CHALLENGE">Challenge</option>
            <option value="DIRECT_TO_FUNDED">Direct to Funded</option>
            <option value="INSTANT_FUNDING">Instant Funding</option>
          </select>
        </div>
        <FormField
          name="evalPrice"
          label="Eval price ($)"
          type="number"
          required
          defaultValue={formatNumber(values?.evalPrice)}
        />
        <FormField
          name="activationFee"
          label="Activation fee ($)"
          type="number"
          defaultValue={formatNumber(values?.activationFee ?? 0)}
        />
        <FormField
          name="profitTarget"
          label="Target goal ($)"
          type="number"
          defaultValue={formatNumber(values?.profitTarget)}
        />
        <FormField
          name="dailyDrawdown"
          label="Daily draw down ($)"
          type="number"
          defaultValue={formatNumber(values?.dailyDrawdown)}
        />
        <FormField
          name="maxDrawdown"
          label="Max draw down ($)"
          type="number"
          defaultValue={formatNumber(values?.maxDrawdown)}
        />
        <FormField
          name="minimumDays"
          label="Minimum days"
          type="number"
          defaultValue={formatNumber(values?.minimumDays)}
        />
        <div className="space-y-2">
          <label htmlFor={`${prefix}drawdownType`} className="text-sm font-medium">
            Draw down type
          </label>
          <select
            id={`${prefix}drawdownType`}
            name="drawdownType"
            className={adminSelectClassName}
            defaultValue={values?.drawdownType ?? ""}
          >
            <option value="">—</option>
            <option value="END_OF_DAY">End of Day</option>
            <option value="TRAILING">Trailing</option>
            <option value="STATIC">Static</option>
          </select>
        </div>
        <FormField
          name="profitSplit"
          label="Profit split (0.9 = 90%)"
          type="number"
          step="0.01"
          defaultValue={formatNumber(values?.profitSplit)}
        />
        <FormField
          name="maxPayout"
          label="Max payout ($)"
          type="number"
          defaultValue={formatNumber(values?.maxPayout)}
        />
        <FormField
          name="payoutFrequency"
          label="Payout frequency"
          defaultValue={values?.payoutFrequency ?? ""}
        />
      </div>
      <fieldset className="space-y-3 rounded-lg border border-border/60 p-4">
        <legend className="px-1 text-sm font-medium">Funded terms</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            name="minimumDaysToPayout"
            label="Min days to payout"
            type="number"
            defaultValue={formatNumber(values?.minimumDaysToPayout)}
          />
          <FormField
            name="minimumTargetGoalCushion"
            label="Min target goal cushion ($)"
            type="number"
            defaultValue={formatNumber(values?.minimumTargetGoalCushion)}
          />
          <FormField
            name="maxFundedAccounts"
            label="Max funded accounts"
            type="number"
            defaultValue={formatNumber(values?.maxFundedAccounts)}
          />
          <div className="space-y-2">
            <label
              htmlFor={`${prefix}fundedDrawdownType`}
              className="text-sm font-medium"
            >
              Funded draw down type
            </label>
            <select
              id={`${prefix}fundedDrawdownType`}
              name="fundedDrawdownType"
              className={adminSelectClassName}
              defaultValue={values?.fundedDrawdownType ?? ""}
            >
              <option value="">—</option>
              <option value="END_OF_DAY">End of Day</option>
              <option value="TRAILING">Trailing</option>
              <option value="STATIC">Static</option>
            </select>
          </div>
        </div>
      </fieldset>
      {showDiscount ? (
        <fieldset className="space-y-3 rounded-lg border border-border/60 p-4">
          <legend className="px-1 text-sm font-medium">
            Discount (optional — saves when code is provided)
          </legend>
          <div className="grid gap-4 sm:grid-cols-3">
            <FormField
              name="discountCode"
              label="Code"
              placeholder="JUICY"
              defaultValue={values?.discount?.code}
            />
            <FormField
              name="discountPct"
              label="Discount % (0.4 = 40%)"
              type="number"
              step="0.01"
              defaultValue={formatNumber(values?.discount?.discountPct)}
            />
            <FormField
              name="discountAmt"
              label="Or fixed amount ($)"
              type="number"
              defaultValue={formatNumber(values?.discount?.discountAmt)}
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="waivesActivationFee"
              value="true"
              defaultChecked={values?.discount?.waivesActivationFee ?? false}
              className="size-4 rounded border-input"
            />
            Waives activation fee when this code is used
          </label>
        </fieldset>
      ) : null}
    </>
  );
}

export function PlanActiveCheckbox({
  defaultChecked,
  id,
}: {
  defaultChecked: boolean;
  id?: string;
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input
        id={id}
        type="checkbox"
        name="isActive"
        value="true"
        defaultChecked={defaultChecked}
        className="size-4 rounded border-input"
      />
      Active on site
    </label>
  );
}
