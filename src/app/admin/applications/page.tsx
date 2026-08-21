import Link from "next/link";
import { getApplications, type ApplicationStatus } from "@/dal/applications";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatRelativeTime, formatDate } from "@/lib/utils";
import { ClipboardList, ChevronRight } from "lucide-react";

export const metadata = { title: "Applications — Surework Admin" };

const STATUSES: { label: string; value: string }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const status = (params.status as ApplicationStatus | "all") ?? "all";
  const page = Number(params.page ?? 1);

  const { applications, total, totalPages } = await getApplications(
    status,
    page,
    25
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Handyman Applications
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review and action handyman applications from the mobile app
          </p>
        </div>
        <div className="text-sm text-slate-500">
          {total.toLocaleString()} total
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 w-fit">
        {STATUSES.map(({ label, value }) => (
          <Link
            key={value}
            href={`/admin/applications?status=${value}&page=1`}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              status === value
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <ClipboardList size={40} className="mb-3 opacity-40" />
            <p className="font-medium">No applications found</p>
            <p className="text-sm mt-1">
              {status !== "all"
                ? `No ${status} applications at this time`
                : "No applications have been submitted yet"}
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Profession
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Experience
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.map((app) => (
                <tr
                  key={app.userId}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {app.userProfilePicture ? (
                        <img
                          src={app.userProfilePicture}
                          alt={app.userName}
                          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-sm font-bold text-slate-500 flex-shrink-0">
                          {app.userName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-slate-900">
                          {app.userName}
                        </p>
                        <p className="text-xs text-slate-400">{app.userEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {app.profession ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {app.yearsOfExperience != null
                      ? `${app.yearsOfExperience} yr${app.yearsOfExperience !== 1 ? "s" : ""}`
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">
                    {app.submittedAt
                      ? formatRelativeTime(app.submittedAt)
                      : "—"}
                    <span className="block text-slate-400 text-xs">
                      {app.submittedAt ? formatDate(app.submittedAt) : ""}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={app.applicationStatus} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/applications/${app.userId}`}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium ml-auto w-fit"
                    >
                      Review
                      <ChevronRight size={14} />
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
                href={`/admin/applications?status=${status}&page=${page - 1}`}
                className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Previous
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`/admin/applications?status=${status}&page=${page + 1}`}
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
