import React, { Suspense } from "react";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/website/ThemeProvider";
import { Header } from "@/components/website/Header";
import { Footer } from "@/components/website/Footer";

export const metadata: Metadata = {
  title: {
    default: "Port Harcourt Handyman Services | Excellence and Reliability",
    template: "%s | Port Harcourt Handyman Services",
  },
  description: "Port Harcourt's trusted name in professional property maintenance and personal specialist services. Powered by the Surework mobile app.",
  keywords: [
    "Handyman Port Harcourt",
    "Plumber Port Harcourt",
    "Electrician Rivers State",
    "AC repair GRA Phase 2",
    "Surework App",
    "Port Harcourt Handyman Services",
    "Cleaning services Trans Amadi",
  ],
};

export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen">
        {/* Suspense is required here because Header uses usePathname() (a dynamic
            navigation hook). Without this boundary Next.js throws
            "invariant expected layout router to be mounted". */}
        <Suspense fallback={<div className="h-16 sm:h-20" />}>
          <Header />
        </Suspense>
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
