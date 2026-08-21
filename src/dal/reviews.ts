import { db } from "@/db";
import { reviews, users, jobs, handymanProfiles } from "@/db/schema";
import { eq, isNull, desc, count, and, avg, ilike, gte, lte } from "drizzle-orm";

export interface ReviewFilters {
  minRating?: number;
  maxRating?: number;
  handymanSearch?: string;
  includeRemoved?: boolean;
}

export async function getReviews(
  filters: ReviewFilters = {},
  page = 1,
  limit = 20
) {
  const offset = (page - 1) * limit;

  const conditions = [];
  if (!filters.includeRemoved) {
    conditions.push(isNull(reviews.deletedAt));
  }
  if (filters.minRating) {
    conditions.push(gte(reviews.rating, filters.minRating));
  }
  if (filters.maxRating) {
    conditions.push(lte(reviews.rating, filters.maxRating));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const reviewer = users;

  const [rows, [{ total }]] = await Promise.all([
    db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
        deletedAt: reviews.deletedAt,
        jobId: reviews.jobId,
        reviewerId: reviews.reviewerId,
        revieweeId: reviews.revieweeId,
        reviewerName: users.name,
      })
      .from(reviews)
      .leftJoin(users, eq(reviews.reviewerId, users.id))
      .where(whereClause)
      .orderBy(desc(reviews.createdAt))
      .limit(limit)
      .offset(offset),
    db.select({ total: count() }).from(reviews).where(whereClause),
  ]);

  return {
    reviews: rows,
    total: Number(total),
    page,
    limit,
    totalPages: Math.ceil(Number(total) / limit),
  };
}

export async function softDeleteReview(id: number, adminId: number) {
  const [deleted] = await db
    .update(reviews)
    .set({ deletedAt: new Date(), deletedBy: adminId })
    .where(eq(reviews.id, id))
    .returning();

  if (deleted) {
    await recalculateHandymanRating(deleted.revieweeId);
  }

  return deleted ?? null;
}

export async function recalculateHandymanRating(handymanUserId: number) {
  // Recalculate average rating from non-deleted reviews and store it
  // (Currently we compute avg on the fly; if you add an avg_rating column later, update it here)
  const [result] = await db
    .select({ avgRating: avg(reviews.rating) })
    .from(reviews)
    .where(
      and(eq(reviews.revieweeId, handymanUserId), isNull(reviews.deletedAt))
    );

  return result?.avgRating ? Number(result.avgRating) : null;
}

export async function getHandymanRating(handymanUserId: number) {
  const [result] = await db
    .select({ avgRating: avg(reviews.rating), total: count() })
    .from(reviews)
    .where(
      and(eq(reviews.revieweeId, handymanUserId), isNull(reviews.deletedAt))
    );

  return {
    avgRating: result?.avgRating ? Number(Number(result.avgRating).toFixed(1)) : null,
    total: Number(result?.total ?? 0),
  };
}
