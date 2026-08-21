"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Wrench,
  Mail,
  Phone,
  MapPin,
  Clock,
  ChevronRight,
  Shield,
  FileText,
  Scale,
  Lock,
  Heart,
  ArrowUp,
  Globe,
  Info,
  HelpCircle,
} from "lucide-react";

interface FooterProps {
  isDark?: boolean;
}

// Modal component for terms and conditions
const TermsModal = ({ isOpen, onClose, title, children }: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1 text-sm text-slate-600 leading-relaxed space-y-4">
          {children}
        </div>
        <div className="p-6 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export function Footer({ isDark = false }: FooterProps) {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <footer className={`py-6 sm:py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 border-t ${
        isDark 
          ? "bg-linear-to-b from-slate-950 to-slate-900 border-slate-800" 
          : "bg-linear-to-b from-slate-50 to-white border-slate-200"
      }`}>
        <div className="max-w-7xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            
            {/* Brand Column */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Wrench size={18} className="text-white" />
                </div>
                <span className={`font-bold text-lg ${isDark ? "text-white" : "text-slate-900"}`}>
                  Surework
                </span>
              </div>
              <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Owned and operated by <strong className={isDark ? "text-slate-300" : "text-slate-700"}>
                  Port Harcourt Handyman Services
                </strong>
              </p>
              <p className={`text-sm max-w-sm leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Providing trusted, vetted, and professional handyman services across Port Harcourt, Rivers State.
              </p>
              
              {/* Social Icons */}
              {/* <div className="flex items-center gap-3 pt-2">
                <a
                  href="#"
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    isDark 
                      ? "bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white" 
                      : "bg-slate-100 hover:bg-blue-600 text-slate-600 hover:text-white"
                  }`}
                  aria-label="Facebook"
                >
                  <Facebook size={16} />
                </a>
                <a
                  href="#"
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    isDark 
                      ? "bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white" 
                      : "bg-slate-100 hover:bg-blue-600 text-slate-600 hover:text-white"
                  }`}
                  aria-label="Twitter"
                >
                  <Twitter size={16} />
                </a>
                <a
                  href="#"
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    isDark 
                      ? "bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white" 
                      : "bg-slate-100 hover:bg-blue-600 text-slate-600 hover:text-white"
                  }`}
                  aria-label="Instagram"
                >
                  <Instagram size={16} />
                </a>
                <a
                  href="#"
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    isDark 
                      ? "bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white" 
                      : "bg-slate-100 hover:bg-blue-600 text-slate-600 hover:text-white"
                  }`}
                  aria-label="LinkedIn"
                >
                  <Linkedin size={16} />
                </a>
              </div> */}
            </div>

            {/* Quick Links Column */}
            <div className="space-y-4">
              <h3 className={`text-sm font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                Quick Links
              </h3>
              <ul className="space-y-2.5">
                {[
                  { label: "Features", href: "#features" },
                  { label: "Services", href: "#categories" },
                  { label: "App Preview", href: "#previews" },
                  { label: "Admin Portal", href: "/admin" },
                ].map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className={`text-sm flex items-center gap-1.5 transition-colors ${
                        isDark 
                          ? "text-slate-400 hover:text-white" 
                          : "text-slate-600 hover:text-blue-600"
                      }`}
                    >
                      <ChevronRight size={14} className="opacity-50" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info Column */}
            <div className="space-y-4">
              <h3 className={`text-sm font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                Contact Us
              </h3>
              <ul className="space-y-2.5">
                <li className={`text-sm flex items-start gap-2.5 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  <Phone size={16} className="shrink-0 mt-0.5" />
                  <span>+234 800 000 0000</span>
                </li>
                <li className={`text-sm flex items-start gap-2.5 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  <Mail size={16} className="shrink-0 mt-0.5" />
                  <span>info@surework.com</span>
                </li>
                <li className={`text-sm flex items-start gap-2.5 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  <MapPin size={16} className="shrink-0 mt-0.5" />
                  <span>Port Harcourt, Rivers State, Nigeria</span>
                </li>
                <li className={`text-sm flex items-start gap-2.5 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  <Clock size={16} className="shrink-0 mt-0.5" />
                  <span>Mon - Sat: 8:00 AM - 6:00 PM</span>
                </li>
              </ul>
            </div>

            {/* Legal Column */}
            <div className="space-y-4">
              <h3 className={`text-sm font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                Legal
              </h3>
              <ul className="space-y-2.5">
                <li>
                  <button
                    onClick={() => setActiveModal("terms")}
                    className={`text-sm flex items-center gap-1.5 transition-colors ${
                      isDark 
                        ? "text-slate-400 hover:text-white" 
                        : "text-slate-600 hover:text-blue-600"
                    }`}
                  >
                    <FileText size={14} />
                    Terms & Conditions
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal("privacy")}
                    className={`text-sm flex items-center gap-1.5 transition-colors ${
                      isDark 
                        ? "text-slate-400 hover:text-white" 
                        : "text-slate-600 hover:text-blue-600"
                    }`}
                  >
                    <Shield size={14} />
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal("cookies")}
                    className={`text-sm flex items-center gap-1.5 transition-colors ${
                      isDark 
                        ? "text-slate-400 hover:text-white" 
                        : "text-slate-600 hover:text-blue-600"
                    }`}
                  >
                    <Lock size={14} />
                    Cookie Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal("disclaimer")}
                    className={`text-sm flex items-center gap-1.5 transition-colors ${
                      isDark 
                        ? "text-slate-400 hover:text-white" 
                        : "text-slate-600 hover:text-blue-600"
                    }`}
                  >
                    <Info size={14} />
                    Disclaimer
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className={`mt-12 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4 ${
            isDark ? "border-slate-800" : "border-slate-200"
          }`}>
            <div className="flex items-center gap-2 text-xs">
              <span className={isDark ? "text-slate-500" : "text-slate-500"}>
                &copy; {currentYear} Port Harcourt Handyman Services.
              </span>
              <span className={isDark ? "text-slate-600" : "text-slate-300"}>|</span>
              <span className={isDark ? "text-slate-500" : "text-slate-500"}>
                All rights reserved.
              </span>
             
            </div>

            {/* <button
              onClick={scrollToTop}
              className={`p-2.5 rounded-xl transition-all duration-200 flex items-center gap-2 text-sm ${
                isDark 
                  ? "bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white" 
                  : "bg-slate-100 hover:bg-blue-600 text-slate-600 hover:text-white"
              }`}
            >
              <ArrowUp size={14} />
              <span className="hidden sm:inline">Back to Top</span>
            </button> */}
          </div>
        </div>
      </footer>

      {/* Terms & Conditions Modal */}
      <TermsModal
        isOpen={activeModal === "terms"}
        onClose={() => setActiveModal(null)}
        title="Terms & Conditions"
      >
        <div className="space-y-4">
          <section>
            <h4 className="font-semibold text-slate-900">1. Acceptance of Terms</h4>
            <p>By using Surework services, you agree to be bound by these Terms & Conditions. If you do not agree to these terms, please do not use our services.</p>
          </section>

          <section>
            <h4 className="font-semibold text-slate-900">2. Service Description</h4>
            <p>Surework provides a platform connecting customers with verified handyman professionals. We facilitate service bookings but are not directly responsible for the quality of work performed by service providers.</p>
          </section>

          <section>
            <h4 className="font-semibold text-slate-900">3. User Accounts</h4>
            <p>Users must create an account to access full features. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>
          </section>

          <section>
            <h4 className="font-semibold text-slate-900">4. Payment Terms</h4>
            <p>Payments are processed securely through our platform. Service fees are displayed upfront, and additional charges may apply for specialized services. Refunds are subject to our refund policy.</p>
          </section>

          <section>
            <h4 className="font-semibold text-slate-900">5. Cancellation Policy</h4>
            <p>Customers may cancel bookings within 24 hours of scheduling for a full refund. Cancellations within 24 hours of service time may incur a cancellation fee.</p>
          </section>

          <section>
            <h4 className="font-semibold text-slate-900">6. Liability</h4>
            <p>Surework is a platform connecting users with professionals. We do not guarantee the quality of work performed. Users assume all risks associated with services provided.</p>
          </section>

          <section>
            <h4 className="font-semibold text-slate-900">7. Changes to Terms</h4>
            <p>We reserve the right to modify these terms at any time. Users will be notified of significant changes via email or platform notification.</p>
          </section>

          <section>
            <h4 className="font-semibold text-slate-900">8. Governing Law</h4>
            <p>These terms are governed by the laws of Nigeria. Any disputes shall be resolved in the courts of Port Harcourt, Rivers State.</p>
          </section>
        </div>
      </TermsModal>

      {/* Privacy Policy Modal */}
      <TermsModal
        isOpen={activeModal === "privacy"}
        onClose={() => setActiveModal(null)}
        title="Privacy Policy"
      >
        <div className="space-y-4">
          <section>
            <h4 className="font-semibold text-slate-900">1. Information We Collect</h4>
            <p>We collect information you provide directly, including name, email address, phone number, and service preferences. We also collect usage data to improve our services.</p>
          </section>

          <section>
            <h4 className="font-semibold text-slate-900">2. How We Use Information</h4>
            <p>Your information is used to: provide services, process payments, communicate with you, improve our platform, and send relevant marketing communications (with your consent).</p>
          </section>

          <section>
            <h4 className="font-semibold text-slate-900">3. Data Security</h4>
            <p>We implement industry-standard security measures to protect your data. However, no method of transmission over the internet is 100% secure.</p>
          </section>

          <section>
            <h4 className="font-semibold text-slate-900">4. Third-Party Sharing</h4>
            <p>We do not sell your personal information. We may share data with trusted service providers who assist in our operations, subject to confidentiality agreements.</p>
          </section>

          <section>
            <h4 className="font-semibold text-slate-900">5. Your Rights</h4>
            <p>You have the right to: access your data, request corrections, request deletion, opt-out of marketing communications, and data portability.</p>
          </section>

          <section>
            <h4 className="font-semibold text-slate-900">6. Cookies</h4>
            <p>We use cookies to enhance your experience. You can control cookie preferences in your browser settings.</p>
          </section>

          <section>
            <h4 className="font-semibold text-slate-900">7. Updates to Policy</h4>
            <p>This policy may be updated periodically. We'll notify you of significant changes via email or platform notification.</p>
          </section>

          <section>
            <h4 className="font-semibold text-slate-900">8. Contact Us</h4>
            <p>For privacy concerns, email us at: privacy@surework.com</p>
          </section>
        </div>
      </TermsModal>

      {/* Cookie Policy Modal */}
      <TermsModal
        isOpen={activeModal === "cookies"}
        onClose={() => setActiveModal(null)}
        title="Cookie Policy"
      >
        <div className="space-y-4">
          <section>
            <h4 className="font-semibold text-slate-900">1. What Are Cookies</h4>
            <p>Cookies are small text files stored on your device that help us improve your experience on Surework.</p>
          </section>

          <section>
            <h4 className="font-semibold text-slate-900">2. Types of Cookies We Use</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Essential:</strong> Required for basic site functionality</li>
              <li><strong>Performance:</strong> Help us understand how users interact with our site</li>
              <li><strong>Functional:</strong> Remember your preferences and settings</li>
              <li><strong>Marketing:</strong> Used to deliver relevant advertisements</li>
            </ul>
          </section>

          <section>
            <h4 className="font-semibold text-slate-900">3. Managing Cookies</h4>
            <p>You can manage cookie preferences in your browser settings. Disabling cookies may affect some site features.</p>
          </section>

          <section>
            <h4 className="font-semibold text-slate-900">4. Third-Party Cookies</h4>
            <p>Some cookies are set by third-party services we use, such as analytics providers and payment processors.</p>
          </section>

          <section>
            <h4 className="font-semibold text-slate-900">5. Consent</h4>
            <p>By continuing to use our site, you consent to our use of cookies as described in this policy.</p>
          </section>
        </div>
      </TermsModal>

      {/* Disclaimer Modal */}
      <TermsModal
        isOpen={activeModal === "disclaimer"}
        onClose={() => setActiveModal(null)}
        title="Disclaimer"
      >
        <div className="space-y-4">
          <section>
            <h4 className="font-semibold text-slate-900">1. General Disclaimer</h4>
            <p>The information provided on Surework is for general informational purposes only. We make no representations or warranties of any kind about the accuracy or completeness of this information.</p>
          </section>

          <section>
            <h4 className="font-semibold text-slate-900">2. Professional Advice</h4>
            <p>Content on this platform is not intended as professional advice. Always consult qualified professionals for specific service needs.</p>
          </section>

          <section>
            <h4 className="font-semibold text-slate-900">3. Service Provider Disclaimer</h4>
            <p>Surework facilitates connections but does not employ service providers. We are not liable for the quality of work or any damages resulting from services performed.</p>
          </section>

          <section>
            <h4 className="font-semibold text-slate-900">4. External Links</h4>
            <p>Our site may contain links to external websites. We are not responsible for the content or practices of these external sites.</p>
          </section>

          <section>
            <h4 className="font-semibold text-slate-900">5. Limitation of Liability</h4>
            <p>To the fullest extent permitted by law, Surework shall not be liable for any indirect, incidental, or consequential damages arising from your use of our services.</p>
          </section>

          <section>
            <h4 className="font-semibold text-slate-900">6. Changes to Information</h4>
            <p>We reserve the right to update or modify any information on this site without prior notice.</p>
          </section>
        </div>
      </TermsModal>
    </>
  );
}