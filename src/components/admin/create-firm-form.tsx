"use client";

import { useActionState } from "react";

import type { AdminActionState } from "@/actions/admin";
import { createFirmAction } from "@/actions/admin";
import { AdminFormFields } from "@/components/admin/admin-form-fields";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function CreateFirmForm() {
  const [state, formAction, isPending] = useActionState(
    createFirmAction,
    {} as AdminActionState,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Firm details</CardTitle>
        <CardDescription>
          Slug becomes the public URL: /firms/your-slug
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-6">
          {state.error ? (
            <p role="alert" className="text-sm text-destructive">
              {state.error}
            </p>
          ) : null}

          <AdminFormFields />

          <fieldset className="space-y-4 rounded-lg border border-border/60 p-4">
            <legend className="px-1 text-sm font-medium">
              Ranking (optional)
            </legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field name="rankScore" label="Score (0–100)" type="number" />
              <Field name="rankPosition" label="Position" type="number" />
              <Field name="payoutSpeed" label="Payout speed" type="number" />
              <Field name="affordability" label="Affordability" type="number" />
              <Field
                name="ruleFriendliness"
                label="Rule friendliness"
                type="number"
              />
              <Field
                name="platformQuality"
                label="Platform quality"
                type="number"
              />
            </div>
          </fieldset>

          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating…" : "Create firm"}
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}

function Field({
  name,
  label,
  type = "text",
}: {
  name: string;
  label: string;
  type?: string;
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
        className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
      />
    </div>
  );
}
