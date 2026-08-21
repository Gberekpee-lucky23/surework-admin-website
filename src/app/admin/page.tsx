import Link from "next/link";
import { getDashboardStats, getRecentActivity } from "@/dal/analytics";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatRelativeTime } from "@/lib/utils";
import {
  Users,
  Wrench,
  ClipboardList,
  Briefcase,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";

export const metadata = { title: "Dashboard — Surework Admin" };

function StatCard({
  label,
  value,
  icon: Icon,
  href,
  highlight,
  sublabel,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  href?: string;
  highlight?: boolean;
  sublabel?: string;
}) {
  const inner = (
    <div
      className={`rounded-2xl p-5 border transition-shadow hover:shadow-md ${
        highlight
          ? "bg-amber-50 border-amber-200"
          : "bg-white border-slate-200"
      }`}
    >
      <div className="flex items-start justify-between">
        <div
          className={`p-2.5 rounded-xl ${
            highlight ? "bg-amber-100" : "bg-blue-50"
          }`}
        >
          <Icon
            size={20}
            className={highlight ? "text-amber-600" : "text-blue-600"}
          />
        </div>
        {highlight && (
          <span className="flex items-center gap-1 text-xs bg-amber-500 text-white font-bold px-2 py-0.5 rounded-full animate-pulse">
            <AlertTriangle size={10} />
            Action needed
          </span>
        )}
      </div>
      <p className="mt-4 text-3xl font-bold text-slate-900">{value}</p>
      <p className="mt-1 text-sm font-medium text-slate-600">{label}</p>
      {sublabel && <p className="text-xs text-slate-400 mt-0.5">{sublabel}</p>}
    </div>
  );

  return href ? (
    <Link href={href} className="block">
      {inner}
    </Link>
  ) : (
    inner
  );
}

export default async function AdminDashboardPage() {
  const [stats, activity] = await Promise.all([
    getDashboardStats(),
    getRecentActivity(5),
  ]);

  const jobStatuses = [
    { key: "requested",                      label: "Requested" },
    { key: "accepted",                        label: "Accepted" },
    { key: "on_the_way",                      label: "On the Way" },
    { key: "site_assessment",                 label: "At Site" },
    { key: "quote_pending_approval",          label: "Quote Pending" },
    { key: "quote_rejected",                  label: "Quote Rejected" },
    { key: "payment_pending",                 label: "Awaiting Payment" },
    { key: "in_progress",                     label: "In Progress" },
    { key: "awaiting_customer_confirmation",  label: "Awaiting Confirm" },
    { key: "confirmed",                       label: "Confirmed" },
    { key: "payout_released",                 label: "Payout Released" },
    { key: "disputed",                        label: "Disputed" },
    { key: "completed",                       label: "Completed" },
    { key: "cancelled",                       label: "Cancelled" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">
          Platform overview and recent activity
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Users"
          value={stats.totalUsers.toLocaleString()}
          icon={Users}
          href="/admin/users"
        />
        <StatCard
          label="Approved Handymen"
          value={stats.totalApprovedHandymen.toLocaleString()}
          icon={Wrench}
          href="/admin/users?filter=handyman"
        />
        <StatCard
          label="Pending Applications"
          value={stats.pendingApplications.toLocaleString()}
          icon={ClipboardList}
          href="/admin/applications?status=pending"
          highlight={stats.pendingApplications > 0}
          sublabel={
            stats.pendingApplications > 0 ? "Requires your attention" : undefined
          }
        />
        <StatCard
          label="Total Jobs"
          value={Object.values(stats.jobsByStatus)
            .reduce((a, b) => a + b, 0)
            .toLocaleString()}
          icon={Briefcase}
          href="/admin/jobs"
        />
      </div>

      {/* Jobs by Status */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <h2 className="text-sm font-semibold text-slate-900 mb-4">
          Jobs by Status
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {jobStatuses.map(({ key, label }) => (
            <Link
              key={key}
              href={`/admin/jobs?status=${key}`}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-200"
            >
              <span className="text-xl font-bold text-slate-900">
                {(stats.jobsByStatus[key] ?? 0).toLocaleString()}
              </span>
              <StatusBadge status={key} />
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity + Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Jobs */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Recent Jobs
            </h2>
            <Link
              href="/admin/jobs"
              className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {activity.recentJobs.length === 0 ? (
              <p className="text-sm text-slate-400 py-4 text-center">
                No jobs yet
              </p>
            ) : (
              activity.recentJobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/admin/jobs/${job.id}`}
                  className="flex items-start gap-3 group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900 font-medium truncate group-hover:text-blue-600 transition-colors">
                      {job.description?.substring(0, 60)}
                      {job.description?.length > 60 ? "…" : ""}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      by {job.customerName ?? "Unknown"} ·{" "}
                      {formatRelativeTime(job.createdAt)}
                    </p>
                  </div>
                  <StatusBadge status={job.status} className="flex-shrink-0" />
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Recent Applications
            </h2>
            <Link
              href="/admin/applications"
              className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {activity.recentApplications.length === 0 ? (
              <p className="text-sm text-slate-400 py-4 text-center">
                No applications yet
              </p>
            ) : (
              activity.recentApplications.map((app) => (
                <Link
                  key={app.userId}
                  href={`/admin/applications/${app.userId}`}
                  className="flex items-start gap-3 group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900 font-medium truncate group-hover:text-blue-600 transition-colors">
                      {app.userName}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {app.profession ?? "Unknown profession"} ·{" "}
                      {formatRelativeTime(app.submittedAt)}
                    </p>
                  </div>
                  <StatusBadge
                    status={app.applicationStatus}
                    className="flex-shrink-0"
                  />
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Recent Reviews
            </h2>
            <Link
              href="/admin/reviews"
              className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {activity.recentReviews.length === 0 ? (
              <p className="text-sm text-slate-400 py-4 text-center">
                No reviews yet
              </p>
            ) : (
              activity.recentReviews.map((review) => (
                <div key={review.id} className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium text-slate-900">
                        {review.reviewerName ?? "Unknown"}
                      </span>
                      <span className="text-amber-400 text-xs">
                        {"★".repeat(review.rating)}
                        {"☆".repeat(5 - review.rating)}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-xs text-slate-500 mt-0.5 truncate">
                        {review.comment}
                      </p>
                    )}
                    <p className="text-xs text-slate-400 mt-0.5">
                      {formatRelativeTime(review.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <h2 className="text-sm font-semibold text-slate-900 mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/applications?status=pending"
            className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
          >
            <ClipboardList size={16} />
            Review Pending Applications
            {stats.pendingApplications > 0 && (
              <span className="bg-amber-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                {stats.pendingApplications}
              </span>
            )}
          </Link>
          <Link
            href="/admin/jobs?status=requested"
            className="flex items-center gap-2 bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
          >
            <Briefcase size={16} />
            Open Job Requests
          </Link>
          <Link
            href="/admin/users"
            className="flex items-center gap-2 bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
          >
            <Users size={16} />
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  );
}
