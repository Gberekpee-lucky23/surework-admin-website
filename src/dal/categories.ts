import { db } from "@/db";
import { categories, jobs } from "@/db/schema";
import { eq, count, and, notInArray } from "drizzle-orm";
import { ServiceCategory } from "@/components/website/CategoryCard";
import { ALL_CATEGORIES, getCategoryImage } from "@/constants/websiteCategories";

export async function getCategories() {
  return db.select().from(categories).orderBy(categories.name);
}

export async function getCategoryById(id: number) {
  const [cat] = await db.select().from(categories).where(eq(categories.id, id));
  return cat ?? null;
}

export async function createCategory(data: {
  name: string;
  slug?: string;
  icon?: string;
  color?: string;
  description?: string;
  group?: "inspection_required" | "fixed_price";
}) {
  const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  const [created] = await db
    .insert(categories)
    .values({
      ...data,
      slug,
      icon: data.icon || "Wrench",
      color: data.color || "#0ea5e9",
      group: data.group || "inspection_required",
    })
    .returning();
  return created;
}

export async function updateCategory(
  id: number,
  data: {
    name?: string;
    slug?: string;
    icon?: string;
    color?: string;
    description?: string;
    group?: "inspection_required" | "fixed_price";
  }
) {
  const updateData: any = { ...data };
  if (data.name && !data.slug) {
    updateData.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  }
  const [updated] = await db
    .update(categories)
    .set(updateData)
    .where(eq(categories.id, id))
    .returning();
  return updated ?? null;
}

export async function deleteCategory(id: number) {
  // Check for active (non-completed, non-cancelled) jobs in this category
  const activeJobs = await db
    .select({ id: jobs.id })
    .from(jobs)
    .where(
      and(
        eq(jobs.categoryId, id),
        notInArray(jobs.status, ["completed", "cancelled"])
      )
    )
    .limit(1);

  if (activeJobs.length > 0) {
    return {
      success: false,
      error: "Cannot delete this category — it has active jobs attached to it.",
    };
  }

  await db.delete(categories).where(eq(categories.id, id));
  return { success: true };
}

export async function getCategoryJobCounts() {
  return db
    .select({
      categoryId: categories.id,
      categoryName: categories.name,
      jobCount: count(jobs.id),
    })
    .from(categories)
    .leftJoin(jobs, eq(jobs.categoryId, categories.id))
    .groupBy(categories.id, categories.name)
    .orderBy(categories.name);
}

export async function fetchDynamicWebsiteCategories(): Promise<ServiceCategory[]> {
  try {
    const dbCats = await getCategories();
    if (!dbCats || dbCats.length === 0) return ALL_CATEGORIES;

    return dbCats
      .filter((c) => c.isActive)
      .map((c) => {
        const isHomeProperty = c.group === "inspection_required";
        const catId = c.slug || c.id.toString();
        return {
          id: catId,
          name: c.name,
          description:
            c.description ||
            (isHomeProperty
              ? "Professional inspection & quote-based artisan repair service."
              : "Upfront fixed price specialist service."),
          icon: c.icon && c.icon.length < 5 ? c.icon : isHomeProperty ? "🔧" : "✨",
          group: isHomeProperty ? ("home_property" as const) : ("personal_specialist" as const),
          groupLabel: isHomeProperty ? "Home & Property" : "Personal & Specialist",
          popular: true,
          imagePath: getCategoryImage(catId),
        };
      });
  } catch (error) {
    console.warn("Failed to fetch dynamic categories from DB, falling back to static:", error);
    return ALL_CATEGORIES;
  }
}
