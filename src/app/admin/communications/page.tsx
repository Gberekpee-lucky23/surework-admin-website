import React from "react";
import { getNotificationLogs, getCommunicationAnalytics } from "@/dal/communications";
import { retryNotificationAction } from "./actions";
import {
  MessageSquare,
  Mail,
  Bell,
  CheckCircle,
  XCircle,
  RefreshCw,
  Search,
  Filter,
  AlertCircle
} from "lucide-react";

export const metadata = { title: "Communications Center — Surework Admin" };

interface PageProps {
  searchParams: Promise<{
    search?: string;
    channel?: string;
    status?: string;
    type?: string;
  }>;
}

export default async function CommunicationsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const search = params.search || "";
  const channel = params.channel || "";
  const status = params.status || "";
  const type = params.type || "";

  // Fetch data
  const logs = await getNotificationLogs({ search, channel, status, type, limit: 50 });
  const analytics = await getCommunicationAnalytics();

  // Calculations for metrics
  const totalLogsCount = analytics.successCount + analytics.failureCount;
  const deliverySuccessRate = totalLogsCount > 0 ? Math.round((analytics.successCount / totalLogsCount) * 100) : 100;

  // Channel metrics
  const emailSent = analytics.channelStats.filter(c => c.channel === "email" && c.status === "success").reduce((a, b) => a + b.count, 0);
  const emailFailed = analytics.channelStats.filter(c => c.channel === "email" && c.status === "failed").reduce((a, b) => a + b.count, 0);
  const pushSent = analytics.channelStats.filter(c => c.channel === "push" && c.status === "success").reduce((a, b) => a + b.count, 0);
  const pushFailed = analytics.channelStats.filter(c => c.channel === "push" && c.status === "failed").reduce((a, b) => a + b.count, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare size={22} className="text-blue-600" />
            Communications & Notifications
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Audit transactional emails, FCM push notifications, and database notifications.
          </p>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Delivery Rate</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{deliverySuccessRate}%</span>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">Succeeded</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {analytics.successCount} of {totalLogsCount} transmissions successful
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Failed Delivery</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-600">{analytics.failureCount}</span>
            <span className="text-xs font-medium text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-full">Action Needed</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Requires retry or credentials check
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Summary</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{emailSent + emailFailed}</span>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full">Mailjet</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {emailSent} succeeded, {emailFailed} failed
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Push Summary</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{pushSent + pushFailed}</span>
            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-full">Firebase</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {pushSent} succeeded, {pushFailed} failed
          </p>
        </div>
      </div>

      {/* Filter and Search Form */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <form method="GET" className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="User email, name, title..."
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">Channel</label>
            <select
              name="channel"
              defaultValue={channel}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
            >
              <option value="">All Channels</option>
              <option value="email">Email (Mailjet)</option>
              <option value="push">Push Notification (FCM)</option>
              <option value="db">In-App (Database)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">Status</label>
            <select
              name="status"
              defaultValue={status}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
            >
              <option value="">All Statuses</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2 px-4 rounded-xl text-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <Filter size={15} />
              Filter
            </button>
            {(search || channel || status || type) && (
              <a
                href="/admin/communications"
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-2 px-4 rounded-xl text-sm transition-colors flex items-center justify-center"
              >
                Clear
              </a>
            )}
          </div>
        </form>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-xs font-bold text-slate-500 uppercase">
                <th className="p-4">Recipient</th>
                <th className="p-4">Channel</th>
                <th className="p-4">Type</th>
                <th className="p-4">Notification details</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-center">Retries</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400 italic">
                    No matching logs found.
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const hasFailed = log.status === "failed";
                  return (
                    <tr key={log.logId} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        {log.recipient ? (
                          <div>
                            <div className="font-semibold text-slate-900">{log.recipient.name}</div>
                            <div className="text-xs text-slate-400">{log.recipient.email}</div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Unknown user</span>
                        )}
                      </td>

                      <td className="p-4">
                        {log.channel === "email" && (
                          <span className="inline-flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded-lg text-xs font-medium">
                            <Mail size={12} />
                            Email
                          </span>
                        )}
                        {log.channel === "push" && (
                          <span className="inline-flex items-center gap-1 text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg text-xs font-medium">
                            <Bell size={12} />
                            Push
                          </span>
                        )}
                        {log.channel === "db" && (
                          <span className="inline-flex items-center gap-1 text-slate-600 bg-slate-50 px-2 py-1 rounded-lg text-xs font-medium">
                            <MessageSquare size={12} />
                            In-App
                          </span>
                        )}
                      </td>

                      <td className="p-4">
                        <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                          {log.notification?.type || "SYSTEM"}
                        </span>
                      </td>

                      <td className="p-4 max-w-xs">
                        <div className="font-medium text-slate-900 truncate">
                          {log.notification?.title || "No Title"}
                        </div>
                        <div className="text-xs text-slate-400 line-clamp-2 mt-0.5">
                          {log.notification?.message || "No Message"}
                        </div>
                        {hasFailed && log.error && (
                          <div className="mt-1 flex items-start gap-1 text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-lg p-1.5 font-mono">
                            <AlertCircle size={12} className="mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-2">{log.error}</span>
                          </div>
                        )}
                      </td>

                      <td className="p-4">
                        {log.status === "success" ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg text-xs font-semibold">
                            <CheckCircle size={12} />
                            Delivered
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 px-2 py-1 rounded-lg text-xs font-semibold">
                            <XCircle size={12} />
                            Failed
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-xs text-slate-400 whitespace-nowrap">
                        {log.createdAt ? new Date(log.createdAt).toLocaleString() : "Never"}
                      </td>

                      <td className="p-4 text-center font-semibold text-slate-700">
                        {log.retryCount}
                      </td>

                      <td className="p-4 text-right">
                        {hasFailed ? (
                          <form action={retryNotificationAction} className="inline-block">
                            <input type="hidden" name="logId" value={log.logId} />
                            <button
                              type="submit"
                              className="text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200 px-2.5 py-1.5 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-all flex items-center gap-1 ml-auto"
                            >
                              <RefreshCw size={12} />
                              Retry
                            </button>
                          </form>
                        ) : (
                          <span className="text-xs text-slate-300">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
