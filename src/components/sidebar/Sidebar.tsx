"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Briefcase,
  Grid3X3,
  Star,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  LogOut,
  X,
  CreditCard,
  AlertTriangle,
  Settings,
  MessageSquare,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/applications", label: "Applications", icon: ClipboardList },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/jobs", label: "Jobs", icon: Briefcase },
  { href: "/admin/payments", label: "Payments & Payouts", icon: CreditCard },
  { href: "/admin/disputes", label: "Disputes", icon: AlertTriangle },
  { href: "/admin/categories", label: "Categories", icon: Grid3X3 },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/communications", label: "Communications", icon: MessageSquare },
  { href: "/admin/legal", label: "Legal Documents", icon: FileText },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  adminName: string;
  pendingCount?: number;
  mobileOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ adminName, pendingCount = 0, mobileOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile backdrop overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 transition-opacity duration-300 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "flex flex-col h-full bg-slate-900 text-white transition-all duration-300 ease-in-out",
          // Mobile positions: overlay drawer that slides in/out
          "fixed inset-y-0 left-0 z-50 w-64 transform -translate-x-full md:translate-x-0",
          mobileOpen && "translate-x-0",
          // Desktop positions: static sidebar
          "md:static md:flex md:flex-shrink-0",
          collapsed ? "md:w-16" : "md:w-64"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-700/50">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg overflow-hidden">
            <Image
              src="/images/surework-logo.png"
              alt="Surework logo"
              width={32}
              height={32}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <div className={cn("block", collapsed && "md:hidden")}>
            <span className="font-bold text-sm text-white">Surework</span>
            <span className="block text-xs text-slate-400">Admin Panel</span>
          </div>

          {/* Desktop collapse button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "hidden md:block ml-auto p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors",
              collapsed && "mx-auto"
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>

          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="block md:hidden ml-auto p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            aria-label="Close navigation menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            const isPending = item.href === "/admin/applications" && pendingCount > 0;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose} // Auto-close sidebar on link click on mobile viewports
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group",
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon
                  size={18}
                  className={cn(
                    "flex-shrink-0 transition-transform group-hover:scale-110",
                    isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                  )}
                />
                <span className={cn("block", collapsed && "md:hidden", "flex-1 truncate")}>
                  {item.label}
                </span>
                {isPending && (
                  <span
                    className={cn(
                      "flex-shrink-0 bg-amber-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center",
                      collapsed && "md:hidden"
                    )}
                  >
                    {pendingCount > 99 ? "99+" : pendingCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User info + logout */}
        <div className="border-t border-slate-700/50 p-3">
          <div className={cn("flex items-center gap-3 px-2 py-2 rounded-xl", collapsed && "md:justify-center")}>
            <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
              {adminName.charAt(0).toUpperCase()}
            </div>
            <div className={cn("flex-1 min-w-0", collapsed && "md:hidden")}>
              <p className="text-sm font-medium text-white truncate">{adminName}</p>
              <p className="text-xs text-slate-400">Administrator</p>
            </div>
            <form action="/api/auth/logout" method="POST" className={cn("block", collapsed && "md:hidden")}>
              <button
                type="submit"
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                aria-label="Sign out"
              >
                <LogOut size={16} />
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}
