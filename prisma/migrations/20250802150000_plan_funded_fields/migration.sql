-- AlterTable
ALTER TABLE "plans" ADD COLUMN "minimum_days_to_payout" INTEGER,
ADD COLUMN "minimum_target_goal_cushion" DECIMAL(10,2),
ADD COLUMN "max_funded_accounts" INTEGER;
