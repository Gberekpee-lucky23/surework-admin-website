"use client";

import React from "react";
import { Star, MapPin, CheckCircle2 } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  service: string;
  rating: number;
  comment: string;
  date: string;
  initials: string;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const { isDark } = useTheme();

  return (
    <div className={`p-6 rounded-2xl space-y-4 border transition-all duration-300 ${
      isDark 
        ? "bg-slate-900/40 border-slate-800/80 hover:border-slate-700" 
        : "bg-white border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md"
    }`}>
      {/* Header: User Initials & Rating */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600/20 text-blue-600 dark:text-blue-400 font-bold text-sm flex items-center justify-center border border-blue-500/20">
            {testimonial.initials}
          </div>
          <div>
            <h4 className="font-bold text-sm leading-tight flex items-center gap-1.5">
              {testimonial.name}
              <span title="Verified Customer">
                <CheckCircle2 size={13} className="text-green-500 fill-green-500/20" />
              </span>
            </h4>
            <p className={`text-[11px] flex items-center gap-1 mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              <MapPin size={10} className="text-blue-500" />
              {testimonial.location}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded-full text-xs font-bold">
          <Star size={12} className="fill-current" />
          <span>{testimonial.rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Quote */}
      <p className={`text-sm leading-relaxed italic ${isDark ? "text-slate-300" : "text-slate-700"}`}>
        &ldquo;{testimonial.comment}&rdquo;
      </p>

      {/* Footer: Service tag & date */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-200/50 dark:border-slate-800/60 text-[11px]">
        <span className={`font-semibold px-2 py-0.5 rounded ${
          isDark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-700"
        }`}>
          {testimonial.service}
        </span>
        <span className={isDark ? "text-slate-500" : "text-slate-400"}>{testimonial.date}</span>
      </div>
    </div>
  );
}
