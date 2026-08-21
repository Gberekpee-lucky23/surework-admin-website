import { getCategories } from "@/dal/categories";
import { CategoriesClient } from "@/app/admin/categories/CategoriesClient"

export const metadata = { title: "Categories — Surework Admin" };

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-5">
      <CategoriesClient categories={categories} />
    </div>
  );
}
