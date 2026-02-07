"use client";

import { Send, HelpCircle, ArrowRight, Clock, Shield } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function ContactSupportPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    topic: "General",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="bg-[#0D1117] border border-[#1A3155] rounded-2xl p-8 lg:p-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Side - Info */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-3">
            Contact Support
          </h1>
          <p className="text-gray-400 text-base leading-relaxed mb-8">
            Have a question about billing or technical issues? Our team of AI
            experts is here to help you get the most out of VisionAI.
          </p>

          {/* FAQ Card */}
          <div className="bg-[#0B0E12] border border-[#1A3155] rounded-xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#2563EB]/20 flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-[#3B82F6]" />
              </div>
              <h3 className="text-white font-semibold text-base">
                Check our FAQ first
              </h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              We might have already answered your question. Our FAQ covers 90%
              of all common inquiries.
            </p>
            <Link
              href="/#faq"
              className="inline-flex items-center gap-2 text-[#3B82F6] hover:text-[#60A5FA] text-sm font-medium transition-colors"
            >
              Visit Help Center
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Info Points */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
              <p className="text-gray-400 text-sm">
                Response time: &lt; 2 hours
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
              <p className="text-gray-400 text-sm">
                Available 24/7 for Pro users
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <form onSubmit={handleSubmit}>
          <div className="bg-[#0B0E12] border border-[#1A3155] rounded-xl p-6 space-y-6">
            {/* Full Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-white text-sm font-semibold mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Jane Doe"
                  className="w-full bg-[#0D1117] border border-[#1A3155] rounded-lg px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:border-[#3B82F6] focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-white text-sm font-semibold mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="jane@example.com"
                  className="w-full bg-[#0D1117] border border-[#1A3155] rounded-lg px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:border-[#3B82F6] focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Subject & Topic */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-white text-sm font-semibold mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Issue with credits"
                  className="w-full bg-[#0D1117] border border-[#1A3155] rounded-lg px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:border-[#3B82F6] focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-white text-sm font-semibold mb-2">
                  Topic
                </label>
                <select
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                  className="w-full bg-[#0D1117] border border-[#1A3155] rounded-lg px-4 py-3 text-white text-sm focus:border-[#3B82F6] focus:outline-none transition-colors appearance-none cursor-pointer"
                >
                  <option value="General">General</option>
                  <option value="Billing">Billing</option>
                  <option value="Technical">Technical</option>
                  <option value="Feature Request">Feature Request</option>
                  <option value="Bug Report">Bug Report</option>
                </select>
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us how we can help..."
                rows={5}
                className="w-full bg-[#0D1117] border border-[#1A3155] rounded-lg px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:border-[#3B82F6] focus:outline-none transition-colors resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm"
            >
              <Send className="w-4 h-4" />
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
