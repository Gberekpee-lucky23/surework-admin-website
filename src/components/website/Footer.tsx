"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, ShieldCheck, ArrowUpRight } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function Footer() {
  const { isDark } = useTheme();

  return (
    <footer className={`py-12 sm:py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300 border-t ${
      isDark ? "bg-slate-950 border-slate-900 text-slate-400" : "bg-slate-100 text-slate-600 border-slate-200"
    }`}>
      <div className="max-w-7xl mx-auto space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Col 1 & 2: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
                <Image
                  src="/images/surework-logo.png"
                  alt="Surework logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className={`font-bold text-lg leading-none block ${isDark ? "text-white" : "text-slate-900"}`}>
                  Port Harcourt Handyman Services
                </span>
                <span className="text-[10px] uppercase tracking-widest font-semibold text-blue-600 dark:text-blue-400 mt-0.5 block">
                  Excellence and Reliability
                </span>
              </div>
            </div>

            <p className="text-xs leading-relaxed max-w-sm">
              Port Harcourt&apos;s trusted name in professional property maintenance and personal specialist services. Powered by our proprietary <strong>Surework</strong> mobile application.
            </p>

            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://play.google.com/store"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-[1.03] active:scale-95 transition-transform"
                aria-label="Get it on Google Play"
              >
                <Image
                  src="/web/google-play-badge.svg"
                  alt="Get it on Google Play"
                  width={135}
                  height={40}
                  className="h-10 w-auto"
                />
              </a>
              <a
                href="/downloads/surework.apk"
                download
                className="hover:scale-[1.03] active:scale-95 transition-transform"
                aria-label="Download Android APK"
              >
                <Image
                  src="/web/android-apk-badge.svg"
                  alt="Download Android APK"
                  width={135}
                  height={40}
                  className="h-10 w-auto"
                />
              </a>
            </div>

            <div className="flex items-center gap-2 pt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <ShieldCheck size={16} />
              <span>100% Background-Vetted & Insured Artisans</span>
            </div>
          </div>

          {/* Col 3: Navigation */}
          <div className="space-y-3">
            <h4 className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-white" : "text-slate-900"}`}>
              Navigation
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link href="/" className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-blue-600"}`}>Home</Link>
              </li>
              <li>
                <Link href="/services" className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-blue-600"}`}>All Services</Link>
              </li>
              <li>
                <Link href="/product" className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-blue-600"}`}>Surework App</Link>
              </li>
              <li>
                <Link href="/about" className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-blue-600"}`}>About Us</Link>
              </li>
              <li>
                <Link href="/faq" className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-blue-600"}`}>FAQ</Link>
              </li>
              <li>
                <Link href="/careers" className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-blue-600"}`}>Careers & Pros</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Top Service Areas */}
          <div className="space-y-3">
            <h4 className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-white" : "text-slate-900"}`}>
              Service Coverage
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li className="flex items-center gap-1.5">
                <MapPin size={12} className="text-blue-500" /> GRA Phase 1, 2 & 3
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin size={12} className="text-blue-500" /> Trans Amadi Layout
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin size={12} className="text-blue-500" /> Ada George Road
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin size={12} className="text-blue-500" /> Peter Odili Road
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin size={12} className="text-blue-500" /> Garrison & Rumuola
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin size={12} className="text-blue-500" /> Choba & Uniport Area
              </li>
            </ul>
          </div>

          {/* Col 5: Contact & Portal */}
          <div className="space-y-3">
            <h4 className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-white" : "text-slate-900"}`}>
              Contact Us
            </h4>
            <div className="space-y-2 text-xs">
              <p className="flex items-center gap-2">
                <Phone size={13} className="text-blue-500" />
                <span>+234 (0) 800 SUREWORK</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail size={13} className="text-blue-500" />
                <span>support@surework.ng</span>
              </p>
              <p className="flex items-start gap-2 pt-1">
                <MapPin size={13} className="text-blue-500 shrink-0 mt-0.5" />
                <span>Port Harcourt, Rivers State, Nigeria</span>
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Send Us a Message
                <ArrowUpRight size={13} />
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className={`pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4 text-xs ${
          isDark ? "border-slate-900 text-slate-500" : "border-slate-200 text-slate-500"
        }`}>
          <p>&copy; {new Date().getFullYear()} Port Harcourt Handyman Services. All rights reserved.</p>
          <div className="flex items-center gap-6 font-medium">
            <Link href="/contact" className="hover:underline">Support</Link>
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="hover:underline">Terms of Service</Link>
            {/* <Link href="/admin" className="hover:underline text-slate-400 dark:text-slate-600">Admin Portal</Link> */}
          </div>
        </div>

      </div>
    </footer>
  );
}
