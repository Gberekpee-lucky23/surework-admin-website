import { notFound } from "next/navigation";
import Link from "next/link";
import { getJobById } from "@/dal/jobs";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import { JobActionsClient } from "./JobActionsClient";
import {
  ArrowLeft,
  MapPin,
  User,
  Wrench,
  Calendar,
  Image as ImageIcon,
  CheckCircle,
  Circle,
} from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: `Job #${id} — Surework Admin` };
}

interface TimelineStep {
  label: string;
  timestamp: Date | null | undefined;
  status: string;
  isDone?: boolean;
  isCurrent?: boolean;
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await getJobById(Number(id));
  if (!job) notFound();

  const images = Array.isArray(job.images) ? job.images as string[] : [];

  // Build timeline based on which timestamps exist and current status
  const jobStatusOrder = [
    "requested", "accepted", "on_the_way", "site_assessment",
    "quote_pending_approval", "quote_rejected",
    "payment_pending", "in_progress",
    "awaiting_customer_confirmation", "confirmed",
    "payout_released", "completed",
  ];

  const currentStatusIndex = jobStatusOrder.indexOf(job.status);

  const timeline: TimelineStep[] = [
    { label: "Requested",          timestamp: job.createdAt,   status: "requested" },
    { label: "Accepted",           timestamp: job.acceptedAt,  status: "accepted" },
    { label: "On the Way",         timestamp: job.onTheWayAt,  status: "on_the_way" },
    { label: "At Site",            timestamp: null,            status: "site_assessment" },
    { label: "Quote Submitted",    timestamp: null,            status: "quote_pending_approval" },
    { label: "Awaiting Payment",   timestamp: null,            status: "payment_pending" },
    { label: "In Progress",        timestamp: job.startedAt,   status: "in_progress" },
    { label: "Handyman Done",      timestamp: job.completedAt, status: "awaiting_customer_confirmation" },
    { label: "Confirmed",          timestamp: null,            status: "confirmed" },
    { label: "Payout Released",    timestamp: null,            status: "payout_released" },
  ];

  // Fill timestamps for steps we don't have explicit columns for by checking if the status was reached
  const enrichedTimeline = timeline.map((step, i) => ({
    ...step,
    isDone: step.timestamp != null
      || (currentStatusIndex >= 0 && jobStatusOrder.indexOf(step.status) <= currentStatusIndex
          && job.status !== "cancelled" && job.status !== "disputed"),
    isCurrent: job.status === step.status,
  }));

  if (job.cancelledAt || job.status === "cancelled") {
    enrichedTimeline.push({ label: "Cancelled", timestamp: job.cancelledAt, status: "cancelled", isDone: true, isCurrent: job.status === "cancelled" });
  }
  if (job.status === "disputed") {
    enrichedTimeline.push({ label: "Disputed", timestamp: null, status: "disputed", isDone: true, isCurrent: true });
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-2">
        <Link
          href="/admin/jobs"
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft size={14} />
          Jobs
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-sm text-slate-700 font-medium">Job #{job.id}</span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-xl font-bold text-slate-900">Job #{job.id}</h1>
              <StatusBadge status={job.status} />
              {job.categoryName && (
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg font-medium">
                  {job.categoryName}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-600 max-w-xl">{job.description}</p>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500">
              <MapPin size={12} />
              {job.address}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Created {formatRelativeTime(job.createdAt)} · {formatDate(job.createdAt)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Timeline */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h2 className="font-semibold text-slate-900 mb-4">Status Timeline</h2>
            <div className="space-y-4">
              {enrichedTimeline.map((step, i) => {
                const isDone = step.isDone ?? !!step.timestamp;
                const isCurrent = step.isCurrent ?? (step.status === job.status);
                const isError = step.status === "cancelled" || step.status === "disputed";
                return (
                  <div key={step.status} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isDone && isError
                            ? "bg-red-100 text-red-600"
                            : isDone
                            ? "bg-green-100 text-green-600"
                            : isCurrent
                            ? "bg-blue-100 text-blue-600"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle size={14} />
                        ) : (
                          <Circle size={14} />
                        )}
                      </div>
                      {i < enrichedTimeline.length - 1 && (
                        <div
                          className={`w-0.5 h-6 mt-1 ${
                            isDone && !isError ? "bg-green-200" : isDone && isError ? "bg-red-200" : "bg-slate-100"
                          }`}
                        />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p
                        className={`text-sm font-medium ${
                          isDone && isError
                            ? "text-red-600"
                            : isDone
                            ? "text-slate-900"
                            : isCurrent
                            ? "text-blue-700"
                            : "text-slate-400"
                        }`}
                      >
                        {step.label}
                        {isCurrent && !isDone && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-medium">Current</span>
                        )}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {step.timestamp
                          ? formatDate(step.timestamp)
                          : isDone
                          ? "Reached"
                          : "Not yet reached"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Images */}
          {images.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <ImageIcon size={15} className="text-slate-400" />
                Job Images ({images.length})
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {images.map((url, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={url}
                      alt={`Job image ${i + 1}`}
                      className="w-full aspect-square object-cover rounded-xl border border-slate-200 hover:opacity-90 transition-opacity"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Admin Actions */}
          <JobActionsClient
            jobId={job.id}
            jobStatus={job.status}
            currentNote={job.adminNote ?? ""}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Customer */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <User size={14} className="text-slate-400" />
              Customer
            </h3>
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-900">
                {job.customerName ?? "—"}
              </p>
              <p className="text-xs text-slate-500">{job.customerEmail}</p>
              <p className="text-xs text-slate-500">{job.customerPhone}</p>
            </div>
            {job.customerId && (
              <Link
                href={`/admin/users/${job.customerId}`}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium mt-2 block"
              >
                → View User Profile
              </Link>
            )}
          </div>

          {/* Handyman */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Wrench size={14} className="text-slate-400" />
              Assigned Handyman
            </h3>
            {job.handyman ? (
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-900">
                  {job.handyman.name}
                </p>
                <p className="text-xs text-slate-500">{job.handyman.email}</p>
                <p className="text-xs text-slate-500">{job.handyman.phone}</p>
                <Link
                  href={`/admin/users/${job.handyman.id}`}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium mt-2 block"
                >
                  → View User Profile
                </Link>
              </div>
            ) : (
              <p className="text-sm text-slate-400">No handyman assigned yet</p>
            )}
          </div>

          {/* Preferred Date */}
          {job.preferredDate && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <Calendar size={14} className="text-slate-400" />
                Preferred Date
              </h3>
              <p className="text-sm text-slate-700">{formatDate(job.preferredDate)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
