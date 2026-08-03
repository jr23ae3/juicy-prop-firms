"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  createPlanAction,
  deactivateFirmAction,
  updateFirmAction,
  type AdminActionState,
} from "@/actions/admin";
import { adminInputClassName } from "@/components/admin/admin-form-fields";
import {
  PlanActiveCheckbox,
  PlanFormFields,
} from "@/components/admin/plan-form-fields";
import {
  PlanEditForm,
  PlanSummaryLine,
} from "@/components/admin/plan-edit-form";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CURRENT_RANKING_PERIOD } from "@/config/rankings";
import { cn } from "@/lib/utils";
import type { PlanFormValues } from "@/components/admin/plan-form-fields";

type PlanForAdmin = PlanFormValues & {
  id: string;
  isActive: boolean;
};

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
  plans: PlanForAdmin[];
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
            Expand a plan to edit all fields, change active status, or delete
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {firm.plans.length === 0 ? (
            <p className="text-sm text-muted-foreground">No plans yet.</p>
          ) : (
            firm.plans.map((plan) => (
              <details
                key={plan.id}
                className="group rounded-lg border border-border/60 px-4 py-3"
              >
                <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">
                        {plan.name}{" "}
                        {!plan.isActive ? (
                          <span className="text-muted-foreground">(inactive)</span>
                        ) : null}
                      </p>
                      <PlanSummaryLine plan={plan} />
                    </div>
                    <span className="text-xs text-muted-foreground group-open:hidden">
                      Click to edit
                    </span>
                  </div>
                </summary>
                <PlanEditForm firmId={firm.id} plan={plan} />
              </details>
            ))
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
            <PlanFormFields showDiscount />
            <Button type="submit" disabled={planPending}>
              {planPending ? "Adding…" : "Add plan"}
            </Button>
          </CardContent>
        </form>
      </Card>
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
