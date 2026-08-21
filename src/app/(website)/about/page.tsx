"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Award, Clock, DollarSign, MapPin, ArrowRight } from "lucide-react";
import { useTheme } from "@/components/website/ThemeProvider";
import { SectionHeading } from "@/components/website/SectionHeading";
import { FeatureCard } from "@/components/website/FeatureCard";

export default function AboutPage() {
  const { isDark } = useTheme();

  // Image source state to handle fallback from Team photo to Office photo
  const [imgSrc, setImgSrc] = useState("/images/com-cleaning.jpg");
  const [isFallback, setIsFallback] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleImgError = () => {
    if (!isFallback) {
      setImgSrc("/images/office/office-main.jpg");
      setIsFallback(true);
    } else {
      setImgError(true);
    }
  };

  return (
    <div className="space-y-20 lg:space-y-28 pb-20 pt-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <SectionHeading
        badge="Who We Are"
        title="Port Harcourt's Trusted Name in"
        titleGradient="Professional Services"
        subtitle="Port Harcourt Handyman Services was founded to solve the chronic gap in artisan reliability, transparency, and accountability across Rivers State."
      />

      {/* Story & Background Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest block">
              Our Mission
            </span>
            <h2 className={`text-3xl font-extrabold sm:text-4xl tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              Setting the Gold Standard for Property Maintenance in Rivers State
            </h2>
          </div>

          <p className={`text-base sm:text-lg leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
            Finding a reliable plumber, electrician, or AC technician in Port Harcourt shouldn&apos;t depend on luck or unverified referrals. We built <strong>Port Harcourt Handyman Services</strong> to combine professional corporate standards with seamless modern technology.
          </p>

          <div className={`p-6 rounded-2xl border space-y-3 ${
            isDark ? "bg-slate-900/50 border-slate-800" : "bg-blue-50/50 border-blue-200"
          }`}>
            <h3 className="font-bold text-base flex items-center gap-2">
              <ShieldCheck className="text-emerald-500" />
              What &ldquo;Excellence and Reliability&rdquo; Means to Us
            </h3>
            <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              It means rigorous multi-stage background checks (NIN, residential address audits, guarantor checks), transparent pricing before work begins, and a guarantee that your artisan arrives on time equipped to do the job right.
            </p>
          </div>

          {/* Placeholder callout notice for client customization */}
          <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
            isDark ? "bg-amber-950/20 border-amber-500/30 text-amber-300" : "bg-amber-50 border-amber-200 text-amber-800"
          }`}>
            <span className="font-bold uppercase tracking-wider block mb-1">Client Note (Company History & Leadership)</span>
            Placeholder content: The exact founding year and executive biography sections are ready to be populated with your specific corporate history details before going live.
          </div>
        </div>

        {/* Photography & Metrics Column */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Team / Office location photo container */}
          <div className="relative w-full h-64 sm:h-72 overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 shadow-md">
            {imgError ? (
              <div className="w-full h-full bg-blue-600 dark:bg-blue-900/60 flex flex-col items-center justify-center text-white p-6 text-center select-none">
                {process.env.NODE_ENV === "development" ? (
                  <div className="space-y-2 flex flex-col items-center justify-center">
                    <span className="inline-block text-[10px] font-black uppercase tracking-widest bg-blue-550 dark:bg-blue-500/40 px-2.5 py-0.5 rounded-full border border-blue-400/30 text-blue-100 animate-pulse">
                      Photo needed
                    </span>
                    <p className="text-[10px] font-mono break-all opacity-95">
                      Expected paths:<br/>
                      1. /images/team/team-main.jpg<br/>
                      2. /images/office/office-main.jpg
                    </p>
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-700 to-indigo-850 flex items-center justify-center">
                    <span className="text-xs font-semibold tracking-wider text-blue-200/50 uppercase select-none">
                      Our Office & Team
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <Image
                src={imgSrc}
                alt={isFallback ? "Port Harcourt office location photo" : "Port Harcourt Handyman Services team photo"}
                fill
                sizes="(max-width: 1024px) 100vw, 400px"
                className="object-cover"
                onError={handleImgError}
              />
            )}
            
            {/* Conditional warning label in development when using the office fallback */}
            {isFallback && !imgError && process.env.NODE_ENV === "development" && (
              <div className="absolute bottom-3 left-3 right-3 bg-amber-600/90 text-white text-[9.5px] font-bold px-2 py-1 rounded-xl shadow-md text-center backdrop-blur-sm border border-amber-500/30">
                ⚠️ Team photo missing. Using office fallback: /images/office/office-main.jpg
              </div>
            )}
          </div>

          {/* Metrics Card */}
          <div className={`p-8 rounded-3xl border w-full space-y-6 shadow-xl ${
            isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200 shadow-slate-200/50"
          }`}>
            <h3 className="text-xl font-bold text-center text-slate-900 dark:text-white">Company Metrics at a Glance</h3>
            
            <div className="space-y-4">
              {[
                { label: "Satisfied Port Harcourt Clients", value: "5,000+" },
                { label: "Vetted Local Artisans", value: "350+" },
                { label: "Port Harcourt Neighborhoods Covered", value: "100%" },
                { label: "Average Customer Rating", value: "4.9 / 5.0" },
              ].map((stat, idx) => (
                <div key={idx} className={`p-4 rounded-2xl border flex items-center justify-between ${
                  isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
                }`}>
                  <span className={`text-xs font-semibold ${isDark ? "text-slate-400" : "text-slate-600"}`}>{stat.label}</span>
                  <span className="text-lg font-black text-blue-600 dark:text-blue-400">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Core Values Section */}
      <section className="space-y-12">
        <SectionHeading
          badge="Our Core Beliefs"
          title="The Principles That Drive"
          titleGradient="Every Service Call"
          subtitle="We align every technician and customer representative with our core operating standards."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={ShieldCheck}
            title="Trust & Safety First"
            description="Complete identity verification and background vetting so you feel completely safe inviting our pros into your home or office."
            color="text-emerald-500"
            bg="bg-emerald-500/10"
          />
          <FeatureCard
            icon={Award}
            title="Quality Craftsmanship"
            description="We test skills rigorously. If a job fails to meet professional standards, we re-inspect and fix it at no extra charge."
            color="text-blue-600 dark:text-blue-400"
            bg="bg-blue-600/10 dark:bg-blue-400/10"
          />
          <FeatureCard
            icon={Clock}
            title="Uncompromising Punctuality"
            description="Your time is valuable. We enforce punctual arrivals and provide live app location updates."
            color="text-indigo-600 dark:text-indigo-400"
            bg="bg-indigo-600/10 dark:bg-indigo-400/10"
          />
          <FeatureCard
            icon={DollarSign}
            title="Fair Transparent Pricing"
            description="No hidden markups or extortionate rates. Inspection quotes are approved by you before work begins."
            color="text-amber-500"
            bg="bg-amber-500/10"
          />
        </div>
      </section>

      {/* Service Area Coverage */}
      <section className={`p-8 sm:p-12 rounded-3xl border space-y-8 ${
        isDark ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200 shadow-md"
      }`}>
        <div className="space-y-3 text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest block">
            Coverage Area
          </span>
          <h2 className={`text-3xl font-extrabold sm:text-4xl tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>Active Across Port Harcourt & Environs</h2>
          <p className={`text-xs sm:text-sm ${isDark ? "text-white" : "text-slate-600"}`}>
            We operate throughout Rivers State with dedicated service pods in key Port Harcourt residential and commercial zones:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { zone: "GRA Phase 1, 2 & 3", desc: "Residential & commercial property maintenance." },
            { zone: "Trans Amadi Layout", desc: "Industrial & commercial specialist support." },
            { zone: "Ada George Road", desc: "Plumbing, electrical, and home cleaning." },
            { zone: "Peter Odili Road", desc: "Estate maintenance & AC repair hub." },
            { zone: "Garrison & Rumuola", desc: "Rapid central dispatch and repairs." },
            { zone: "Choba & Uniport Area", desc: "Residential, student & personal services." },
            { zone: "Oil Mill & Eleme Axis", desc: "Expanding property specialist coverage." },
            { zone: "D-Line & Town", desc: "Commercial & residential service dispatch." },
          ].map((loc, idx) => (
            <div key={idx} className={`p-4 rounded-xl border flex items-start gap-3 ${
              isDark ? "bg-slate-950 border-slate-850" : "bg-slate-50 border-slate-200"
            }`}>
              <MapPin size={16} className="text-blue-500 shrink-0 mt-0.5" />
              <div>
                <h4 className={`font-bold text-xs sm:text-sm ${isDark ? "text-white" : "text-slate-900"}`}>{loc.zone}</h4>
                <p className={`text-[11px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-600"}`}>{loc.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="text-center space-y-4">
        <h3 className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Have Questions or Need a Custom Service Quote?</h3>
        <p className={`text-sm max-w-xl mx-auto ${isDark ? "text-slate-400" : "text-slate-600"}`}>
          Our Port Harcourt team is ready to assist you. Contact our office or download the Surework app.
        </p>
        <div className="flex justify-center gap-4 pt-2">
          <Link
            href="/contact"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-all text-xs sm:text-sm flex items-center gap-2 shadow-md hover:scale-105"
          >
            <span>Contact Customer Support</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

    </div>
  );
}
