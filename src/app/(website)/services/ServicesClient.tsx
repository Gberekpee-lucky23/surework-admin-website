"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Smartphone, ShieldCheck } from "lucide-react";
import { useTheme } from "@/components/website/ThemeProvider";
import { SectionHeading } from "@/components/website/SectionHeading";
import { CategoryCard, ServiceCategory } from "@/components/website/CategoryCard";

interface ServicesClientProps {
  initialCategories: ServiceCategory[];
}

export function ServicesClient({ initialCategories }: ServicesClientProps) {
  const { isDark } = useTheme();
  const [filter, setFilter] = useState<"all" | "home_property" | "personal_specialist">("all");

  const homeCategories = initialCategories.filter((c) => c.group === "home_property");
  const specialistCategories = initialCategories.filter((c) => c.group === "personal_specialist");

  return (
    <div className="space-y-16 lg:space-y-24 pb-20 pt-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <SectionHeading
        badge="Our Comprehensive Catalog"
        title="Professional Services for"
        titleGradient="Home & Lifestyle"
        subtitle="Every category is backed by Port Harcourt Handyman Services' background-checked, skilled artisans. Browse our offerings and book directly in the Surework app."
      />

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-3">
        {[
          { id: "all", label: `All Categories (${initialCategories.length})` },
          { id: "home_property", label: `Home & Property Maintenance (${homeCategories.length})` },
          { id: "personal_specialist", label: `Personal & Lifestyle Specialists (${specialistCategories.length})` },
        ].map((tab) => {
          const isActive = filter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                isActive
                  ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/20 scale-105"
                  : isDark
                    ? "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Group 1: Home & Property Services */}
      {(filter === "all" || filter === "home_property") && (
        <div className="space-y-6">
          <div className="pb-4 border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold flex items-center gap-2">
                <span className="text-blue-600 dark:text-blue-400"></span> Home & Property Maintenance
              </h3>
              <p className={`text-xs sm:text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Essential maintenance, installation, and civil works. Standard inspection & quote approval workflow.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden sm:inline">
              {homeCategories.length} Categories
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {homeCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      )}

      {/* Group 2: Personal & Lifestyle Specialists */}
      {(filter === "all" || filter === "personal_specialist") && (
        <div className="space-y-6 pt-6">
          <div className="pb-4 border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold flex items-center gap-2">
                <span className="text-purple-600 dark:text-purple-400"></span> Personal & Lifestyle Specialists
              </h3>
              <p className={`text-xs sm:text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                At-home beauty, grooming, pest control, and specialist services with upfront fixed-rate scheduling.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden sm:inline">
              {specialistCategories.length} Categories
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {specialistCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      )}

      {/* How Booking Works Notice */}
      <div className={`p-8 rounded-3xl border flex flex-col md:flex-row items-center justify-between gap-6 ${
        isDark ? "bg-slate-900/50 border-slate-800" : "bg-blue-50/60 border-blue-200 shadow-sm"
      }`}>
        <div className="space-y-2 text-center md:text-left">
          <h4 className="text-lg font-bold flex items-center justify-center md:justify-start gap-2">
            <ShieldCheck className="text-blue-600 dark:text-blue-400" />
            Ready to book a service in Port Harcourt?
          </h4>
          <p className={`text-xs sm:text-sm max-w-2xl ${isDark ? "text-slate-350" : "text-slate-600"}`}>
            Our website is designed for marketing and inquiries. To request an artisan, receive instant location tracking, and process secure payments (via online escrow or dual-confirmed cash), download the <strong>Surework</strong> app.
          </p>
        </div>

        <Link
          href="/product"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-all text-xs sm:text-sm flex items-center gap-2 shrink-0 shadow-md hover:scale-105"
        >
          <Smartphone size={16} />
          <span>Get Surework App</span>
          <ArrowRight size={14} />
        </Link>
      </div>

    </div>
  );
}
