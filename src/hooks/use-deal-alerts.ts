"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { ApiResponse } from "@/types";
import type { DealAlertSummary } from "@/types/user";
import type { DealAlertInput } from "@/lib/validations/user";

async function fetchAlerts(): Promise<DealAlertSummary[]> {
  const response = await fetch("/api/user/alerts");

  if (response.status === 401) return [];
  if (!response.ok) throw new Error("Failed to fetch alerts");

  const json = (await response.json()) as ApiResponse<DealAlertSummary[]>;
  if (!json.success) throw new Error(json.error);
  return json.data;
}

async function createAlert(input: DealAlertInput) {
  const response = await fetch("/api/user/alerts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (response.status === 401) throw new Error("UNAUTHORIZED");
  if (!response.ok) {
    const json = await response.json();
    throw new Error(json.error ?? "Failed to create alert");
  }

  const json = (await response.json()) as ApiResponse<DealAlertSummary[]>;
  if (!json.success) throw new Error(json.error);
  return json.data;
}

async function deleteAlert(alertId: string) {
  const response = await fetch(`/api/user/alerts?id=${alertId}`, {
    method: "DELETE",
  });

  if (response.status === 401) throw new Error("UNAUTHORIZED");
  if (!response.ok) throw new Error("Failed to delete alert");

  const json = (await response.json()) as ApiResponse<DealAlertSummary[]>;
  if (!json.success) throw new Error(json.error);
  return json.data;
}

export function useDealAlerts(enabled = true) {
  return useQuery({
    queryKey: ["user", "alerts"],
    queryFn: fetchAlerts,
    enabled,
  });
}

export function useCreateDealAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAlert,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "alerts"] });
    },
  });
}

export function useDeleteDealAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAlert,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "alerts"] });
    },
  });
}
