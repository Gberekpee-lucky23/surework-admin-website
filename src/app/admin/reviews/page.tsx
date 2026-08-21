import Link from "next/link";
import { getReviews } from "@/dal/reviews";
import { formatRelativeTime } from "@/lib/utils";
import { ReviewsClient } from "./ReviewsClient";
import { Star } from "lucide-react";

export const metadata = { title: "Reviews — Surework Admin" };

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const minRating = params.minRating ? Number(params.minRating) : undefined;
  const includeRemoved = params.includeRemoved === "true";
  const page = Number(params.page ?? 1);

  const { reviews, total, totalPages } = await getReviews(
    { minRating, includeRemoved },
    page,
    25
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reviews</h1>
          <p className="text-sm text-slate-500 mt-1">
            Moderate user reviews — removed reviews are soft-deleted with audit trail
          </p>
        </div>
        <span className="text-sm text-slate-500">{total.toLocaleString()} reviews</span>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1">
          {[5, 4, 3, 2, 1].map((r) => (
            <Link
              key={r}
              href={`/admin/reviews?minRating=${r}&page=1`}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                minRating === r
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              {r}
              <Star size={11} className="fill-current" />
            </Link>
          ))}
          <Link
            href="/admin/reviews?page=1"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              !minRating
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            All
          </Link>
        </div>

        <Link
          href={`/admin/reviews?includeRemoved=${!includeRemoved}&page=1`}
          className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition-colors ${
            includeRemoved
              ? "bg-slate-800 text-white border-slate-800"
              : "border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          {includeRemoved ? "Hiding removed" : "Show removed"}
        </Link>
      </div>

      {/* Reviews Table */}
      <ReviewsClient reviews={reviews} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`/admin/reviews?minRating=${minRating ?? ""}&page=${page - 1}`}
                className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Previous
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`/admin/reviews?minRating=${minRating ?? ""}&page=${page + 1}`}
                className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
