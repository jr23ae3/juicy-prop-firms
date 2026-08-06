"use client";

import { useActionState } from "react";

import {
  deletePlanAction,
  updatePlanAction,
  type AdminActionState,
} from "@/actions/admin";
import {
  PlanActiveCheckbox,
  PlanFormFields,
  type PlanFormValues,
} from "@/components/admin/plan-form-fields";
import {
  PlanFieldHistory,
  type PlanFieldHistoryEntry,
} from "@/components/admin/plan-field-history";
import { Button } from "@/components/ui/button";
import { formatAccountSize, formatCurrency } from "@/lib/format";

type PlanForAdmin = PlanFormValues & {
  id: string;
  isActive: boolean;
  evalPriceHistory: PlanFieldHistoryEntry[];
  resetFeeHistory: PlanFieldHistoryEntry[];
};

export function PlanEditForm({
  firmId,
  plan,
}: {
  firmId: string;
  plan: PlanForAdmin;
}) {
  const updateAction = updatePlanAction.bind(null, firmId, plan.id);
  const [updateState, updateFormAction, updatePending] = useActionState(
    updateAction,
    {} as AdminActionState,
  );

  return (
    <div className="space-y-4 border-t border-border/60 pt-4">
      <form action={updateFormAction} className="space-y-4">
        {updateState.error ? (
          <p role="alert" className="text-sm text-destructive">
            {updateState.error}
          </p>
        ) : null}
        {updateState.success ? (
          <p className="text-sm text-emerald-600">Plan updated.</p>
        ) : null}
        <PlanFormFields
          values={plan}
          idPrefix={plan.id}
          showDiscount
        />
        <PlanActiveCheckbox defaultChecked={plan.isActive} id={`${plan.id}-active`} />
        <div className="flex flex-wrap gap-2">
          <Button type="submit" disabled={updatePending}>
            {updatePending ? "Saving…" : "Save plan"}
          </Button>
        </div>
      </form>
      <div className="grid gap-4 sm:grid-cols-2">
        <PlanFieldHistory
          title="Eval price history"
          emptyMessage="No eval price changes recorded yet."
          history={plan.evalPriceHistory}
        />
        <PlanFieldHistory
          title="Reset fee history"
          emptyMessage="No reset fee changes recorded yet."
          history={plan.resetFeeHistory}
        />
      </div>
      <div className="flex flex-wrap gap-2 border-t border-border/40 pt-4">
        <DeletePlanButton firmId={firmId} planId={plan.id} planName={plan.name} />
      </div>
    </div>
  );
}

function DeletePlanButton({
  firmId,
  planId,
  planName,
}: {
  firmId: string;
  planId: string;
  planName: string;
}) {
  async function handleDelete() {
    const confirmed = window.confirm(
      `Permanently delete "${planName}"? This cannot be undone.`,
    );
    if (!confirmed) return;

    await deletePlanAction(firmId, planId);
  }

  return (
    <Button type="button" variant="destructive" size="sm" onClick={handleDelete}>
      Delete plan
    </Button>
  );
}

export function PlanSummaryLine({ plan }: { plan: PlanForAdmin }) {
  return (
    <p className="text-muted-foreground">
      {formatAccountSize(plan.accountSize)} · {plan.evalType} · Eval{" "}
      {formatCurrency(plan.evalPrice)} + {formatCurrency(plan.activationFee)}{" "}
      activation
      {plan.resetFee > 0 ? ` · Reset ${formatCurrency(plan.resetFee)}` : ""}
      {plan.discount?.code ? ` · Code: ${plan.discount.code}` : ""}
    </p>
  );
}
