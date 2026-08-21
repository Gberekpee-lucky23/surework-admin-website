"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { suspendUser, reactivateUser } from "@/dal/users";
import { logAction } from "@/dal/audit";

export async function suspendUserAction(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/login");

  const userId = Number(formData.get("userId"));
  if (!userId) return { error: "Invalid user ID" };

  await suspendUser(userId);
  await logAction(session.id, "suspend_user", "user", userId);

  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${userId}`);
  return { success: true };
}

export async function reactivateUserAction(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/login");

  const userId = Number(formData.get("userId"));
  if (!userId) return { error: "Invalid user ID" };

  await reactivateUser(userId);
  await logAction(session.id, "reactivate_user", "user", userId);

  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${userId}`);
  return { success: true };
}
