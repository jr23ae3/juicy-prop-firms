"use client";

import { useQuery } from "@tanstack/react-query";

import {
  DEFAULT_MARKET_TYPE,
  marketTypeToParam,
} from "@/lib/plans/market-type";
import type { CompareFilterMetadata } from "@/types/compare";
import type { ApiResponse } from "@/types";
import type { MarketType } from "@/generated/prisma/client";

async function fetchCompareMetadata(
  marketType: MarketType,
): Promise<CompareFilterMetadata> {
  const response = await fetch(
    `/api/plans/metadata?market=${marketTypeToParam(marketType)}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch compare metadata");
  }

  const json = (await response.json()) as ApiResponse<CompareFilterMetadata>;

  if (!json.success) {
    throw new Error(json.error);
  }

  return json.data;
}

export function useCompareMetadata(marketType: MarketType = DEFAULT_MARKET_TYPE) {
  return useQuery({
    queryKey: ["compare-metadata", marketType],
    queryFn: () => fetchCompareMetadata(marketType),
  });
}
