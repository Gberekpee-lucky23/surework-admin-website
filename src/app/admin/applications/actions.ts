"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { approveApplication, rejectApplication, toggleVerifyBankDetails } from "@/dal/applications";
import { logAction } from "@/dal/audit";
import crypto from "crypto";
import { db } from "@/db";
import { handymanGuarantors, handymanProfiles, users, categories } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

export async function approveApplicationAction(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/login");

  const userId = Number(formData.get("userId"));
  if (!userId) return { error: "Invalid user ID" };

  try {
    const updated = await approveApplication(userId, session.id);
    if (!updated) return { error: "Application not found" };

    await logAction(session.id, "approve_application", "handyman_profile", userId, {
      profession: updated.profession,
    });

    revalidatePath("/admin/applications");
    revalidatePath(`/admin/applications/${userId}`);
    revalidatePath("/admin");

    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to approve application" };
  }
}

export async function rejectApplicationAction(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/login");

  const userId = Number(formData.get("userId"));
  const reason = (formData.get("reason") as string)?.trim();

  if (!userId) return { error: "Invalid user ID" };
  if (!reason) return { error: "A rejection reason is required." };

  const updated = await rejectApplication(userId, session.id, reason);
  if (!updated) return { error: "Application not found" };

  await logAction(session.id, "reject_application", "handyman_profile", userId, {
    reason,
  });

  revalidatePath("/admin/applications");
  revalidatePath(`/admin/applications/${userId}`);
  revalidatePath("/admin");

  return { success: true };
}

export async function toggleBankVerificationAction(userId: number, isVerified: boolean) {
  const session = await getSession();
  if (!session) redirect("/login");

  await toggleVerifyBankDetails(userId, isVerified);

  await logAction(session.id, "verify_bank_details", "handyman_bank_details", userId, {
    isVerified,
  });

  revalidatePath(`/admin/applications/${userId}`);
  return { success: true };
}

export async function resendGuarantorLinkAction(userId: number) {
  const session = await getSession();
  if (!session) redirect("/login");

  const [guarantor] = await db
    .select()
    .from(handymanGuarantors)
    .where(eq(handymanGuarantors.handymanId, userId));

  if (!guarantor) {
    return { error: "Guarantor record not found" };
  }

  const newToken = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days

  await db
    .update(handymanGuarantors)
    .set({
      confirmationToken: newToken,
      tokenExpiresAt: expiresAt,
      confirmationStatus: "pending",
    })
    .where(eq(handymanGuarantors.id, guarantor.id));

  await logAction(session.id, "resend_guarantor_link", "handyman_guarantors", userId, {
    guarantorEmail: guarantor.email,
  });

  revalidatePath(`/admin/applications/${userId}`);
  return { success: true, message: `Guarantor link resent to ${guarantor.email}` };
}
