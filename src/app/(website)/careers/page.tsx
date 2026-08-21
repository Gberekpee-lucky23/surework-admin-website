"use client";

import React, { useState } from "react";
import Link from "next/link";
import { UserCheck, ShieldCheck, DollarSign, Clock, CheckCircle2, ArrowRight, Smartphone, Send, Loader2 } from "lucide-react";
import { useTheme } from "@/components/website/ThemeProvider";
import { SectionHeading } from "@/components/website/SectionHeading";
import { FeatureCard } from "@/components/website/FeatureCard";
import { ALL_CATEGORIES } from "@/constants/websiteCategories";
import { ImageWithPlaceholder } from "@/components/website/ImageWithPlaceholder";

export default function CareersPage() {
  const { isDark } = useTheme();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    tradeCategory: "",
    yearsExperience: "",
    location: "",
    hourlyRate: "",
  });

  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setApplied(true);
    }, 1000);
  };

  return (
    <div className="space-y-16 lg:space-y-24 pb-20 pt-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Hero Header */}
      <SectionHeading
        badge="Join Our Network of Professionals"
        title="Earn Money & Grow Your Business in"
        titleGradient="Port Harcourt"
        subtitle="Are you a skilled electrician, plumber, AC specialist, painter, or beauty professional? Become a verified service provider with Port Harcourt Handyman Services."
      />

      {/* Provider Benefits */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FeatureCard
          icon={DollarSign}
          title="Guaranteed Fast Payouts"
          description="Receive earnings directly into your bank account immediately after completing verified customer jobs."
          color="text-emerald-500"
          bg="bg-emerald-500/10"
          badge="Earnings"
        />
        <FeatureCard
          icon={UserCheck}
          title="Consistent Client Requests"
          description="Gain access to hundreds of residential and commercial job requests across GRA, Trans Amadi, and Ada George."
          color="text-blue-600 dark:text-blue-400"
          bg="bg-blue-600/10 dark:bg-blue-400/10"
          badge="Volume"
        />
        <FeatureCard
          icon={Clock}
          title="Flexible Work Schedule"
          description="Set your own availability hours and accept jobs whenever you choose directly in the Surework app."
          color="text-indigo-600 dark:text-indigo-400"
          bg="bg-indigo-600/10 dark:bg-indigo-400/10"
          badge="Flexibility"
        />
        <FeatureCard
          icon={ShieldCheck}
          title="Verified Professional Profile"
          description="Build your reputation with customer reviews, verified badges, and corporate backed trust."
          color="text-amber-500"
          bg="bg-amber-500/10"
          badge="Reputation"
        />
      </section>

      {/* Verification Steps (Two-column layout pairing list with artisan photo) */}
      <section className={`p-8 sm:p-12 rounded-4xl border ${
        isDark ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200 shadow-xl shadow-slate-100/50"
      }`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Heading and Steps */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-3 text-left">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest block">
                Application Process
              </span>
              <h2 className={`text-3xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                3 Steps to Get Verified & Start Earning
              </h2>
              <p className={`text-xs sm:text-sm ${isDark ? "text-white" : "text-slate-600"}`}>
                Our vetting standard protects both clients and genuine artisans. Here is how to get approved:
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  step: "01",
                  title: "Submit Profile & ID",
                  desc: "Fill out the provider registration form below or inside the Surework app. Upload a valid ID (NIN, Voter's Card, or Passport).",
                },
                {
                  step: "02",
                  title: "Admin Screening & Check",
                  desc: "Our Port Harcourt operations team conducts a professional trade assessment and physical address verification.",
                },
                {
                  step: "03",
                  title: "Unlock Job Notifications",
                  desc: "Once verified, receive instant push notifications for jobs in your neighborhood and start earning.",
                },
              ].map((item, idx) => (
                <div key={idx} className={`p-5 rounded-2xl border flex gap-4 items-start ${
                  isDark ? "bg-slate-950/60 border-slate-850" : "bg-slate-50 border-slate-200"
                }`}>
                  <span className="text-lg font-black text-blue-600 dark:text-blue-400 bg-blue-600/10 dark:bg-blue-450/10 px-3.5 py-1.5 rounded-2xl">
                    {item.step}
                  </span>
                  <div className="space-y-1">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">{item.title}</h3>
                    <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Artisan Image */}
          <div className="lg:col-span-5 relative w-full h-96 sm:h-[450px] overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 shadow-md">
            <ImageWithPlaceholder
              src="/images/hero-image.jpg"
              alt="Port Harcourt artisan actively working on a home maintenance job"
              fallbackText="Artisan at Work"
              expectedPath="/images/hero-image.jpg"
              fill
              sizes="(max-width: 1024px) 100vw, 400px"
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
                
        </div>
      </section>
    </div>
  );
}
