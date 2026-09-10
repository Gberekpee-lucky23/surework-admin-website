"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { saveLegalDraft, publishLegalDocument } from "@/dal/legal";
import { logAction } from "@/dal/audit";

export async function saveDraftAction(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/login");

  const documentType = (formData.get("documentType") as string)?.trim();
  const title = (formData.get("title") as string)?.trim();
  const content = (formData.get("content") as string);
  const changelog = (formData.get("changelog") as string)?.trim();

  if (!documentType || !content) {
    return { error: "Document type and content are required." };
  }

  try {
    const draft = await saveLegalDraft(
      documentType,
      title || "Legal Document",
      content,
      changelog || undefined,
      session.id
    );

    await logAction(session.id, "save_legal_draft", "legal_document", draft.id, {
      documentType,
      version: draft.version,
    });

    revalidatePath("/admin/legal");
    revalidatePath(`/admin/legal/${documentType}`);
    return { success: true, draft };
  } catch (err: any) {
    console.error("Failed to save draft:", err);
    return { error: err.message || "Failed to save draft." };
  }
}

export async function publishDocumentAction(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/login");

  const documentType = (formData.get("documentType") as string)?.trim();
  const changelog = (formData.get("changelog") as string)?.trim();

  if (!documentType) {
    return { error: "Document type is required." };
  }

  try {
    const published = await publishLegalDocument(
      documentType,
      changelog || undefined,
      session.id
    );

    await logAction(session.id, "publish_legal_document", "legal_document", published.id, {
      documentType,
      version: published.version,
      changelog: published.changelog,
    });

    revalidatePath("/admin/legal");
    revalidatePath(`/admin/legal/${documentType}`);
    return { success: true, version: published.version };
  } catch (err: any) {
    console.error("Failed to publish document:", err);
    return { error: err.message || "Failed to publish document." };
  }
}
