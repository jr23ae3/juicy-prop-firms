-- CreateEnum
CREATE TYPE "MarketType" AS ENUM ('FUTURES', 'FOREX');

-- AlterTable
ALTER TABLE "plans" ADD COLUMN "market_type" "MarketType" NOT NULL DEFAULT 'FUTURES';

-- DropIndex
DROP INDEX "plans_prop_firm_id_slug_key";

-- CreateIndex
CREATE UNIQUE INDEX "plans_prop_firm_id_slug_market_type_key" ON "plans"("prop_firm_id", "slug", "market_type");

-- CreateIndex
CREATE INDEX "plans_is_active_market_type_account_size_idx" ON "plans"("is_active", "market_type", "account_size");

-- DropIndex
DROP INDEX "plans_is_active_account_size_idx";
