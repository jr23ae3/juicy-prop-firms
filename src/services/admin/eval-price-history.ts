import { decimalValuesEqual } from "@/lib/decimal";
import type { Prisma } from "@/generated/prisma/client";

type DbClient = Pick<Prisma.TransactionClient, "planEvalPriceHistory">;

export async function logEvalPriceChange(
  db: DbClient,
  input: {
    planId: string;
    evalPrice: number;
    previousEvalPrice: number | null;
    changedByUserId?: string;
  },
) {
  await db.planEvalPriceHistory.create({
    data: {
      planId: input.planId,
      evalPrice: input.evalPrice,
      previousEvalPrice: input.previousEvalPrice,
      changedByUserId: input.changedByUserId,
    },
  });
}

export const evalPricesEqual = decimalValuesEqual;
