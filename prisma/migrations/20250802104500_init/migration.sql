-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "EvalType" AS ENUM ('CHALLENGE', 'DIRECT_TO_FUNDED', 'INSTANT_FUNDING');

-- CreateEnum
CREATE TYPE "DrawdownType" AS ENUM ('END_OF_DAY', 'TRAILING', 'STATIC');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "supabase_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "avatar_url" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_preferences" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "trading_style" TEXT,
    "preferred_size" INTEGER,
    "max_budget" DECIMAL(10,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prop_firms" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "website_url" TEXT,
    "logo_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "rank_score" DOUBLE PRECISION,
    "rank_position" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prop_firms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plans" (
    "id" TEXT NOT NULL,
    "prop_firm_id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "account_size" INTEGER NOT NULL,
    "eval_type" "EvalType" NOT NULL,
    "eval_price" DECIMAL(10,2) NOT NULL,
    "activation_fee" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "profit_target" DECIMAL(10,2),
    "max_drawdown" DECIMAL(10,2),
    "drawdown_type" "DrawdownType",
    "profit_split" DECIMAL(5,4),
    "max_payout" DECIMAL(10,2),
    "payout_frequency" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discounts" (
    "id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "discount_pct" DECIMAL(5,4),
    "discount_amt" DECIMAL(10,2),
    "expires_at" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "verified_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "discounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "firm_rankings" (
    "id" TEXT NOT NULL,
    "prop_firm_id" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "position" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "factors" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "firm_rankings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_plans" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_plans_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_supabase_id_key" ON "users"("supabase_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_preferences_user_id_key" ON "user_preferences"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "prop_firms_slug_key" ON "prop_firms"("slug");

-- CreateIndex
CREATE INDEX "prop_firms_is_active_rank_position_idx" ON "prop_firms"("is_active", "rank_position");

-- CreateIndex
CREATE INDEX "plans_is_active_account_size_idx" ON "plans"("is_active", "account_size");

-- CreateIndex
CREATE UNIQUE INDEX "plans_prop_firm_id_slug_key" ON "plans"("prop_firm_id", "slug");

-- CreateIndex
CREATE INDEX "discounts_plan_id_is_active_idx" ON "discounts"("plan_id", "is_active");

-- CreateIndex
CREATE INDEX "firm_rankings_period_position_idx" ON "firm_rankings"("period", "position");

-- CreateIndex
CREATE UNIQUE INDEX "firm_rankings_prop_firm_id_period_key" ON "firm_rankings"("prop_firm_id", "period");

-- CreateIndex
CREATE UNIQUE INDEX "saved_plans_user_id_plan_id_key" ON "saved_plans"("user_id", "plan_id");

-- AddForeignKey
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plans" ADD CONSTRAINT "plans_prop_firm_id_fkey" FOREIGN KEY ("prop_firm_id") REFERENCES "prop_firms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discounts" ADD CONSTRAINT "discounts_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "firm_rankings" ADD CONSTRAINT "firm_rankings_prop_firm_id_fkey" FOREIGN KEY ("prop_firm_id") REFERENCES "prop_firms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_plans" ADD CONSTRAINT "saved_plans_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_plans" ADD CONSTRAINT "saved_plans_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;
