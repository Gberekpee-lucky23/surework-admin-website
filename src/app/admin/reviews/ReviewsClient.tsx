"use client";

import React, { useState, useTransition } from "react";
import { Modal } from "@/components/ui/Modal";
import { removeReviewAction } from "./actions";
import { formatRelativeTime } from "@/lib/utils";
import { Star, Trash2, Loader2, AlertTriangle, Star as StarIcon } from "lucide-react";

interface Review {
  id: number;
  rating: number;
  comment: string | null;
  createdAt: Date;
  deletedAt: Date | null;
  reviewerName: string | null;
  reviewerId: number;
  revieweeId: number;
  jobId: number;
}

export function ReviewsClient({ reviews }: { reviews: Review[] }) {
  const [deleteTarget, setDeleteTarget] = useState<Review | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!deleteTarget) return;
    setError(null);
    startTransition(async () => {
      const fd = new FormData();
      fd.append("reviewId", String(deleteTarget.id));
      const result = await removeReviewAction(fd);
      if (result?.error) setError(result.error);
      else {
        setDeleteTarget(null);
        window.location.reload();
      }
    });
  }

  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-200 text-slate-400">
        <StarIcon size={40} className="mb-3 opacity-40" />
        <p className="font-medium">No reviews found</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Reviewer
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Comment
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {reviews.map((review) => (
              <tr
                key={review.id}
                className={`hover:bg-slate-50 transition-colors ${
                  review.deletedAt ? "opacity-50" : ""
                }`}
              >
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-900">
                    {review.reviewerName ?? "Unknown"}
                  </p>
                  <p className="text-xs text-slate-400">Job #{review.jobId}</p>
                </td>
                <td className="px-4 py-3">
                  <span className="text-amber-400 text-base">
                    {"★".repeat(review.rating)}
                    <span className="text-slate-200">{"★".repeat(5 - review.rating)}</span>
                  </span>
                  <span className="text-xs text-slate-500 ml-1">
                    {review.rating}/5
                  </span>
                </td>
                <td className="px-4 py-3 max-w-xs">
                  <p className="text-slate-700 text-sm truncate">
                    {review.comment ?? (
                      <span className="text-slate-300 italic">No comment</span>
                    )}
                  </p>
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">
                  {formatRelativeTime(review.createdAt)}
                </td>
                <td className="px-4 py-3">
                  {review.deletedAt ? (
                    <span className="text-xs bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-full font-medium">
                      Removed
                    </span>
                  ) : (
                    <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-medium">
                      Active
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {!review.deletedAt && (
                    <button
                      onClick={() => { setError(null); setDeleteTarget(review); }}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="Remove review"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => { setDeleteTarget(null); setError(null); }}
        title="Remove Review"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
            <AlertTriangle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-red-700 font-medium">
                Remove this review by{" "}
                <strong>{deleteTarget?.reviewerName ?? "Unknown"}</strong>?
              </p>
              <p className="text-xs text-red-600 mt-1">
                The review will be soft-deleted (kept in the database for audit purposes)
                and the handyman's average rating will be recalculated.
              </p>
            </div>
          </div>
          {deleteTarget?.comment && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
              <p className="text-xs text-slate-500 mb-1">Review content:</p>
              <p className="text-sm text-slate-700 italic">"{deleteTarget.comment}"</p>
            </div>
          )}
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}
          <div className="flex justify-end gap-3">
            <button
              onClick={() => { setDeleteTarget(null); setError(null); }}
              className="px-4 py-2 text-sm border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              id="confirm-remove-review-btn"
              onClick={handleDelete}
              disabled={isPending}
              className="flex items-center gap-2 px-5 py-2 text-sm bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl font-medium transition-colors"
            >
              {isPending && <Loader2 size={14} className="animate-spin" />}
              Remove Review
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
