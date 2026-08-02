"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { ApiResponse } from "@/types";
import type { SubscriptionSummary } from "@/types/subscription";

async function fetchSubscription(): Promise<SubscriptionSummary | null> {
  const response = await fetch("/api/user/subscription");

  if (response.status === 401) return null;
  if (!response.ok) throw new Error("Failed to fetch subscription");

  const json = (await response.json()) as ApiResponse<SubscriptionSummary>;
  if (!json.success) throw new Error(json.error);
  return json.data;
}

async function startCheckout(): Promise<string> {
  const response = await fetch("/api/stripe/checkout", { method: "POST" });

  if (response.status === 401) throw new Error("UNAUTHORIZED");
  if (!response.ok) {
    const json = (await response.json()) as ApiResponse<never>;
    throw new Error(json.success ? "Checkout failed" : json.error);
  }

  const json = (await response.json()) as ApiResponse<{ url: string }>;
  if (!json.success) throw new Error(json.error);
  return json.data.url;
}

async function openBillingPortal(): Promise<string> {
  const response = await fetch("/api/stripe/portal", { method: "POST" });

  if (response.status === 401) throw new Error("UNAUTHORIZED");
  if (!response.ok) {
    const json = (await response.json()) as ApiResponse<never>;
    throw new Error(json.success ? "Portal failed" : json.error);
  }

  const json = (await response.json()) as ApiResponse<{ url: string }>;
  if (!json.success) throw new Error(json.error);
  return json.data.url;
}

export function useSubscription(enabled = true) {
  return useQuery({
    queryKey: ["user", "subscription"],
    queryFn: fetchSubscription,
    enabled,
  });
}

export function useCheckout() {
  return useMutation({
    mutationFn: startCheckout,
    onSuccess: (url) => {
      window.location.href = url;
    },
  });
}

export function useBillingPortal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: openBillingPortal,
    onSuccess: (url) => {
      queryClient.invalidateQueries({ queryKey: ["user", "subscription"] });
      window.location.href = url;
    },
  });
}
