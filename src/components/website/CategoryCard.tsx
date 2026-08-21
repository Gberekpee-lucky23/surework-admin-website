"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Smartphone } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { ImageWithPlaceholder } from "./ImageWithPlaceholder";

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  group: "home_property" | "personal_specialist";
  groupLabel: string;
  popular?: boolean;
  imagePath?: string;
}

interface CategoryCardProps {
  category: ServiceCategory;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const { isDark } = useTheme();
  
  // Clean fallback label for production mode
  const fallbackLabel = category.name.split(" ")[0];

  return (
    <div className={`rounded-3xl flex flex-col justify-between border overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 ${
      isDark 
        ? "bg-slate-900/40 border-slate-800 hover:border-slate-700 shadow-blue-900/5 shadow-2xl" 
        : "bg-white border-slate-200 hover:border-slate-300 shadow-lg shadow-slate-100 hover:shadow-xl"
    }`}>
      
      {/* Category Image Section (Dominant Visual Element) */}
      <div className="relative w-full h-48 sm:h-52 overflow-hidden bg-slate-100 dark:bg-slate-950">
        <ImageWithPlaceholder
          src={category.imagePath || `/images/${category.id}.jpg`}
          alt={`${category.name} in Port Harcourt`}
          fallbackText={fallbackLabel}
          expectedPath={`/images/${category.id}.jpg`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 hover:scale-105"
          priority={category.popular}
        />
        
        {/* Overlay Icon Badge */}
        <div className="absolute top-4 left-4 w-11 h-11 rounded-2xl flex items-center justify-center bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-md text-xl border border-white/20 dark:border-slate-800/50">
          {category.icon}
        </div>

        {/* Overlay Group Label */}
        <span className={`absolute top-4 right-4 text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full backdrop-blur-md shadow-sm border ${
          category.group === "home_property"
            ? "bg-blue-600/90 dark:bg-blue-500/80 text-white border-blue-400/20"
            : "bg-purple-600/90 dark:bg-purple-500/80 text-white border-purple-400/20"
        }`}>
          {category.groupLabel}
        </span>
      </div>

      {/* Content Section */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className={`font-extrabold text-lg sm:text-xl leading-snug tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
            {category.name}
          </h3>
          <p className={`text-xs sm:text-sm mt-2 leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            {category.description}
          </p>
        </div>

        <div className="pt-4 border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <Link
            href="/product"
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5 group"
          >
            <span>Book in Surework App</span>
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Smartphone size={15} className="text-slate-400 dark:text-slate-600" />
        </div>
      </div>
    </div>
  );
}
