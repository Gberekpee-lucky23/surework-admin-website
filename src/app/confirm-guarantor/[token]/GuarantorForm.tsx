"use client";

import { useState } from "react";
import { Check, X, Loader2 } from "lucide-react";

export default function GuarantorForm({
  token,
  defaultName,
}: {
  token: string;
  defaultName: string;
}) {
  const [signatureName, setSignatureName] = useState(defaultName || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (action: "confirm" | "decline") => {
    try {
      setLoading(true);
      setError(null);

      if (action === "confirm" && !signatureName.trim()) {
        setError("Please enter your full name as your digital e-signature.");
        setLoading(false);
        return;
      }

      // Call API (either relative to backend API or local route handler)
      const res = await fetch(`/api/guarantor-confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          signatureName: signatureName.trim(),
          action,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to process request");
      }

      setSuccessMsg(data.message || "Thank you! Your decision has been saved.");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (successMsg) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center text-emerald-800 text-sm font-medium">
        {successMsg}
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-2">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-3">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Type Full Name (Digital E-Signature) <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={signatureName}
          onChange={(e) => setSignatureName(e.target.value)}
          placeholder="Enter your official full name"
          className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium text-slate-900 bg-white"
        />
        <p className="text-[11px] text-slate-400 mt-1">
          By typing your name above and clicking Confirm, you legally accept the terms of the guarantor declaration.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="button"
          onClick={() => handleSubmit("confirm")}
          disabled={loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.99]"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <>
              <Check size={18} />
              Confirm & Sign Guarantor Declaration
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => handleSubmit("decline")}
          disabled={loading}
          className="bg-slate-100 hover:bg-red-50 hover:text-red-600 disabled:opacity-50 text-slate-600 font-semibold py-3.5 px-5 rounded-xl flex items-center justify-center gap-2 transition-all border border-slate-200"
        >
          <X size={16} />
          Decline
        </button>
      </div>
    </div>
  );
}
