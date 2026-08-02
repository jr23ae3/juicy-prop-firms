"use client";

import { useQuery } from "@tanstack/react-query";

import type { ApiResponse } from "@/types";
import type { SavedPlansResponse } from "@/types/user";

async function fetchSavedPlans(): Promise<SavedPlansResponse> {
  const response = await fetch("/api/user/saved-plans");

  if (response.status === 401) {
    return { planIds: [], plans: [] };
  }

  if (!response.ok) {
    throw new Error("Failed to fetch saved plans");
  }

  const json = (await response.json()) as ApiResponse<SavedPlansResponse>;
  if (!json.success) throw new Error(json.error);
  return json.data;
}

export function useSavedPlans(enabled = true) {
  return useQuery({
    queryKey: ["user", "saved-plans"],
    queryFn: fetchSavedPlans,
    enabled,
  });
}

export function useSavedPlanIds(enabled = true) {
  return useQuery({
    queryKey: ["user", "saved-plans"],
    queryFn: fetchSavedPlans,
    enabled,
    select: (data) => data.planIds,
  });
}
