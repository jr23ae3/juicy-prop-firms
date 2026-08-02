"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

type ToggleSaveInput = {
  planId: string;
  isSaved: boolean;
};

async function toggleSavePlan({ planId, isSaved }: ToggleSaveInput) {
  const response = await fetch(
    isSaved
      ? `/api/user/saved-plans?planId=${planId}`
      : "/api/user/saved-plans",
    {
      method: isSaved ? "DELETE" : "POST",
      headers: isSaved ? undefined : { "Content-Type": "application/json" },
      body: isSaved ? undefined : JSON.stringify({ planId }),
    },
  );

  if (response.status === 401) {
    throw new Error("UNAUTHORIZED");
  }

  if (response.status === 403) {
    throw new Error("PREMIUM_REQUIRED");
  }

  if (!response.ok) {
    throw new Error("Failed to update saved plan");
  }

  return response.json();
}

export function useToggleSavePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleSavePlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "saved-plans"] });
    },
  });
}
