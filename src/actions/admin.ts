"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createDiscountSchema,
  createFirmSchema,
  createPlanSchema,
  parseFormBoolean,
  updateFirmSchema,
  updatePlanSchema,
} from "@/lib/validations/admin";
import { requireAdminUser } from "@/server/admin/require-admin-user";
import {
  createDiscount,
  createFirmWithRanking,
  createPlan,
  deactivateFirm,
  deactivatePlan,
  deletePlan,
  updateFirmWithRanking,
  updatePlan,
} from "@/services/admin/data-service";

export type AdminActionState = {
  error?: string;
  success?: boolean;
};

function revalidateCatalog() {
  revalidatePath("/");
  revalidatePath("/compare");
  revalidatePath("/rankings");
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin");
  revalidatePath("/admin/firms");
}

export async function createFirmAction(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdminUser();

  const parsed = createFirmSchema.safeParse({
    slug: formData.get("slug"),
    name: formData.get("name"),
    description: formData.get("description") || undefined,
    websiteUrl: formData.get("websiteUrl") || undefined,
    isActive: parseFormBoolean(formData.get("isActive")) || true,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const rankScore = formData.get("rankScore");
  const rankPosition = formData.get("rankPosition");

  try {
    const firm = await createFirmWithRanking({
      ...parsed.data,
      rankScore: rankScore ? Number(rankScore) : undefined,
      rankPosition: rankPosition ? Number(rankPosition) : undefined,
      payoutSpeed: formData.get("payoutSpeed")
        ? Number(formData.get("payoutSpeed"))
        : undefined,
      affordability: formData.get("affordability")
        ? Number(formData.get("affordability"))
        : undefined,
      ruleFriendliness: formData.get("ruleFriendliness")
        ? Number(formData.get("ruleFriendliness"))
        : undefined,
      platformQuality: formData.get("platformQuality")
        ? Number(formData.get("platformQuality"))
        : undefined,
    });

    revalidateCatalog();
    revalidatePath(`/firms/${firm.slug}`);
    redirect(`/admin/firms/${firm.id}`);
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      String((error as { digest?: string }).digest).startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }
    const message =
      error instanceof Error && error.message.includes("Unique constraint")
        ? "A firm with this slug already exists"
        : "Failed to create firm";
    return { error: message };
  }
}

export async function updateFirmAction(
  firmId: string,
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdminUser();

  const parsed = updateFirmSchema.safeParse({
    slug: formData.get("slug") || undefined,
    name: formData.get("name") || undefined,
    description: formData.get("description") || undefined,
    websiteUrl: formData.get("websiteUrl") || undefined,
    isActive: formData.has("isActive")
      ? parseFormBoolean(formData.get("isActive"))
      : undefined,
    rankScore: formData.get("rankScore") || undefined,
    rankPosition: formData.get("rankPosition") || undefined,
    payoutSpeed: formData.get("payoutSpeed") || undefined,
    affordability: formData.get("affordability") || undefined,
    ruleFriendliness: formData.get("ruleFriendliness") || undefined,
    platformQuality: formData.get("platformQuality") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    const firm = await updateFirmWithRanking(firmId, parsed.data);
    revalidateCatalog();
    revalidatePath(`/admin/firms/${firmId}`);
    revalidatePath(`/firms/${firm.slug}`);
    return { success: true };
  } catch {
    return { error: "Failed to update firm" };
  }
}

export async function createPlanAction(
  firmId: string,
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdminUser();

  const parsed = createPlanSchema.safeParse({
    propFirmId: firmId,
    slug: formData.get("slug"),
    name: formData.get("name"),
    accountSize: formData.get("accountSize"),
    evalType: formData.get("evalType"),
    evalPrice: formData.get("evalPrice"),
    activationFee: formData.get("activationFee") || 0,
    profitTarget: formData.get("profitTarget") || undefined,
    maxDrawdown: formData.get("maxDrawdown") || undefined,
    dailyDrawdown: formData.get("dailyDrawdown") || undefined,
    drawdownType: formData.get("drawdownType") || undefined,
    minimumDays: formData.get("minimumDays") || undefined,
    profitSplit: formData.get("profitSplit") || undefined,
    maxPayout: formData.get("maxPayout") || undefined,
    minimumDaysToPayout: formData.get("minimumDaysToPayout") || undefined,
    minimumTargetGoalCushion: formData.get("minimumTargetGoalCushion") || undefined,
    maxFundedAccounts: formData.get("maxFundedAccounts") || undefined,
    fundedDrawdownType: formData.get("fundedDrawdownType") || undefined,
    payoutFrequency: formData.get("payoutFrequency") || undefined,
    isActive: true,
    discountCode: formData.get("discountCode") || undefined,
    discountPct: formData.get("discountPct") || undefined,
    discountAmt: formData.get("discountAmt") || undefined,
    waivesActivationFee: parseFormBoolean(formData.get("waivesActivationFee")),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    await createPlan(parsed.data);
    revalidateCatalog();
    revalidatePath(`/admin/firms/${firmId}`);
    return { success: true };
  } catch {
    return { error: "Failed to create plan" };
  }
}

export async function updatePlanAction(
  firmId: string,
  planId: string,
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdminUser();

  const parsed = updatePlanSchema.safeParse({
    slug: formData.get("slug"),
    name: formData.get("name"),
    accountSize: formData.get("accountSize"),
    evalType: formData.get("evalType"),
    evalPrice: formData.get("evalPrice"),
    activationFee: formData.get("activationFee") || 0,
    profitTarget: formData.get("profitTarget"),
    maxDrawdown: formData.get("maxDrawdown"),
    dailyDrawdown: formData.get("dailyDrawdown"),
    drawdownType: formData.get("drawdownType"),
    minimumDays: formData.get("minimumDays"),
    profitSplit: formData.get("profitSplit"),
    maxPayout: formData.get("maxPayout"),
    minimumDaysToPayout: formData.get("minimumDaysToPayout"),
    minimumTargetGoalCushion: formData.get("minimumTargetGoalCushion"),
    maxFundedAccounts: formData.get("maxFundedAccounts"),
    fundedDrawdownType: formData.get("fundedDrawdownType"),
    payoutFrequency: formData.get("payoutFrequency"),
    isActive: formData.has("isActive")
      ? parseFormBoolean(formData.get("isActive"))
      : false,
    discountCode: formData.get("discountCode") || undefined,
    discountPct: formData.get("discountPct") || undefined,
    discountAmt: formData.get("discountAmt") || undefined,
    waivesActivationFee: parseFormBoolean(formData.get("waivesActivationFee")),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    await updatePlan(planId, parsed.data);
    revalidateCatalog();
    revalidatePath(`/admin/firms/${firmId}`);
    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error && error.message.includes("Unique constraint")
        ? "A plan with this slug already exists for this firm"
        : "Failed to update plan";
    return { error: message };
  }
}

export async function deletePlanAction(firmId: string, planId: string) {
  await requireAdminUser();

  try {
    await deletePlan(planId);
    revalidateCatalog();
    revalidatePath(`/admin/firms/${firmId}`);
  } catch {
    throw new Error("Failed to delete plan");
  }
}

export async function addDiscountAction(
  firmId: string,
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdminUser();

  const parsed = createDiscountSchema.safeParse({
    planId: formData.get("planId"),
    code: formData.get("code"),
    discountPct: formData.get("discountPct") || undefined,
    discountAmt: formData.get("discountAmt") || undefined,
    waivesActivationFee: parseFormBoolean(formData.get("waivesActivationFee")),
    isActive: true,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    await createDiscount(parsed.data);
    revalidateCatalog();
    revalidatePath(`/admin/firms/${firmId}`);
    return { success: true };
  } catch {
    return { error: "Failed to add discount" };
  }
}

export async function deactivatePlanAction(firmId: string, planId: string) {
  await requireAdminUser();
  await deactivatePlan(planId);
  revalidateCatalog();
  revalidatePath(`/admin/firms/${firmId}`);
}

export async function deactivateFirmAction(firmId: string) {
  await requireAdminUser();
  await deactivateFirm(firmId);
  revalidateCatalog();
  redirect("/admin/firms");
}
