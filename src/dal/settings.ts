import { db } from "@/db";
import { platformSettings } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getAllSettings() {
  return db.select().from(platformSettings);
}

export async function getSetting(key: string) {
  const [row] = await db
    .select()
    .from(platformSettings)
    .where(eq(platformSettings.key, key));
  return row ?? null;
}

export async function updateSetting(key: string, value: string) {
  const [updated] = await db
    .update(platformSettings)
    .set({ value, updatedAt: new Date() })
    .where(eq(platformSettings.key, key))
    .returning();
  return updated ?? null;
}
