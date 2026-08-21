"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { toggleBankVerificationAction } from "../actions";

export default function BankVerificationToggle({
  userId,
  initialVerified,
}: {
  userId: number;
  initialVerified: boolean;
}) {
  const [verified, setVerified] = useState(initialVerified);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    const nextState = !verified;
    setVerified(nextState);
    startTransition(async () => {
      await toggleBankVerificationAction(userId, nextState);
    });
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleToggle}
        disabled={isPending}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
          verified
            ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
            : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
        }`}
      >
        {isPending ? (
          <Loader2 size={13} className="animate-spin" />
        ) : verified ? (
          <CheckCircle2 size={13} className="text-emerald-600" />
        ) : (
          <AlertCircle size={13} className="text-slate-400" />
        )}
        {verified ? "Verified Account Name" : "Mark as Verified"}
      </button>
    </div>
  );
}
