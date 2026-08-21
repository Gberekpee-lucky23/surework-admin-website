"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "general" | "pricing" | "app" | "handymen";
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  const { isDark } = useTheme();
  const [openId, setOpenId] = useState<string | null>(items[0]?.id || null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
              isOpen
                ? isDark 
                  ? "bg-slate-900/80 border-blue-500/40 shadow-lg" 
                  : "bg-white border-blue-500 shadow-md"
                : isDark
                  ? "bg-slate-900/30 border-slate-800/80 hover:border-slate-700"
                  : "bg-white border-slate-200 hover:border-slate-300"
            }`}
          >
            <button
              onClick={() => toggle(item.id)}
              className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
              aria-expanded={isOpen}
            >
              <span className={`font-bold text-base sm:text-lg transition-colors ${
                isOpen
                  ? isDark ? "text-blue-400" : "text-blue-600"
                  : isDark ? "text-white" : "text-slate-900"
              }`}>
                {item.question}
              </span>
              <div className={`p-1.5 rounded-full transition-transform duration-300 ${
                isOpen ? "rotate-180 bg-blue-600 text-white" : isDark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-600"
              }`}>
                <ChevronDown size={18} />
              </div>
            </button>

            {isOpen && (
              <div className={`px-5 sm:px-6 pb-6 pt-1 text-sm sm:text-base leading-relaxed border-t ${
                isDark ? "border-slate-800/60 text-slate-300" : "border-slate-100 text-slate-600"
              }`}>
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
