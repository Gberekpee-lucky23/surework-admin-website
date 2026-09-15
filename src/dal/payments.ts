import { db } from "@/db";
import { payments, payouts, payoutRequests, handymanBankDetails, handymanCashLedger, users, jobs, jobQuotes } from "@/db/schema";
import { eq, desc, and, sum, count, lte } from "drizzle-orm";

export async function getAllPayments(page = 1, limit = 25) {
  const offset = (page - 1) * limit;
  const [rows, [{ total }]] = await Promise.all([
    db
      .select({
        id: payments.id,
        jobId: payments.jobId,
        amount: payments.amount,
        gateway: payments.gateway,
        gatewayReference: payments.gatewayReference,
        gatewayFee: payments.gatewayFee,
        status: payments.status,
        paymentMethod: payments.paymentMethod,
        paidAt: payments.paidAt,
        createdAt: payments.createdAt,
        customerName: users.name,
        customerEmail: users.email,
      })
      .from(payments)
      .leftJoin(users, eq(payments.customerId, users.id))
      .orderBy(desc(payments.createdAt))
      .limit(limit)
      .offset(offset),
    db.select({ total: count() }).from(payments),
  ]);

  return {
    payments: rows,
    total: Number(total),
    totalPages: Math.ceil(Number(total) / limit),
  };
}

export async function getAllPayoutRequests(page = 1, limit = 25) {
  const offset = (page - 1) * limit;
  const [rows, [{ total }]] = await Promise.all([
    db
      .select({
        id: payoutRequests.id,
        handymanId: payoutRequests.handymanId,
        handymanName: users.name,
        handymanEmail: users.email,
        amountRequestedKobo: payoutRequests.amountRequestedKobo,
        availableBalanceAtRequestKobo: payoutRequests.availableBalanceAtRequestKobo,
        status: payoutRequests.status,
        requestedAt: payoutRequests.requestedAt,
        reviewedBy: payoutRequests.reviewedBy,
        reviewedAt: payoutRequests.reviewedAt,
        rejectionReason: payoutRequests.rejectionReason,
        paystackTransferReference: payoutRequests.paystackTransferReference,
        paidAt: payoutRequests.paidAt,
        createdAt: payoutRequests.createdAt,
        bankName: handymanBankDetails.bankName,
        accountNumber: handymanBankDetails.accountNumber,
        accountNameResolved: handymanBankDetails.accountNameResolved,
        isVerified: handymanBankDetails.isVerified,
      })
      .from(payoutRequests)
      .leftJoin(users, eq(payoutRequests.handymanId, users.id))
      .leftJoin(handymanBankDetails, eq(payoutRequests.handymanId, handymanBankDetails.handymanId))
      .orderBy(desc(payoutRequests.createdAt))
      .limit(limit)
      .offset(offset),
    db.select({ total: count() }).from(payoutRequests),
  ]);

  return {
    requests: rows,
    total: Number(total),
    totalPages: Math.ceil(Number(total) / limit),
  };
}

export async function getCashLedger() {
  return db
    .select({
      id: handymanCashLedger.id,
      handymanId: handymanCashLedger.handymanId,
      handymanName: users.name,
      jobId: handymanCashLedger.jobId,
      commissionOwed: handymanCashLedger.commissionOwed,
      status: handymanCashLedger.status,
      createdAt: handymanCashLedger.createdAt,
      deductedAt: handymanCashLedger.deductedAt,
    })
    .from(handymanCashLedger)
    .leftJoin(users, eq(handymanCashLedger.handymanId, users.id))
    .orderBy(desc(handymanCashLedger.createdAt));
}

export async function getPaymentsSummary() {
  const [onlineSucceeded, gatewayFees, labourCommission, serviceFees] = await Promise.all([
    db.select({ total: sum(payments.amount) }).from(payments).where(
      and(eq(payments.status, "succeeded"), eq(payments.paymentMethod, "online"))
    ),
    db.select({ total: sum(payments.gatewayFee) }).from(payments).where(eq(payments.status, "succeeded")),
    // Labour commission: for new quotes = commissionAmount (labour only); for historical = commissionAmount (combined)
    db.select({ total: sum(jobQuotes.commissionAmount) }).from(jobQuotes).where(eq(jobQuotes.status, "approved")),
    // Service fee: only present on new quotes (serviceFeeAmount column); historical quotes had no separate service fee
    db.select({ total: sum(jobQuotes.serviceFeeAmount) }).from(jobQuotes).where(eq(jobQuotes.status, "approved")),
  ]);

  const totalLabourCommission = Number(labourCommission[0]?.total ?? 0);
  const totalServiceFees = Number(serviceFees[0]?.total ?? 0);

  return {
    totalOnlineRevenue: Number(onlineSucceeded[0]?.total ?? 0),
    totalGatewayFees: Number(gatewayFees[0]?.total ?? 0),
    totalLabourCommission,
    totalServiceFees,
    // Platform revenue = labour commission + service fees
    totalPlatformRevenue: totalLabourCommission + totalServiceFees,
    // Legacy field kept for backward compat
    totalCommissionEarned: totalLabourCommission + totalServiceFees,
  };
}

/**
 * Fetch payments stuck in 'pending' status older than thresholdMinutes (default 15 mins).
 * Surfaces transactions where automatic webhook or redirect reconciliation may have failed.
 */
export async function getStuckPayments(thresholdMinutes = 15) {
  const cutoff = new Date(Date.now() - thresholdMinutes * 60 * 1000);
  return db
    .select({
      id: payments.id,
      jobId: payments.jobId,
      amount: payments.amount,
      gateway: payments.gateway,
      gatewayReference: payments.gatewayReference,
      gatewayFee: payments.gatewayFee,
      status: payments.status,
      paymentMethod: payments.paymentMethod,
      createdAt: payments.createdAt,
      customerId: payments.customerId,
      customerName: users.name,
      customerEmail: users.email,
      jobDescription: jobs.description,
      jobStatus: jobs.status,
    })
    .from(payments)
    .leftJoin(users, eq(payments.customerId, users.id))
    .leftJoin(jobs, eq(payments.jobId, jobs.id))
    .where(and(eq(payments.status, "pending"), lte(payments.createdAt, cutoff)))
    .orderBy(desc(payments.createdAt));
}
