"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { ApiResponse } from "@/types";
import type { UserPreferencesData } from "@/types/user";
import type { UserPreferencesInput } from "@/lib/validations/user";

async function fetchPreferences(): Promise<UserPreferencesData | null> {
  const response = await fetch("/api/user/preferences");

  if (response.status === 401) return null;
  if (!response.ok) throw new Error("Failed to fetch preferences");

  const json = (await response.json()) as ApiResponse<UserPreferencesData | null>;
  if (!json.success) throw new Error(json.error);
  return json.data;
}

async function updatePreferences(input: UserPreferencesInput) {
  const response = await fetch("/api/user/preferences", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (response.status === 401) throw new Error("UNAUTHORIZED");
  if (!response.ok) throw new Error("Failed to save preferences");

  const json = (await response.json()) as ApiResponse<UserPreferencesData>;
  if (!json.success) throw new Error(json.error);
  return json.data;
}

export function useUserPreferences(enabled = true) {
  return useQuery({
    queryKey: ["user", "preferences"],
    queryFn: fetchPreferences,
    enabled,
  });
}

export function useUpdatePreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "preferences"] });
    },
  });
}
