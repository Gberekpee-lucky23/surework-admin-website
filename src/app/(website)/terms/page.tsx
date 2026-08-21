"use client";

import React from "react";
import { useTheme } from "@/components/website/ThemeProvider";
import { SectionHeading } from "@/components/website/SectionHeading";
import { ShieldCheck, BookOpen } from "lucide-react";

export default function TermsPage() {
  const { isDark } = useTheme();

  return (
    <div className="space-y-12 pb-20 pt-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Header */}
      <SectionHeading
        badge="Legal Agreement"
        title="Terms and"
        titleGradient="Conditions"
        subtitle="Last updated: August 21, 2026. Please read these terms carefully before using our platform."
      />

      {/* Intro alert */}
      <div className={`p-5 rounded-2xl border text-xs sm:text-sm leading-relaxed flex items-start gap-3.5 ${
        isDark ? "bg-blue-950/20 border-blue-500/30 text-blue-300" : "bg-blue-50 border-blue-200 text-blue-800"
      }`}>
        <ShieldCheck className="shrink-0 mt-0.5" size={20} />
        <div>
          <span className="font-bold block mb-1">Nigerian Standards & Regulation Compliance</span>
          This agreement is drafted in compliance with the Federal Competition and Consumer Protection Act, 2018 (FCCPA), the Nigeria Data Protection Act, 2023 (NDPA), and the General Application and Implementation Directive, 2025 (GAID).
        </div>
      </div>

      {/* Content */}
      <div className={`prose max-w-none space-y-8 text-sm leading-relaxed ${isDark ? "text-slate-350" : "text-slate-600"}`}>
        
        <section className="space-y-3">
          <h2 className={`text-xl font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
            <BookOpen size={18} className="text-blue-500" />
            1. Introduction and Acceptance
          </h2>
          <p>
            Welcome to Surework (&ldquo;Platform,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;). Surework is an online platform that connects customers (&ldquo;Service Seekers&rdquo;) with independent handymen and service professionals (&ldquo;Service Providers&rdquo;) across Nigeria.
          </p>
          <p>
            By accessing or using the Surework platform, website, mobile application, or any associated services, you agree to be bound by these Terms and Conditions (&ldquo;Terms&rdquo;). If you do not agree to these Terms, please do not use the Platform.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>2. Definitions</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>&ldquo;Account&rdquo;</strong> means your registered user account on the Surework Platform.</li>
            <li><strong>&ldquo;Customer&rdquo; or &ldquo;Service Seeker&rdquo;</strong> means any individual or entity seeking handyman or service provider services through the Platform.</li>
            <li><strong>&ldquo;Service Provider&rdquo; or &ldquo;Handyman&rdquo;</strong> means any individual or entity offering services through the Platform.</li>
            <li><strong>&ldquo;Platform&rdquo;</strong> means the Surework website, mobile application, and all related services.</li>
            <li><strong>&ldquo;Services&rdquo;</strong> means the handyman and related services offered through the Platform, including but not limited to plumbing, electrical work, carpentry, painting, cleaning, and general maintenance.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>3. Eligibility and Account Registration</h2>
          <p>
            You must be at least 18 years old to create an Account and use the Platform. By creating an Account, you represent and warrant that you are at least 18 years old.
          </p>
          <p>
            To access certain features of the Platform, you must register for an Account. When you register, you agree to provide accurate, current, and complete information, and maintain the security and confidentiality of your password and Account credentials.
          </p>
          <p>
            We may require proof of age, identity, or professional qualifications during registration and verification. Any attempts to misrepresent information will result in immediate Account termination.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>4. Platform Services and Role</h2>
          <p>
            Surework provides a venue for Service Providers and Service Seekers to connect. We do not provide handyman services ourselves and are not a party to any agreements between Users.
          </p>
          <p>
            Service Providers listed on the Platform are independent contractors, not employees or agents of Surework. We facilitate connections but do not employ or control the Service Providers. The relationship between Service Seekers and Service Providers is that of independent contractors.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>5. User Obligations and Conduct</h2>
          <p>
            When using the Platform, you agree to comply with all applicable laws and regulations in Nigeria, provide accurate and truthful information, and use the Platform only for lawful purposes.
          </p>
          <p>
            <strong>Service Providers agree to:</strong> Deliver services by the agreed deadline, perform services with reasonable skill and care, maintain appropriate licenses/permits as required by Nigerian law, and comply with all health and safety regulations.
          </p>
          <p>
            <strong>Service Seekers agree to:</strong> Provide accurate information about the services required, allow Service Providers reasonable access to perform services, pay all agreed fees promptly, and treat Service Providers with respect and professionalism.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>6. Bookings, Payments, and Fees</h2>
          <p>
            All payments are processed securely through third-party payment processors. Prices are subject to change with reasonable notice. All payments must be made in full before service commencement unless otherwise agreed.
          </p>
          <p>
            Surework may charge service fees, commissions, or subscription fees for using the Platform. These fees will be clearly communicated to Users before any charges are incurred.
          </p>
          <p>
            Cancellation policies vary by Service Provider. Service Seekers should review the specific cancellation terms before making a booking. Refund requests must be submitted through the Platform and will be assessed on a case-by-case basis.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>7. Disclaimers and Limitations of Liability</h2>
          <p>
            Your use of the Service is at your sole risk. The Service is provided on an &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; basis. To the fullest extent permitted by law, Surework disclaims all warranties, whether express or implied.
          </p>
          <p>
            Surework is not liable for the actions, content, or services of third-party providers. Your interactions with Service Providers are at your own risk. Our total liability to you shall not exceed the total fees paid by you to Surework in the six (6) months preceding the claim.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>8. Governing Law and Disputes</h2>
          <p>
            Any dispute arising from these Terms shall first be referred to Surework for informal resolution.
          </p>
          <p>
            These Terms shall be governed and construed in accordance with the laws of the Federal Republic of Nigeria. Any legal action or proceeding arising out of these Terms shall be brought exclusively in the competent courts of Nigeria.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>9. Contact Information</h2>
          <p>
            For any questions about these Terms, please contact us at:
          </p>
          <div className={`p-4 rounded-xl text-xs sm:text-sm font-semibold border ${
            isDark ? "bg-slate-900 border-slate-800 text-slate-350" : "bg-slate-50 border-slate-200 text-slate-700"
          }`}>
            <p>Surework Support Team</p>
            <p>Email: support@surework.ng</p>
            <p>Phone: +234 (0) 800 SUREWORK</p>
            <p>Address: Port Harcourt, Rivers State, Nigeria</p>
          </div>
        </section>

      </div>
    </div>
  );
}
