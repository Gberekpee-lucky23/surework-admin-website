import { db } from "@/db";
import { jobs, jobQuotes, jobQuoteItems, payments, users, categories } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function getDisputedJobs() {
  const rows = await db
    .select({
      id: jobs.id,
      description: jobs.description,
      address: jobs.address,
      status: jobs.status,
      createdAt: jobs.createdAt,
      updatedAt: jobs.updatedAt,
      categoryName: categories.name,
      customerId: jobs.customerId,
      customerName: users.name,
      customerEmail: users.email,
      handymanId: jobs.handymanId,
      quoteId: jobs.quoteId,
    })
    .from(jobs)
    .leftJoin(categories, eq(jobs.categoryId, categories.id))
    .leftJoin(users, eq(jobs.customerId, users.id))
    .where(eq(jobs.status, "disputed"))
    .orderBy(desc(jobs.updatedAt));

  // Enrich each row with quote and payment data
  const enriched = await Promise.all(
    rows.map(async (row) => {
      let quote = null;
      let quoteItems: any[] = [];
      let payment = null;

      if (row.quoteId) {
        const [q] = await db.select().from(jobQuotes).where(eq(jobQuotes.id, row.quoteId));
        quote = q ?? null;
        if (quote) {
          quoteItems = await db
            .select()
            .from(jobQuoteItems)
            .where(eq(jobQuoteItems.quoteId, quote.id));
        }
      }

      const [p] = await db
        .select()
        .from(payments)
        .where(eq(payments.jobId, row.id));
      payment = p ?? null;

      // Get handyman name
      let handymanName = null;
      if (row.handymanId) {
        const [h] = await db
          .select({ name: users.name })
          .from(users)
          .where(eq(users.id, row.handymanId));
        handymanName = h?.name ?? null;
      }

      return { ...row, handymanName, quote, quoteItems, payment };
    }),
  );

  return enriched;
}
