"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Menu, Wrench } from "lucide-react";

interface AdminShellProps {
  adminName: string;
  pendingCount: number;
  children: React.ReactNode;
}

export function AdminShell({ adminName, pendingCount, children }: AdminShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-full relative overflow-hidden">
      {/* Sidebar Component */}
      <Sidebar
        adminName={adminName}
        pendingCount={pendingCount}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Top bar (Header) */}
        <header className="flex-shrink-0 bg-white border-b border-slate-200 px-4 md:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Hamburger Button for Mobile */}
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 -ml-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors md:hidden"
              aria-label="Open navigation menu"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2 md:hidden">
              <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center">
                <Wrench size={14} className="text-white" />
              </div>
              <span className="font-bold text-sm text-slate-900">Surework</span>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {pendingCount > 0 && (
              <a
                href="/admin/applications?status=pending"
                className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 md:px-3 py-1 md:py-1.5 rounded-lg hover:bg-amber-100 transition-colors font-medium"
              >
                <span className="w-1.5 md:w-2 h-1.5 md:h-2 bg-amber-500 rounded-full animate-pulse" />
                <span className="hidden sm:inline">
                  {pendingCount} application{pendingCount !== 1 ? "s" : ""} pending review
                </span>
                <span className="inline sm:hidden">
                  {pendingCount} Pending
                </span>
              </a>
            )}
            <span className="text-xs md:text-sm text-slate-500">
              <span className="hidden sm:inline">Signed in as </span>
              <span className="font-medium text-slate-900">{adminName}</span>
            </span>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-auto bg-slate-50 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
