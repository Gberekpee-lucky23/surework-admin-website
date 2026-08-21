import Link from "next/link";
import { getDisputedJobs } from "@/dal/disputes";
import { AlertTriangle, MessageSquare } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

export const metadata = { title: "Disputes — Surework Admin" };

function formatNGN(kobo: number | null): string {
  if (!kobo) return "—";
  return `NGN ${(kobo / 100).toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;
}

export default async function DisputesPage() {
  const disputes = await getDisputedJobs();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Disputes</h1>
          <p className="text-sm text-slate-500 mt-1">Jobs awaiting manual admin resolution</p>
        </div>
        {disputes.length > 0 && (
          <span className="flex items-center gap-1.5 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-full">
            <AlertTriangle size={14} />
            {disputes.length} open
          </span>
        )}
      </div>

      {disputes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center py-20">
          <AlertTriangle size={44} className="text-slate-200 mb-4" />
          <p className="font-semibold text-slate-500">No disputes at the moment</p>
          <p className="text-sm text-slate-400 mt-1">All disputes will appear here for review</p>
        </div>
      ) : (
        <div className="space-y-4">
          {disputes.map((job) => (
            <div key={job.id} className="bg-white rounded-2xl border border-red-200 overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-red-100 p-2 rounded-xl">
                    <AlertTriangle size={18} className="text-red-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">
                      Job #{job.id} — {job.categoryName ?? "Unknown Category"}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{job.address}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500">{formatRelativeTime(job.updatedAt)}</p>
              </div>

              {/* Parties */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-6 py-4 bg-slate-50/50">
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Customer</p>
                  <p className="font-medium text-slate-900">{job.customerName ?? "—"}</p>
                  <p className="text-xs text-slate-400">{job.customerEmail}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Handyman</p>
                  <p className="font-medium text-slate-900">{job.handymanName ?? "—"}</p>
                </div>
              </div>

              {/* Quote breakdown */}
              {job.quote && (
                <div className="px-6 py-4 border-t border-slate-100">
                  <p className="text-xs text-slate-500 uppercase font-semibold mb-3">Approved Quote</p>
                  <div className="space-y-1">
                    {job.quoteItems.map((item: any) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-slate-700">{item.description} ×{item.quantity}</span>
                        <span className="font-medium text-slate-900">{formatNGN(item.lineTotal)}</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-slate-100 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Labour</span>
                        <span>{formatNGN(job.quote.laborCost)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Commission</span>
                        <span>{formatNGN(job.quote.commissionAmount)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold pt-1">
                        <span className="text-slate-900">Total Paid</span>
                        <span className="text-slate-900">{formatNGN(job.quote.totalAmount)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment status */}
              {job.payment && (
                <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
                  <span className="text-xs text-slate-500">Payment:</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${
                    job.payment.status === "succeeded"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}>
                    {job.payment.status}
                  </span>
                  <span className="text-xs text-slate-400 ml-auto font-mono">{job.payment.gatewayReference ?? ""}</span>
                </div>
              )}

              {/* Admin actions */}
              <div className="px-6 py-4 border-t border-slate-100 flex items-center gap-3">
                <Link
                  href={`/admin/jobs/${job.id}`}
                  className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-700 transition-colors"
                >
                  <MessageSquare size={14} />
                  View Full Job
                </Link>
                <span className="text-xs text-slate-400">
                  Resolve by updating job status to &quot;confirmed&quot; or &quot;cancelled&quot; from the job detail page.
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
