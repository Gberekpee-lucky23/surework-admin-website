"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { triggerNotificationRetry } from "@/dal/communications";
import { logAction } from "@/dal/audit";

export async function retryNotificationAction(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/login");

  const logId = Number(formData.get("logId"));
  if (isNaN(logId)) return { error: "Invalid log ID" };

  const result = await triggerNotificationRetry(logId);
  
  if (result.success) {
    await logAction(session.id, "retry_notification", "notification_log", logId);
  }

  revalidatePath("/admin/communications");
  return result;
}
