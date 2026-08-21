import { db } from "@/db";
import {
  handymanProfiles,
  handymanNextOfKin,
  handymanGuarantors,
  handymanReferences,
  handymanBankDetails,
  users,
  notifications,
} from "@/db/schema";
import { eq, desc, count } from "drizzle-orm";

export type ApplicationStatus = "pending" | "approved" | "rejected";

export async function getApplications(
  status: ApplicationStatus | "all" = "all",
  page = 1,
  limit = 20
) {
  const offset = (page - 1) * limit;

  const conditions =
    status !== "all" ? eq(handymanProfiles.applicationStatus, status) : undefined;

  const [rows, [{ total }]] = await Promise.all([
    db
      .select({
        profileId: handymanProfiles.id,
        userId: handymanProfiles.userId,
        profession: handymanProfiles.profession,
        yearsOfExperience: handymanProfiles.yearsOfExperience,
        applicationStatus: handymanProfiles.applicationStatus,
        submittedAt: handymanProfiles.submittedAt,
        reviewedAt: handymanProfiles.reviewedAt,
        rejectionReason: handymanProfiles.rejectionReason,
        userName: users.name,
        userEmail: users.email,
        userProfilePicture: users.profilePictureUrl,
        guarantorStatus: handymanGuarantors.confirmationStatus,
      })
      .from(handymanProfiles)
      .innerJoin(users, eq(handymanProfiles.userId, users.id))
      .leftJoin(handymanGuarantors, eq(handymanProfiles.userId, handymanGuarantors.handymanId))
      .where(conditions)
      .orderBy(desc(handymanProfiles.submittedAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ total: count() })
      .from(handymanProfiles)
      .where(conditions),
  ]);

  return {
    applications: rows,
    total: Number(total),
    page,
    limit,
    totalPages: Math.ceil(Number(total) / limit),
  };
}

export async function getApplicationByUserId(userId: number) {
  const [profile] = await db
    .select({
      profileId: handymanProfiles.id,
      userId: handymanProfiles.userId,
      profession: handymanProfiles.profession,
      yearsOfExperience: handymanProfiles.yearsOfExperience,
      bio: handymanProfiles.bio,
      serviceRadiusKm: handymanProfiles.serviceRadiusKm,
      serviceState: handymanProfiles.serviceState,
      serviceCity: handymanProfiles.serviceCity,
      startingPrice: handymanProfiles.startingPrice,
      idDocumentUrl: handymanProfiles.idDocumentUrl,
      certificateUrl: handymanProfiles.certificateUrl,
      applicationStatus: handymanProfiles.applicationStatus,
      submittedAt: handymanProfiles.submittedAt,
      reviewedAt: handymanProfiles.reviewedAt,
      rejectionReason: handymanProfiles.rejectionReason,
      reviewedBy: handymanProfiles.reviewedBy,
      // Expanded fields
      surname: handymanProfiles.surname,
      firstName: handymanProfiles.firstName,
      otherName: handymanProfiles.otherName,
      gender: handymanProfiles.gender,
      dateOfBirth: handymanProfiles.dateOfBirth,
      stateOfOrigin: handymanProfiles.stateOfOrigin,
      lga: handymanProfiles.lga,
      alternativePhone: handymanProfiles.alternativePhone,
      whatsapp: handymanProfiles.whatsapp,
      ownsTools: handymanProfiles.ownsTools,
      majorTools: handymanProfiles.majorTools,
      experienceYearsBracket: handymanProfiles.experienceYearsBracket,
      experienceDescription: handymanProfiles.experienceDescription,
      acceptsEmergencyJobs: handymanProfiles.acceptsEmergencyJobs,
      preferredAreas: handymanProfiles.preferredAreas,
      canTravelOutsideState: handymanProfiles.canTravelOutsideState,
      idType: handymanProfiles.idType,
      idNumber: handymanProfiles.idNumber,
      portfolioPictureUrls: handymanProfiles.portfolioPictureUrls,
      cvUrl: handymanProfiles.cvUrl,
      otherTradeDescription: handymanProfiles.otherTradeDescription,
      selectedCategoryIds: handymanProfiles.selectedCategoryIds,
      // User table
      userName: users.name,
      userEmail: users.email,
      userPhone: users.phone,
      userProfilePicture: users.profilePictureUrl,
      userState: users.state,
      userCity: users.city,
      userCreatedAt: users.createdAt,
    })
    .from(handymanProfiles)
    .innerJoin(users, eq(handymanProfiles.userId, users.id))
    .where(eq(handymanProfiles.userId, userId));

  if (!profile) return null;

  const [nextOfKin] = await db
    .select()
    .from(handymanNextOfKin)
    .where(eq(handymanNextOfKin.handymanId, userId));

  const [guarantor] = await db
    .select()
    .from(handymanGuarantors)
    .where(eq(handymanGuarantors.handymanId, userId));

  const references = await db
    .select()
    .from(handymanReferences)
    .where(eq(handymanReferences.handymanId, userId));

  const [bankDetails] = await db
    .select()
    .from(handymanBankDetails)
    .where(eq(handymanBankDetails.handymanId, userId));

  return {
    ...profile,
    nextOfKin: nextOfKin ?? null,
    guarantor: guarantor ?? null,
    references: references ?? [],
    bankDetails: bankDetails ?? null,
  };
}

export async function approveApplication(userId: number, adminId: number) {
  // Check guarantor status first
  const [guarantor] = await db
    .select()
    .from(handymanGuarantors)
    .where(eq(handymanGuarantors.handymanId, userId));

  if (!guarantor || guarantor.confirmationStatus !== "confirmed") {
    throw new Error("Application cannot be approved until guarantor confirmation is received.");
  }

  const [updated] = await db
    .update(handymanProfiles)
    .set({
      applicationStatus: "approved",
      reviewedAt: new Date(),
      reviewedBy: adminId,
      rejectionReason: null,
    })
    .where(eq(handymanProfiles.userId, userId))
    .returning();

  if (updated) {
    // Send in-app notification to the handyman
    await db.insert(notifications).values({
      userId,
      title: "Congratulations! Your Application is Approved 🎉",
      message: "Your handyman application has been approved by Port Harcourt Handyman Services. You can now accept jobs and offer services on the platform!",
      type: "HANDYMAN",
      referenceId: userId,
      referenceType: "handyman_application",
      isRead: false,
    });
  }

  return updated ?? null;
}

export async function rejectApplication(
  userId: number,
  adminId: number,
  reason: string
) {
  const [updated] = await db
    .update(handymanProfiles)
    .set({
      applicationStatus: "rejected",
      reviewedAt: new Date(),
      reviewedBy: adminId,
      rejectionReason: reason,
    })
    .where(eq(handymanProfiles.userId, userId))
    .returning();

  if (updated) {
    // Send in-app notification to the handyman
    await db.insert(notifications).values({
      userId,
      title: "Handyman Application Status Update",
      message: `Your handyman application was not approved. Reason: ${reason}`,
      type: "HANDYMAN",
      referenceId: userId,
      referenceType: "handyman_application",
      isRead: false,
    });
  }

  return updated ?? null;
}

export async function toggleVerifyBankDetails(userId: number, isVerified: boolean) {
  const [updated] = await db
    .update(handymanBankDetails)
    .set({
      isVerified,
      updatedAt: new Date(),
    })
    .where(eq(handymanBankDetails.handymanId, userId))
    .returning();

  return updated ?? null;
}

export async function getPendingCount() {
  const [{ total }] = await db
    .select({ total: count() })
    .from(handymanProfiles)
    .where(eq(handymanProfiles.applicationStatus, "pending"));

  return Number(total);
}
