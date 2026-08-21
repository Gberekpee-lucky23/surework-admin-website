"use client";

import React, { useState, useTransition } from "react";
import { Modal } from "@/components/ui/Modal";
import { suspendUserAction, reactivateUserAction } from "./actions";
import { Ban, RefreshCw, Loader2, AlertTriangle } from "lucide-react";

interface UserActionsProps {
  userId: number;
  userName: string;
  currentStatus: string;
}

export function UserActions({ userId, userName, currentStatus }: UserActionsProps) {
  const [modal, setModal] = useState<"suspend" | "reactivate" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleAction(action: "suspend" | "reactivate") {
    setError(null);
    startTransition(async () => {
      const fd = new FormData();
      fd.append("userId", String(userId));
      const result =
        action === "suspend"
          ? await suspendUserAction(fd)
          : await reactivateUserAction(fd);
      if (result?.error) setError(result.error);
      else setModal(null);
    });
  }

  return (
    <>
      {currentStatus === "active" ? (
        <button
          id="suspend-user-btn"
          onClick={() => setModal("suspend")}
          className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-medium px-4 py-2 rounded-xl text-sm transition-colors"
        >
          <Ban size={14} />
          Suspend Account
        </button>
      ) : (
        <button
          id="reactivate-user-btn"
          onClick={() => setModal("reactivate")}
          className="flex items-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 font-medium px-4 py-2 rounded-xl text-sm transition-colors"
        >
          <RefreshCw size={14} />
          Reactivate Account
        </button>
      )}

      <Modal
        isOpen={modal !== null}
        onClose={() => { setModal(null); setError(null); }}
        title={modal === "suspend" ? "Suspend Account" : "Reactivate Account"}
      >
        <div className="space-y-4">
          <div
            className={`flex items-start gap-3 p-4 rounded-xl border ${
              modal === "suspend"
                ? "bg-red-50 border-red-200"
                : "bg-green-50 border-green-200"
            }`}
          >
            <AlertTriangle
              size={18}
              className={
                modal === "suspend" ? "text-red-600 flex-shrink-0 mt-0.5" : "text-green-600 flex-shrink-0 mt-0.5"
              }
            />
            <p
              className={`text-sm ${
                modal === "suspend" ? "text-red-700" : "text-green-700"
              }`}
            >
              {modal === "suspend" ? (
                <>
                  Are you sure you want to <strong>suspend {userName}</strong>?
                  Their account will be locked and the mobile app backend will reject
                  their login attempts immediately.
                </>
              ) : (
                <>
                  Are you sure you want to <strong>reactivate {userName}</strong>?
                  They will regain full access to the platform.
                </>
              )}
            </p>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3">
            <button
              onClick={() => { setModal(null); setError(null); }}
              className="px-4 py-2 text-sm border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              id="confirm-user-action-btn"
              onClick={() => handleAction(modal!)}
              disabled={isPending}
              className={`flex items-center gap-2 px-5 py-2 text-sm text-white rounded-xl font-medium transition-colors disabled:opacity-50 ${
                modal === "suspend"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isPending && <Loader2 size={14} className="animate-spin" />}
              {modal === "suspend" ? "Suspend Account" : "Reactivate Account"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
