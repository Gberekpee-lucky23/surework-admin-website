"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useTheme } from "@/components/website/ThemeProvider";
import { SectionHeading } from "@/components/website/SectionHeading";
import { ShieldCheck, Calendar, FileText } from "lucide-react";

interface LegalDocumentViewProps {
  document: {
    title: string;
    version: number;
    content: string;
    publishedAt: string | Date | null;
  } | null;
  badge: string;
  title: string;
  titleGradient: string;
  complianceNotice?: string;
}

export function LegalDocumentView({
  document,
  badge,
  title,
  titleGradient,
  complianceNotice,
}: LegalDocumentViewProps) {
  const { isDark } = useTheme();

  const formattedDate = document?.publishedAt
    ? new Date(document.publishedAt).toLocaleDateString("en-NG", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "August 21, 2026";

  const versionText = document?.version ? `Version ${document.version} • ` : "";

  return (
    <div className="space-y-10 pb-20 pt-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Heading */}
      <SectionHeading
        badge={badge}
        title={title}
        titleGradient={titleGradient}
        subtitle={`${versionText}Last updated: ${formattedDate}. Please review this document carefully.`}
      />

      {/* Compliance / Regulatory Callout */}
      {complianceNotice && (
        <div
          className={`p-5 rounded-2xl border text-xs sm:text-sm leading-relaxed flex items-start gap-3.5 ${
            isDark
              ? "bg-blue-950/20 border-blue-500/30 text-blue-300"
              : "bg-blue-50 border-blue-200 text-blue-800"
          }`}
        >
          <ShieldCheck className="shrink-0 mt-0.5 text-blue-500" size={20} />
          <div>
            <span className="font-bold block mb-1">Regulatory & Statutory Notice</span>
            {complianceNotice}
          </div>
        </div>
      )}

      {/* Markdown Content */}
      <div
        className={`prose max-w-none space-y-6 text-sm sm:text-base leading-relaxed ${
          isDark
            ? "prose-invert text-slate-300 prose-headings:text-white prose-strong:text-white prose-a:text-blue-400"
            : "text-slate-700 prose-headings:text-slate-900 prose-strong:text-slate-900 prose-a:text-blue-600"
        }`}
      >
        {document?.content ? (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {document.content}
          </ReactMarkdown>
        ) : (
          <div className="py-12 text-center text-slate-400">
            <FileText size={32} className="mx-auto mb-2 opacity-50" />
            <p>Document content is being loaded or has not yet been published.</p>
          </div>
        )}
      </div>
    </div>
  );
}
