"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowLeft,
  FileText,
  Save,
  Send,
  History,
  CheckCircle2,
  Clock,
  ExternalLink,
  Users,
  AlertTriangle,
  Eye,
  Edit3,
  Loader2,
  HelpCircle,
  Copy,
  Check,
  ShieldCheck,
} from "lucide-react";
import { saveDraftAction, publishDocumentAction } from "../actions";

interface Props {
  documentType: string;
  config: {
    type: string;
    title: string;
    route: string;
    description: string;
    audience: string;
    requiredFor: string;
  };
  published: any;
  draft: any;
  history: any[];
  acceptancesCount: number;
  totalEligibleUsers: number;
}

export function LegalDocumentEditorClient({
  documentType,
  config,
  published,
  draft,
  history,
  acceptancesCount,
  totalEligibleUsers,
}: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"editor" | "history" | "compliance">("editor");

  // Editor states
  const initialContent = draft?.content || published?.content || "# " + config.title + "\n\nEnter content here...";
  const initialTitle = draft?.title || published?.title || config.title;
  const initialChangelog = draft?.changelog || "";

  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [changelog, setChangelog] = useState(initialChangelog);

  const [isPending, startTransition] = useTransition();
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [selectedHistoryDoc, setSelectedHistoryDoc] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  // Next version calculation
  const currentPublishedVersion = published?.version || 0;
  const nextVersion = draft ? draft.version : currentPublishedVersion + 1;

  // Insert markdown helper
  const insertMarkdown = (prefix: string, suffix: string = "") => {
    const textarea = document.getElementById("markdown-editor") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const replacement = prefix + (selectedText || "text") + suffix;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selectedText.length || 4));
    }, 50);
  };

  const handleSaveDraft = () => {
    setSaveMessage(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.append("documentType", documentType);
      formData.append("title", title);
      formData.append("content", content);
      formData.append("changelog", changelog);

      const res = await saveDraftAction(formData);
      if (res?.error) {
        setSaveMessage({ type: "error", text: res.error });
      } else {
        setSaveMessage({ type: "success", text: `Draft v${res.draft?.version || nextVersion} saved successfully.` });
        setTimeout(() => setSaveMessage(null), 4000);
      }
    });
  };

  const handleConfirmPublish = () => {
    setSaveMessage(null);
    startTransition(async () => {
      // 1. Save draft content first
      const draftFd = new FormData();
      draftFd.append("documentType", documentType);
      draftFd.append("title", title);
      draftFd.append("content", content);
      draftFd.append("changelog", changelog);
      await saveDraftAction(draftFd);

      // 2. Publish
      const publishFd = new FormData();
      publishFd.append("documentType", documentType);
      publishFd.append("changelog", changelog);

      const res = await publishDocumentAction(publishFd);
      if (res?.error) {
        setSaveMessage({ type: "error", text: res.error });
        setShowPublishModal(false);
      } else {
        setShowPublishModal(false);
        setSaveMessage({
          type: "success",
          text: `Version ${res.version} successfully published! Notification email batch queued.`,
        });
        setTimeout(() => setSaveMessage(null), 5000);
      }
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Breadcrumb & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/legal"
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold text-slate-900">{config.title}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                {documentType}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{config.description}</p>
          </div>
        </div>

        {/* Status badges & public link */}
        <div className="flex items-center gap-2.5">
          <a
            href={`/${config.route}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <ExternalLink size={13} />
            Public Route (/{config.route})
          </a>

          {published && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 size={12} />
              v{published.version} Published
            </span>
          )}
          {draft && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
              <Clock size={12} />
              v{draft.version} Draft
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("editor")}
          className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all duration-150 flex items-center gap-2 ${
            activeTab === "editor"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Edit3 size={15} />
          Editor & Preview
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all duration-150 flex items-center gap-2 ${
            activeTab === "history"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <History size={15} />
          Version History ({history.length})
        </button>

        <button
          onClick={() => setActiveTab("compliance")}
          className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all duration-150 flex items-center gap-2 ${
            activeTab === "compliance"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Users size={15} />
          Compliance & Acceptances
        </button>
      </div>

      {/* Notification banner */}
      {saveMessage && (
        <div
          className={`p-4 rounded-xl text-xs sm:text-sm font-medium border transition-all duration-200 flex items-center justify-between ${
            saveMessage.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          <span>{saveMessage.text}</span>
          <button onClick={() => setSaveMessage(null)} className="text-slate-400 hover:text-slate-700">
            &times;
          </button>
        </div>
      )}

      {/* ── TAB 1: EDITOR & PREVIEW ── */}
      {activeTab === "editor" && (
        <div className="space-y-5">
          {/* Document Title input */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Document Display Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Terms and Conditions"
            />
          </div>

          {/* Editor + Preview Split View */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Editor Pane */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm flex flex-col overflow-hidden">
              {/* Toolbar */}
              <div className="p-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center gap-1">
                <button
                  type="button"
                  onClick={() => insertMarkdown("**", "**")}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg hover:bg-slate-200 text-slate-700"
                  title="Bold"
                >
                  B
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown("*", "*")}
                  className="px-2.5 py-1 text-xs italic font-serif rounded-lg hover:bg-slate-200 text-slate-700"
                  title="Italic"
                >
                  I
                </button>
                <div className="h-4 w-px bg-slate-300 mx-1" />
                <button
                  type="button"
                  onClick={() => insertMarkdown("## ")}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg hover:bg-slate-200 text-slate-700"
                  title="Heading 2"
                >
                  H2
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown("### ")}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg hover:bg-slate-200 text-slate-700"
                  title="Heading 3"
                >
                  H3
                </button>
                <div className="h-4 w-px bg-slate-300 mx-1" />
                <button
                  type="button"
                  onClick={() => insertMarkdown("- ")}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg hover:bg-slate-200 text-slate-700"
                  title="Bullet List"
                >
                  • List
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown("> ")}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg hover:bg-slate-200 text-slate-700"
                  title="Quote / Callout"
                >
                  ❝ Quote
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown("[", "](https://)")}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg hover:bg-slate-200 text-slate-700"
                  title="Link"
                >
                  🔗 Link
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown("\n| Column 1 | Column 2 |\n|---|---|\n| Item 1 | Item 2 |\n")}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg hover:bg-slate-200 text-slate-700"
                  title="Table"
                >
                  ⊞ Table
                </button>
              </div>

              {/* Textarea */}
              <div className="relative flex-1 p-3">
                <textarea
                  id="markdown-editor"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full h-[550px] p-3 font-mono text-xs sm:text-sm text-slate-800 bg-transparent border-none resize-none focus:outline-none leading-relaxed"
                  placeholder="Type or paste markdown content here..."
                />
              </div>

              {/* Footer stats */}
              <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>{content.split(/\s+/).filter(Boolean).length} words</span>
                <span>{content.length} characters</span>
              </div>
            </div>

            {/* Live Preview Pane */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm flex flex-col overflow-hidden">
              <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Eye size={14} className="text-blue-600" />
                  Live Reader Preview
                </span>
                <span className="text-xs text-slate-400">Renders as shown to users</span>
              </div>

              <div className="p-6 h-[585px] overflow-y-auto prose max-w-none text-slate-700 text-sm leading-relaxed">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content}
                </ReactMarkdown>
              </div>
            </div>
          </div>

          {/* Changelog Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Changelog / Release Summary <span className="text-slate-400 font-normal">(Included in user update emails)</span>
            </label>
            <textarea
              value={changelog}
              onChange={(e) => setChangelog(e.target.value)}
              rows={2}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
              placeholder="e.g. Updated Nigerian FCCPA compliance clause, clarified cancellation terms for inspection bookings."
            />
          </div>

          {/* Action Bar */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              Editing target: <strong className="text-slate-800">Version {nextVersion}</strong>
              {published && <span> (Current published is v{published.version})</span>}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={isPending}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs sm:text-sm font-bold text-slate-700 shadow-sm transition-all duration-150 disabled:opacity-60"
              >
                {isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                Save Draft v{nextVersion}
              </button>

              <button
                type="button"
                onClick={() => setShowPublishModal(true)}
                disabled={isPending}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-sm transition-all duration-150 disabled:opacity-60"
              >
                <Send size={14} />
                Publish Version {nextVersion}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: VERSION HISTORY ── */}
      {activeTab === "history" && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Document Version History</h3>
              <p className="text-xs text-slate-500">Immutable audit trail of all previous revisions and drafts.</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {history.map((item) => (
              <div key={item.id} className="p-5 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-sm font-bold text-slate-900">v{item.version}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        item.status === "published"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : item.status === "draft"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {item.status.toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-400">
                      {item.publishedAt
                        ? `Published on ${new Date(item.publishedAt).toLocaleDateString("en-NG", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}`
                        : `Created ${new Date(item.createdAt).toLocaleDateString("en-NG")}`}
                    </span>
                  </div>
                  {item.changelog && (
                    <p className="text-xs text-slate-600 bg-slate-100/70 px-3 py-1.5 rounded-lg max-w-2xl">
                      <strong>Changelog:</strong> {item.changelog}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedHistoryDoc(item)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
                  >
                    <Eye size={13} />
                    Inspect Content
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setContent(item.content);
                      setTitle(item.title);
                      setActiveTab("editor");
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-xs font-semibold text-white transition-colors"
                  >
                    <Copy size={13} />
                    Load into Editor
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 3: COMPLIANCE & ACCEPTANCES ── */}
      {activeTab === "compliance" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
              <span className="text-xs font-bold text-slate-500 uppercase block mb-1">Active Version</span>
              <span className="text-2xl font-black text-slate-900">v{currentPublishedVersion}</span>
              <span className="text-xs text-slate-500 block mt-1">Currently enforced across apps</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
              <span className="text-xs font-bold text-slate-500 uppercase block mb-1">Confirmed Acceptances</span>
              <span className="text-2xl font-black text-blue-600">{acceptancesCount.toLocaleString()}</span>
              <span className="text-xs text-slate-500 block mt-1">Users who accepted v{currentPublishedVersion}</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
              <span className="text-xs font-bold text-slate-500 uppercase block mb-1">Total Eligible Users</span>
              <span className="text-2xl font-black text-slate-900">{totalEligibleUsers.toLocaleString()}</span>
              <span className="text-xs text-slate-500 block mt-1">Target audience: {config.audience}</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
            <div className="flex justify-between items-center text-sm font-semibold">
              <span className="text-slate-800">Overall Re-acceptance Completion Rate</span>
              <span className="text-blue-600">
                {totalEligibleUsers > 0
                  ? Math.min(100, Math.round((acceptancesCount / totalEligibleUsers) * 100))
                  : 0}
                %
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-500"
                style={{
                  width: `${
                    totalEligibleUsers > 0
                      ? Math.min(100, Math.round((acceptancesCount / totalEligibleUsers) * 100))
                      : 0
                  }%`,
                }}
              />
            </div>
            <p className="text-xs text-slate-500">
              Users who haven&apos;t accepted yet will see the non-dismissible Acceptance Gate modal upon opening the mobile app or resuming the app.
            </p>
          </div>

          {/* Information callout */}
          <div className="bg-blue-50/60 border border-blue-200/70 p-5 rounded-2xl text-xs sm:text-sm text-blue-950 space-y-2">
            <div className="font-bold flex items-center gap-2">
              <ShieldCheck size={16} className="text-blue-600" />
              Automated Compliance Enforcement
            </div>
            <p className="text-blue-900/90 leading-relaxed">
              When a new version is published:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-blue-900/90">
              <li>The previous version is automatically archived in the database.</li>
              <li>A background email job is enqueued in <code>email_jobs</code>, delivering transactional notices in batches of 50 via Mailjet.</li>
              <li>Active mobile app users are prompted with a full-screen, non-dismissible re-acceptance gate requiring scroll-to-bottom confirmation.</li>
              <li>All acceptances record the user ID, timestamp, IP address, and user-agent string for legal audit readiness.</li>
            </ul>
          </div>
        </div>
      )}

      {/* ── PUBLISH CONFIRMATION MODAL ── */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Publish Version {nextVersion}?</h3>
                <p className="text-xs text-slate-500">This action takes immediate effect across all platforms.</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs text-slate-700 space-y-2">
              <p>
                <strong>1. Versioning:</strong> Version {nextVersion} will become active. Current version {currentPublishedVersion} will be archived.
              </p>
              <p>
                <strong>2. Audience:</strong> {config.audience} will receive email notifications with the changelog.
              </p>
              <p>
                <strong>3. Mobile Gate:</strong> Users in scope must accept this new version before continuing.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Release Changelog (Confirmed)
              </label>
              <textarea
                value={changelog}
                onChange={(e) => setChangelog(e.target.value)}
                rows={2}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Required summary of changes..."
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowPublishModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmPublish}
                disabled={isPending}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-all duration-150 disabled:opacity-60"
              >
                {isPending && <Loader2 size={13} className="animate-spin" />}
                Confirm & Publish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── INSPECT HISTORICAL VERSION MODAL ── */}
      {selectedHistoryDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl space-y-4 border border-slate-200 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {selectedHistoryDoc.title} — Version {selectedHistoryDoc.version}
                </h3>
                <span className="text-xs text-slate-400">
                  Status: {selectedHistoryDoc.status.toUpperCase()}
                </span>
              </div>
              <button
                onClick={() => setSelectedHistoryDoc(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-slate-50 rounded-xl prose max-w-none text-xs leading-relaxed">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {selectedHistoryDoc.content}
              </ReactMarkdown>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setContent(selectedHistoryDoc.content);
                  setTitle(selectedHistoryDoc.title);
                  setSelectedHistoryDoc(null);
                  setActiveTab("editor");
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
              >
                Restore to Editor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
