"use client";

import React from "react";
import { useTheme } from "./ThemeProvider";

interface SectionHeadingProps {
  badge?: string;
  title: string;
  titleGradient?: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeading({
  badge,
  title,
  titleGradient,
  subtitle,
  centered = true,
  className = "",
}: SectionHeadingProps) {
  const { isDark } = useTheme();

  return (
    <div className={`space-y-4 ${centered ? "text-center max-w-3xl mx-auto" : "max-w-3xl"} ${className}`}>
      {badge && (
        <div className={`inline-flex items-center gap-2 border px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors duration-300 ${
          isDark 
            ? "bg-blue-500/10 border-blue-500/25 text-blue-400" 
            : "bg-blue-50 border-blue-200 text-blue-700 shadow-sm"
        }`}>
          {badge}
        </div>
      )}
      
      <h2 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl tracking-tight leading-tight">
        {title}
        {titleGradient && (
          <>
            {" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300">
              {titleGradient}
            </span>
          </>
        )}
      </h2>
      
      {subtitle && (
        <p className={`text-base sm:text-lg leading-relaxed transition-colors duration-300 ${
          isDark ? "text-slate-400" : "text-slate-600"
        }`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
