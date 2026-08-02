/**
 * Admin data management — wired up in a future milestone.
 * Validations live in @/lib/validations/admin.
 */

import type {
  CreateDiscountInput,
  CreateFirmInput,
  CreatePlanInput,
} from "@/lib/validations/admin";
import { db } from "@/lib/db";
import { isDatabaseConfigured } from "@/lib/env";

export async function createFirm(input: CreateFirmInput) {
  if (!isDatabaseConfigured()) {
    throw new Error("Database not configured");
  }

  return db.propFirm.create({ data: input });
}

export async function createPlan(input: CreatePlanInput) {
  if (!isDatabaseConfigured()) {
    throw new Error("Database not configured");
  }

  return db.plan.create({ data: input });
}

export async function createDiscount(input: CreateDiscountInput) {
  if (!isDatabaseConfigured()) {
    throw new Error("Database not configured");
  }

  return db.discount.create({ data: input });
}

export async function deactivatePlan(planId: string) {
  if (!isDatabaseConfigured()) {
    throw new Error("Database not configured");
  }

  return db.plan.update({
    where: { id: planId },
    data: { isActive: false },
  });
}
