"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle, XCircle, AlertTriangle, ShieldCheck } from "lucide-react";

interface StuckPaymentActionsClientProps {
  paymentId: number;
  reference: string | null;
  jobId: number | null;
  amount: number;
  customerName: string | null;
}

export function StuckPaymentActionsClient({
  paymentId,
  reference,
  jobId,
  amount,
  customerName,
}: StuckPaymentActionsClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultStatus, setResultStatus] = useState<string | null>(null);
  const [resultMessage, setResultMessage] = useState<string | null>(null);

  const formattedAmount = `NGN ${(amount / 100).toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;

  async function handleReconcile() {
    if (!reference) {
      setError("No gateway reference found for this payment.");
      return;
    }
    setShowConfirm(false);
    setError(null);
    setResultStatus(null);
    setResultMessage(null);

    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/payments/reconcile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference }),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          setError(data.error || "Failed to reconcile payment");
          return;
        }

        setResultStatus(data.status || (data.success ? "succeeded" : "pending"));
        setResultMessage(data.message || "Reconciliation completed.");
        router.refresh();
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred");
      }
    });
  }

  return (
    <div className="flex flex-col gap-2 min-w-[160px]">
      {error && (
        <div className="text-[11px] text-red-700 bg-red-50 border border-red-200 rounded-lg p-2">
          ⚠ {error}
        </div>
      )}

      {resultStatus && (
        <div
          className={`text-[11px] p-2 rounded-lg font-medium border flex items-center gap-1.5 ${
            resultStatus === "succeeded" || resultStatus === "already_processed"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : resultStatus === "failed"
              ? "bg-red-50 text-red-800 border-red-200"
              : "bg-amber-50 text-amber-800 border-amber-200"
          }`}
        >
          {resultStatus === "succeeded" || resultStatus === "already_processed" ? (
            <CheckCircle size={14} className="text-emerald-600 flex-shrink-0" />
          ) : resultStatus === "failed" ? (
            <XCircle size={14} className="text-red-600 flex-shrink-0" />
          ) : (
            <AlertTriangle size={14} className="text-amber-600 flex-shrink-0" />
          )}
          <span>{resultMessage || `Status: ${resultStatus}`}</span>
        </div>
      )}

      {!resultStatus && (
        <>
          <button
            onClick={() => setShowConfirm(true)}
            disabled={isPending}
            className="flex items-center justify-center gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg font-semibold transition-colors disabled:opacity-50 shadow-sm"
          >
            {isPending ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                <span>Verifying Paystack...</span>
              </>
            ) : (
              <>
                <ShieldCheck size={14} />
                <span>Verify with Paystack</span>
              </>
            )}
          </button>

          {/* Consequential Confirmation Dialog */}
          {showConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 max-w-md w-full space-y-4 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-100 text-amber-700 rounded-xl">
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Verify Payment with Paystack</h3>
                    <p className="text-xs text-slate-500">Consequential Financial Action</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  You are about to query Paystack for reference{" "}
                  <code className="font-mono bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded font-bold text-[11px]">
                    {reference}
                  </code>
                  .
                </p>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1 text-slate-700">
                  <p>
                    <strong>Customer:</strong> {customerName || "Customer"}
                  </p>
                  <p>
                    <strong>Amount:</strong> {formattedAmount}
                  </p>
                  {jobId && (
                    <p>
                      <strong>Target Job:</strong> #{jobId}
                    </p>
                  )}
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 leading-normal">
                  ⚠ <strong>Note:</strong> If Paystack confirms this payment was successful, this action will immediately mark the payment paid, record immutable ledger entries, and advance the job to in-progress.
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => setShowConfirm(false)}
                    disabled={isPending}
                    className="text-xs px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReconcile}
                    disabled={isPending}
                    className="text-xs px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    {isPending ? <Loader2 size={13} className="animate-spin" /> : <ShieldCheck size={14} />}
                    Confirm & Verify
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
