"use client";

import { useState, useTransition } from "react";
import { Send, Loader2, Check } from "lucide-react";
import { resendGuarantorLinkAction } from "../actions";

export default function ResendGuarantorButton({ userId }: { userId: number }) {
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  const handleResend = () => {
    setMsg(null);
    startTransition(async () => {
      const res = await resendGuarantorLinkAction(userId);
      if (res?.error) {
        setMsg(res.error);
      } else {
        setMsg(res.message || "Link resent successfully!");
      }
    });
  };

  return (
    <div className="space-y-1">
      <button
        onClick={handleResend}
        disabled={isPending}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
      >
        {isPending ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
        Resend Guarantor Link
      </button>
      {msg && <p className="text-[11px] text-blue-600 font-medium">{msg}</p>}
    </div>
  );
}
