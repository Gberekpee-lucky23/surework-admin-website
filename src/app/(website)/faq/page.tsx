"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, HelpCircle, PhoneCall, Smartphone } from "lucide-react";
import { useTheme } from "@/components/website/ThemeProvider";
import { SectionHeading } from "@/components/website/SectionHeading";
import { FAQAccordion, FAQItem } from "@/components/website/FAQAccordion";

const FAQ_ITEMS: FAQItem[] = [
  // General
  {
    id: "g1",
    category: "general",
    question: "What is Port Harcourt Handyman Services?",
    answer: "Port Harcourt Handyman Services is a licensed property maintenance and specialist service company operating across Rivers State. We connect homeowners, tenants, and businesses with thoroughly background-checked, skilled artisans through our proprietary mobile app, Surework.",
  },
  {
    id: "g2",
    category: "general",
    question: "Which areas in Port Harcourt do you cover?",
    answer: "We cover all major zones in Port Harcourt and surrounding Rivers State areas including GRA Phase 1, 2 & 3, Trans Amadi Layout, Ada George Road, Peter Odili Road, Garrison, Rumuola, Choba, Oil Mill, and Eleme.",
  },
  {
    id: "g3",
    category: "general",
    question: "How are your artisans and handymen vetted?",
    answer: "Every artisan undergoes a rigorous 4-stage screening process: 1) National Identity (NIN/Voter Card) verification, 2) Physical home/workshop address verification, 3) Technical trade assessment, and 4) Guarantor verification. Only top-scoring candidates are approved.",
  },

  // Pricing & Quotes
  {
    id: "p1",
    category: "pricing",
    question: "How does pricing and quote approval work?",
    answer: "We offer two clear pricing models depending on the service category: 1) Home & Property Maintenance (e.g. Plumbing, Electrical, AC) requires an initial inspection. The handyman inspects the job, submits a transparent quote, and work begins ONLY after you approve the quote. 2) Personal & Lifestyle Specialists (e.g. Beauty, Fumigation) feature transparent upfront fixed rates.",
  },
  {
    id: "p2",
    category: "pricing",
    question: "Are there any hidden fees or surprise costs?",
    answer: "No. You are always informed of inspection fees or fixed rates before booking. Any extra materials required during repairs are listed clearly in your job invoice for your review prior to authorization.",
  },
  {
    id: "p3",
    category: "pricing",
    question: "How do payments work?",
    answer: "Payments can be made securely online via Paystack (holding funds in escrow until job completion) or recorded as cash payments directly with the handyman upon mutual dual-confirmation.",
  },

  // App & Booking
  {
    id: "a1",
    category: "app",
    question: "Do I need the Surework mobile app to book a handyman?",
    answer: "While you can submit inquiries or custom corporate requests via our website contact form, the Surework mobile app provides the fastest experience with real-time location tracking, live messaging with your assigned artisan, and instant digital receipts.",
  },
  {
    id: "a2",
    category: "app",
    question: "What happens if I am not satisfied with the completed job?",
    answer: "We offer a Quality Work Guarantee. If a job completed by one of our artisans fails to meet professional standards, contact customer support within 48 hours. Our quality assurance team will inspect and rectify the issue at no additional cost.",
  },
  {
    id: "a3",
    category: "app",
    question: "What is your cancellation policy?",
    answer: "You can cancel a booking free of charge before the assigned handyman is dispatched to your location. If a handyman is already en route, a nominal dispatch fee may apply.",
  },

  // For Handymen
  {
    id: "h1",
    category: "handymen",
    question: "How can I join Port Harcourt Handyman Services as an artisan?",
    answer: "If you are a skilled electrician, plumber, AC specialist, painter, or beauty professional in Port Harcourt, you can apply on our Careers page or download the Surework app to register as a provider. Upload your ID documents, complete screening, and start receiving steady client requests.",
  },
  {
    id: "h2",
    category: "handymen",
    question: "How quickly do handymen get paid?",
    answer: "Handymen receive payouts directly into their registered Nigerian bank account immediately upon job completion and customer sign-off.",
  },
];

export default function FAQPage() {
  const { isDark } = useTheme();
  const [activeCategory, setActiveCategory] = useState<"all" | "general" | "pricing" | "app" | "handymen">("all");

  const filteredItems = activeCategory === "all"
    ? FAQ_ITEMS
    : FAQ_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <div className="space-y-16 lg:space-y-24 pb-20 pt-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      
      <SectionHeading
        badge="Frequently Asked Questions"
        title="Everything You Need to Know About"
        titleGradient="Our Services"
        subtitle="Got questions about booking, artisan vetting, quote approval, or payments? Find clear answers below."
      />

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2.5">
        {[
          { id: "all", label: "All Questions" },
          { id: "general", label: "General & Vetting" },
          { id: "pricing", label: "Pricing & Quotes" },
          { id: "app", label: "App & Booking" },
          { id: "handymen", label: "For Artisans" },
        ].map((tab) => {
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id as any)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                isActive
                  ? "bg-blue-600 border-blue-600 text-white shadow-md scale-105"
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

      {/* Accordion */}
      <FAQAccordion items={filteredItems} />

      {/* Still Have Questions CTA */}
      <div className={`p-8 rounded-3xl border text-center space-y-6 ${
        isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200 shadow-md"
      }`}>
        <div className="w-12 h-12 bg-blue-600/10 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto">
          <HelpCircle size={24} />
        </div>
        <div className="space-y-2 max-w-md mx-auto">
          <h3 className="text-xl font-bold">Still Have Questions?</h3>
          <p className={`text-xs sm:text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Our customer support team in Port Harcourt is available Monday to Saturday to assist you.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
          <Link
            href="/contact"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-all text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:scale-105"
          >
            <PhoneCall size={16} />
            <span>Contact Customer Support</span>
          </Link>
          <Link
            href="/product"
            className={`font-semibold px-6 py-3 rounded-xl transition-all text-xs sm:text-sm border flex items-center justify-center gap-2 hover:scale-105 ${
              isDark ? "border-slate-800 bg-slate-950 text-slate-300" : "border-slate-200 bg-slate-50 text-slate-700"
            }`}
          >
            <Smartphone size={16} className="text-blue-500" />
            <span>Explore Surework App</span>
          </Link>
        </div>
      </div>

    </div>
  );
}
