"use client";

import React, { useActionState } from "react";
import Image from "next/image";
import { loginAction } from "./actions";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const initialState = { error: "" };

function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) => {
      const result = await loginAction(formData);
      return result ?? initialState;
    },
    initialState
  );

  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          {state.error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
          placeholder="admin@surework.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            className="w-full px-4 py-2.5 pr-11 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 px-4 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 mt-6"
      >
        {isPending ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Signing in…
          </>
        ) : (
          "Sign in"
        )}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-full bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 shadow-lg">
              <Image
                src="/images/surework-logo.png"
                alt="Surework logo"
                width={40}
                height={40}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Surework Admin</h1>
              <p className="text-xs text-slate-500">Marketplace Management</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-900">Welcome back</h2>
            <p className="text-sm text-slate-500 mt-1">
              Sign in to your admin account to continue
            </p>
          </div>

          <LoginForm />

          <p className="text-xs text-slate-400 text-center mt-6">
            Admin accounts are created by your system administrator.
          </p>
        </div>
      </div>
    </div>
  );
}
