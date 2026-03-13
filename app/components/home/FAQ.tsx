"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { faqs } from "@/app/data";

interface RemoteFaqItem {
  id: number;
  Question: string;
  Answer: string;
  updated_at: string;
}

interface DisplayFaq {
  question: string;
  answer: string;
}

const API_ROOT = process.env.NEXT_PUBLIC_API_URL || "http://10.10.12.3:8000/api";
const REFUND_PHRASE = "Refund Policy";

export default function FAQ() {
  const [remoteFaqs, setRemoteFaqs] = useState<RemoteFaqItem[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchFaqs = async () => {
      try {
        const res = await fetch(`${API_ROOT}/v1/admin/faq?skip=0&limit=50`, {
          cache: "no-store",
        });

        if (!res.ok) return;
        const data = (await res.json()) as RemoteFaqItem[];

        if (isMounted && Array.isArray(data)) {
          setRemoteFaqs(data);
        }
      } catch {
        // Keep static FAQ fallback when API is unavailable.
      }
    };

    fetchFaqs();
    const intervalId = window.setInterval(fetchFaqs, 30000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const displayFaqs = useMemo<DisplayFaq[]>(() => {
    if (remoteFaqs.length > 0) {
      return remoteFaqs.map((item) => ({
        question: item.Question,
        answer: item.Answer,
      }));
    }
    return faqs;
  }, [remoteFaqs]);

  const renderAnswer = (answer: string) => {
    if (!answer.includes(REFUND_PHRASE)) {
      return answer;
    }

    const [before, after] = answer.split(REFUND_PHRASE);
    return (
      <>
        {before}
        <Link
          href="/refund-policy"
          className="font-semibold text-[#3B82F6] dark:text-cyan-400 underline underline-offset-2 hover:text-[#2563EB] dark:hover:text-cyan-300"
        >
          {REFUND_PHRASE}
        </Link>
        {after}
      </>
    );
  };

  return (
    <section id="faq" className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16 md:py-20">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-10 md:mb-12">
        Frequently Asked Questions
      </h2>
      <div className="max-w-[1320px] mx-auto space-y-2 sm:space-y-3">
        {displayFaqs.map((faq, index) => (
          <details
            key={index}
            className="group border border-gray-200 dark:border-gray-800/50 rounded-xl sm:rounded-[18px] overflow-hidden bg-gray-50 dark:bg-gray-900/30 hover:border-gray-300 dark:hover:border-gray-700/50 transition-all duration-300"
            style={{
              minHeight: "auto",
              padding: "1.24px",
              borderWidth: "1.24px",
            }}
          >
            <summary className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-6 cursor-pointer list-none min-h-[60px] sm:min-h-[82px] gap-4">
              <span className="text-xs sm:text-sm font-medium">{faq.question}</span>
              <ChevronDown className="w-4 h-4 text-gray-500 group-open:rotate-180 transition-transform duration-300 flex-shrink-0" />
            </summary>
            <div className="px-4 sm:px-6 pb-4 sm:pb-6">
              <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm leading-relaxed">{renderAnswer(faq.answer)}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
