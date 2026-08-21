import { db } from "@/db";
import { auditLogs } from "@/db/schema";

export async function logAction(
  adminId: number,
  action: string,
  targetType: string,
  targetId?: number,
  metadata?: Record<string, unknown>
) {
  try {
    await db.insert(auditLogs).values({
      adminId,
      action,
      targetType,
      targetId,
      metadata: metadata ?? null,
    });
  } catch (err) {
    // Audit logging should never crash the main action
    console.error("[audit] Failed to log action:", err);
  }
}
