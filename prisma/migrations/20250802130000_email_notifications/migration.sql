-- CreateEnum
CREATE TYPE "EmailType" AS ENUM ('DEAL_ALERT', 'WELCOME', 'SUBSCRIPTION_CONFIRMATION');

-- CreateEnum
CREATE TYPE "EmailStatus" AS ENUM ('SENT', 'FAILED');

-- AlterTable
ALTER TABLE "deal_alerts" ADD COLUMN "last_notified_at" TIMESTAMP(3),
ADD COLUMN "last_notified_all_in" DECIMAL(10,2);

-- CreateTable
CREATE TABLE "email_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "deal_alert_id" TEXT,
    "type" "EmailType" NOT NULL,
    "to_email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "status" "EmailStatus" NOT NULL DEFAULT 'SENT',
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "email_logs_user_id_type_idx" ON "email_logs"("user_id", "type");

-- CreateIndex
CREATE INDEX "email_logs_deal_alert_id_idx" ON "email_logs"("deal_alert_id");

-- AddForeignKey
ALTER TABLE "email_logs" ADD CONSTRAINT "email_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_logs" ADD CONSTRAINT "email_logs_deal_alert_id_fkey" FOREIGN KEY ("deal_alert_id") REFERENCES "deal_alerts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
