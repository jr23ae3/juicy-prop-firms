"use client";

import { useActionState, useEffect, useMemo } from "react";

import { createPlanAction, type AdminActionState } from "@/actions/admin";
import { adminSelectClassName } from "@/components/admin/admin-form-fields";
import {
  PlanFormFields,
  type PlanFormValues,
} from "@/components/admin/plan-form-fields";
import { Button } from "@/components/ui/button";
import { planToDuplicateTemplate } from "@/lib/admin/plan-duplicate";

type PlanForDuplicate = PlanFormValues & {
  id: string;
  isActive: boolean;
};

type AddPlanFormProps = {
  firmId: string;
  plans: PlanForDuplicate[];
  duplicateSourceId: string;
  onDuplicateSourceChange: (planId: string) => void;
};

export function AddPlanForm({
  firmId,
  plans,
  duplicateSourceId,
  onDuplicateSourceChange,
}: AddPlanFormProps) {
  const createPlanBound = createPlanAction.bind(null, firmId);
  const [planState, planFormAction, planPending] = useActionState(
    createPlanBound,
    {} as AdminActionState,
  );

  const template = useMemo(() => {
    if (!duplicateSourceId) return undefined;
    const plan = plans.find((entry) => entry.id === duplicateSourceId);
    return plan ? planToDuplicateTemplate(plan) : undefined;
  }, [duplicateSourceId, plans]);

  useEffect(() => {
    if (planState.success) {
      onDuplicateSourceChange("");
    }
  }, [planState.success, onDuplicateSourceChange]);

  return (
    <form action={planFormAction} key={duplicateSourceId || "blank"}>
      <div className="space-y-4">
        {planState.error ? (
          <p role="alert" className="text-sm text-destructive">
            {planState.error}
          </p>
        ) : null}
        {planState.success ? (
          <p className="text-sm text-emerald-600">Plan added.</p>
        ) : null}
        {plans.length > 0 ? (
          <div className="space-y-2">
            <label htmlFor="duplicateFrom" className="text-sm font-medium">
              Duplicate from existing plan
            </label>
            <select
              id="duplicateFrom"
              value={duplicateSourceId}
              onChange={(event) => onDuplicateSourceChange(event.target.value)}
              className={adminSelectClassName}
            >
              <option value="">Start blank</option>
              {plans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name}
                  {!plan.isActive ? " (inactive)" : ""}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground">
              Copies all plan fields and discount settings. Update the name and
              slug before saving.
            </p>
          </div>
        ) : null}
        <PlanFormFields values={template} showDiscount />
        <Button type="submit" disabled={planPending}>
          {planPending ? "Adding…" : "Add plan"}
        </Button>
      </div>
    </form>
  );
}
