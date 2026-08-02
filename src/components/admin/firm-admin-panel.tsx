"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  addDiscountAction,
  createPlanAction,
  deactivateFirmAction,
  deactivatePlanAction,
  updateFirmAction,
  type AdminActionState,
} from "@/actions/admin";
import { adminInputClassName, adminSelectClassName } from "@/components/admin/admin-form-fields";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CURRENT_RANKING_PERIOD } from "@/config/rankings";
import { formatAccountSize, formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

type FirmForAdmin = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  websiteUrl: string | null;
  isActive: boolean;
  rankScore: number | null;
  rankPosition: number | null;
  rankings: Array<{
    score: number;
    position: number;
    factors: Record<string, number> | null;
  }>;
  plans: Array<{
    id: string;
    slug: string;
    name: string;
    accountSize: number;
    evalType: string;
    evalPrice: number;
    activationFee: number;
    isActive: boolean;
    discounts: Array<{ code: string }>;
  }>;
};

export function FirmAdminPanel({ firm }: { firm: FirmForAdmin }) {
  const ranking = firm.rankings[0];
  const factors = (ranking?.factors ?? {}) as Record<string, number>;

  const updateAction = updateFirmAction.bind(null, firm.id);
  const [updateState, updateFormAction, updatePending] = useActionState(
    updateAction,
    {} as AdminActionState,
  );

  const createPlanBound = createPlanAction.bind(null, firm.id);
  const [planState, planFormAction, planPending] = useActionState(
    createPlanBound,
    {} as AdminActionState,
  );

  const discountAction = addDiscountAction.bind(null, firm.id);
  const [discountState, discountFormAction, discountPending] = useActionState(
    discountAction,
    {} as AdminActionState,
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">
            {firm.isActive ? "Active" : "Inactive"} · Period {CURRENT_RANKING_PERIOD}
          </p>
          <h1 className="text-2xl font-bold">{firm.name}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/firms/${firm.slug}`}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            target="_blank"
          >
            View public page
          </Link>
          <form action={deactivateFirmAction.bind(null, firm.id)}>
            <Button type="submit" variant="destructive" size="sm">
              Deactivate firm
            </Button>
          </form>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit firm</CardTitle>
        </CardHeader>
        <form action={updateFormAction}>
          <CardContent className="space-y-4">
            {updateState.error ? (
              <p role="alert" className="text-sm text-destructive">
                {updateState.error}
              </p>
            ) : null}
            {updateState.success ? (
              <p className="text-sm text-emerald-600">Firm updated.</p>
            ) : null}
            <div className="grid gap-4 sm:grid-cols-2">
              <Field name="name" label="Name" defaultValue={firm.name} />
              <Field name="slug" label="Slug" defaultValue={firm.slug} />
              <div className="space-y-2 sm:col-span-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  defaultValue={firm.description ?? ""}
                  className={cn(adminInputClassName, "h-auto min-h-20 py-2")}
                />
              </div>
              <Field
                name="websiteUrl"
                label="Website"
                defaultValue={firm.websiteUrl ?? ""}
              />
              <Field
                name="rankScore"
                label="Rank score"
                type="number"
                defaultValue={String(firm.rankScore ?? ranking?.score ?? "")}
              />
              <Field
                name="rankPosition"
                label="Rank position"
                type="number"
                defaultValue={String(firm.rankPosition ?? ranking?.position ?? "")}
              />
              <Field
                name="payoutSpeed"
                label="Payout speed"
                type="number"
                defaultValue={String(factors.payoutSpeed ?? "")}
              />
              <Field
                name="affordability"
                label="Affordability"
                type="number"
                defaultValue={String(factors.affordability ?? "")}
              />
              <Field
                name="ruleFriendliness"
                label="Rule friendliness"
                type="number"
                defaultValue={String(factors.ruleFriendliness ?? "")}
              />
              <Field
                name="platformQuality"
                label="Platform quality"
                type="number"
                defaultValue={String(factors.platformQuality ?? "")}
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="isActive"
                value="true"
                defaultChecked={firm.isActive}
                className="size-4 rounded border-input"
              />
              Active on site
            </label>
            <Button type="submit" disabled={updatePending}>
              {updatePending ? "Saving…" : "Save firm"}
            </Button>
          </CardContent>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Plans ({firm.plans.length})</CardTitle>
          <CardDescription>
            Active and inactive plans for this firm
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {firm.plans.length === 0 ? (
            <p className="text-sm text-muted-foreground">No plans yet.</p>
          ) : (
            <ul className="space-y-2">
              {firm.plans.map((plan) => (
                <li
                  key={plan.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/60 px-3 py-2 text-sm"
                >
                  <div>
                    <p className="font-medium">
                      {plan.name}{" "}
                      {!plan.isActive ? (
                        <span className="text-muted-foreground">(inactive)</span>
                      ) : null}
                    </p>
                    <p className="text-muted-foreground">
                      {formatAccountSize(plan.accountSize)} · {plan.evalType} ·
                      Eval {formatCurrency(plan.evalPrice)} +{" "}
                      {formatCurrency(plan.activationFee)} activation
                      {plan.discounts[0]
                        ? ` · Code: ${plan.discounts[0].code}`
                        : ""}
                    </p>
                  </div>
                  {plan.isActive ? (
                    <form action={deactivatePlanAction.bind(null, firm.id, plan.id)}>
                      <Button type="submit" variant="ghost" size="sm">
                        Deactivate
                      </Button>
                    </form>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add plan</CardTitle>
        </CardHeader>
        <form action={planFormAction}>
          <CardContent className="space-y-4">
            {planState.error ? (
              <p role="alert" className="text-sm text-destructive">
                {planState.error}
              </p>
            ) : null}
            {planState.success ? (
              <p className="text-sm text-emerald-600">Plan added.</p>
            ) : null}
            <div className="grid gap-4 sm:grid-cols-2">
              <Field name="name" label="Plan name" required />
              <Field name="slug" label="Plan slug" required placeholder="50k-challenge" />
              <Field name="accountSize" label="Account size" type="number" required />
              <div className="space-y-2">
                <label htmlFor="evalType" className="text-sm font-medium">
                  Eval type
                </label>
                <select id="evalType" name="evalType" className={adminSelectClassName} required>
                  <option value="CHALLENGE">Challenge</option>
                  <option value="DIRECT_TO_FUNDED">Direct to Funded</option>
                  <option value="INSTANT_FUNDING">Instant Funding</option>
                </select>
              </div>
              <Field name="evalPrice" label="Eval price ($)" type="number" required />
              <Field name="activationFee" label="Activation fee ($)" type="number" defaultValue="0" />
              <Field name="profitTarget" label="Target goal ($)" type="number" />
              <Field name="dailyDrawdown" label="Daily draw down ($)" type="number" />
              <Field name="maxDrawdown" label="Max draw down ($)" type="number" />
              <Field name="minimumDays" label="Minimum days" type="number" />
              <div className="space-y-2">
                <label htmlFor="drawdownType" className="text-sm font-medium">
                  Draw down type
                </label>
                <select id="drawdownType" name="drawdownType" className={adminSelectClassName}>
                  <option value="">—</option>
                  <option value="END_OF_DAY">End of Day</option>
                  <option value="TRAILING">Trailing</option>
                  <option value="STATIC">Static</option>
                </select>
              </div>
              <Field name="profitSplit" label="Profit split (0.9 = 90%)" type="number" step="0.01" />
              <Field name="maxPayout" label="Max payout ($)" type="number" />
              <Field name="payoutFrequency" label="Payout frequency" />
            </div>
            <fieldset className="space-y-3 rounded-lg border border-border/60 p-4">
              <legend className="px-1 text-sm font-medium">Funded terms</legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field name="minimumDaysToPayout" label="Min days to payout" type="number" />
                <Field name="minimumTargetGoalCushion" label="Min target goal cushion ($)" type="number" />
                <Field name="maxFundedAccounts" label="Max funded accounts" type="number" />
              </div>
            </fieldset>
            <fieldset className="space-y-3 rounded-lg border border-border/60 p-4">
              <legend className="px-1 text-sm font-medium">
                Discount (optional)
              </legend>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field name="discountCode" label="Code" placeholder="JUICY" />
                <Field name="discountPct" label="Discount % (0.4 = 40%)" type="number" step="0.01" />
                <Field name="discountAmt" label="Or fixed amount ($)" type="number" />
              </div>
            </fieldset>
            <Button type="submit" disabled={planPending}>
              {planPending ? "Adding…" : "Add plan"}
            </Button>
          </CardContent>
        </form>
      </Card>

      {firm.plans.filter((p) => p.isActive).length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Update discount on existing plan</CardTitle>
            <CardDescription>
              Replaces the current active discount for the selected plan
            </CardDescription>
          </CardHeader>
          <form action={discountFormAction}>
            <CardContent className="space-y-4">
              {discountState.error ? (
                <p role="alert" className="text-sm text-destructive">
                  {discountState.error}
                </p>
              ) : null}
              {discountState.success ? (
                <p className="text-sm text-emerald-600">Discount updated.</p>
              ) : null}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="planId" className="text-sm font-medium">
                    Plan
                  </label>
                  <select id="planId" name="planId" className={adminSelectClassName} required>
                    {firm.plans
                      .filter((p) => p.isActive)
                      .map((plan) => (
                        <option key={plan.id} value={plan.id}>
                          {plan.name}
                        </option>
                      ))}
                  </select>
                </div>
                <Field name="code" label="Code" required placeholder="JUICY" />
                <Field name="discountPct" label="Discount % (0.4 = 40%)" type="number" step="0.01" />
                <Field name="discountAmt" label="Or fixed amount ($)" type="number" />
              </div>
              <Button type="submit" disabled={discountPending}>
                {discountPending ? "Saving…" : "Save discount"}
              </Button>
            </CardContent>
          </form>
        </Card>
      ) : null}
    </div>
  );
}

function Field({
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
