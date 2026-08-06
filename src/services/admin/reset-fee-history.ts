import type { Prisma } from "@/generated/prisma/client";

type DbClient = Pick<Prisma.TransactionClient, "planResetFeeHistory">;

export async function logResetFeeChange(
  db: DbClient,
  input: {
    planId: string;
    resetFee: number;
    previousResetFee: number | null;
    changedByUserId?: string;
  },
) {
  await db.planResetFeeHistory.create({
    data: {
      planId: input.planId,
      resetFee: input.resetFee,
      previousResetFee: input.previousResetFee,
      changedByUserId: input.changedByUserId,
    },
  });
}
