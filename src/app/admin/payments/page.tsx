import Link from "next/link";
import { getAllPayments, getAllPayoutRequests, getCashLedger, getPaymentsSummary, getStuckPayments } from "@/dal/payments";
import { formatRelativeTime, formatDate } from "@/lib/utils";
import { CreditCard, Wallet, AlertCircle, DollarSign, TrendingUp, Percent, AlertTriangle, CheckCircle2 } from "lucide-react";
import { PayoutActionsClient } from "./PayoutActionsClient";
import { StuckPaymentActionsClient } from "./StuckPaymentActionsClient";

export const metadata = { title: "Payments & Payouts — Surework Admin" };

function formatNGN(kobo: number): string {
  if (!kobo) return "NGN 0.00";
  return `NGN ${(kobo / 100).toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;
}

const PAYMENT_STATUS_COLORS: Record<string, string> = {
  succeeded: "bg-emerald-100 text-emerald-700",
  pending:   "bg-amber-100 text-amber-700",
  failed:    "bg-red-100 text-red-700",
  refunded:  "bg-blue-100 text-blue-700",
};

const PAYOUT_STATUS_COLORS: Record<string, string> = {
  pending:    "bg-amber-100 text-amber-700",
  approved:   "bg-blue-100 text-blue-700",
  processing: "bg-purple-100 text-purple-700",
  paid:       "bg-emerald-100 text-emerald-700",
  failed:     "bg-red-100 text-red-700",
  rejected:   "bg-red-100 text-red-700",
};

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const tab = (params.tab as "payments" | "stuck" | "payouts" | "ledger") ?? "payments";
  const page = Number(params.page ?? 1);

  const [paymentsData, payoutsData, ledger, summary, stuckPayments] = await Promise.all([
    getAllPayments(page),
    getAllPayoutRequests(page),
    getCashLedger(),
    getPaymentsSummary(),
    getStuckPayments(15),
  ]);

  const tabs = [
    { value: "payments", label: "Payments", icon: CreditCard },
    {
      value: "stuck",
      label: stuckPayments.length > 0 ? `Stuck Payments (${stuckPayments.length})` : "Stuck Payments",
      icon: AlertTriangle,
      badge: stuckPayments.length > 0 ? stuckPayments.length : null,
    },
    { value: "payouts", label: "Payouts", icon: Wallet },
    { value: "ledger", label: "Cash Ledger", icon: AlertCircle },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Payments & Payouts</h1>
        <p className="text-sm text-slate-500 mt-1">Platform financial overview</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: "Platform Revenue", value: formatNGN(summary.totalPlatformRevenue ?? summary.totalCommissionEarned), icon: Percent, color: "text-blue-600", bg: "bg-blue-50", hint: "Labour Commission + Service Fees" },
          { label: "Labour Commission", value: formatNGN(summary.totalLabourCommission ?? 0), icon: TrendingUp, color: "text-violet-600", bg: "bg-violet-50", hint: "Deducted from handyman earnings" },
          { label: "Service Fees", value: formatNGN(summary.totalServiceFees ?? 0), icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50", hint: "Charged to customers" },
          { label: "Gateway Fees", value: formatNGN(summary.totalGatewayFees), icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50", hint: "Paystack processing fees" },
        ].map(({ label, value, icon: Icon, color, bg, hint }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className={`p-2.5 rounded-xl ${bg} w-fit mb-3`}>
              <Icon size={20} className={color} />
            </div>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            <p className="text-sm text-slate-500 mt-1">{label}</p>
            {hint && <p className="text-xs text-slate-400 mt-0.5">{hint}</p>}
          </div>
        ))}
      </div>


      {/* Tabs */}
      <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 w-fit">
        {tabs.map(({ value, label, icon: Icon }) => (
          <Link
            key={value}
            href={`/admin/payments?tab=${value}&page=1`}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === value ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Icon size={15} />
            {label}
          </Link>
        ))}
      </div>

      {/* Payments tab */}
      {tab === "payments" && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          {paymentsData.payments.length === 0 ? (
            <div className="flex items-center justify-center py-16 text-slate-400">
              <CreditCard size={36} className="mr-3 opacity-40" />
              <p>No payments yet</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  {["Job", "Customer", "Amount", "Gateway Fee", "Method", "Status", "Paid At"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paymentsData.payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <Link href={`/admin/jobs/${p.jobId}`} className="text-blue-600 hover:text-blue-700 font-medium">
                        #{p.jobId}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{p.customerName ?? "—"}</p>
                      <p className="text-xs text-slate-400">{p.customerEmail}</p>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900">{formatNGN(p.amount)}</td>
                    <td className="px-4 py-3 text-slate-500">{p.gatewayFee ? formatNGN(p.gatewayFee) : "—"}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg font-medium capitalize">
                        {p.paymentMethod}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${PAYMENT_STATUS_COLORS[p.status] ?? "bg-slate-100 text-slate-600"}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {p.paidAt ? formatDate(p.paidAt) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {paymentsData.totalPages > 1 && (
            <div className="px-4 py-3 border-t border-slate-100 flex justify-between items-center">
              <p className="text-sm text-slate-500">Page {page} of {paymentsData.totalPages}</p>
              <div className="flex gap-2">
                {page > 1 && <Link href={`/admin/payments?tab=payments&page=${page - 1}`} className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg hover:bg-slate-50">Previous</Link>}
                {page < paymentsData.totalPages && <Link href={`/admin/payments?tab=payments&page=${page + 1}`} className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">Next</Link>}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stuck Payments Tab (Safety Net) */}
      {tab === "stuck" && (
        <div className="space-y-4">
          <div className="p-4 bg-amber-50/80 border border-amber-200/80 rounded-2xl flex items-start gap-3">
            <div className="p-2 bg-amber-100 text-amber-700 rounded-xl flex-shrink-0 mt-0.5">
              <AlertTriangle size={18} />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-amber-900">Safety Net: Unreconciled Pending Transactions</h3>
              <p className="text-xs text-amber-800 leading-relaxed">
                These payments have been sitting at <span className="font-semibold">pending</span> for more than 15 minutes.
                They may represent cases where the customer paid on Paystack but closed their browser/app before the redirect completed,
                or where the automated webhook failed to deliver. Use <strong>Verify with Paystack</strong> to query live status and advance the job safely.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            {stuckPayments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                <CheckCircle2 size={44} className="text-emerald-500 mb-2 opacity-80" />
                <p className="font-semibold text-slate-700 text-base">No Stuck Payments</p>
                <p className="text-xs text-slate-400 mt-1">All payments have settled normally or are within the 15-minute grace period.</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60">
                    {["Job", "Customer", "Amount", "Gateway Reference", "Pending Duration", "Created", "Action"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stuckPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <Link href={`/admin/jobs/${p.jobId}`} className="text-blue-600 hover:text-blue-700 font-medium">
                          #{p.jobId}
                        </Link>
                        {p.jobDescription && <p className="text-xs text-slate-500 truncate max-w-[140px]">{p.jobDescription}</p>}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-900">{p.customerName ?? "—"}</p>
                        <p className="text-xs text-slate-400">{p.customerEmail}</p>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900">{formatNGN(p.amount)}</td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                          {p.gatewayReference}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-1 rounded-md">
                          {formatRelativeTime(p.createdAt)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">
                        {formatDate(p.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <StuckPaymentActionsClient
                          paymentId={p.id}
                          reference={p.gatewayReference}
                          jobId={p.jobId}
                          amount={p.amount}
                          customerName={p.customerName}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Payout Requests tab */}
      {tab === "payouts" && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          {payoutsData.requests.length === 0 ? (
            <div className="flex items-center justify-center py-16 text-slate-400">
              <Wallet size={36} className="mr-3 opacity-40" />
              <p>No payout requests yet</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  {["ID", "Handyman", "Requested", "Balance at Request", "Bank Details", "Requested Date", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payoutsData.requests.map((r) => {
                  return (
                    <tr key={r.id} className={`hover:bg-slate-50 ${r.status === "failed" ? "bg-red-50/40" : ""}`}>
                      <td className="px-4 py-3 font-medium text-slate-900">#{r.id}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-900">{r.handymanName ?? "—"}</p>
                        <p className="text-xs text-slate-400">{r.handymanEmail}</p>
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-900">{formatNGN(r.amountRequestedKobo)}</td>
                      <td className="px-4 py-3 text-slate-600">{formatNGN(r.availableBalanceAtRequestKobo)}</td>
                      <td className="px-4 py-3 text-xs">
                        {r.accountNumber ? (
                          <div>
                            <p className="font-medium text-slate-800">{r.accountNameResolved || "Account"}</p>
                            <p className="text-slate-500">{r.bankName} • {r.accountNumber}</p>
                            <span className={`inline-block text-[10px] px-1.5 py-0.5 rounded font-bold mt-1 ${r.isVerified ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
                              {r.isVerified ? "Verified" : "Unverified"}
                            </span>
                          </div>
                        ) : (
                          <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium text-[11px]">No Bank Set</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">
                        {r.requestedAt ? formatDate(r.requestedAt) : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${PAYOUT_STATUS_COLORS[r.status] ?? "bg-slate-100 text-slate-600"}`}>
                          {r.status}
                        </span>
                        {r.status === "failed" && (
                          <p className="text-[10px] text-red-600 font-bold mt-1">⚠️ REQUIRES FOLLOW-UP</p>
                        )}
                        {r.rejectionReason && (
                          <p className="text-[10px] text-red-500 mt-1 max-w-xs">{r.rejectionReason}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <PayoutActionsClient
                          requestId={r.id}
                          status={r.status}
                          handymanName={r.handymanName}
                        />
                        {r.paystackTransferReference && (
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">{r.paystackTransferReference}</p>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Cash Ledger tab */}
      {tab === "ledger" && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          {ledger.length === 0 ? (
            <div className="flex items-center justify-center py-16 text-slate-400">
              <AlertCircle size={36} className="mr-3 opacity-40" />
              <p>No cash ledger entries</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  {["Handyman", "Job", "Commission Owed", "Status", "Created", "Deducted"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ledger.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{entry.handymanName ?? "—"}</td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/jobs/${entry.jobId}`} className="text-blue-600 hover:text-blue-700 font-medium">
                        #{entry.jobId}
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-semibold text-amber-700">{formatNGN(entry.commissionOwed)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${
                        entry.status === "outstanding" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                      }`}>
                        {entry.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">{formatRelativeTime(entry.createdAt)}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{entry.deductedAt ? formatDate(entry.deductedAt) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
