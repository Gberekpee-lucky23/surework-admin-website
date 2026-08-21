"use client";

import React, { useState, useTransition } from "react";
import { Modal } from "@/components/ui/Modal";
import { approveApplicationAction, rejectApplicationAction } from "./actions";
import { CheckCircle, XCircle, Loader2, AlertTriangle, ShieldAlert } from "lucide-react";

interface ApplicationActionsProps {
  userId: number;
  applicantName: string;
  currentStatus: string;
  guarantorConfirmed?: boolean;
}

export function ApplicationActions({
  userId,
  applicantName,
  currentStatus,
  guarantorConfirmed = false,
}: ApplicationActionsProps) {
  const [modal, setModal] = useState<"approve" | "reject" | null>(null);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleApprove() {
    if (!guarantorConfirmed) {
      setError("Cannot approve: Applicant's guarantor has not confirmed their declaration yet.");
      return;
    }
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const fd = new FormData();
      fd.append("userId", String(userId));
      const result = await approveApplicationAction(fd);
      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess("Application approved successfully.");
        setModal(null);
      }
    });
  }

  function handleReject() {
    if (!reason.trim()) {
      setError("Please provide a rejection reason.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const fd = new FormData();
      fd.append("userId", String(userId));
      fd.append("reason", reason);
      const result = await rejectApplicationAction(fd);
      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess("Application rejected.");
        setModal(null);
        setReason("");
      }
    });
  }

  if (currentStatus !== "pending") {
    return (
      <div className="text-sm text-slate-500 italic">
        This application has already been {currentStatus}.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
          {success}
        </div>
      )}

      {!guarantorConfirmed && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-center gap-3 text-xs text-amber-800 font-medium">
          <ShieldAlert size={18} className="text-amber-600 flex-shrink-0" />
          <span>
            <strong>Approval Blocked:</strong> Guarantor confirmation is pending. You cannot approve this application until the guarantor confirms their endorsement.
          </span>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          id="approve-btn"
          disabled={!guarantorConfirmed}
          title={!guarantorConfirmed ? "Guarantor confirmation is required before approval." : undefined}
          onClick={() => { setError(null); setModal("approve"); }}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-medium px-5 py-2.5 rounded-xl text-sm transition-colors"
        >
          <CheckCircle size={16} />
          Approve Application
        </button>
        <button
          id="reject-btn"
          onClick={() => { setError(null); setModal("reject"); }}
          className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-medium px-5 py-2.5 rounded-xl text-sm transition-colors"
        >
          <XCircle size={16} />
          Reject Application
        </button>
      </div>

      {/* Approve Confirmation Modal */}
      <Modal
        isOpen={modal === "approve"}
        onClose={() => setModal(null)}
        title="Confirm Approval"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
            <CheckCircle size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-800">
                Approving application for <strong>{applicantName}</strong>
              </p>
              <p className="text-xs text-green-700 mt-1">
                This will grant them handyman access on the platform. They will be
                able to accept and complete jobs immediately.
              </p>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setModal(null)}
              className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              id="confirm-approve-btn"
              onClick={handleApprove}
              disabled={isPending || !guarantorConfirmed}
              className="flex items-center gap-2 px-5 py-2 text-sm bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-xl font-medium transition-colors"
            >
              {isPending ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
              Yes, Approve
            </button>
          </div>
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={modal === "reject"}
        onClose={() => { setModal(null); setError(null); }}
        title="Reject Application"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
            <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">
                Rejecting application for <strong>{applicantName}</strong>
              </p>
              <p className="text-xs text-amber-700 mt-1">
                The applicant will be notified of the rejection. They may re-apply
                after addressing the issues you specify below.
              </p>
            </div>
          </div>

          <div>
            <label
              htmlFor="rejection-reason"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Rejection reason{" "}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              id="rejection-reason"
              value={reason}
              onChange={(e) => { setReason(e.target.value); setError(null); }}
              rows={4}
              placeholder="Explain why this application is being rejected..."
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <p className="text-xs text-slate-400 mt-1">
              This reason will be shown to the applicant in their mobile app.
            </p>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => { setModal(null); setError(null); setReason(""); }}
              className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              id="confirm-reject-btn"
              onClick={handleReject}
              disabled={isPending || !reason.trim()}
              className="flex items-center gap-2 px-5 py-2 text-sm bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white rounded-xl font-medium transition-colors"
            >
              {isPending ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
              Reject Application
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
