"use client";

import { ChevronDown } from "lucide-react";

export default function FAQ() {
  const faqs = [
    {
      question: "What are credits?",
      answer:
        "Credits are our internal currency. 1 credit = 1 video generation. Credits never expire and you can buy more whenever you need them.",
    },
    {
      question: "Is the content really copyright free?",
      answer:
        "Yes, all our AI-generated scenes, music, and voiceovers are 100% copyright-free and royalty-free for commercial use.",
    },
    {
      question: "Can I use my own voice?",
      answer:
        "Yes, you can upload your own voice recordings or use our premium AI voices. You have complete control over the audio.",
    },
    {
      question: "What format are the videos exported in?",
      answer:
        "Videos are exported in MP4 format in 9:16 aspect ratio (1080x1920) resolution, perfect for TikTok, Reels, and Shorts.",
    },
    {
      question: "Do you offer a free trial?",
      answer:
        "Yes, our Starter plan includes 50 free credits so you can test the platform before purchasing more credits.",
    },
  ];

  return (
    <section id="faq" className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16 md:py-20">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-10 md:mb-12">
        Frequently Asked Questions
      </h2>
      <div className="max-w-[1320px] mx-auto space-y-2 sm:space-y-3">
        {faqs.map((faq, index) => (
          <details
            key={index}
            className="group border border-gray-800/50 rounded-xl sm:rounded-[18px] overflow-hidden bg-gray-900/30 hover:border-gray-700/50 transition-all duration-300"
            style={{
              minHeight: "auto",
              padding: "1.24px",
              borderWidth: "1.24px",
            }}
          >
            <summary className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-6 cursor-pointer list-none min-h-[60px] sm:min-h-[82px] gap-4">
              <span className="text-xs sm:text-sm font-medium text-white">{faq.question}</span>
              <ChevronDown className="w-4 h-4 text-gray-500 group-open:rotate-180 transition-transform duration-300 flex-shrink-0" />
            </summary>
            <div className="px-4 sm:px-6 pb-4 sm:pb-6">
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{faq.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
