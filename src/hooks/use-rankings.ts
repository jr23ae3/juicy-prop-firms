"use client";

import { useQuery } from "@tanstack/react-query";

import type { ApiResponse, RankingSummary } from "@/types";

async function fetchRankings(): Promise<RankingSummary[]> {
  const response = await fetch("/api/rankings");

  if (!response.ok) {
    throw new Error("Failed to fetch rankings");
  }

  const json = (await response.json()) as ApiResponse<RankingSummary[]>;

  if (!json.success) {
    throw new Error(json.error);
  }

  return json.data;
}

export function useRankings() {
  return useQuery({
    queryKey: ["rankings"],
    queryFn: fetchRankings,
  });
}
