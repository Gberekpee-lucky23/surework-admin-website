"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Sun, Moon, Menu, X, Smartphone, ArrowRight } from "lucide-react";
import { useTheme } from "./ThemeProvider";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Product", href: "/product" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  // { label: "FAQ", href: "/faq" },
  { label: "Careers", href: "/careers" },
];

export function Header() {
  const { isDark, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-300 ${
      isDark ? "bg-slate-950/85 border-slate-800/60" : "bg-white/85 border-slate-200/80"
    } px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 sm:h-20">
        
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform">
            <Image
              src="/images/surework-logo.png"
              alt="Surework logo"
              width={40}
              height={40}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <div>
            <span className="font-bold text-lg leading-none block">Surework</span>
            <span className={`text-[9px] uppercase tracking-widest font-semibold mt-0.5 block transition-colors duration-300 ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}>
              Port Harcourt Handyman Services
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className={`hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium transition-colors duration-300 ${
          isDark ? "text-slate-300" : "text-slate-600"
        }`}>
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors py-1 border-b-2 ${
                  isActive
                    ? "border-blue-600 font-bold text-blue-600 dark:text-blue-400 dark:border-blue-400"
                    : `border-transparent ${isDark ? "hover:text-white" : "hover:text-blue-600"}`
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls & Theme Toggle */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`p-2 sm:p-2.5 rounded-xl  transition-all hover:scale-105 cursor-pointer ${
              isDark 
                ? "bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800 hover:border-slate-700" 
                : "bg-white border-slate-200 text-indigo-600 hover:bg-slate-100 hover:border-slate-300"
            }`}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun size={18} className="animate-pulse" /> : <Moon size={18} />}
          </button>

          {/* Download Store Badges */}
          <div className="hidden lg:flex items-center gap-2">
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
                width={120}
                height={36}
                className="h-9 w-auto"
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
                width={120}
                height={36}
                className="h-9 w-auto"
              />
            </a>
          </div>

          {/* Fallback button for medium screens where full badges are too wide */}
          <Link
            href="/product"
            className="hidden sm:inline-flex lg:hidden text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-blue-600/10 hover:scale-105 active:scale-95 items-center gap-1.5"
          >
            <Smartphone size={14} />
            <span>Get the App</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 rounded-xl  ${
              isDark ? "bg-slate-900 border-slate-800 text-slate-300" : "bg-white border-slate-200 text-slate-700"
            }`}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className={`md:hidden border-t py-4 px-2 space-y-2 transition-colors duration-300 ${
          isDark ? "border-slate-800 bg-slate-950" : "border-slate-200 bg-white"
        }`}>
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : isDark ? "text-slate-300 hover:bg-slate-900" : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="pt-2 px-2">
            <Link
              href="/product"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm shadow-md"
            >
              <span>Download Surework App</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
