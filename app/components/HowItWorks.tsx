"use client";

import { FileText, Settings, Share2 } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      step: 1,
      title: "Paste your script",
      desc: "Simply paste your content or let our AI generate a script for you from a prompt.",
      icon: FileText,
    },
    {
      step: 2,
      title: "Customize settings",
      desc: "Choose your voice, visual style, and background music to match your brand's vibe.",
      icon: Settings,
    },
    {
      step: 3,
      title: "Export and share",
      desc: "Download your video in 9:16 format and upload directly to your favorite platforms.",
      icon: Share2,
    },
  ];

  return (
    <section id="how-it-works" className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16 md:py-20">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 md:mb-16">
        How It Works
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 md:gap-12">
        {steps.map((item) => (
          <div key={item.step} className="text-center sm:last:col-span-2 lg:last:col-span-1 sm:last:max-w-sm sm:last:mx-auto lg:last:max-w-none">
            <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 bg-cyan-500/10 border border-cyan-500/20 rounded-xl sm:rounded-2xl flex items-center justify-center">
              <item.icon className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-500" />
            </div>
            <h3 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3 text-white">
              {item.step}. {item.title}
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-xs mx-auto">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
