"use client";

import React from "react";
import { useTheme } from "@/components/website/ThemeProvider";
import { SectionHeading } from "@/components/website/SectionHeading";
import { ShieldCheck, Eye } from "lucide-react";

export default function PrivacyPage() {
  const { isDark } = useTheme();

  return (
    <div className="space-y-12 pb-20 pt-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Header */}
      <SectionHeading
        badge="Data Protection"
        title="Privacy"
        titleGradient="Policy"
        subtitle="Last updated: August 21, 2026. Your privacy and data security are extremely important to us."
      />

      {/* Intro alert */}
      <div className={`p-5 rounded-2xl border text-xs sm:text-sm leading-relaxed flex items-start gap-3.5 ${
        isDark ? "bg-blue-950/20 border-blue-500/30 text-blue-300" : "bg-blue-50 border-blue-200 text-blue-800"
      }`}>
        <ShieldCheck className="shrink-0 mt-0.5" size={20} />
        <div>
          <span className="font-bold block mb-1">Nigeria Data Protection Act, 2023 (NDPA) Compliant</span>
          Surework is committed to protecting your personal data in strict compliance with the NDPA, the General Application and Implementation Directive, 2025 (GAID), and other applicable Rivers State and federal regulations.
        </div>
      </div>

      {/* Content */}
      <div className={`prose max-w-none space-y-8 text-sm leading-relaxed ${isDark ? "text-slate-350" : "text-slate-600"}`}>
        
        <section className="space-y-3">
          <h2 className={`text-xl font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
            <Eye size={18} className="text-blue-500" />
            1. Introduction
          </h2>
          <p>
            Surework (&ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our&rdquo;) is committed to protecting the privacy and security of your personal data. This Privacy Policy explains how we collect, use, disclose, transfer, and protect your personal information when you use the Surework platform, website, mobile application, and related services.
          </p>
          <p>
            By using the Platform, you consent to the collection and use of your personal data as described in this Privacy Policy.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>2. Types of Personal Data Collected</h2>
          <p>We collect the following categories of personal data:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Personal Identifiers:</strong> Full name, address, phone number, email address, date of birth, and government-issued identification for verification.</li>
            <li><strong>Account Information:</strong> Username, password, profile settings, and service preferences.</li>
            <li><strong>Financial Information:</strong> Bank account details (for Service Providers receiving payments), payment card information (processed by secure third-party payment gateways), and transaction history.</li>
            <li><strong>Service & Technical Data:</strong> Booking histories, rating feedbacks, communication logs between users, location data, IP addresses, and device/browser identifiers.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>3. Legal Basis for Processing</h2>
          <p>We process your personal data under the following lawful bases of the NDPA:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Consent:</strong> Where you have given explicit consent (e.g. for location tracking or marketing preferences).</li>
            <li><strong>Contractual Necessity:</strong> For the performance of our contract with you (service delivery, payout processing).</li>
            <li><strong>Legal Obligation:</strong> To comply with applicable financial, safety, or tax laws in Nigeria.</li>
            <li><strong>Legitimate Interest:</strong> To maintain security, detect fraud, and continuously improve platform performance.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>4. Data Sharing and Disclosure</h2>
          <p>
            We do not sell your personal data. We share your data only with other users (to facilitate service bookings), third-party payment processors (e.g., Paystack, Flutterwave), cloud hosting providers, and regulatory authorities where legally required.
          </p>
          <p>
            Any cross-border transfer of personal data shall be executed in strict accordance with the NDPA and GAID requirements, ensuring appropriate safeguards including Standard Contractual Clauses.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>5. Data Subject Rights</h2>
          <p>Under the NDPA, you have the following rights regarding your personal data:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Right to access the personal data we hold about you.</li>
            <li>Right to request correction of inaccurate or incomplete data.</li>
            <li>Right to erasure (&ldquo;Right to be Forgotten&rdquo;), subject to legal and contractual retention requirements.</li>
            <li>Right to withdraw consent at any time.</li>
            <li>Right to lodge a complaint with the Nigeria Data Protection Commission (NDPC).</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>6. Data Retention and Security</h2>
          <p>
            We retain your personal data only for as long as necessary to fulfill the purposes for which it was collected. In accordance with general guidelines, personal data is not stored for more than six (6) months after the purpose of processing has been achieved, unless a longer retention period is required by law.
          </p>
          <p>
            We implement appropriate technical and organizational measures to protect your personal data, including data encryption in transit and at rest, secure authentication, firewalls, and regular compliance audits.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>7. Contact Information</h2>
          <p>
            For any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact our Data Protection Officer:
          </p>
          <div className={`p-4 rounded-xl text-xs sm:text-sm font-semibold border ${
            isDark ? "bg-slate-900 border-slate-800 text-slate-350" : "bg-slate-50 border-slate-200 text-slate-700"
          }`}>
            <p>Surework Data Protection Officer (DPO)</p>
            <p>Email: privacy@surework.ng</p>
            <p>Phone: +234 (0) 800 SUREWORK</p>
            <p>Address: Port Harcourt, Rivers State, Nigeria</p>
          </div>
        </section>

      </div>
    </div>
  );
}
