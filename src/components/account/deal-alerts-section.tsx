"use client";

import { Bell, Trash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PremiumGate } from "@/components/premium/premium-gate";
import { UpgradePrompt } from "@/components/premium/upgrade-prompt";
import {
  useCreateDealAlert,
  useDealAlerts,
  useDeleteDealAlert,
} from "@/hooks/use-deal-alerts";
import { formatCurrency } from "@/lib/format";

export function DealAlertsSection() {
  const { data: alerts = [], isLoading } = useDealAlerts();
  const createAlert = useCreateDealAlert();
  const deleteAlert = useDeleteDealAlert();
  const [firmSlug, setFirmSlug] = useState("");
  const [maxAllIn, setMaxAllIn] = useState("150");
  const [label, setLabel] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    createAlert.mutate(
      {
        firmSlug: firmSlug || undefined,
        maxAllIn: maxAllIn ? Number(maxAllIn) : undefined,
        label: label || undefined,
      },
      {
        onSuccess: () => {
          setFirmSlug("");
          setLabel("");
        },
        onError: (err) => setError(err.message),
      },
    );
  }

  return (
    <PremiumGate
      feature="Deal alerts"
      fallback={
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="size-5" aria-hidden />
              Deal alerts
            </CardTitle>
            <CardDescription>
              Track price drops and get notified when deals hit your target.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UpgradePrompt feature="Deal alerts" />
          </CardContent>
        </Card>
      }
    >
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="size-5" aria-hidden />
          Deal alerts
        </CardTitle>
        <CardDescription>
          Get notified by email when prices drop below your target. Checked hourly.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="alertFirmSlug">Firm slug</Label>
            <Input
              id="alertFirmSlug"
              value={firmSlug}
              onChange={(e) => setFirmSlug(e.target.value)}
              placeholder="lucid-trading"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="alertMaxAllIn">Max all-in ($)</Label>
            <Input
              id="alertMaxAllIn"
              type="number"
              min={0}
              value={maxAllIn}
              onChange={(e) => setMaxAllIn(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="alertLabel">Label (optional)</Label>
            <Input
              id="alertLabel"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="50K challenge deal"
            />
          </div>
          <div className="sm:col-span-3">
            <Button type="submit" disabled={createAlert.isPending}>
              {createAlert.isPending ? "Creating…" : "Create alert"}
            </Button>
          </div>
        </form>

        {error ? (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        ) : null}

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading alerts…</p>
        ) : alerts.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No active alerts yet. Create one above to track price drops.
          </p>
        ) : (
          <ul className="space-y-2">
            {alerts.map((alert) => (
              <li
                key={alert.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-border/60 px-3 py-2 text-sm"
              >
                <div>
                  <p className="font-medium">
                    {alert.label ??
                      alert.plan?.firm.name ??
                      alert.firmSlug ??
                      "Price alert"}
                  </p>
                  <p className="text-muted-foreground">
                    {alert.firmSlug ? `Firm: ${alert.firmSlug}` : null}
                    {alert.maxAllIn != null
                      ? ` · Under ${formatCurrency(alert.maxAllIn)}`
                      : null}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Delete alert"
                  disabled={deleteAlert.isPending}
                  onClick={() => deleteAlert.mutate(alert.id)}
                >
                  <Trash2 className="size-4" aria-hidden />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
    </PremiumGate>
  );
}
