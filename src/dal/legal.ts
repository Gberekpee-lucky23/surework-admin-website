/**
 * src/dal/legal.ts
 *
 * Data Access Layer for Legal Documents & Terms management in Surework Admin.
 */

import { db } from "@/db";
import { legalDocuments, userTermsAcceptances, emailJobs, users, handymanProfiles } from "@/db/schema";
import { eq, and, desc, sql, count } from "drizzle-orm";

export const DOCUMENT_CONFIG = [
  {
    type: "terms_and_conditions",
    title: "Terms and Conditions",
    route: "terms",
    description: "Master user agreement covering account usage, bookings, disclaimers, and Nigerian legal compliance.",
    audience: "All Users (Customers & Handymen)",
    requiredFor: "All Users",
  },
  {
    type: "privacy_policy",
    title: "Privacy Policy",
    route: "privacy",
    description: "Data protection policy compliant with Nigeria Data Protection Act, 2023 (NDPA) and GAID 2025.",
    audience: "All Users (Customers & Handymen)",
    requiredFor: "All Users",
  },
  {
    type: "customer_terms",
    title: "Customer Terms of Service",
    route: "customer-terms",
    description: "Rules governing service seekers, escrow protection, on-site inspections, and cancellations.",
    audience: "Customers",
    requiredFor: "All Users (dual-role for Handymen)",
  },
  {
    type: "handyman_terms",
    title: "Handyman & Service Provider Agreement",
    route: "handyman-terms",
    description: "Professional standards, payout conditions, non-circumvention rules, and artisan code of conduct.",
    audience: "Handymen & Artisans",
    requiredFor: "Approved Handymen Only",
  },
] as const;

export type LegalDocType = (typeof DOCUMENT_CONFIG)[number]["type"];

export async function getAllLegalSummaries() {
  const summaries = [];

  for (const config of DOCUMENT_CONFIG) {
    // 1. Get latest published version
    const [published] = await db
      .select()
      .from(legalDocuments)
      .where(
        and(
          eq(legalDocuments.documentType, config.type),
          eq(legalDocuments.status, "published")
        )
      )
      .orderBy(desc(legalDocuments.version))
      .limit(1);

    // 2. Check for draft version
    const [draft] = await db
      .select()
      .from(legalDocuments)
      .where(
        and(
          eq(legalDocuments.documentType, config.type),
          eq(legalDocuments.status, "draft")
        )
      )
      .limit(1);

    // 3. Count total versions
    const [vCount] = await db
      .select({ count: count() })
      .from(legalDocuments)
      .where(eq(legalDocuments.documentType, config.type));

    // 4. Count total acceptances for current published version
    let acceptanceCount = 0;
    if (published) {
      const [aCount] = await db
        .select({ count: count() })
        .from(userTermsAcceptances)
        .where(
          and(
            eq(userTermsAcceptances.documentType, config.type),
            eq(userTermsAcceptances.version, published.version)
          )
        );
      acceptanceCount = Number(aCount?.count || 0);
    }

    summaries.push({
      ...config,
      published: published || null,
      draft: draft || null,
      totalVersions: Number(vCount?.count || 0),
      currentVersionAcceptances: acceptanceCount,
    });
  }

  return summaries;
}

export async function getLegalDocumentDetails(documentType: string) {
  const config = DOCUMENT_CONFIG.find((c) => c.type === documentType);
  if (!config) return null;

  // 1. Current published
  const [published] = await db
    .select()
    .from(legalDocuments)
    .where(
      and(
        eq(legalDocuments.documentType, documentType),
        eq(legalDocuments.status, "published")
      )
    )
    .orderBy(desc(legalDocuments.version))
    .limit(1);

  // 2. Draft
  const [draft] = await db
    .select()
    .from(legalDocuments)
    .where(
      and(
        eq(legalDocuments.documentType, documentType),
        eq(legalDocuments.status, "draft")
      )
    )
    .limit(1);

  // 3. Version history
  const history = await db
    .select()
    .from(legalDocuments)
    .where(eq(legalDocuments.documentType, documentType))
    .orderBy(desc(legalDocuments.version));

  // 4. Acceptances count
  let acceptancesCount = 0;
  if (published) {
    const [aCount] = await db
      .select({ count: count() })
      .from(userTermsAcceptances)
      .where(
        and(
          eq(userTermsAcceptances.documentType, documentType),
          eq(userTermsAcceptances.version, published.version)
        )
      );
    acceptancesCount = Number(aCount?.count || 0);
  }

  // 5. Total active eligible users count
  let totalEligibleUsers = 0;
  if (documentType === "handyman_terms") {
    const [hCount] = await db
      .select({ count: count() })
      .from(handymanProfiles)
      .where(eq(handymanProfiles.applicationStatus, "approved"));
    totalEligibleUsers = Number(hCount?.count || 0);
  } else {
    const [uCount] = await db
      .select({ count: count() })
      .from(users)
      .where(sql`${users.accountStatus} != 'suspended'`);
    totalEligibleUsers = Number(uCount?.count || 0);
  }

  return {
    config,
    published: published || null,
    draft: draft || null,
    history,
    acceptancesCount,
    totalEligibleUsers,
  };
}

export async function saveLegalDraft(
  documentType: string,
  title: string,
  content: string,
  changelog?: string,
  adminId?: number
) {
  const existingDraft = await db
    .select()
    .from(legalDocuments)
    .where(
      and(
        eq(legalDocuments.documentType, documentType),
        eq(legalDocuments.status, "draft")
      )
    )
    .limit(1);

  if (existingDraft[0]) {
    const [updated] = await db
      .update(legalDocuments)
      .set({
        title,
        content,
        changelog: changelog !== undefined ? changelog : existingDraft[0].changelog,
        updatedAt: new Date(),
      })
      .where(eq(legalDocuments.id, existingDraft[0].id))
      .returning();
    return updated;
  }

  // Get next version number
  const [latest] = await db
    .select({ version: legalDocuments.version })
    .from(legalDocuments)
    .where(eq(legalDocuments.documentType, documentType))
    .orderBy(desc(legalDocuments.version))
    .limit(1);

  const nextVersion = (latest?.version || 0) + 1;

  const [created] = await db
    .insert(legalDocuments)
    .values({
      documentType,
      title,
      version: nextVersion,
      content,
      changelog: changelog || null,
      status: "draft",
      createdBy: adminId || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return created;
}

export async function publishLegalDocument(
  documentType: string,
  changelog?: string,
  adminId?: number
) {
  // Find current draft
  const [draft] = await db
    .select()
    .from(legalDocuments)
    .where(
      and(
        eq(legalDocuments.documentType, documentType),
        eq(legalDocuments.status, "draft")
      )
    )
    .limit(1);

  let targetDoc = draft;

  if (!targetDoc) {
    // If no draft exists, clone latest published into next version
    const [latest] = await db
      .select()
      .from(legalDocuments)
      .where(
        and(
          eq(legalDocuments.documentType, documentType),
          eq(legalDocuments.status, "published")
        )
      )
      .orderBy(desc(legalDocuments.version))
      .limit(1);

    if (!latest) {
      throw new Error(`No document found to publish for ${documentType}`);
    }

    const nextVersion = latest.version + 1;
    const [newVersion] = await db
      .insert(legalDocuments)
      .values({
        documentType,
        title: latest.title,
        version: nextVersion,
        content: latest.content,
        changelog: changelog || null,
        status: "draft",
        createdBy: adminId || null,
      })
      .returning();
    targetDoc = newVersion;
  }

  // 1. Archive previously published versions
  await db
    .update(legalDocuments)
    .set({ status: "archived", updatedAt: new Date() })
    .where(
      and(
        eq(legalDocuments.documentType, documentType),
        eq(legalDocuments.status, "published")
      )
    );

  // 2. Set targetDoc to published
  const [published] = await db
    .update(legalDocuments)
    .set({
      status: "published",
      publishedAt: new Date(),
      publishedBy: adminId || null,
      changelog: changelog !== undefined ? changelog : targetDoc.changelog,
      updatedAt: new Date(),
    })
    .where(eq(legalDocuments.id, targetDoc.id))
    .returning();

  // 3. Queue email batch job
  let audience = "all";
  if (documentType === "customer_terms") audience = "customers";
  else if (documentType === "handyman_terms") audience = "handymen";

  await db.insert(emailJobs).values({
    jobType: "terms_update_notification",
    payload: {
      documentType,
      title: published.title,
      version: published.version,
      changelog: published.changelog,
      audience,
      offset: 0,
      batchSize: 50,
    },
    status: "pending",
    attempts: 0,
    maxAttempts: 3,
  });

  return published;
}
