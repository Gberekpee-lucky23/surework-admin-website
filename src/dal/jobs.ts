import { db } from "@/db";
import { jobs, users, categories } from "@/db/schema";
import { eq, desc, and, count, gte, lte, ilike, inArray } from "drizzle-orm";

export type JobStatus =
  | "requested"
  | "accepted"
  | "on_the_way"
  | "site_assessment"
  | "quote_pending_approval"
  | "quote_rejected"
  | "payment_pending"
  | "in_progress"
  | "started"
  | "completed_by_handyman"
  | "awaiting_customer_confirmation"
  | "confirmed"
  | "payout_released"
  | "closed"
  | "completed"
  | "disputed"
  | "cancelled";

export interface JobFilters {
  status?: JobStatus | "all";
  categoryId?: number;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}

export async function getJobs(filters: JobFilters = {}, page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  const conditions = [];

  if (filters.status && filters.status !== "all") {
    conditions.push(eq(jobs.status, filters.status));
  }
  if (filters.categoryId) {
    conditions.push(eq(jobs.categoryId, filters.categoryId));
  }
  if (filters.dateFrom) {
    conditions.push(gte(jobs.createdAt, filters.dateFrom));
  }
  if (filters.dateTo) {
    conditions.push(lte(jobs.createdAt, filters.dateTo));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const customer = users;
  const handyman = {
    id: users.id,
    name: users.name,
    email: users.email,
  };

  const [rows, [{ total }]] = await Promise.all([
    db
      .select({
        id: jobs.id,
        status: jobs.status,
        description: jobs.description,
        address: jobs.address,
        paymentStatus: jobs.paymentStatus,
        preferredDate: jobs.preferredDate,
        createdAt: jobs.createdAt,
        updatedAt: jobs.updatedAt,
        categoryId: jobs.categoryId,
        customerId: jobs.customerId,
        handymanId: jobs.handymanId,
        categoryName: categories.name,
        customerName: users.name,
        customerEmail: users.email,
      })
      .from(jobs)
      .leftJoin(categories, eq(jobs.categoryId, categories.id))
      .leftJoin(users, eq(jobs.customerId, users.id))
      .where(whereClause)
      .orderBy(desc(jobs.createdAt))
      .limit(limit)
      .offset(offset),
    db.select({ total: count() }).from(jobs).where(whereClause),
  ]);

  return {
    jobs: rows,
    total: Number(total),
    page,
    limit,
    totalPages: Math.ceil(Number(total) / limit),
  };
}

export async function getJobById(id: number) {
  const [row] = await db
    .select({
      id: jobs.id,
      status: jobs.status,
      description: jobs.description,
      address: jobs.address,
      images: jobs.images,
      paymentStatus: jobs.paymentStatus,
      preferredDate: jobs.preferredDate,
      adminNote: jobs.adminNote,
      acceptedAt: jobs.acceptedAt,
      onTheWayAt: jobs.onTheWayAt,
      startedAt: jobs.startedAt,
      completedAt: jobs.completedAt,
      cancelledAt: jobs.cancelledAt,
      createdAt: jobs.createdAt,
      updatedAt: jobs.updatedAt,
      categoryId: jobs.categoryId,
      categoryName: categories.name,
      categoryIcon: categories.icon,
      customerId: jobs.customerId,
      customerName: users.name,
      customerEmail: users.email,
      customerPhone: users.phone,
      handymanId: jobs.handymanId,
    })
    .from(jobs)
    .leftJoin(categories, eq(jobs.categoryId, categories.id))
    .leftJoin(users, eq(jobs.customerId, users.id))
    .where(eq(jobs.id, id));

  if (!row) return null;

  // Fetch handyman separately if assigned
  let handyman = null;
  if (row.handymanId) {
    const [h] = await db
      .select({ id: users.id, name: users.name, email: users.email, phone: users.phone })
      .from(users)
      .where(eq(users.id, row.handymanId));
    handyman = h ?? null;
  }

  return { ...row, handyman };
}

import { jobStatusHistory, notifications } from "@/db/schema";

export async function cancelJob(id: number, adminId?: number) {
  const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
  if (!job) return null;

  const [updated] = await db
    .update(jobs)
    .set({ status: "cancelled", cancelledAt: new Date(), updatedAt: new Date() })
    .where(eq(jobs.id, id))
    .returning();

  if (updated) {
    await db.insert(jobStatusHistory).values({
      jobId: id,
      fromStatus: job.status,
      toStatus: "cancelled",
      actorId: adminId || null,
      note: "Cancelled by Admin Override",
    });

    // Notify customer
    await db.insert(notifications).values({
      userId: job.customerId,
      title: "Booking Cancelled",
      message: `Job #${id} has been cancelled by system administration.`,
      type: "BOOKING",
      referenceId: id,
      referenceType: "job",
      isRead: false,
    });

    // Notify handyman if assigned
    if (job.handymanId) {
      await db.insert(notifications).values({
        userId: job.handymanId,
        title: "Job Cancelled",
        message: `Assigned Job #${id} was cancelled by system administration.`,
        type: "BOOKING",
        referenceId: id,
        referenceType: "job",
        isRead: false,
      });
    }
  }

  return updated ?? null;
}

export async function updateJobNote(id: number, note: string) {
  const [updated] = await db
    .update(jobs)
    .set({ adminNote: note, updatedAt: new Date() })
    .where(eq(jobs.id, id))
    .returning();
  return updated ?? null;
}

export async function getJobStatusCounts() {
  const allJobs = await db.select({ status: jobs.status }).from(jobs);
  const counts: Record<string, number> = {
    requested:                        0,
    accepted:                         0,
    on_the_way:                       0,
    site_assessment:                  0,
    quote_pending_approval:           0,
    quote_rejected:                   0,
    payment_pending:                  0,
    in_progress:                      0,
    started:                          0,
    completed_by_handyman:            0,
    awaiting_customer_confirmation:   0,
    confirmed:                        0,
    payout_released:                  0,
    closed:                           0,
    completed:                        0,
    disputed:                         0,
    cancelled:                        0,
  };
  for (const job of allJobs) {
    if (job.status in counts) counts[job.status]++;
  }
  return counts;
}
