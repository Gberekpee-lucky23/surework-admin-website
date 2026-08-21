"use client";

import React, { useState, useTransition } from "react";
import { Modal } from "@/components/ui/Modal";
import { cancelJobAction, updateJobNoteAction } from "../actions";
import { XOctagon, StickyNote, Loader2, AlertTriangle, Save } from "lucide-react";

interface JobActionsClientProps {
  jobId: number;
  jobStatus: string;
  currentNote: string;
}

export function JobActionsClient({ jobId, jobStatus, currentNote }: JobActionsClientProps) {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [note, setNote] = useState(currentNote);
  const [error, setError] = useState<string | null>(null);
  const [noteSaved, setNoteSaved] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isNotePending, startNoteTrans] = useTransition();

  const canCancel = !["cancelled", "completed", "confirmed", "payout_released", "closed"].includes(jobStatus);

  function handleCancel() {
    setError(null);
    startTransition(async () => {
      const fd = new FormData();
      fd.append("jobId", String(jobId));
      const result = await cancelJobAction(fd);
      if (result?.error) setError(result.error);
      else setShowCancelModal(false);
    });
  }

  function handleSaveNote() {
    startNoteTrans(async () => {
      const fd = new FormData();
      fd.append("jobId", String(jobId));
      fd.append("note", note);
      const result = await updateJobNoteAction(fd);
      if (!result?.error) {
        setNoteSaved(true);
        setTimeout(() => setNoteSaved(false), 3000);
      }
    });
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-5">
      <h2 className="font-semibold text-slate-900">Admin Tools</h2>

      {/* Admin Note */}
      <div>
        <label
          htmlFor="admin-note"
          className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1.5"
        >
          <StickyNote size={14} className="text-slate-400" />
          Internal Admin Note{" "}
          <span className="text-xs text-slate-400 font-normal">
            (not visible to customer or handyman)
          </span>
        </label>
        <textarea
          id="admin-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="Add internal notes about this job…"
          className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
        <div className="flex items-center justify-between mt-2">
          {noteSaved && (
            <span className="text-xs text-green-600 font-medium">✓ Note saved</span>
          )}
          <button
            onClick={handleSaveNote}
            disabled={isNotePending}
            className="flex items-center gap-1.5 ml-auto text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg transition-colors font-medium"
          >
            {isNotePending ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Save size={13} />
            )}
            Save Note
          </button>
        </div>
      </div>

      {/* Force Cancel */}
      {canCancel && (
        <div className="pt-3 border-t border-slate-100">
          <button
            id="force-cancel-btn"
            onClick={() => setShowCancelModal(true)}
            className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-medium px-4 py-2 rounded-xl text-sm transition-colors"
          >
            <XOctagon size={14} />
            Force Cancel Job
          </button>
          <p className="text-xs text-slate-400 mt-1.5">
            Use only for disputes or platform violations. This action is logged.
          </p>
        </div>
      )}

      {/* Cancel Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Force Cancel Job"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
            <AlertTriangle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">
              This will force-cancel <strong>Job #{jobId}</strong>. Both the customer
              and handyman will no longer be able to interact with this job. This
              action is logged in the audit trail.
            </p>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowCancelModal(false)}
              className="px-4 py-2 text-sm border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              id="confirm-cancel-job-btn"
              onClick={handleCancel}
              disabled={isPending}
              className="flex items-center gap-2 px-5 py-2 text-sm bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl font-medium transition-colors"
            >
              {isPending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <XOctagon size={14} />
              )}
              Yes, Cancel Job
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
