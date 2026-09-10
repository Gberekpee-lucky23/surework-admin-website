import { db } from "@/db";
import { users, handymanProfiles, jobs } from "@/db/schema";
import { eq, desc, and, count, or, ilike, sql } from "drizzle-orm";

export type UserFilter = "all" | "customer" | "handyman" | "suspended" | "pending_verification";

export async function getUsers(filter: UserFilter = "all", page = 1, limit = 20, search = "") {
  const offset = (page - 1) * limit;

  const conditions = [];
  if (filter === "suspended") {
    conditions.push(eq(users.accountStatus, "suspended"));
  }
  if (filter === "pending_verification") {
    conditions.push(eq(users.accountStatus, "pending_verification"));
  }
  if (search) {
    conditions.push(
      or(
        ilike(users.name, `%${search}%`),
        ilike(users.email, `%${search}%`)
      )!
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [rows, [{ total }]] = await Promise.all([
    db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        profilePictureUrl: users.profilePictureUrl,
        state: users.state,
        city: users.city,
        accountStatus: users.accountStatus,
        createdAt: users.createdAt,
        // handyman profile info (null if not applied)
        handymanStatus: handymanProfiles.applicationStatus,
        profession: handymanProfiles.profession,
      })
      .from(users)
      .leftJoin(handymanProfiles, eq(handymanProfiles.userId, users.id))
      .where(whereClause)
      .orderBy(desc(users.createdAt))
      .limit(limit)
      .offset(offset),
    db.select({ total: count() }).from(users).where(whereClause),
  ]);

  // Filter by handyman/customer after join if needed
  let filtered = rows;
  if (filter === "handyman") {
    filtered = rows.filter((r) => r.handymanStatus === "approved");
  } else if (filter === "customer") {
    filtered = rows.filter((r) => r.handymanStatus !== "approved");
  }

  return {
    users: filtered,
    total: (filter === "all" || filter === "suspended" || filter === "pending_verification") ? Number(total) : filtered.length,
    page,
    limit,
    totalPages: Math.ceil(Number(total) / limit),
  };
}

export async function getUserById(id: number) {
  const [user] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      phone: users.phone,
      profilePictureUrl: users.profilePictureUrl,
      state: users.state,
      city: users.city,
      address: users.address,
      accountStatus: users.accountStatus,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .where(eq(users.id, id));

  if (!user) return null;

  const [profile] = await db
    .select()
    .from(handymanProfiles)
    .where(eq(handymanProfiles.userId, id));

  return { ...user, handymanProfile: profile ?? null };
}

export async function getUserJobsAsCustomer(userId: number) {
  return db
    .select()
    .from(jobs)
    .where(eq(jobs.customerId, userId))
    .orderBy(desc(jobs.createdAt))
    .limit(20);
}

export async function getUserJobsAsHandyman(userId: number) {
  return db
    .select()
    .from(jobs)
    .where(eq(jobs.handymanId, userId))
    .orderBy(desc(jobs.createdAt))
    .limit(20);
}

export async function suspendUser(id: number) {
  const [updated] = await db
    .update(users)
    .set({ accountStatus: "suspended", updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning();
  return updated ?? null;
}

export async function reactivateUser(id: number) {
  const [updated] = await db
    .update(users)
    .set({ accountStatus: "active", updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning();
  return updated ?? null;
}

export async function getUserCounts() {
  const [{ total }] = await db.select({ total: count() }).from(users);
  const [{ approved }] = await db
    .select({ approved: count() })
    .from(handymanProfiles)
    .where(eq(handymanProfiles.applicationStatus, "approved"));
  return { totalCustomers: Number(total), totalHandymen: Number(approved) };
}
