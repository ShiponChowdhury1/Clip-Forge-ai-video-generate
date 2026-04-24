"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown, MessageCircleQuestionMark, X } from "lucide-react";
import ContactSupportSection from "@/app/components/shared/ContactSupportSection";

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
const FAQ_QUERY = "?skip=0&limit=50";

function normalizeFaqItems(data: unknown): RemoteFaqItem[] {
  const list = Array.isArray(data)
    ? data
    : typeof data === "object" && data !== null && Array.isArray((data as { items?: unknown }).items)
      ? (data as { items: unknown[] }).items
      : [];

  return list.filter(
    (item): item is RemoteFaqItem =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as { Question?: unknown }).Question === "string" &&
      typeof (item as { Answer?: unknown }).Answer === "string"
  );
}

export default function FAQ() {
  const [remoteFaqs, setRemoteFaqs] = useState<RemoteFaqItem[]>([]);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isSupportModalVisible, setIsSupportModalVisible] = useState(false);

  const openSupportModal = () => {
    setIsSupportModalVisible(true);
    window.requestAnimationFrame(() => {
      setIsSupportModalOpen(true);
    });
  };

  const closeSupportModal = () => {
    setIsSupportModalOpen(false);
  };

  useEffect(() => {
    let isMounted = true;

    const fetchFaqs = async () => {
      try {
        const res = await fetch(`${API_ROOT}/v1/admin/faq${FAQ_QUERY}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          if (isMounted) {
            setRemoteFaqs([]);
          }
          return;
        }

        const data = (await res.json()) as unknown;
        const normalized = normalizeFaqItems(data);

        if (isMounted) {
          setRemoteFaqs(normalized);
        }
      } catch {
        if (isMounted) {
          setRemoteFaqs([]);
        }
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
    return remoteFaqs.map((item) => ({
      question: item.Question,
      answer: item.Answer,
    }));
  }, [remoteFaqs]);

  const renderAnswer = (answer: string) => {
    if (typeof answer !== "string") return "";

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
    <section id="faq" className="w-full max-w-330 mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16 md:py-20">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white text-center mb-8 sm:mb-10 md:mb-12">
        Frequently Asked Questions
      </h2>
      <div className="max-w-330 mx-auto space-y-2 sm:space-y-3">
        {displayFaqs.length === 0 && (
          <div className="rounded-xl sm:rounded-[18px] border border-gray-200 dark:border-gray-800/50 bg-gray-50 dark:bg-gray-900/30 px-4 sm:px-6 py-4 sm:py-6">
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">No FAQ available right now.</p>
          </div>
        )}
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
            <summary className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-6 cursor-pointer list-none min-h-15 sm:min-h-20.5 gap-4">
              <span className="text-xs sm:text-sm font-medium">{faq.question}</span>
              <ChevronDown className="w-4 h-4 text-gray-500 group-open:rotate-180 transition-transform duration-300 shrink-0" />
            </summary>
            <div className="px-4 sm:px-6 pb-4 sm:pb-6">
              <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm leading-relaxed">{renderAnswer(faq.answer)}</p>
            </div>
          </details>
        ))}
      </div>

      <div className="fixed right-4 sm:right-6 bottom-6 z-40" id="contact-support">
        <button
          type="button"
          aria-label="Open support form"
          onClick={openSupportModal}
          className="group relative w-12 h-12 rounded-full bg-[#3B82F6] hover:bg-[#2563EB] text-white shadow-lg shadow-blue-500/30 flex items-center justify-center transition-colors animate-support-zoom"
        >
          <span className="pointer-events-none absolute -top-10 right-0 whitespace-nowrap rounded-md bg-[#111827] px-2.5 py-1 text-[11px] font-medium text-white opacity-0 shadow-md transition-all duration-200 group-hover:-translate-y-1 group-hover:opacity-100 group-focus-visible:-translate-y-1 group-focus-visible:opacity-100">
            Contact Support
          </span>
          <MessageCircleQuestionMark className="w-5 h-5" />
        </button>
      </div>

      {isSupportModalVisible && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center px-4 transition-opacity duration-250 ${
            isSupportModalOpen ? "opacity-100" : "opacity-0"
          }`}
          onTransitionEnd={() => {
            if (!isSupportModalOpen) {
              setIsSupportModalVisible(false);
            }
          }}
        >
          <button
            type="button"
            aria-label="Close support form"
            onClick={closeSupportModal}
            className={`absolute inset-0 bg-black/55 backdrop-blur-sm transition-opacity duration-250 ${
              isSupportModalOpen ? "opacity-100" : "opacity-0"
            }`}
          />
          <div
            className={`relative w-full max-w-3xl max-h-[90vh] overflow-y-auto transform transition-all duration-250 ease-out ${
              isSupportModalOpen
                ? "translate-y-0 scale-100 opacity-100"
                : "translate-y-3 scale-[0.98] opacity-0"
            }`}
          >
            <button
              type="button"
              aria-label="Close support form"
              onClick={closeSupportModal}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-gray-900/70 hover:bg-gray-900 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <ContactSupportSection variant="form-only" />
          </div>
        </div>
      )}
    </section>
  );
}
