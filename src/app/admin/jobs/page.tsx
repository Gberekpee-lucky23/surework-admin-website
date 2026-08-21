import Link from "next/link";
import { getJobs, type JobFilters } from "@/dal/jobs";
import { getCategories } from "@/dal/categories";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatRelativeTime, formatDate } from "@/lib/utils";
import { Briefcase, ChevronRight } from "lucide-react";
import { AutoRefresh } from "@/components/ui/AutoRefresh";

export const dynamic = "force-dynamic";
export const metadata = { title: "Jobs — Surework Admin" };

const STATUSES = [
  { label: "All", value: "all" },
  { label: "Requested", value: "requested" },
  { label: "Accepted", value: "accepted" },
  { label: "On the Way", value: "on_the_way" },
  { label: "At Site", value: "site_assessment" },
  { label: "Quote Pending", value: "quote_pending_approval" },
  { label: "Quote Rejected", value: "quote_rejected" },
  { label: "Awaiting Payment", value: "payment_pending" },
  { label: "In Progress", value: "in_progress" },
  { label: "Awaiting Confirm", value: "awaiting_customer_confirmation" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Disputed", value: "disputed" },
  { label: "Payout Released", value: "payout_released" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const status = params.status ?? "all";
  const categoryId = params.categoryId ? Number(params.categoryId) : undefined;
  const page = Number(params.page ?? 1);

  const filters: JobFilters = {
    status: status as JobFilters["status"],
    categoryId,
  };

  const [{ jobs, total, totalPages }, categories] = await Promise.all([
    getJobs(filters, page, 25),
    getCategories(),
  ]);

  return (
    <div className="space-y-5">
      <AutoRefresh intervalMs={20000} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Jobs</h1>
          <p className="text-sm text-slate-500 mt-1">All jobs across the platform</p>
        </div>
        <span className="text-sm text-slate-500">{total.toLocaleString()} total</span>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 overflow-x-auto">
          {STATUSES.map(({ label, value }) => (
            <Link
              key={value}
              href={`/admin/jobs?status=${value}&categoryId=${categoryId ?? ""}&page=1`}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                status === value
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {categories.length > 0 && (
          <form>
            <input type="hidden" name="status" value={status} />
            <select
              name="categoryId"
              defaultValue={categoryId ?? ""}
              className="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </form>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <Briefcase size={40} className="mb-3 opacity-40" />
            <p className="font-medium">No jobs found</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Job
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">
                      #{job.id}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 max-w-xs truncate">
                      {job.description}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {job.customerName ?? "—"}
                    <p className="text-xs text-slate-400">{job.customerEmail}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg font-medium">
                      {job.categoryName ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={job.status} />
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {formatRelativeTime(job.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/jobs/${job.id}`}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium ml-auto w-fit"
                    >
                      View <ChevronRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Page {page} of {totalPages} ({total.toLocaleString()} results)
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`/admin/jobs?status=${status}&categoryId=${categoryId ?? ""}&page=${page - 1}`}
                className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Previous
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`/admin/jobs?status=${status}&categoryId=${categoryId ?? ""}&page=${page + 1}`}
                className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
