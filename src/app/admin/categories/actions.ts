"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/dal/categories";
import { logAction } from "@/dal/audit";

export async function createCategoryAction(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/login");

  const name = (formData.get("name") as string)?.trim();
  const icon = (formData.get("icon") as string)?.trim() || "Wrench";
  const color = (formData.get("color") as string)?.trim() || "#0ea5e9";
  const description = (formData.get("description") as string)?.trim() || undefined;
  const group = (formData.get("group") as string)?.trim() as "inspection_required" | "fixed_price" || "inspection_required";

  if (!name) return { error: "Category name is required." };

  const created = await createCategory({ name, icon, color, description, group });
  await logAction(session.id, "create_category", "category", created.id, { name, group });

  revalidatePath("/admin/categories");
  return { success: true };
}

export async function updateCategoryAction(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/login");

  const id = Number(formData.get("id"));
  const name = (formData.get("name") as string)?.trim();
  const icon = (formData.get("icon") as string)?.trim() || undefined;
  const color = (formData.get("color") as string)?.trim() || undefined;
  const description = (formData.get("description") as string)?.trim() || undefined;
  const group = (formData.get("group") as string)?.trim() as "inspection_required" | "fixed_price" || undefined;

  if (!id) return { error: "Invalid category ID" };
  if (!name) return { error: "Category name is required." };

  await updateCategory(id, { name, icon, color, description, group });
  await logAction(session.id, "update_category", "category", id, { name, group });

  revalidatePath("/admin/categories");
  return { success: true };
}

export async function deleteCategoryAction(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/login");

  const id = Number(formData.get("id"));
  if (!id) return { error: "Invalid category ID" };

  const result = await deleteCategory(id);
  if (!result.success) return { error: result.error };

  await logAction(session.id, "delete_category", "category", id);
  revalidatePath("/admin/categories");
  return { success: true };
}
