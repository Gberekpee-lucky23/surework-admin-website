"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color?: string;
  bg?: string;
  badge?: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  color = "text-blue-600 dark:text-blue-400",
  bg = "bg-blue-600/10 dark:bg-blue-400/10",
  badge,
}: FeatureCardProps) {
  const { isDark } = useTheme();

  return (
    <div className={`p-6 rounded-2xl space-y-4 border transition-all duration-300 hover:-translate-y-1 ${
      isDark 
        ? "bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900 shadow-sm" 
        : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-lg shadow-sm"
    }`}>
      <div className="flex items-center justify-between">
        <div className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center`}>
          <Icon size={20} className={color} />
        </div>
        {badge && (
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
            isDark ? "bg-slate-800 text-blue-400 border border-slate-700" : "bg-blue-50 text-blue-700 border border-blue-200"
          }`}>
            {badge}
          </span>
        )}
      </div>
      <h3 className="font-bold text-lg leading-snug">{title}</h3>
      <p className={`text-sm leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
        {description}
      </p>
    </div>
  );
}
