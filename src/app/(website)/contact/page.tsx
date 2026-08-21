"use client";

import React, { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useTheme } from "@/components/website/ThemeProvider";
import { SectionHeading } from "@/components/website/SectionHeading";
import { ALL_CATEGORIES } from "@/constants/websiteCategories";

export default function ContactPage() {
  const { isDark } = useTheme();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus({ type: "success", message: data.message });
        setFormData({
          name: "",
          email: "",
          phone: "",
          category: "",
          subject: "",
          message: "",
        });
      } else {
        setStatus({ type: "error", message: data.error || "Failed to send message. Please try again." });
      }
    } catch (err) {
      setStatus({ type: "error", message: "Network error occurred. Please check your connection and try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-16 lg:space-y-24 pb-20 pt-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      <SectionHeading
        badge="Get in Touch"
        title="Contact Port Harcourt"
        titleGradient="Handyman Services"
        subtitle="Have a question, need a custom corporate quote, or want to speak with our dispatch team? Fill out the form or reach out directly."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Contact Form */}
        <div className={`lg:col-span-7 p-6 sm:p-8 rounded-3xl border transition-all ${
          isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200 shadow-lg shadow-slate-200/50"
        }`}>
          <h3 className="text-xl font-bold mb-6">Send Us a Direct Message</h3>

          {status && (
            <div className={`p-4 rounded-2xl mb-6 border flex items-start gap-3 text-xs sm:text-sm ${
              status.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                : "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400"
            }`}>
              {status.type === "success" ? (
                <CheckCircle2 size={20} className="shrink-0 text-emerald-500" />
              ) : (
                <AlertCircle size={20} className="shrink-0 text-red-500" />
              )}
              <div>
                <p className="font-bold">{status.type === "success" ? "Message Sent!" : "Submission Error"}</p>
                <p className="mt-0.5">{status.message}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold block mb-1.5">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chinedu Okafor"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full p-3 rounded-xl border text-xs sm:text-sm focus:outline-none transition-colors ${
                    isDark 
                      ? "bg-slate-950 border-slate-800 focus:border-blue-500 text-white" 
                      : "bg-slate-50 border-slate-200 focus:border-blue-600 text-slate-900"
                  }`}
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1.5">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full p-3 rounded-xl border text-xs sm:text-sm focus:outline-none transition-colors ${
                    isDark 
                      ? "bg-slate-950 border-slate-800 focus:border-blue-500 text-white" 
                      : "bg-slate-50 border-slate-200 focus:border-blue-600 text-slate-900"
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold block mb-1.5">Phone Number (Optional)</label>
                <input
                  type="tel"
                  placeholder="+234 800 000 0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full p-3 rounded-xl border text-xs sm:text-sm focus:outline-none transition-colors ${
                    isDark 
                      ? "bg-slate-950 border-slate-800 focus:border-blue-500 text-white" 
                      : "bg-slate-50 border-slate-200 focus:border-blue-600 text-slate-900"
                  }`}
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1.5">Service Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className={`w-full p-3 rounded-xl border text-xs sm:text-sm focus:outline-none transition-colors ${
                    isDark 
                      ? "bg-slate-950 border-slate-800 focus:border-blue-500 text-white" 
                      : "bg-slate-50 border-slate-200 focus:border-blue-600 text-slate-900"
                  }`}
                >
                  <option value="">-- Select a Category --</option>
                  {ALL_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                  <option value="Corporate / Facility Maintenance">Corporate / Facility Maintenance</option>
                  <option value="General Inquiry">General Inquiry</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1.5">Subject</label>
              <input
                type="text"
                placeholder="e.g. Plumbing Quote for Office Building"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className={`w-full p-3 rounded-xl border text-xs sm:text-sm focus:outline-none transition-colors ${
                  isDark 
                    ? "bg-slate-950 border-slate-800 focus:border-blue-500 text-white" 
                    : "bg-slate-50 border-slate-200 focus:border-blue-600 text-slate-900"
                }`}
              />
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1.5">Message *</label>
              <textarea
                required
                rows={4}
                placeholder="Describe your maintenance request or inquiry in detail..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className={`w-full p-3 rounded-xl border text-xs sm:text-sm focus:outline-none transition-colors resize-none ${
                  isDark 
                    ? "bg-slate-950 border-slate-800 focus:border-blue-500 text-white" 
                    : "bg-slate-50 border-slate-200 focus:border-blue-600 text-slate-900"
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-600/20"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Sending Message...</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Contact Info & Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className={`p-6 sm:p-8 rounded-3xl border space-y-6 ${
            isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200 shadow-md"
          }`}>
            <h3 className="text-xl font-bold">Port Harcourt Office</h3>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider">Phone Support</h4>
                  <p className="font-bold mt-0.5">+234 (0) 800 SUREWORK</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider">Email Inquiry</h4>
                  <p className="font-bold mt-0.5">support@surework.ng</p>
                  <p className={`text-[11px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    Response guaranteed within 24 hours
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider">Service Address</h4>
                  <p className="font-bold mt-0.5">GRA Phase 2 / Trans Amadi, Port Harcourt, Rivers State</p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2 border-t border-slate-200/50 dark:border-slate-800">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0">
                  <Clock size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider">Business Hours</h4>
                  <p className="font-bold mt-0.5">Mon – Sat: 7:00 AM – 7:00 PM</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                    Emergency Repairs: 24/7 via Surework App
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Embedded Google Map */}
          <div className={`p-3 rounded-3xl border overflow-hidden shadow-md ${
            isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
          }`}>
            <div className="h-64 rounded-2xl overflow-hidden relative">
              <iframe
                title="Port Harcourt Handyman Services Map Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63604.56826620583!2d6.97405235!3d4.81561575!2m3!1f0!2f0!3f0!2m3!1i1024!2i768!4f13.1!3m3!1m2!1s0x1069cea3c3bfcfb7%3A0x6b8764a856230f3a!2sPort%20Harcourt%2C%20Rivers!5e0!3m2!1sen!2sng!4v1700000000000!5m2!1sen!2sng"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full filter saturate-150 contrast-105"
              />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
