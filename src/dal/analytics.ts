import { db } from "@/db";
import { jobs, handymanProfiles, users, reviews, categories } from "@/db/schema";
import { eq, gte, desc, count, avg, and, isNull, sql } from "drizzle-orm";

export type DateRange = "7d" | "30d" | "90d" | "all";

function getRangeStart(range: DateRange): Date | null {
  if (range === "all") return null;
  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

export async function getDashboardStats() {
  const [
    totalUsersResult,
    approvedHandymenResult,
    pendingApplicationsResult,
    jobStatusResult,
  ] = await Promise.all([
    db.select({ count: count() }).from(users),
    db.select({ count: count() }).from(handymanProfiles).where(eq(handymanProfiles.applicationStatus, "approved")),
    db.select({ count: count() }).from(handymanProfiles).where(eq(handymanProfiles.applicationStatus, "pending")),
    db.select({ status: jobs.status, count: count() }).from(jobs).groupBy(jobs.status),
  ]);

  const jobsByStatus = Object.fromEntries(
    jobStatusResult.map((r) => [r.status, Number(r.count)])
  );

  return {
    totalUsers: Number(totalUsersResult[0]?.count ?? 0),
    totalApprovedHandymen: Number(approvedHandymenResult[0]?.count ?? 0),
    pendingApplications: Number(pendingApplicationsResult[0]?.count ?? 0),
    jobsByStatus,
  };
}

export async function getRecentActivity(limit = 10) {
  const [recentJobs, recentApplications, recentReviews] = await Promise.all([
    db
      .select({
        id: jobs.id,
        description: jobs.description,
        status: jobs.status,
        createdAt: jobs.createdAt,
        customerName: users.name,
      })
      .from(jobs)
      .leftJoin(users, eq(jobs.customerId, users.id))
      .orderBy(desc(jobs.createdAt))
      .limit(limit),
    db
      .select({
        userId: handymanProfiles.userId,
        profession: handymanProfiles.profession,
        applicationStatus: handymanProfiles.applicationStatus,
        submittedAt: handymanProfiles.submittedAt,
        userName: users.name,
      })
      .from(handymanProfiles)
      .innerJoin(users, eq(handymanProfiles.userId, users.id))
      .orderBy(desc(handymanProfiles.submittedAt))
      .limit(limit),
    db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
        reviewerName: users.name,
      })
      .from(reviews)
      .leftJoin(users, eq(reviews.reviewerId, users.id))
      .where(isNull(reviews.deletedAt))
      .orderBy(desc(reviews.createdAt))
      .limit(limit),
  ]);

  return { recentJobs, recentApplications, recentReviews };
}

export async function getJobsOverTime(range: DateRange = "30d") {
  const start = getRangeStart(range);
  const condition = start ? gte(jobs.createdAt, start) : undefined;

  const rows = await db
    .select({
      date: sql<string>`DATE(${jobs.createdAt})`.as("date"),
      count: count(),
    })
    .from(jobs)
    .where(condition)
    .groupBy(sql`DATE(${jobs.createdAt})`)
    .orderBy(sql`DATE(${jobs.createdAt})`);

  return rows.map((r) => ({ date: r.date, count: Number(r.count) }));
}

export async function getJobsByCategory(range: DateRange = "30d") {
  const start = getRangeStart(range);
  const condition = start ? gte(jobs.createdAt, start) : undefined;

  return db
    .select({
      categoryName: categories.name,
      count: count(),
    })
    .from(jobs)
    .leftJoin(categories, eq(jobs.categoryId, categories.id))
    .where(condition)
    .groupBy(categories.name)
    .orderBy(desc(count()));
}

export async function getApplicationsOverTime(range: DateRange = "30d") {
  const start = getRangeStart(range);
  const condition = start ? gte(handymanProfiles.submittedAt, start) : undefined;

  const rows = await db
    .select({
      date: sql<string>`DATE(${handymanProfiles.submittedAt})`.as("date"),
      status: handymanProfiles.applicationStatus,
      count: count(),
    })
    .from(handymanProfiles)
    .where(condition)
    .groupBy(sql`DATE(${handymanProfiles.submittedAt})`, handymanProfiles.applicationStatus)
    .orderBy(sql`DATE(${handymanProfiles.submittedAt})`);

  return rows;
}

export async function getTopHandymen(limit = 10) {
  return db
    .select({
      userId: handymanProfiles.userId,
      userName: users.name,
      profession: handymanProfiles.profession,
      avgRating: avg(reviews.rating),
      reviewCount: count(reviews.id),
    })
    .from(handymanProfiles)
    .innerJoin(users, eq(handymanProfiles.userId, users.id))
    .leftJoin(reviews, and(
      eq(reviews.revieweeId, handymanProfiles.userId),
      isNull(reviews.deletedAt)
    ))
    .where(eq(handymanProfiles.applicationStatus, "approved"))
    .groupBy(handymanProfiles.userId, users.name, handymanProfiles.profession)
    .orderBy(desc(avg(reviews.rating)))
    .limit(limit);
}
