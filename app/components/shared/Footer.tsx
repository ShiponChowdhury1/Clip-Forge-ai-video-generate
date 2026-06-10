"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Twitter, Github, Linkedin, Instagram } from "lucide-react";
import { toast } from "react-toastify";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pathname = usePathname();

  const handleOpenSupportModal = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-contact-support-modal"));
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    toast.success("Successfully joined the newsletter!");
    setEmail("");
    setIsSubmitting(false);
  };

  // Render a clean, compact, non-cluttered footer if inside the dashboard
  const isDashboard = pathname?.startsWith("/dashboard");
  if (isDashboard) {
    return (
      <footer className="w-full mt-12 border-t border-gray-200 dark:border-[#1F1F1F] py-6 bg-transparent">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500 dark:text-[#6666a0]">
          <p>© 2026 Clipforge AI. All rights reserved.</p>
          <div className="flex gap-5 flex-wrap justify-center font-medium">
            <Link href="/privacy-policy" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/refund-policy" className="hover:text-gray-900 dark:hover:text-white transition-colors">Refund &amp; Cancellation</Link>
            <Link href="/dashboard/support" className="hover:text-gray-900 dark:hover:text-white transition-colors">Contact Support</Link>
          </div>
        </div>
      </footer>
    );
  }


  return (
    <footer className="w-full bg-gray-50 dark:bg-[#0d0d0d] mt-12 sm:mt-16 md:mt-20">
      {/* Main Footer Content */}
      <div className="px-4 sm:px-6 md:px-12 lg:px-24 py-10 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12 lg:gap-16">
          {/* Logo & Description */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1 max-w-sm">
            <Link href="/" className="flex items-center gap-2 mb-4 sm:mb-5">
              <Image
                src="/logo.png"
                alt="Clipforge Logo"
                width={48}
                height={48}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg"
              />
              <span className="text-lg sm:text-xl font-semibold">Clipforge</span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm leading-relaxed mb-6 sm:mb-8">
              The world&lsquo;s most powerful AI video generation platform. Create faceless reels, cinematic shorts, and viral content in seconds with credit-based pricing that scales with you.
            </p>
            <div className="flex gap-2 sm:gap-3">
              <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-100 dark:bg-[#1a1a1a] rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-[#2E6AF5] hover:border-[#2E6AF5] dark:hover:bg-[#2E6AF5] dark:hover:border-[#2E6AF5] transition border border-gray-200 dark:border-gray-800">
                <Twitter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>
              <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-100 dark:bg-[#1a1a1a] rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-[#2E6AF5] hover:border-[#2E6AF5] dark:hover:bg-[#2E6AF5] dark:hover:border-[#2E6AF5] transition border border-gray-200 dark:border-gray-800">
                <Github className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>
              <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-100 dark:bg-[#1a1a1a] rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-[#2E6AF5] hover:border-[#2E6AF5] dark:hover:bg-[#2E6AF5] dark:hover:border-[#2E6AF5] transition border border-gray-200 dark:border-gray-800">
                <Linkedin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>
              <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-100 dark:bg-[#1a1a1a] rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-[#2E6AF5] hover:border-[#2E6AF5] dark:hover:bg-[#2E6AF5] dark:hover:border-[#2E6AF5] transition border border-gray-200 dark:border-gray-800">
                <Instagram className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>
            </div>
          </div>
          
          {/* Product */}
          <div>
            <h4 className="font-semibold text-xs sm:text-sm mb-4 sm:mb-6 tracking-wider">PRODUCT</h4>
            <ul className="space-y-3 sm:space-y-4">
              <li><a href="#features" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition text-xs sm:text-sm">Features</a></li>
              <li><a href="#how-it-works" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition text-xs sm:text-sm">How It Works</a></li>
              <li><a href="#pricing" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition text-xs sm:text-sm">Pricing</a></li>
              <li><a href="#faq" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition text-xs sm:text-sm">FAQ</a></li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h4 className="font-semibold text-xs sm:text-sm mb-4 sm:mb-6 tracking-wider">LEGAL</h4>
            <ul className="space-y-3 sm:space-y-4">
              <li>
                <a
                  href="#contact-support"
                  onClick={handleOpenSupportModal}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition text-xs sm:text-sm"
                >
                  Contact
                </a>
              </li>
              <li><Link href="/privacy-policy" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition text-xs sm:text-sm">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition text-xs sm:text-sm">Terms of Service</Link></li>
              <li><Link href="/refund-policy" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition text-xs sm:text-sm">Refund Policy</Link></li>
            </ul>
          </div>
          
          {/* Stay Updated */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <h4 className="font-semibold text-xs sm:text-sm mb-4 sm:mb-6 tracking-wider">STAY UPDATED</h4>
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-4 sm:mb-5 leading-relaxed">Subscribe to our newsletter for the latest AI video tips and updates.</p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 bg-transparent border border-gray-300 dark:border-gray-700 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-[#2E6AF5]/50 transition"
              />
              <button 
                type="submit"
                disabled={isSubmitting}
                className="bg-[#2E6AF5] hover:bg-[#3A49F6] disabled:opacity-50 text-white font-semibold px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl transition text-xs sm:text-sm whitespace-nowrap active:scale-95 duration-150"
              >
                {isSubmitting ? "Joining..." : "Join"}
              </button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-gray-200 dark:border-gray-800/50 mx-4 sm:mx-6 md:mx-12 lg:mx-24"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-24 py-4 sm:py-6 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
        <p className="text-gray-500 dark:text-gray-600 text-[10px] sm:text-xs text-center sm:text-left">
          © 2026 Clipforge AI. All rights reserved.
        </p>
        <div className="flex gap-4 sm:gap-6 md:gap-8 text-gray-500 text-[10px] sm:text-xs">
          <a href="#" className="hover:text-gray-900 dark:hover:text-white transition">Twitter</a>
          <a href="#" className="hover:text-gray-900 dark:hover:text-white transition">Discord</a>
          <a href="#" className="hover:text-gray-900 dark:hover:text-white transition">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
}
