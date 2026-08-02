-- AlterTable
ALTER TABLE "user_preferences" ADD COLUMN "experience_level" TEXT,
ADD COLUMN "eval_type_preference" TEXT,
ADD COLUMN "priority" TEXT,
ADD COLUMN "alerts_enabled" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "deal_alerts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "plan_id" TEXT,
    "firm_slug" TEXT,
    "max_all_in" DECIMAL(10,2),
    "label" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "deal_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "deal_alerts_user_id_is_active_idx" ON "deal_alerts"("user_id", "is_active");

-- AddForeignKey
ALTER TABLE "deal_alerts" ADD CONSTRAINT "deal_alerts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deal_alerts" ADD CONSTRAINT "deal_alerts_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;
