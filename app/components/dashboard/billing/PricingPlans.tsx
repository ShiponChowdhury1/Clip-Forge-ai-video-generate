"use client";

import PricingCards from "@/app/components/shared/PricingCards";

interface PricingPlansProps {
  onSelectPlan: (planName: string) => void;
  onClose: () => void;
}

export default function PricingPlans({
  onSelectPlan,
  onClose,
}: PricingPlansProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-5xl mx-4 bg-white dark:bg-[#0A0E14] border border-gray-300 dark:border-[#1A3155] rounded-2xl p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-xl transition-colors"
        >
          ✕
        </button>

        <PricingCards variant="compact" onSelectPlan={onSelectPlan} />
      </div>
    </div>
  );
}
