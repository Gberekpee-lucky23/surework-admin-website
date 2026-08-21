import {
  pgTable, serial, text, varchar, timestamp,
  integer, jsonb, pgEnum, boolean, numeric,
} from "drizzle-orm/pg-core";

// ─── Enums ────────────────────────────────────────────────────────────────────
export const accountStatusEnum = pgEnum("account_status", ["active", "suspended"]);
export const applicationStatusEnum = pgEnum("application_status", ["pending", "approved", "rejected"]);
export const categoryGroupEnum = pgEnum("category_group", ["inspection_required", "fixed_price"]);

// ─── Users ────────────────────────────────────────────────────────────────────
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phone: varchar("phone", { length: 20 }).notNull(),
  passwordHash: text("password_hash").notNull(),
  profilePictureUrl: text("profile_picture_url"),
  state: varchar("state", { length: 100 }),
  city: varchar("city", { length: 100 }),
  address: text("address"),
  accountStatus: accountStatusEnum("account_status").default("active").notNull(),
  fcmToken: text("fcm_token"),
  lastLogin: timestamp("last_login"),
  lastDevice: text("last_device"),
  emailVerified: boolean("email_verified").default(false).notNull(),
  verificationToken: text("verification_token"),
  verificationTokenExpires: timestamp("verification_token_expires"),
  resetToken: text("reset_token"),
  resetTokenExpires: timestamp("reset_token_expires"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Handyman Profiles ────────────────────────────────────────────────────────
export const handymanProfiles = pgTable("handyman_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull().unique(),
  profession: varchar("profession", { length: 100 }),
  yearsOfExperience: integer("years_of_experience"),
  bio: text("bio"),
  serviceRadiusKm: integer("service_radius_km"),
  serviceState: varchar("service_state", { length: 100 }),
  serviceCity: varchar("service_city", { length: 100 }),
  startingPrice: integer("starting_price"),
  idDocumentUrl: text("id_document_url"),
  certificateUrl: text("certificate_url"),
  applicationStatus: applicationStatusEnum("application_status").default("pending").notNull(),
  submittedAt: timestamp("submitted_at"),
  reviewedAt: timestamp("reviewed_at"),
  reviewedBy: integer("reviewed_by"),           // admin_users.id
  rejectionReason: text("rejection_reason"),
  paystackRecipientCode: text("paystack_recipient_code"),
  // Expanded registration form fields
  surname: varchar("surname", { length: 100 }),
  firstName: varchar("first_name", { length: 100 }),
  otherName: varchar("other_name", { length: 100 }),
  gender: varchar("gender", { length: 20 }),
  dateOfBirth: varchar("date_of_birth", { length: 50 }),
  stateOfOrigin: varchar("state_of_origin", { length: 100 }),
  lga: varchar("lga", { length: 100 }),
  alternativePhone: varchar("alternative_phone", { length: 20 }),
  whatsapp: varchar("whatsapp", { length: 20 }),
  ownsTools: boolean("owns_tools").default(false),
  majorTools: text("major_tools"),
  experienceYearsBracket: varchar("experience_years_bracket", { length: 20 }),
  experienceDescription: text("experience_description"),
  acceptsEmergencyJobs: boolean("accepts_emergency_jobs").default(false),
  preferredAreas: text("preferred_areas"),
  canTravelOutsideState: boolean("can_travel_outside_state").default(false),
  idType: varchar("id_type", { length: 50 }),
  idNumber: varchar("id_number", { length: 100 }),
  portfolioPictureUrls: jsonb("portfolio_picture_urls"),
  cvUrl: text("cv_url"),
  otherTradeDescription: text("other_trade_description"),
  selectedCategoryIds: jsonb("selected_category_ids"),
});

// ─── Handyman Next of Kin ────────────────────────────────────────────────────
export const handymanNextOfKin = pgTable("handyman_next_of_kin", {
  id: serial("id").primaryKey(),
  handymanId: integer("handyman_id").references(() => users.id).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  relationship: varchar("relationship", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  address: text("address").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Handyman Guarantors ─────────────────────────────────────────────────────
export const handymanGuarantors = pgTable("handyman_guarantors", {
  id: serial("id").primaryKey(),
  handymanId: integer("handyman_id").references(() => users.id).notNull().unique(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  occupation: varchar("occupation", { length: 255 }).notNull(),
  companyOrganization: varchar("company_organization", { length: 255 }),
  officeAddress: text("office_address"),
  residentialAddress: text("residential_address").notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  whatsapp: varchar("whatsapp", { length: 20 }),
  email: varchar("email", { length: 255 }).notNull(),
  relationshipToApplicant: varchar("relationship_to_applicant", { length: 100 }).notNull(),
  yearsKnown: varchar("years_known", { length: 50 }).notNull(),
  idType: varchar("id_type", { length: 50 }).notNull(),
  idNumber: varchar("id_number", { length: 100 }),
  confirmationStatus: varchar("confirmation_status", { length: 20 }).default("pending").notNull(),
  confirmationToken: varchar("confirmation_token", { length: 255 }).unique(),
  tokenExpiresAt: timestamp("token_expires_at"),
  confirmedAt: timestamp("confirmed_at"),
  confirmedSignatureName: varchar("confirmed_signature_name", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Handyman References ─────────────────────────────────────────────────────
export const handymanReferences = pgTable("handyman_references", {
  id: serial("id").primaryKey(),
  handymanId: integer("handyman_id").references(() => users.id).notNull(),
  refereeNumber: integer("referee_number").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  occupation: varchar("occupation", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  relationship: varchar("relationship", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Handyman Bank Details ───────────────────────────────────────────────────
export const handymanBankDetails = pgTable("handyman_bank_details", {
  id: serial("id").primaryKey(),
  handymanId: integer("handyman_id").references(() => users.id).notNull().unique(),
  bankName: varchar("bank_name", { length: 255 }).notNull(),
  bankCode: varchar("bank_code", { length: 50 }),
  accountName: varchar("account_name", { length: 255 }).notNull(),
  accountNameResolved: varchar("account_name_resolved", { length: 255 }),
  accountNumber: varchar("account_number", { length: 50 }).notNull(),
  paystackRecipientCode: text("paystack_recipient_code"),
  isVerified: boolean("is_verified").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Categories ───────────────────────────────────────────────────────────────
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  icon: varchar("icon", { length: 50 }).notNull(),
  color: varchar("color", { length: 20 }).default("#0ea5e9").notNull(),
  description: text("description"),
  group: categoryGroupEnum("group").default("inspection_required").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Handyman Services ────────────────────────────────────────────────────────
export const handymanServices = pgTable("handyman_services", {
  id: serial("id").primaryKey(),
  handymanId: integer("handyman_id").references(() => users.id).notNull(),
  categoryId: integer("category_id").references(() => categories.id).notNull(),
  fixedPrice: integer("fixed_price"), // kobo; required for fixed_price group, null for inspection_required
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Platform Settings ────────────────────────────────────────────────────────
export const platformSettings = pgTable("platform_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value").notNull(),
  description: text("description"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  updatedBy: integer("updated_by"),
});

// ─── Jobs ─────────────────────────────────────────────────────────────────────
export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => users.id).notNull(),
  handymanId: integer("handyman_id").references(() => users.id),
  categoryId: integer("category_id").references(() => categories.id).notNull(),
  description: text("description").notNull(),
  preferredDate: timestamp("preferred_date"),
  images: jsonb("images"),
  address: text("address").notNull(),
  status: varchar("status", { length: 50 }).notNull().default("requested"),
  paymentStatus: varchar("payment_status", { length: 20 }).notNull().default("pending"),
  quoteId: integer("quote_id"),
  confirmationDeadline: timestamp("confirmation_deadline"),
  quoteRevisionCount: integer("quote_revision_count").default(0).notNull(),
  invoiceUrl: text("invoice_url"),
  // Admin-only fields
  adminNote: text("admin_note"),
  acceptedAt: timestamp("accepted_at"),
  onTheWayAt: timestamp("on_the_way_at"),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  cancelledAt: timestamp("cancelled_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Job Status History ───────────────────────────────────────────────────────
export const jobStatusHistory = pgTable("job_status_history", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").references(() => jobs.id).notNull(),
  fromStatus: varchar("from_status", { length: 50 }),
  toStatus: varchar("to_status", { length: 50 }).notNull(),
  actorId: integer("actor_id").references(() => users.id),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Job Quotes ───────────────────────────────────────────────────────────────
export const jobQuotes = pgTable("job_quotes", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").references(() => jobs.id).notNull(),
  submittedBy: integer("submitted_by").references(() => users.id).notNull(),
  laborCost: integer("labor_cost").notNull(),
  laborCommissionRate: numeric("labor_commission_rate", { precision: 5, scale: 4 }).notNull(),
  materialsFeeRecoveryRate: numeric("materials_fee_recovery_rate", { precision: 5, scale: 4 }).notNull(),
  laborCommissionAmount: integer("labor_commission_amount").notNull(),
  materialsFeeRecoveryAmount: integer("materials_fee_recovery_amount").notNull(),
  // commissionAmount = labour commission only (handyman deduction); NOT charged to customer
  commissionAmount: integer("commission_amount").notNull(),
  // Customer service fee — snapshotted at quote submission time (null on historical quotes)
  serviceFeeRate: numeric("service_fee_rate", { precision: 5, scale: 4 }),
  serviceFeeAmount: integer("service_fee_amount"),
  materialsTotal: integer("materials_total").notNull(),
  // totalAmount = materialsTotal + laborCost + serviceFeeAmount (what customer pays)
  totalAmount: integer("total_amount").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending_approval"),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  respondedAt: timestamp("responded_at"),
  rejectionReason: text("rejection_reason"),
  revisionNumber: integer("revision_number").default(1).notNull(),
});

// ─── Job Quote Items ──────────────────────────────────────────────────────────
export const jobQuoteItems = pgTable("job_quote_items", {
  id: serial("id").primaryKey(),
  quoteId: integer("quote_id").references(() => jobQuotes.id).notNull(),
  description: varchar("description", { length: 500 }).notNull(),
  quantity: integer("quantity").notNull(),
  unitCost: integer("unit_cost").notNull(),
  lineTotal: integer("line_total").notNull(),
  receiptPhotoUrl: text("receipt_photo_url"),
});

// ─── Payments ─────────────────────────────────────────────────────────────────
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").references(() => jobs.id).notNull(),
  quoteId: integer("quote_id").references(() => jobQuotes.id).notNull(),
  customerId: integer("customer_id").references(() => users.id).notNull(),
  amount: integer("amount").notNull(),
  gateway: varchar("gateway", { length: 20 }).notNull().default("paystack"),
  gatewayReference: varchar("gateway_reference", { length: 255 }),
  gatewayFee: integer("gateway_fee"),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  paymentMethod: varchar("payment_method", { length: 20 }).notNull().default("online"),
  handymanCashConfirmed: integer("handyman_cash_confirmed").default(0),
  customerCashConfirmed: integer("customer_cash_confirmed").default(0),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Payouts ──────────────────────────────────────────────────────────────────
export const payouts = pgTable("payouts", {
  id: serial("id").primaryKey(),
  handymanId: integer("handyman_id").references(() => users.id).notNull(),
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  jobsIncluded: jsonb("jobs_included").notNull(),
  grossLaborTotal: integer("gross_labor_total").notNull(),
  commissionDeducted: integer("commission_deducted").notNull(),
  cashDebtDeducted: integer("cash_debt_deducted").notNull().default(0),
  netPayoutAmount: integer("net_payout_amount").notNull(),
  transferReference: varchar("transfer_reference", { length: 255 }),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  approvedBy: integer("approved_by"),
  approvedAt: timestamp("approved_at"),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const payoutRequests = pgTable("payout_requests", {
  id: serial("id").primaryKey(),
  handymanId: integer("handyman_id").references(() => users.id).notNull(),
  amountRequestedKobo: integer("amount_requested_kobo").notNull(),
  availableBalanceAtRequestKobo: integer("available_balance_at_request_kobo").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  requestedAt: timestamp("requested_at").defaultNow().notNull(),
  reviewedBy: integer("reviewed_by").references(() => users.id),
  reviewedAt: timestamp("reviewed_at"),
  rejectionReason: text("rejection_reason"),
  paystackTransferReference: varchar("paystack_transfer_reference", { length: 255 }),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Handyman Cash Ledger ─────────────────────────────────────────────────────
export const handymanCashLedger = pgTable("handyman_cash_ledger", {
  id: serial("id").primaryKey(),
  handymanId: integer("handyman_id").references(() => users.id).notNull(),
  jobId: integer("job_id").references(() => jobs.id).notNull(),
  commissionOwed: integer("commission_owed").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("outstanding"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  deductedAt: timestamp("deducted_at"),
  deductedInPayoutId: integer("deducted_in_payout_id").references(() => payouts.id),
});

// ─── Reviews ──────────────────────────────────────────────────────────────────
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").references(() => jobs.id).notNull().unique(),
  reviewerId: integer("reviewer_id").references(() => users.id).notNull(),
  revieweeId: integer("reviewee_id").references(() => users.id).notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  deletedAt: timestamp("deleted_at"),
  deletedBy: integer("deleted_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Admin Users ──────────────────────────────────────────────────────────────
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull().default("admin"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Audit Logs ───────────────────────────────────────────────────────────────
export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  adminId: integer("admin_id").references(() => adminUsers.id).notNull(),
  action: varchar("action", { length: 100 }).notNull(),
  targetType: varchar("target_type", { length: 50 }).notNull(),
  targetId: integer("target_id"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Centralized Notification Center Tables ──────────────────────────────────
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  type: varchar("type", { length: 50 }).notNull(), // BOOKING, PAYMENT, MESSAGE, SYSTEM, etc.
  referenceId: integer("reference_id"),
  referenceType: varchar("reference_type", { length: 100 }),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const notificationPreferences = pgTable("notification_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull().unique(),
  emailEnabled: boolean("email_enabled").default(true).notNull(),
  pushEnabled: boolean("push_enabled").default(true).notNull(),
  bookingEnabled: boolean("booking_enabled").default(true).notNull(),
  paymentEnabled: boolean("payment_enabled").default(true).notNull(),
  marketingEnabled: boolean("marketing_enabled").default(true).notNull(),
  securityEnabled: boolean("security_enabled").default(true).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const notificationLogs = pgTable("notification_logs", {
  id: serial("id").primaryKey(),
  channel: varchar("channel", { length: 20 }).notNull(), // email | push | db
  status: varchar("status", { length: 20 }).notNull(), // success | failed | retry
  error: text("error"),
  notificationId: integer("notification_id").references(() => notifications.id),
  retryCount: integer("retry_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Contact Form Submissions ─────────────────────────────────────────────────
// Persists every website contact form submission so no inquiry is lost
// even if email delivery fails.
export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  category: varchar("category", { length: 100 }),
  subject: varchar("subject", { length: 500 }),
  message: text("message").notNull(),
  emailSent: boolean("email_sent").default(false).notNull(),
  emailError: text("email_error"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});


