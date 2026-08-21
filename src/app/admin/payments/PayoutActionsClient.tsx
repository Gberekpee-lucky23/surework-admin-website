"use client";

import React, { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle, XCircle, Send, AlertTriangle } from "lucide-react";

interface PayoutActionsClientProps {
  requestId: number;
  status: string;
  handymanName: string | null;
}

export function PayoutActionsClient({ requestId, status, handymanName }: PayoutActionsClientProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [action, setAction] = useState<string | null>(null);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const reasonRef = useRef<HTMLInputElement>(null);

  async function callAction(endpoint: string, body?: Record<string, string>) {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/payouts/${requestId}/${endpoint}`, {
          method: "POST",
          headers: body ? { "Content-Type": "application/json" } : undefined,
          body: body ? JSON.stringify(body) : undefined,
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok && res.status !== 302 && res.status !== 303) {
          setError(data.error || `Failed to ${endpoint} payout request`);
        } else {
          router.refresh();
        }
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred");
      }
    });
  }

  function handleApprove() {
    setAction("approve");
    callAction("approve");
  }

  function handleInitiateTransfer() {
    setAction("initiate-transfer");
    callAction("initiate-transfer");
  }

  function handleReject() {
    const reason = reasonRef.current?.value?.trim();
    if (!reason) {
      setError("Please enter a rejection reason.");
      return;
    }
    setAction("reject");
    callAction("reject", { reason });
  }

  return (
    <div className="flex flex-col gap-1.5">
      {error && (
        <p className="text-[10px] text-red-600 font-semibold bg-red-50 border border-red-200 rounded px-2 py-1">
          ⚠ {error}
        </p>
      )}

      {status === "pending" && (
        <button
          onClick={handleApprove}
          disabled={isPending}
          className="w-full flex items-center justify-center gap-1.5 text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50"
        >
          {isPending && action === "approve" ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <CheckCircle size={12} />
          )}
          Approve Request
        </button>
      )}

      {status === "approved" && (
        <button
          onClick={handleInitiateTransfer}
          disabled={isPending}
          className="w-full flex items-center justify-center gap-1.5 text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isPending && action === "initiate-transfer" ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <Send size={12} />
          )}
          Initiate Payment
        </button>
      )}

      {(status === "pending" || status === "approved") && (
        <>
          {!showRejectForm ? (
            <button
              onClick={() => setShowRejectForm(true)}
              disabled={isPending}
              className="w-full text-xs bg-red-50 text-red-700 border border-red-200 px-2 py-1 rounded-lg font-semibold hover:bg-red-100 transition-colors disabled:opacity-50"
            >
              Reject
            </button>
          ) : (
            <div className="flex gap-1">
              <input
                ref={reasonRef}
                type="text"
                placeholder="Rejection reason..."
                className="text-[11px] border border-slate-200 rounded px-2 py-1 flex-1 focus:outline-none focus:ring-1 focus:ring-red-400"
                onKeyDown={(e) => e.key === "Enter" && handleReject()}
              />
              <button
                onClick={handleReject}
                disabled={isPending}
                className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded font-semibold hover:bg-red-200 transition-colors disabled:opacity-50"
              >
                {isPending && action === "reject" ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <XCircle size={12} />
                )}
              </button>
              <button
                onClick={() => { setShowRejectForm(false); setError(null); }}
                className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-semibold hover:bg-slate-200 transition-colors"
              >
                ×
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
