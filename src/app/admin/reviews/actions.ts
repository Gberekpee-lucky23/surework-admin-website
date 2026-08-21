"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { softDeleteReview } from "@/dal/reviews";
import { logAction } from "@/dal/audit";

export async function removeReviewAction(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/login");

  const reviewId = Number(formData.get("reviewId"));
  if (!reviewId) return { error: "Invalid review ID" };

  await softDeleteReview(reviewId, session.id);
  await logAction(session.id, "remove_review", "review", reviewId);

  revalidatePath("/admin/reviews");
  return { success: true };
}
