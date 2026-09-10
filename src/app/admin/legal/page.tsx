import React from "react";
import Link from "next/link";
import { getAllLegalSummaries } from "@/dal/legal";
import {
  FileText,
  ShieldCheck,
  History,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ArrowRight,
  Sparkles,
  Users,
  Clock,
} from "lucide-react";

export const metadata = {
  title: "Legal Documents — Surework Admin",
};

export default async function LegalAdminPage() {
  const summaries = await getAllLegalSummaries();

  const totalPublished = summaries.filter((s) => s.published).length;
  const totalDrafts = summaries.filter((s) => s.draft).length;
  const totalAcceptances = summaries.reduce((acc, s) => acc + s.currentVersionAcceptances, 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 p-6 md:p-8 text-white shadow-xl">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <ShieldCheck size={14} />
            Compliance & Legal Governance
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Legal Documents & Platform Terms
          </h1>
          <p className="mt-2 text-slate-300 text-sm md:text-base max-w-2xl leading-relaxed">
            Manage terms of service, privacy policy, and artisan agreements with automated versioning, audit logging, batched email notifications, and mobile re-acceptance gating.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80">
            <div>
              <span className="text-xs text-slate-400 font-medium block">Total Managed Documents</span>
              <span className="text-xl font-bold text-white">{summaries.length}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium block">Active Published</span>
              <span className="text-xl font-bold text-emerald-400">{totalPublished} of {summaries.length}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium block">Drafts in Progress</span>
              <span className="text-xl font-bold text-amber-400">{totalDrafts}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium block">Total Re-Acceptances</span>
              <span className="text-xl font-bold text-blue-400">{totalAcceptances.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Decorative ambient blur */}
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {summaries.map((item) => {
          const published = item.published;
          const draft = item.draft;
          const hasDraft = Boolean(draft);

          return (
            <div
              key={item.type}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden"
            >
              <div className="p-6">
                {/* Top badge row */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                    <FileText size={13} className="text-blue-600" />
                    {item.type}
                  </span>

                  <div className="flex items-center gap-2">
                    {hasDraft && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock size={11} />
                        Draft v{draft.version}
                      </span>
                    )}
                    {published ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 size={11} />
                        v{published.version} Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-500">
                        Unpublished
                      </span>
                    )}
                  </div>
                </div>

                {/* Title and description */}
                <h3 className="text-lg font-bold text-slate-900 mb-1.5">{item.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">{item.description}</p>

                {/* Details list */}
                <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs text-slate-600 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Audience Scope:</span>
                    <span className="font-semibold text-slate-800">{item.audience}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Re-acceptance Gate:</span>
                    <span className="font-semibold text-slate-800">{item.requiredFor}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Last Published:</span>
                    <span className="font-semibold text-slate-800">
                      {published?.publishedAt
                        ? new Date(published.publishedAt).toLocaleDateString("en-NG", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "Never"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Active Acceptances:</span>
                    <span className="font-semibold text-blue-600">
                      {item.currentVersionAcceptances.toLocaleString()} users
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-3">
                <a
                  href={`/${item.route}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
                >
                  <ExternalLink size={13} />
                  Public Page
                </a>

                <Link
                  href={`/admin/legal/${item.type}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all duration-150"
                >
                  Edit & Manage
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
