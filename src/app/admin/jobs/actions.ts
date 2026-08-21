"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { cancelJob, updateJobNote } from "@/dal/jobs";
import { logAction } from "@/dal/audit";

export async function cancelJobAction(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/login");

  const jobId = Number(formData.get("jobId"));
  if (!jobId) return { error: "Invalid job ID" };

  await cancelJob(jobId, session.id);
  await logAction(session.id, "cancel_job", "job", jobId);

  revalidatePath("/admin/jobs");
  revalidatePath(`/admin/jobs/${jobId}`);
  return { success: true };
}

export async function updateJobNoteAction(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/login");

  const jobId = Number(formData.get("jobId"));
  const note = (formData.get("note") as string)?.trim();
  if (!jobId) return { error: "Invalid job ID" };

  await updateJobNote(jobId, note ?? "");
  await logAction(session.id, "update_job_note", "job", jobId, { note });

  revalidatePath(`/admin/jobs/${jobId}`);
  return { success: true };
}
