import {
  getDashboardStats,
  getJobsOverTime,
  getJobsByCategory,
  getApplicationsOverTime,
  getTopHandymen,
  type DateRange,
} from "@/dal/analytics";
import { AnalyticsCharts } from "./AnalyticsCharts";
import Link from "next/link";

export const metadata = { title: "Analytics — Surework Admin" };

const RANGES: { label: string; value: DateRange }[] = [
  { label: "7 days", value: "7d" },
  { label: "30 days", value: "30d" },
  { label: "90 days", value: "90d" },
  { label: "All time", value: "all" },
];

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const range = (params.range as DateRange) ?? "30d";

  const [stats, jobsOverTime, jobsByCategory, applicationsOverTime, topHandymen] =
    await Promise.all([
      getDashboardStats(),
      getJobsOverTime(range),
      getJobsByCategory(range),
      getApplicationsOverTime(range),
      getTopHandymen(10),
    ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
          <p className="text-sm text-slate-500 mt-1">
            Platform performance and trends
          </p>
        </div>

        {/* Date Range Filter */}
        <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1">
          {RANGES.map(({ label, value }) => (
            <Link
              key={value}
              href={`/admin/analytics?range=${value}`}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                range === value
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      <AnalyticsCharts
        jobsOverTime={jobsOverTime}
        jobsByCategory={jobsByCategory as { categoryName: string | null; count: number }[]}
        applicationsOverTime={applicationsOverTime}
        topHandymen={topHandymen}
        stats={stats}
      />
    </div>
  );
}
