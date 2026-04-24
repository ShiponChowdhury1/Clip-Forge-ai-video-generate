"use client";

import { HelpCircle, ArrowRight, MessageCircleQuestionMark, Loader } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";

interface ContactSupportSectionProps {
  variant?: "dashboard" | "landing" | "form-only";
}

export default function ContactSupportSection({
  variant = "dashboard",
}: ContactSupportSectionProps) {
  const buttonBaseClass =
    "inline-flex items-center justify-center gap-2 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold transition-colors text-sm";

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    topic: "General",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        "https://vision-pulse-backend.onrender.com/api/v1/users/support/contact",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            fullname: formData.fullName,
            email: formData.email,
            subject: formData.subject,
            topic: formData.topic,
            message: formData.message,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast.success("Message sent successfully! We'll get back to you soon.");
      
      // Reset form
      setFormData({
        fullName: "",
        email: "",
        subject: "",
        topic: "General",
        message: "",
      });
    } catch (error) {
      console.error("Error sending support message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isLanding = variant === "landing";
  const isFormOnly = variant === "form-only";

  const renderForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="bg-gray-50 dark:bg-[#0B0E12] border border-gray-300 dark:border-[#1A3155] rounded-xl p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-900 dark:text-white text-sm font-semibold mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Jane Doe"
              className="w-full bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-lg px-4 py-3 text-gray-900 dark:text-white text-sm placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-[#3B82F6] focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-gray-900 dark:text-white text-sm mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="jane@example.com"
              className="w-full bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-lg px-4 py-3 text-gray-900 dark:text-white text-sm placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-[#3B82F6] focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-900 dark:text-white text-sm font-semibold mb-2">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Issue with credits"
              className="w-full bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-lg px-4 py-3 text-gray-900 dark:text-white text-sm placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-[#3B82F6] focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-gray-900 dark:text-white text-sm font-semibold mb-2">
              Topic
            </label>
            <select
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              className="w-full bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-lg px-4 py-3 text-gray-900 dark:text-white text-sm focus:border-[#3B82F6] focus:outline-none transition-colors appearance-none cursor-pointer"
            >
              <option value="General">General</option>
              <option value="Billing">Billing</option>
              <option value="Technical">Technical</option>
              <option value="Feature Request">Feature Request</option>
              <option value="Bug Report">Bug Report</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-gray-600 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
            Message
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell us how we can help..."
            rows={5}
            className="w-full bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-lg px-4 py-3 text-gray-900 dark:text-white text-sm placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-[#3B82F6] focus:outline-none transition-colors resize-none"
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className={`w-full ${buttonBaseClass} py-3.5 ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          {isLoading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <MessageCircleQuestionMark className="w-4 h-4" />
              Send Message
            </>
          )}
        </button>
      </div>
    </form>
  );

  if (isFormOnly) {
    return <div className="w-full">{renderForm()}</div>;
  }

  return (
    <div
      className={`bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-2xl ${
        isLanding ? "p-6 sm:p-8" : "p-8 lg:p-10"
      }`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Contact Support
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed mb-8">
            Have a question about billing or technical issues? Our team is here
            to help you get the most out of Clipforge.
          </p>

          <div className="bg-gray-50 dark:bg-[#0B0E12] border border-gray-300 dark:border-[#1A3155] rounded-xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#2563EB]/20 flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-[#3B82F6]" />
              </div>
              <h3 className="text-gray-900 dark:text-white font-semibold text-base">
                Check our FAQ first
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
              We might have already answered your question. Our FAQ covers most
              common inquiries.
            </p>
            <Link href="/#faq" className={`${buttonBaseClass} px-4 py-2.5`}>
              Visit Help Center
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Response time: less than 2 hours
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Available 24/7 for Pro users
              </p>
            </div>
          </div>
        </div>

        {renderForm()}
      </div>
    </div>
  );
}
