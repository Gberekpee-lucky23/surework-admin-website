"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Wrench,
  ShieldCheck,
  Clock,
  DollarSign,
  Star,
  Search,
  MapPin,
  CheckCircle,
  ArrowRight,
  Smartphone,
  Sparkles,
  ClipboardCheck,
  UserCheck,
} from "lucide-react";
import { useTheme } from "@/components/website/ThemeProvider";
import { SectionHeading } from "@/components/website/SectionHeading";

// Interactive App Screens Data
const APP_SCREENS = [
  {
    id: "browse",
    label: "Explore Services",
    title: "Browse Local Professionals",
    description: "Search and filter verified specialists for any maintenance need in Port Harcourt.",
    screenContent: (
      <div className="flex flex-col h-full bg-slate-50 text-slate-800 text-left">
        {/* Mobile App Header */}
        <div className="bg-blue-600 text-white p-4 pt-6 pb-4 rounded-t-3xl flex justify-between items-center shadow-md">
          <div>
            <span className="text-[10px] text-blue-100 block">Find services in</span>
            <span className="text-xs font-semibold flex items-center gap-1">
              <MapPin size={10} className="text-blue-200" />
              GRA Phase 2, PH
            </span>
          </div>
          <div className="w-7 h-7 rounded-full bg-blue-500/50 flex items-center justify-center font-bold text-[10px]">
            JD
          </div>
        </div>

        {/* App Search Bar */}
        <div className="p-2.5">
          <div className="relative bg-white rounded-xl shadow-sm border border-slate-150 py-1.5 pl-8 pr-3 text-[10px] text-slate-400 flex items-center">
            <Search size={11} className="absolute left-2.5 text-slate-400" />
            Search for plumbers, electricians...
          </div>
        </div>

        {/* Categories Grid */}
        <div className="px-2.5 flex-1 overflow-y-auto scrollbar-thin">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Popular Categories</p>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { label: "Plumbing", icon: "🔧" },
              { label: "AC Repair", icon: "❄️" },
              { label: "Electrical", icon: "⚡" },
              { label: "Cleaning", icon: "🧹" },
              { label: "Painting", icon: "🎨" },
              { label: "Carpentry", icon: "🔨" },
            ].map((cat) => (
              <div key={cat.label} className="bg-white p-2 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-center shadow-sm">
                <span className="text-lg mb-0.5">{cat.icon}</span>
                <span className="text-[8px] font-bold text-slate-700">{cat.label}</span>
              </div>
            ))}
          </div>

          {/* Featured Handymen */}
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-3 mb-1.5">Top Handymen</p>
          <div className="space-y-1.5 pb-3">
            {[
              { name: "Tunde Alabi", profession: "Expert Electrician", rating: 4.9, price: "NGN 4,000", img: "TA" },
              { name: "Chidi Okafor", profession: "Professional Plumber", rating: 4.8, price: "NGN 5,000", img: "CO" },
            ].map((hm) => (
              <div key={hm.name} className="bg-white p-1.5 rounded-xl border border-slate-100 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-1.5">
                  <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px]">
                    {hm.img}
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-800 leading-tight">{hm.name}</p>
                    <p className="text-[7px] text-slate-400 leading-none">{hm.profession}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[8px] font-bold text-amber-500 flex items-center gap-0.5">
                    ★ {hm.rating}
                  </span>
                  <p className="text-[7px] text-slate-500 mt-0.5">{hm.price}/hr</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "booking",
    label: "Easy Booking",
    title: "Book Services Instantly",
    description: "Submit details, upload photos of the issue, and select your preferred date/time.",
    screenContent: (
      <div className="flex flex-col h-full bg-slate-50 text-slate-800 text-left">
        <div className="bg-blue-600 text-white p-4 pt-6 pb-3 rounded-t-3xl flex items-center gap-2 shadow-sm">
          <span className="text-xs font-semibold">New Plumbing Booking</span>
        </div>
        <div className="p-3 space-y-3 flex-1 overflow-y-auto scrollbar-thin">
          <div>
            <label className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider block mb-0.5">Describe the job</label>
            <textarea
              readOnly
              rows={2}
              value="Kitchen sink pipe is leaking water under the cabinet. Needs new pipe installation."
              className="w-full border border-slate-200 bg-white rounded-lg p-2 text-[9px] text-slate-700 resize-none focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider block mb-0.5">Issue Photos</label>
            <div className="flex gap-1.5">
              <div className="w-10 h-10 bg-slate-200 border border-slate-300 rounded-lg flex items-center justify-center text-xs text-slate-400">📸</div>
              <div className="w-10 h-10 bg-slate-200 border border-slate-300 rounded-lg flex items-center justify-center text-xs text-slate-400">📸</div>
              <div className="w-10 h-10 bg-slate-100 border border-dashed border-slate-300 rounded-lg flex items-center justify-center text-[9px] text-slate-400">+ Add</div>
            </div>
          </div>

          <div>
            <label className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider block mb-0.5">Service Address</label>
            <input
              type="text"
              readOnly
              value="22 Ada George Rd, Port Harcourt"
              className="w-full border border-slate-200 bg-white rounded-lg p-1.5 text-[9px] text-slate-700 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider block mb-0.5">Preferred Date</label>
            <div className="w-full border border-slate-200 bg-white rounded-lg p-1.5 text-[9px] text-slate-700 flex items-center justify-between">
              <span>Sat, 25 July 2026</span>
              <span className="text-blue-600 font-medium">10:00 AM</span>
            </div>
          </div>

          <button type="button" className="w-full bg-blue-600 text-white rounded-lg py-1.5 text-[10px] font-bold shadow-md">
            Submit Booking Request
          </button>
        </div>
      </div>
    ),
  },
  {
    id: "tracking",
    label: "Live Tracking",
    title: "Track Your Jobs Live",
    description: "Follow your service timeline transparently from request submission to completion.",
    screenContent: (
      <div className="flex flex-col h-full bg-slate-50 text-slate-800 text-left">
        <div className="bg-blue-600 text-white p-4 pt-6 pb-2 rounded-t-3xl flex justify-between items-center shadow-sm">
          <span className="text-xs font-semibold">Active Job #1042</span>
          <span className="text-[8px] bg-green-500/20 text-green-300 border border-green-500/30 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">Started</span>
        </div>

        <div className="bg-slate-200 h-24 relative flex items-center justify-center text-xs text-slate-400 overflow-hidden">
          <div className="absolute inset-0 bg-blue-50/50 flex flex-col justify-center items-center">
            <span className="text-xl mb-0.5">📍</span>
            <span className="text-[8px] font-semibold text-slate-500">Trans Amadi Industrial Layout</span>
          </div>
        </div>

        <div className="p-3 flex-1 space-y-3 overflow-y-auto scrollbar-thin">
          <div className="bg-white p-2 rounded-xl border border-slate-100 flex items-center gap-2 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
              BO
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-800 leading-tight">Bassey Okon</p>
              <p className="text-[7px] text-slate-400">Professional Electrician</p>
            </div>
            <button className="ml-auto bg-blue-50 text-blue-600 border border-blue-100 font-bold text-[8px] px-2 py-0.5 rounded">
              Call
            </button>
          </div>

          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Service Timeline</p>
            <div className="space-y-1.5 text-[8px]">
              {[
                { label: "Job Request Submitted", time: "10:15 AM" },
                { label: "Accepted by Bassey Okon", time: "10:30 AM" },
                { label: "Handyman is On the Way", time: "10:45 AM" },
                { label: "Job Started", time: "11:00 AM" },
              ].map((step, idx) => (
                <div key={idx} className="flex items-center gap-2 text-slate-700">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 text-white flex items-center justify-center text-[5px]">
                    ✓
                  </div>
                  <span className="font-medium">{step.label}</span>
                  <span className="ml-auto text-slate-400">{step.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "handyman",
    label: "Become a Pro",
    title: "Join as a Handyman",
    description: "Submit your profile and documents, get verified by our admin, and start earning on Surework.",
    screenContent: (
      <div className="flex flex-col h-full bg-slate-50 text-slate-800 text-left">
        <div className="bg-slate-900 text-white p-4 pt-6 pb-3 rounded-t-3xl flex justify-between items-center shadow-sm">
          <span className="text-xs font-semibold">Join Port Harcourt Handymen</span>
        </div>
        <div className="p-3 space-y-2.5 flex-1 overflow-y-auto scrollbar-thin">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-2 text-center">
            <p className="text-[9px] text-blue-700 font-semibold leading-tight">Grow Your Business</p>
            <p className="text-[7px] text-blue-600 mt-0.5">Get consistent clients in Port Harcourt with quick payouts.</p>
          </div>

          <div>
            <label className="text-[8px] font-semibold text-slate-500 block mb-0.5">Select Profession</label>
            <input type="text" readOnly value="Air Conditioner Specialist" className="w-full border border-slate-200 bg-white rounded-lg p-1.5 text-[8px] text-slate-700 focus:outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <div>
              <label className="text-[8px] font-semibold text-slate-500 block mb-0.5">Experience</label>
              <input type="text" readOnly value="5 Years" className="w-full border border-slate-200 bg-white rounded-lg p-1.5 text-[8px] text-slate-700 focus:outline-none" />
            </div>
            <div>
              <label className="text-[8px] font-semibold text-slate-500 block mb-0.5">Price (Hourly)</label>
              <input type="text" readOnly value="NGN 6,500" className="w-full border border-slate-200 bg-white rounded-lg p-1.5 text-[8px] text-slate-700 focus:outline-none" />
            </div>
          </div>

          <div>
            <label className="text-[8px] font-semibold text-slate-500 block mb-0.5">Required ID Verification</label>
            <div className="border border-dashed border-slate-300 bg-white rounded-lg p-1.5 text-center flex flex-col items-center justify-center">
              <span className="text-[8px] text-slate-400">📄 national_id_card.jpg</span>
              <span className="text-[7px] text-green-600 font-bold uppercase tracking-wider">Uploaded</span>
            </div>
          </div>

          <button type="button" className="w-full bg-slate-900 text-white rounded-lg py-1.5 text-[9px] font-bold shadow">
            Submit Application
          </button>
        </div>
      </div>
    ),
  },
];

export default function ProductPage() {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState("browse");

  const selectedScreen = APP_SCREENS.find((s) => s.id === activeTab) || APP_SCREENS[0];

  return (
    <div className="space-y-20 lg:space-y-28 pb-20 pt-10">
      
      {/* App Product Hero */}
      <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className={`inline-flex items-center gap-2 border px-3.5 py-1.5 rounded-full text-xs font-semibold ${
              isDark ? "bg-blue-500/10 border-blue-500/25 text-blue-400" : "bg-blue-50 border-blue-200 text-blue-700"
            }`}>
              The Surework Mobile Experience
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Surework App: On-Demand <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300">
                Handyman Marketplace
              </span>
            </h1>
            
            <p className={`text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}>
              Developed by <strong>Port Harcourt Handyman Services</strong>, Surework connects residents across Rivers State with vetted plumbers, electricians, AC technicians, cleaners, and beauty specialists instantly. Zero guesswork, honest rates, quality guaranteed.
            </p>

            {/* App Store Buttons */}
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-2">
              <a
                href="https://play.google.com/store"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex hover:scale-[1.03] active:scale-95 transition-transform"
                aria-label="Get it on Google Play"
              >
                <Image
                  src="/web/google-play-badge.svg"
                  alt="Get it on Google Play"
                  width={180}
                  height={53}
                  className="h-14 w-auto"
                  priority
                />
              </a>

              <a
                href="https://github.com/Gberekpee-lucky23/surework-android/releases/download/v1.0.0/Surework.v1.0.0.apk"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex hover:scale-[1.03] active:scale-95 transition-transform"
                aria-label="Download Android APK"
              >
                <Image
                  src="/web/android-apk-badge.svg"
                  alt="Download Android APK"
                  width={180}
                  height={53}
                  className="h-14 w-auto"
                  priority
                />
              </a>
            </div>
          </div>

          {/* Interactive Phone Mockup Preview */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className={`relative w-75 h-150 rounded-[40px] p-3 shadow-2xl transition-all duration-500 border-4 ${
              isDark 
                ? "bg-slate-950 border-slate-800 shadow-blue-500/5" 
                : "bg-white border-slate-300 shadow-xl shadow-slate-250"
            }`}>
              {/* Notch */}
              <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 rounded-b-2xl z-20 flex items-center justify-center ${
                isDark ? "bg-slate-950" : "bg-white"
              }`}>
                <div className={`w-12 h-1 rounded-full ${isDark ? "bg-slate-800" : "bg-slate-200"}`} />
              </div>
              <div className="w-full h-full rounded-[30px] overflow-hidden border border-slate-200/80 dark:border-slate-800 relative bg-slate-50">
                {selectedScreen.screenContent}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Interactive App Screen Switcher */}
      <section className={`py-20 lg:py-28 px-4 sm:px-6 lg:px-8 border-y transition-colors duration-300 ${
        isDark ? "border-slate-900 bg-slate-900/20" : "border-slate-200 bg-slate-100/40"
      }`}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <SectionHeading
              badge="Interactive Demo"
              title="Experience the App"
              titleGradient="Features Live"
              subtitle="Toggle the tabs below to preview real app workflows in action."
              centered={false}
            />

            <div className="space-y-3 pt-4">
              {APP_SCREENS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-4 hover:scale-[1.01] cursor-pointer ${
                      isActive
                        ? isDark 
                          ? "bg-slate-900 border-blue-500/50 shadow-lg" 
                          : "bg-white border-blue-600 shadow-md"
                        : isDark
                          ? "bg-slate-950 border-slate-800/60 hover:bg-slate-900/40 text-slate-300"
                          : "bg-slate-100/50 border-slate-200 hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl mt-0.5 transition-all ${
                      isActive 
                        ? "bg-blue-600 text-white scale-110" 
                        : isDark ? "bg-slate-800 text-slate-400" : "bg-slate-200 text-slate-600"
                    }`}>
                      {tab.id === "browse" && <Search size={16} />}
                      {tab.id === "booking" && <ClipboardCheck size={16} />}
                      {tab.id === "tracking" && <Clock size={16} />}
                      {tab.id === "handyman" && <UserCheck size={16} />}
                    </div>
                    <div>
                      <h3 className={`font-bold text-sm transition-colors ${
                        isActive 
                          ? isDark ? "text-blue-400" : "text-blue-600" 
                          : isDark ? "text-white" : "text-slate-800"
                      }`}>
                        {tab.label}
                      </h3>
                      <p className={`text-xs mt-1 leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                        {tab.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col justify-center items-center">
            <div className={`border p-8 rounded-3xl w-full max-w-md flex flex-col items-center transition-all ${
              isDark ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200 shadow-md"
            }`}>
              <h3 className={`text-lg font-bold mb-5 text-center ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                {selectedScreen.title}
              </h3>
              
              <div className={`relative w-70 h-135 rounded-[40px] p-2.5 shadow-2xl border-4 transition-all duration-300 ${
                isDark ? "bg-slate-950 border-slate-800" : "bg-white border-slate-300 shadow-lg"
              }`}>
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 rounded-b-2xl z-20 flex items-center justify-center ${
                  isDark ? "bg-slate-950" : "bg-white"
                }`}>
                  <div className={`w-10 h-0.5 rounded-full ${isDark ? "bg-slate-800" : "bg-slate-200"}`} />
                </div>
                <div className="w-full h-full rounded-[28px] overflow-hidden border border-slate-200/80 dark:border-slate-800 relative bg-slate-50">
                  {selectedScreen.screenContent}
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Become a Pro Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className={`rounded-4xl p-8 sm:p-12 lg:p-16 text-center space-y-6 relative overflow-hidden border ${
          isDark 
            ? "bg-gradient-to-r from-blue-950/40 via-indigo-950/40 to-blue-950/40 border-blue-500/20 shadow-blue-500/5 shadow-2xl" 
            : "bg-white border-slate-200 shadow-xl shadow-slate-200"
        }`}>
          <h2 className="text-3xl font-extrabold sm:text-4xl tracking-tight">
            Are You an Artisan in Port Harcourt?
          </h2>
          <p className={`text-base max-w-2xl mx-auto leading-relaxed ${isDark ? "text-slate-350" : "text-slate-650"}`}>
            Join Port Harcourt Handyman Services as a verified provider on Surework. Build your reputation, unlock steady job requests, and get guaranteed digital payouts.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
            <Link
              href="/careers"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-xl transition-all text-sm flex items-center justify-center gap-2 hover:scale-105 shadow-md shadow-blue-600/10"
            >
              <span>Learn About Becoming a Pro</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
