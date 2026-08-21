"use client";

import React, { useState, useTransition } from "react";
import { Modal } from "@/components/ui/Modal";
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from "./actions";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Grid3X3,
  AlertTriangle,
  FolderOpen,
  Tag,
  Hash,
  FileText,
  AlertCircle,
  ChevronRight,
  LayoutGrid,
  List,
  Wrench,
  Sparkles,
  Zap,
  Leaf,
  Paintbrush,
  Bug,
  Droplets,
  Home,
  Lock,
  Shield,
  Wind,
  Users,
  Package,
  Briefcase,
  Scissors,
  Truck,
  Phone,
  Laptop,
  Coffee,
  Camera,
  Music,
  Plane,
  Heart,
  Star,
  Sun,
  Moon,
  Cloud,
  Rainbow,

  Snowflake,
  Umbrella,
  Gift,
  Clock,
  Calendar,
  MapPin,
  Globe,
  Book,
  Pen,
  Scissors as ScissorsIcon,
} from "lucide-react";

interface Category {
  id: number;
  name: string;
  slug?: string | null;
  icon: string | null;
  color?: string | null;
  description: string | null;
  group?: "inspection_required" | "fixed_price" | null;
}

interface CategoriesClientProps {
  categories: Category[];
}

// Icon mapping for common icon names
const iconMap: Record<string, any> = {
  wrench: Wrench,
  sparkle: Sparkles,
  zap: Zap,
  leaf: Leaf,
  paintbrush: Paintbrush,
  bug: Bug,
  shower: Droplets,
  droplet: Droplets,
  home: Home,
  lock: Lock,
  shield: Shield,
  wind: Wind,
  users: Users,
  package: Package,
  briefcase: Briefcase,
  scissors: ScissorsIcon,
  truck: Truck,
  phone: Phone,
  laptop: Laptop,
  coffee: Coffee,
  camera: Camera,
  music: Music,
  plane: Plane,
  heart: Heart,
  star: Star,
  sun: Sun,
  moon: Moon,
  cloud: Cloud,
  rainbow: Rainbow,
  snowflake: Snowflake,
  umbrella: Umbrella,
  gift: Gift,
  clock: Clock,
  calendar: Calendar,
  map: MapPin,
  globe: Globe,
  book: Book,
  pen: Pen,
  // Add more mappings as needed
};

// Helper to render icon
const renderIcon = (icon: string | null, size: number = 24) => {
  if (!icon) {
    return <FolderOpen size={size} className="text-slate-400" />;
  }

  // Check if it's an emoji (Unicode emoji range)
  const emojiRegex = /[\u{1F300}-\u{1FAFF}]|[\u2600-\u27BF]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]/u;
  if (emojiRegex.test(icon)) {
    return <span className="text-2xl">{icon}</span>;
  }

  // Check if it's a mapped icon name
  const iconKey = icon.toLowerCase().trim();
  const IconComponent = iconMap[iconKey];
  if (IconComponent) {
    return <IconComponent size={size} className="text-blue-600" />;
  }

  // Default fallback
  return <Tag size={size} className="text-slate-400" />;
};

function CategoryForm({
  initial,
  onSubmit,
  isPending,
  error,
}: {
  initial?: Partial<Category>;
  onSubmit: (fd: FormData) => void;
  isPending: boolean;
  error: string | null;
}) {
  const [previewIcon, setPreviewIcon] = useState(initial?.icon || "");
  const [selectedGroup, setSelectedGroup] = useState<"inspection_required" | "fixed_price">(
    (initial?.group as "inspection_required" | "fixed_price") || "inspection_required"
  );

  return (
    <div className="space-y-5">
      {initial?.id && <input type="hidden" name="id" value={initial.id} />}
      <input type="hidden" name="group" value={selectedGroup} />

      {/* Category Group Selector Cards */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Category Group <span className="text-red-500">*</span>
          <span className="block text-xs font-normal text-slate-500 mt-0.5">
            Select the booking and financial commission model for this category.
          </span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
          {/* Group 1: Inspection Required Card */}
          <div
            onClick={() => setSelectedGroup("inspection_required")}
            className={`cursor-pointer rounded-xl border p-3.5 transition-all ${
              selectedGroup === "inspection_required"
                ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-sm text-slate-900 flex items-center gap-1.5">
                <Wrench size={16} className="text-blue-600" />
                Inspection Required
              </span>
              <span
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  selectedGroup === "inspection_required"
                    ? "border-blue-600 bg-blue-600"
                    : "border-slate-300 bg-white"
                }`}
              >
                {selectedGroup === "inspection_required" && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Site Assessment → Itemized Quote → Customer Approval
            </p>
            <div className="mt-2 text-[11px] font-medium text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded w-fit">
              12% Labor + 2% Materials Fee
            </div>
          </div>

          {/* Group 2: Fixed Price Card */}
          <div
            onClick={() => setSelectedGroup("fixed_price")}
            className={`cursor-pointer rounded-xl border p-3.5 transition-all ${
              selectedGroup === "fixed_price"
                ? "border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-sm text-slate-900 flex items-center gap-1.5">
                <Sparkles size={16} className="text-emerald-600" />
                Fixed Price
              </span>
              <span
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  selectedGroup === "fixed_price"
                    ? "border-emerald-600 bg-emerald-600"
                    : "border-slate-300 bg-white"
                }`}
              >
                {selectedGroup === "fixed_price" && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Instant Upfront Price → Direct Payment → No Quotes
            </p>
            <div className="mt-2 text-[11px] font-medium text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded w-fit">
              Flat 15% Platform Commission
            </div>
          </div>
        </div>
      </div>

      {/* Name Field */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Category Name (Agent-Noun Form) <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Hash size={16} className="text-slate-400" />
          </div>
          <input
            name="name"
            defaultValue={initial?.name ?? ""}
            required
            maxLength={40}
            placeholder="e.g. Plumbers, Electricians, Hair Stylists"
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
        <p className="text-xs text-slate-400 mt-1">Use agent-noun names (e.g. Plumbers, not Plumbing)</p>
      </div>

      {/* Icon Field */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Lucide Icon Name
        </label>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Tag size={16} className="text-slate-400" />
            </div>
            <input
              name="icon"
              defaultValue={initial?.icon ?? "Wrench"}
              onChange={(e) => setPreviewIcon(e.target.value)}
              placeholder="e.g. Droplet, Zap, Wrench, Scissors, Sparkle"
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-slate-50 rounded-xl border border-slate-200">
            {renderIcon(previewIcon, 24)}
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Exact Lucide component names: Droplet, Zap, Wrench, Sparkles, Paintbrush, Grid, Wind, Building2, Scissors, Palette, Crown, Sparkle
        </p>
      </div>

      {/* Description Field */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-sm font-semibold text-slate-700">
            Description
          </label>
          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
            {initial?.description?.length || 0}/120
          </span>
        </div>
        <div className="relative">
          <div className="absolute top-2.5 left-3 pointer-events-none">
            <FileText size={16} className="text-slate-400" />
          </div>
          <textarea
            name="description"
            defaultValue={initial?.description ?? ""}
            rows={3}
            maxLength={120}
            placeholder="Brief description of this service category..."
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-md"
          formAction={onSubmit as any}
        >
          {isPending ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              {initial?.id ? "Saving..." : "Creating..."}
            </>
          ) : (
            <>
              <Plus size={16} />
              {initial?.id ? "Save Changes" : "Create Category"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function CategoryCard({ category, onEdit, onDelete }: {
  category: Category;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const isFixedPrice = category.group === "fixed_price";

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-200 overflow-hidden flex flex-col justify-between">
      <div className="p-5">
        {/* Icon & Group Badge */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl group-hover:from-blue-100 group-hover:to-indigo-100 transition-all duration-200">
            {renderIcon(category.icon, 28)}
          </div>

          <div className="flex items-center gap-2">
            {/* Group Badge */}
            {isFixedPrice ? (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs">
                Fixed Price
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 shadow-xs">
                Inspection
              </span>
            )}

            {/* Actions - visible on hover */}
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all duration-200">
              <button
                onClick={onEdit}
                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                aria-label={`Edit ${category.name}`}
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={onDelete}
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                aria-label={`Delete ${category.name}`}
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Category Name */}
        <h3 className="font-bold text-slate-900 text-base mb-1.5 truncate" title={category.name}>
          {category.name}
        </h3>

        {/* Description */}
        {category.description ? (
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {category.description}
          </p>
        ) : (
          <p className="text-xs text-slate-300 italic">No description</p>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] font-mono text-slate-400">ID: #{category.id}</span>
        <span className="text-[11px] text-slate-500 font-medium">
          {isFixedPrice ? "15% Flat Rate" : "12% + 2% Quote"}
        </span>
      </div>
    </div>
  );
}

export function CategoriesClient({ categories: initial }: CategoriesClientProps) {
  const [categories, setCategories] = useState(initial);
  const [createModal, setCreateModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleCreate(fd: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createCategoryAction(fd);
      if (result?.error) {
        setError(result.error);
      } else {
        setCreateModal(false);
        window.location.reload();
      }
    });
  }

  async function handleUpdate(fd: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await updateCategoryAction(fd);
      if (result?.error) {
        setError(result.error);
      } else {
        setEditTarget(null);
        window.location.reload();
      }
    });
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setError(null);
    startTransition(async () => {
      const fd = new FormData();
      fd.append("id", String(deleteTarget.id));
      const result = await deleteCategoryAction(fd);
      if (result?.error) {
        setError(result.error);
      } else {
        setDeleteTarget(null);
        window.location.reload();
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FolderOpen size={22} className="text-blue-600" />
            Service Categories
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            <span className="font-medium text-slate-700">{categories.length}</span> categories
            <span className="mx-2">·</span>
            Shown on customer app
          </p>
        </div>

        <button
          onClick={() => { setError(null); setCreateModal(true); }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all shadow-sm hover:shadow-md flex-shrink-0"
        >
          <Plus size={18} />
          New Category
        </button>
      </div>

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <FolderOpen size={32} className="text-blue-400" />
          </div>
          <p className="font-semibold text-slate-700 text-lg">No categories yet</p>
          <p className="text-sm text-slate-400 mt-1">Create your first service category</p>
          <button
            onClick={() => { setError(null); setCreateModal(true); }}
            className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            <Plus size={14} />
            Add Category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              onEdit={() => { setError(null); setEditTarget(cat); }}
              onDelete={() => { setError(null); setDeleteTarget(cat); }}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal isOpen={createModal} onClose={() => setCreateModal(false)} title="Create New Category">
        <form>
          <CategoryForm onSubmit={handleCreate} isPending={isPending} error={error} />
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        title={`Edit Category: ${editTarget?.name}`}
      >
        <form>
          <CategoryForm
            initial={editTarget ?? undefined}
            onSubmit={handleUpdate}
            isPending={isPending}
            error={error}
          />
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => { setDeleteTarget(null); setError(null); }}
        title="Delete Category"
      >
        <div className="space-y-5">
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
            <AlertTriangle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-red-700 font-medium">
                Delete <strong className="text-red-900">{deleteTarget?.name}</strong>?
              </p>
              <p className="text-xs text-red-600 mt-1">
                This action cannot be undone. Categories with active jobs cannot be deleted.
              </p>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
            <button
              onClick={() => { setDeleteTarget(null); setError(null); }}
              className="px-5 py-2.5 text-sm border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="flex items-center justify-center gap-2 px-6 py-2.5 text-sm bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl font-semibold transition-all shadow-sm hover:shadow-md"
            >
              {isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 size={16} />
                  Delete Category
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}