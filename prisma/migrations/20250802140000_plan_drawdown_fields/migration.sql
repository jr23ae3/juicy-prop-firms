-- AlterTable
ALTER TABLE "plans" ADD COLUMN "daily_drawdown" DECIMAL(10,2),
ADD COLUMN "minimum_days" INTEGER;
