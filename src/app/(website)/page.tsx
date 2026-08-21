"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Clock,
  Star,
  Users,
  CheckCircle,
  ArrowRight,
  Wrench,
  Smartphone,
  PhoneCall,
  Award,
  Zap,
} from "lucide-react";
import { useTheme } from "@/components/website/ThemeProvider";
import { SectionHeading } from "@/components/website/SectionHeading";
import { FeatureCard } from "@/components/website/FeatureCard";
import { TestimonialCard, Testimonial } from "@/components/website/TestimonialCard";
import { ImageWithPlaceholder } from "@/components/website/ImageWithPlaceholder";
import { CategoryCard, ServiceCategory } from "@/components/website/CategoryCard";

const HOME_TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Engr. Nnamdi W.",
    location: "GRA Phase 2, Port Harcourt",
    service: "AC Servicing & Gas Refill",
    rating: 5.0,
    comment: "Port Harcourt Handyman Services sent an AC technician within 45 minutes of my request on Surework. Professional diagnosis and honest pricing. Highly recommended!",
    date: "July 2026",
    initials: "NW",
  },
  {
    id: "2",
    name: "Dr. Mrs. Blessing K.",
    location: "Ada George Road, Port Harcourt",
    service: "Kitchen Plumbing Overhaul",
    rating: 4.9,
    comment: "I've had terrible experiences with unreliable artisans in the past. PH Handyman Services changed that completely — vetted plumber, came on time, and cleaned up afterwards.",
    date: "June 2026",
    initials: "BK",
  },
  {
    id: "3",
    name: "Chef Tari E.",
    location: "Trans Amadi Layout, Port Harcourt",
    service: "Commercial Kitchen Electrical",
    rating: 5.0,
    comment: "Their electrician diagnosed a dangerous breaker fault that two previous repairmen missed. Port Harcourt's gold standard for reliability.",
    date: "July 2026",
    initials: "TE",
  },
];

const POPULAR_SERVICES_TEASER: ServiceCategory[] = [
  {
    id: "plumbers",
    name: "Plumbing Installation & Repair",
    description: "Leaking pipes, clogged sinks, water heater setups, and bathroom fittings.",
    icon: "🔧",
    group: "home_property",
    groupLabel: "Home & Property",
    imagePath: "/images/plumbing.jpg"
  },
  {
    id: "hvac",
    name: "AC Servicing & Repair",
    description: "Split unit installation, gas refilling, compressor repair, and routine maintenance.",
    icon: "❄️",
    group: "home_property",
    groupLabel: "Home & Property",
    imagePath: "/images/ac-repair.jpg"
  },
  {
    id: "electricians",
    name: "Electrical Maintenance & Repair",
    description: "Fault diagnosis, house rewiring, prepaid meter connections, breaker fixes, and inverter setups.",
    icon: "⚡",
    group: "home_property",
    groupLabel: "Home & Property",
    imagePath: "/images/electrical.jpg"
  },
  {
    id: "fumigation",
    name: "Fumigation & Pest Control",
    description: "Residential eco-friendly pest treatment, mosquito eradication, and inspections.",
    icon: "🦟",
    group: "personal_specialist",
    groupLabel: "Personal & Specialist",
    imagePath: "/images/fumigation.jpg"
  },
  {
    id: "cleaners",
    name: "Residential & Commercial Cleaning",
    description: "Post-construction cleanup, deep home sanitization, and office maintenance.",
    icon: "🧹",
    group: "home_property",
    groupLabel: "Home & Property",
    imagePath: "/images/com-cleaning.jpg"
  },
  {
    id: "Nail",
    name: "Nail Technician",
    description: "Manicure, pedicure, acrylic nails, gel polish, and nail art.",
    icon: "💅",
    group: "personal_specialist",
    groupLabel: "Personal & Specialist",
    imagePath: "/images/nail-tech.jpg"
  },
];

export default function HomePage() {
  const { isDark } = useTheme();

  return (
    <div className="space-y-20 lg:space-y-28 pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 lg:pt-28 lg:pb-36 px-4 sm:px-6 lg:px-8 text-white min-h-[600px] flex items-center">
        
        {/* Full-width photography background */}
        <div className="absolute inset-0 z-0">
          <ImageWithPlaceholder
            src="/images/hero-image.jpg"
            alt="Professional electrician repairing a wiring panel in Port Harcourt"
            fallbackText="Handyman Services"
            expectedPath="/images/hero-image.jpg"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* Dark gradient overlay for text legibility (45% default) */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/60 to-slate-950/45" />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10 w-full">
          
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 border px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/10 border-white/20 text-blue-200 backdrop-blur-md">
              
              Serving Port Harcourt & Rivers State
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white drop-shadow-sm">
              Book Verified Handymen in Minutes
              <span className="block text-2xl sm:text-3xl font-bold mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-200">
                Excellence and Reliability
              </span>
            </h1>
            
            <p className="text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed text-slate-200 drop-shadow-sm">
              From plumbing and electrical repairs to AC servicing, cleaning, painting, carpentry, and more. Find trusted professionals for your home or business with transparent pricing and reliable service.
            </p>

            {/* Quick stats tags */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 py-2 text-white">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/10 border border-white/15 text-blue-300 flex items-center justify-center">
                  <ShieldCheck size={16} />
                </div>
                <span className="text-xs font-bold">100% Vetted Artisans</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/10 border border-white/15 text-amber-400 flex items-center justify-center">
                  <Star size={16} className="fill-current" />
                </div>
                <span className="text-xs font-bold">4.9/5 Average Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/10 border border-white/15 text-green-400 flex items-center justify-center">
                  <Users size={16} />
                </div>
                <span className="text-xs font-bold">5K+ Satisfied Clients</span>
              </div>
            </div>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/contact"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-7 py-3.5 rounded-2xl transition-all shadow-lg shadow-blue-600/30 hover:scale-[1.02] active:scale-95 text-sm flex items-center justify-center gap-2"
              >
                <PhoneCall size={18} />
                <span>Get a Service Quote</span>
              </Link>

              <Link
                href="/product"
                className="flex items-center justify-center gap-2 border border-white/20 bg-white/10 hover:bg-white/15 text-white px-7 py-3.5 rounded-2xl transition-all text-sm font-bold hover:scale-[1.02] active:scale-95 backdrop-blur-md"
              >
                <Smartphone size={18} className="text-blue-300" />
                <span>Explore Surework App</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Visual Showcase Glassmorphic Card */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="p-8 rounded-3xl border w-full max-w-md space-y-6 shadow-2xl relative overflow-hidden transition-all bg-slate-950/70 border-white/15 backdrop-blur-md text-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500/10 border border-white/10 text-blue-300 rounded-2xl flex items-center justify-center">
                  <Wrench size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight text-white">Port Harcourt HQ</h3>
                  <p className="text-xs text-slate-350">
                    GRA Phase 2, Trans Amadi, Ada George & Beyond
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                {[
                  { title: "Verification Process", text: "NIN/Voters ID, home address check, background review." },
                  { title: "Transparent Pricing", text: "Upfront quotes & fixed specialist rates. Zero surprise fees." },
                  { title: "Punctuality Guarantee", text: "Artisans arrive on time with real-time app location tracking." },
                ].map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-white/5 bg-slate-900/40 flex items-start gap-3">
                    <CheckCircle size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-xs text-white">{item.title}</h4>
                      <p className="text-[11px] mt-0.5 text-slate-350">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-950/30 text-blue-200 text-center">
                <p className="text-xs font-semibold">
                  Need immediate help? Call our Port Harcourt Dispatch Desk or book instantly via our app!
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Trust & Company Features Section */}
      <section className={`py-20 lg:py-28 px-4 sm:px-6 lg:px-8 border-y transition-colors duration-300 ${
        isDark ? "border-slate-900 bg-slate-900/20" : "border-slate-200 bg-slate-100/40"
      }`}>
        <div className="max-w-7xl mx-auto space-y-12">
          <SectionHeading
            badge="Why Choose PH Handyman Services"
            title="Built on Trust,"
            titleGradient="Delivered with Excellence"
            subtitle="We solve the artisan reliability problem in Rivers State. Every job is backed by our strict quality standard and customer protection guarantee."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={ShieldCheck}
              title="Strictly Vetted Artisans"
              description="National ID verification, residential inspections, and skills testing before any pro joins our network."
              color="text-emerald-500"
              bg="bg-emerald-500/10"
              badge="Security"
            />
            <FeatureCard
              icon={Zap}
              title="Rapid Local Dispatch"
              description="Located in key Port Harcourt hubs to ensure prompt arrival for urgent electrical, plumbing, or AC fixes."
              color="text-blue-600 dark:text-blue-400"
              bg="bg-blue-600/10 dark:bg-blue-400/10"
              badge="Speed"
            />
            <FeatureCard
              icon={Clock}
              title="Punctuality & Tracking"
              description="No waiting endlessly for artisans. Track arrival times transparently via the Surework platform."
              color="text-indigo-600 dark:text-indigo-400"
              bg="bg-indigo-600/10 dark:bg-indigo-400/10"
              badge="Reliability"
            />
            <FeatureCard
              icon={Award}
              title="Quality Work Guarantee"
              description="If a job isn't completed to professional specification, our team inspects and remedies it promptly."
              color="text-amber-500"
              bg="bg-amber-500/10"
              badge="Quality"
            />
          </div>
        </div>
      </section>

      {/* Overview of Services */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest block mb-1">
              Comprehensive Coverage
            </span>
            <h2 className="text-3xl font-extrabold sm:text-4xl tracking-tight">
              Featured Service Categories
            </h2>
            <p className={`text-base mt-2 max-w-xl ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              From home repairs to personal lifestyle specialists, explore our full spectrum of professional offerings.
            </p>
          </div>
          <Link
            href="/services"
            className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 group"
          >
            View All Categories
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {POPULAR_SERVICES_TEASER.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* Condensed 3-Step "How It Works" Section */}
      <section className={`py-20 lg:py-28 px-4 sm:px-6 lg:px-8 border-y transition-colors duration-300 ${
        isDark ? "border-slate-900 bg-slate-900/10" : "border-slate-200 bg-slate-100/30"
      }`}>
        <div className="max-w-7xl mx-auto space-y-12">
          <SectionHeading
            badge="Simple Process"
            title="How Port Harcourt Handyman"
            titleGradient="Services Works"
            subtitle="Getting reliable repairs or specialist care done in Port Harcourt takes just three easy steps."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Select Service or App Request",
                desc: "Choose from our catalog or submit job details & photos through our website contact form or the Surework app.",
                icon: Wrench,
              },
              {
                step: "02",
                title: "Matched with Vetted Pro",
                desc: "We assign a verified specialist near your neighborhood (GRA, Trans Amadi, Ada George, Peter Odili) with upfront quote approval.",
                icon: ShieldCheck,
              },
              {
                step: "03",
                title: "Job Done & Guaranteed",
                desc: "Your handyman completes the work on time to exact specifications. Enjoy seamless payment options (online escrow or dual-confirmed cash) and peace of mind.",
                icon: CheckCircle,
              },
            ].map((st, idx) => (
              <div
                key={idx}
                className={`p-8 rounded-3xl space-y-4 border relative overflow-hidden transition-all hover:-translate-y-1 ${
                  isDark 
                    ? "bg-slate-900/50 border-slate-800" 
                    : "bg-white border-slate-200 shadow-md"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-blue-600 dark:text-blue-400">{st.step}</span>
                  <div className={`p-3 rounded-2xl ${isDark ? "bg-slate-800 text-blue-400" : "bg-blue-50 text-blue-600"}`}>
                    <st.icon size={22} />
                  </div>
                </div>
                <h3 className="font-bold text-xl">{st.title}</h3>
                <p className={`text-sm leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Testimonials Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <SectionHeading
          badge="Verified Client Reviews"
          title="What Port Harcourt Residents Say"
          titleGradient="About Us"
          subtitle="Real reviews from homeowners and businesses across GRA Phase 2, Ada George, and Trans Amadi."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {HOME_TESTIMONIALS.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="rounded-4xl p-8 sm:p-12 lg:p-16 text-center space-y-6 relative overflow-hidden border border-slate-200 dark:border-slate-800 text-white shadow-2xl">
          
          {/* Background photography for footer CTA banner */}
          <div className="absolute inset-0 z-0">
            <ImageWithPlaceholder
              src="/images/hero-image.jpg"
              alt="Handyman service tools and site inspection in Port Harcourt"
              fallbackText="Reliability & Excellence"
              expectedPath="/images/hero-image.jpg"
              fill
              sizes="(max-width: 1024px) 100vw, 1000px"
              className="object-cover"
            />
            {/* Overlay to ensure rich legibility for both themes */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-blue-950/85 to-slate-950/90" />
          </div>

          <div className="relative z-10 w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-600/30">
            <Wrench size={28} />
          </div>
          
          <h2 className="relative z-10 text-3xl font-extrabold sm:text-4xl tracking-tight text-white">
            Ready for Excellence and Reliability?
          </h2>
          <p className="relative z-10 text-base max-w-2xl mx-auto leading-relaxed text-slate-250">
            Experience hassle-free repairs, AC servicing, plumbing, and personal specialist care in Port Harcourt. Contact us for a custom quote or download the Surework app today.
          </p>

          <div className="relative z-10 flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link
              href="/contact"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl transition-all text-sm flex items-center justify-center gap-2 hover:scale-105 shadow-md shadow-blue-600/20"
            >
              <PhoneCall size={18} />
              <span>Contact Us / Get Quote</span>
            </Link>
            <Link
              href="/product"
              className="font-semibold px-8 py-4 rounded-xl transition-all text-sm border border-white/20 bg-white/10 text-white hover:bg-white/15 flex items-center justify-center gap-2 hover:scale-105 backdrop-blur-md"
            >
              <Smartphone size={18} className="text-blue-300" />
              <span>Download Surework App</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
