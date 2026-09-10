"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, AlertCircle, Eye, EyeOff, Lock } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_APP_URL || "https://backend-surework-production.up.railway.app";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const token = searchParams.get("token") ?? "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Validate params on mount
  useEffect(() => {
    if (!email || !token) {
      setError("This reset link is invalid or incomplete. Please request a new one from the app.");
    }
  }, [email, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to reset password. Please request a new link.");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <CheckCircle size={32} className="text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Password Reset!</h2>
        <p className="text-slate-600 text-sm mb-6">
          Your password has been changed successfully. You can now log in to the SureWork app with your new password.
        </p>
        <p className="text-xs text-slate-400">
          Open the SureWork app and log in with your new password.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          New Password
        </label>
        <div className="relative">
          <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="new-password"
            type={showPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="At least 8 characters"
            required
            minLength={8}
            className="w-full pl-9 pr-10 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Confirm Password
        </label>
        <div className="relative">
          <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="confirm-password"
            type={showConfirm ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat your new password"
            required
            minLength={8}
            className="w-full pl-9 pr-10 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
          <button
            type="button"
            onClick={() => setShowConfirm((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            tabIndex={-1}
          >
            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">
          <AlertCircle size={15} className="text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <button
        id="reset-password-submit"
        type="submit"
        disabled={loading || !email || !token}
        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Resetting..." : "Set New Password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo / brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-blue-600 font-bold text-xl">
            SureWork
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 mt-4">Reset Your Password</h1>
          <p className="text-slate-500 text-sm mt-1">
            Enter a new password for your SureWork account.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          {/* Suspense required because useSearchParams() requires it in Next.js 14+ */}
          <Suspense fallback={
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          }>
            <ResetPasswordForm />
          </Suspense>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Didn&apos;t request this?{" "}
          <span className="text-slate-600">You can safely ignore this page.</span>
        </p>
      </div>
    </div>
  );
}
