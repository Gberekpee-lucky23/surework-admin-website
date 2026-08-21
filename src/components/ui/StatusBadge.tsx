import React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant =
  | "pending"
  | "approved"
  | "rejected"
  | "active"
  | "suspended"
  // Job statuses — old
  | "requested"
  | "accepted"
  | "on_the_way"
  | "started"
  | "completed"
  | "cancelled"
  // Job statuses — new
  | "site_assessment"
  | "quote_pending_approval"
  | "quote_rejected"
  | "payment_pending"
  | "in_progress"
  | "completed_by_handyman"
  | "awaiting_customer_confirmation"
  | "confirmed"
  | "payout_released"
  | "closed"
  | "disputed"
  | "default";

const variantMap: Record<BadgeVariant, string> = {
  pending:                        "bg-amber-100 text-amber-800 border border-amber-200",
  approved:                       "bg-green-100 text-green-800 border border-green-200",
  rejected:                       "bg-red-100 text-red-800 border border-red-200",
  active:                         "bg-green-100 text-green-800 border border-green-200",
  suspended:                      "bg-red-100 text-red-800 border border-red-200",
  requested:                      "bg-slate-100 text-slate-700 border border-slate-200",
  accepted:                       "bg-blue-100 text-blue-800 border border-blue-200",
  on_the_way:                     "bg-indigo-100 text-indigo-800 border border-indigo-200",
  started:                        "bg-violet-100 text-violet-800 border border-violet-200",
  completed:                      "bg-green-100 text-green-800 border border-green-200",
  cancelled:                      "bg-red-100 text-red-800 border border-red-200",
  site_assessment:                "bg-purple-100 text-purple-800 border border-purple-200",
  quote_pending_approval:         "bg-orange-100 text-orange-800 border border-orange-200",
  quote_rejected:                 "bg-red-100 text-red-800 border border-red-200",
  payment_pending:                "bg-amber-100 text-amber-800 border border-amber-200",
  in_progress:                    "bg-emerald-100 text-emerald-800 border border-emerald-200",
  completed_by_handyman:          "bg-cyan-100 text-cyan-800 border border-cyan-200",
  awaiting_customer_confirmation: "bg-yellow-100 text-yellow-800 border border-yellow-200",
  confirmed:                      "bg-green-100 text-green-800 border border-green-200",
  payout_released:                "bg-teal-100 text-teal-800 border border-teal-200",
  closed:                         "bg-slate-100 text-slate-600 border border-slate-200",
  disputed:                       "bg-red-100 text-red-800 border border-red-200",
  default:                        "bg-slate-100 text-slate-700 border border-slate-200",
};

const labelMap: Record<string, string> = {
  on_the_way:                     "On the Way",
  approved:                       "Approved",
  rejected:                       "Rejected",
  pending:                        "Pending",
  active:                         "Active",
  suspended:                      "Suspended",
  requested:                      "Requested",
  accepted:                       "Accepted",
  started:                        "Started",
  completed:                      "Completed",
  cancelled:                      "Cancelled",
  site_assessment:                "At Site",
  quote_pending_approval:         "Quote Pending",
  quote_rejected:                 "Quote Rejected",
  payment_pending:                "Awaiting Payment",
  in_progress:                    "In Progress",
  completed_by_handyman:          "Handyman Done",
  awaiting_customer_confirmation: "Awaiting Confirm",
  confirmed:                      "Confirmed",
  payout_released:                "Payout Released",
  closed:                         "Closed",
  disputed:                       "Disputed",
};

const dotColorMap: Record<string, string> = {
  pending:                        "bg-amber-500",
  approved:                       "bg-green-500",
  active:                         "bg-green-500",
  completed:                      "bg-green-500",
  confirmed:                      "bg-green-500",
  payout_released:                "bg-teal-500",
  in_progress:                    "bg-emerald-500",
  rejected:                       "bg-red-500",
  suspended:                      "bg-red-500",
  cancelled:                      "bg-red-500",
  quote_rejected:                 "bg-red-500",
  disputed:                       "bg-red-500",
  accepted:                       "bg-blue-500",
  on_the_way:                     "bg-indigo-500",
  started:                        "bg-violet-500",
  site_assessment:                "bg-purple-500",
  quote_pending_approval:         "bg-orange-500",
  payment_pending:                "bg-amber-500",
  completed_by_handyman:          "bg-cyan-500",
  awaiting_customer_confirmation: "bg-yellow-500",
  closed:                         "bg-slate-400",
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variant = variantMap[status as BadgeVariant] ?? variantMap.default;
  const label = labelMap[status] ?? status;
  const dot = dotColorMap[status] ?? "bg-slate-400";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium",
        variant,
        className,
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", dot)} />
      {label}
    </span>
  );
}
