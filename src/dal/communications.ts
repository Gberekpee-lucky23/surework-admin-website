/**
 * src/dal/communications.ts
 *
 * Data access layer functions for notifications, preferences, and logs.
 */

import { db } from "@/db";
import { notifications, notificationLogs, users } from "@/db/schema";
import { eq, and, desc, sql, gte, lte, or, ilike } from "drizzle-orm";

interface GetLogsOptions {
  channel?: string;
  status?: string;
  type?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

export async function getNotificationLogs(options: GetLogsOptions = {}) {
  const { channel, status, type, search, startDate, endDate, limit = 50, offset = 0 } = options;

  let conditions: any[] = [];

  if (channel) {
    conditions.push(eq(notificationLogs.channel, channel));
  }
  if (status) {
    conditions.push(eq(notificationLogs.status, status));
  }
  if (startDate) {
    conditions.push(gte(notificationLogs.createdAt, new Date(startDate)));
  }
  if (endDate) {
    conditions.push(lte(notificationLogs.createdAt, new Date(endDate)));
  }

  let searchConditions: any[] = [];
  if (search) {
    searchConditions.push(ilike(notifications.title, `%${search}%`));
    searchConditions.push(ilike(notifications.message, `%${search}%`));
    searchConditions.push(ilike(users.email, `%${search}%`));
    searchConditions.push(ilike(users.name, `%${search}%`));
  }

  if (type) {
    conditions.push(eq(notifications.type, type));
  }

  const query = db
    .select({
      logId: notificationLogs.id,
      channel: notificationLogs.channel,
      status: notificationLogs.status,
      error: notificationLogs.error,
      retryCount: notificationLogs.retryCount,
      createdAt: notificationLogs.createdAt,
      notification: {
        id: notifications.id,
        title: notifications.title,
        message: notifications.message,
        type: notifications.type,
      },
      recipient: {
        id: users.id,
        name: users.name,
        email: users.email,
      },
    })
    .from(notificationLogs)
    .leftJoin(notifications, eq(notificationLogs.notificationId, notifications.id))
    .leftJoin(users, eq(notifications.userId, users.id))
    .where(
      and(
        ...conditions,
        searchConditions.length > 0 ? or(...searchConditions) : undefined
      )
    )
    .orderBy(desc(notificationLogs.createdAt))
    .limit(limit)
    .offset(offset);

  return query;
}

export async function getCommunicationAnalytics() {
  const channelStats = await db
    .select({
      channel: notificationLogs.channel,
      status: notificationLogs.status,
      count: sql<number>`count(*)::int`,
    })
    .from(notificationLogs)
    .groupBy(notificationLogs.channel, notificationLogs.status);

  const typeStats = await db
    .select({
      type: notifications.type,
      count: sql<number>`count(*)::int`,
    })
    .from(notifications)
    .groupBy(notifications.type);

  const [failureCountRow] = await db
    .select({
      count: sql<number>`count(*)::int`,
    })
    .from(notificationLogs)
    .where(eq(notificationLogs.status, "failed"));

  const [successCountRow] = await db
    .select({
      count: sql<number>`count(*)::int`,
    })
    .from(notificationLogs)
    .where(eq(notificationLogs.status, "success"));

  return {
    channelStats,
    typeStats,
    successCount: successCountRow?.count || 0,
    failureCount: failureCountRow?.count || 0,
  };
}

export async function triggerNotificationRetry(logId: number) {
  try {
    // BUG 5 FIX: read backend URL from env var; fallback to production domain (never localhost)
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.surework.ng";
    const res = await fetch(`${backendUrl}/api/admin/communications/retry/${logId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to trigger retry on backend.");
    }

    return await res.json();
  } catch (error: any) {
    console.error("Retry trigger failed:", error.message);
    return { success: false, error: error.message };
  }
}
