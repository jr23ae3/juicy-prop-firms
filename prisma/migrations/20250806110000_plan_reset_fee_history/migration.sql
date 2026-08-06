-- CreateTable
CREATE TABLE "plan_reset_fee_history" (
    "id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "reset_fee" DECIMAL(10,2) NOT NULL,
    "previous_reset_fee" DECIMAL(10,2),
    "changed_by_user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "plan_reset_fee_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "plan_reset_fee_history_plan_id_created_at_idx" ON "plan_reset_fee_history"("plan_id", "created_at" DESC);

-- AddForeignKey
ALTER TABLE "plan_reset_fee_history" ADD CONSTRAINT "plan_reset_fee_history_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plan_reset_fee_history" ADD CONSTRAINT "plan_reset_fee_history_changed_by_user_id_fkey" FOREIGN KEY ("changed_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
