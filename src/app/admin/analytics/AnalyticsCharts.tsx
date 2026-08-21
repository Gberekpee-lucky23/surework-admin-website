"use client";

import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface Props {
  jobsOverTime: { date: string; count: number }[];
  jobsByCategory: { categoryName: string | null; count: number }[];
  applicationsOverTime: {
    date: string;
    status: string;
    count: number;
  }[];
  topHandymen: {
    userId: number;
    userName: string;
    profession: string | null;
    avgRating: string | null;
    reviewCount: number;
  }[];
  stats: {
    totalUsers: number;
    totalApprovedHandymen: number;
    pendingApplications: number;
    jobsByStatus: Record<string, number>;
  };
}

const PIE_COLORS = [
  "#2563eb", "#16a34a", "#dc2626", "#d97706", "#7c3aed",
  "#0891b2", "#db2777", "#65a30d", "#ea580c", "#0284c7",
];

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <h2 className="font-semibold text-slate-900 mb-4">{title}</h2>
      {children}
    </div>
  );
}

export function AnalyticsCharts({
  jobsOverTime,
  jobsByCategory,
  applicationsOverTime,
  topHandymen,
  stats,
}: Props) {
  // Process applications over time into grouped data
  const appDates = [...new Set(applicationsOverTime.map((r) => r.date))].sort();
  const appChartData = appDates.map((date) => {
    const pending = applicationsOverTime.find(
      (r) => r.date === date && r.status === "pending"
    )?.count ?? 0;
    const approved = applicationsOverTime.find(
      (r) => r.date === date && r.status === "approved"
    )?.count ?? 0;
    const rejected = applicationsOverTime.find(
      (r) => r.date === date && r.status === "rejected"
    )?.count ?? 0;
    return { date, pending, approved, rejected };
  });

  const categoryData = jobsByCategory
    .filter((c) => c.categoryName)
    .map((c) => ({
      name: c.categoryName!,
      count: Number(c.count),
    }));

  const totalJobs = Object.values(stats.jobsByStatus).reduce((a, b) => a + b, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Jobs Over Time */}
      <Section title="Jobs Over Time">
        {jobsOverTime.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8">No data for this range</p>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={jobsOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                tickFormatter={(d) => d.slice(5)}
              />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
                name="Jobs"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Section>

      {/* Jobs by Category (Pie) */}
      <Section title="Jobs by Category">
        {categoryData.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8">No data</p>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={90}
                dataKey="count"
                nameKey="name"
                label={({ name, percent }) =>
                  `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </Section>

      {/* Applications Over Time */}
      <Section title="Applications Over Time (Submitted vs Reviewed)">
        {appChartData.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8">No data</p>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={appChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                tickFormatter={(d) => d.slice(5)}
              />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  fontSize: 12,
                }}
              />
              <Legend />
              <Bar dataKey="pending" fill="#d97706" name="Pending" radius={[4, 4, 0, 0]} />
              <Bar dataKey="approved" fill="#16a34a" name="Approved" radius={[4, 4, 0, 0]} />
              <Bar dataKey="rejected" fill="#dc2626" name="Rejected" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Section>

      {/* Top Rated Handymen */}
      <Section title="Top Rated Handymen">
        {topHandymen.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8">
            No handymen with reviews yet
          </p>
        ) : (
          <div className="space-y-3">
            {topHandymen.slice(0, 8).map((h, i) => (
              <div key={h.userId} className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-400 w-4 text-right">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{h.userName}</p>
                  <p className="text-xs text-slate-400">{h.profession ?? "General"}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-amber-500">
                    ★ {h.avgRating ? Number(h.avgRating).toFixed(1) : "—"}
                  </p>
                  <p className="text-xs text-slate-400">
                    {h.reviewCount} review{Number(h.reviewCount) !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Jobs by Status Summary */}
      <Section title="Job Status Breakdown">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart
            data={Object.entries(stats.jobsByStatus).map(([status, count]) => ({
              status: status.replace("_", " "),
              count,
            }))}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} />
            <YAxis
              dataKey="status"
              type="category"
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              width={80}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                fontSize: 12,
              }}
            />
            <Bar dataKey="count" fill="#2563eb" radius={[0, 4, 4, 0]} name="Jobs" />
          </BarChart>
        </ResponsiveContainer>
      </Section>

      {/* Platform Summary */}
      <Section title="Platform Summary">
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Total Users", value: stats.totalUsers.toLocaleString() },
            {
              label: "Approved Handymen",
              value: stats.totalApprovedHandymen.toLocaleString(),
            },
            {
              label: "Pending Applications",
              value: stats.pendingApplications.toLocaleString(),
            },
            { label: "Total Jobs", value: totalJobs.toLocaleString() },
          ].map(({ label, value }) => (
            <div key={label} className="bg-slate-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-slate-900">{value}</p>
              <p className="text-xs text-slate-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
