"use client";

import { Check, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState } from "react";
import type {
  CreditPackage,
  SubscriptionPlan,
} from "@/lib/redux/features/admin/adminApi";

interface PricingPlansProps {
  modalType: "change" | "buy";
  plans: SubscriptionPlan[];
  creditPackages: CreditPackage[];
  isPlansLoading: boolean;
  isCreditPackagesLoading: boolean;
  onSelectPlan: (id: number, kind: "plan" | "package") => void;
  onClose: () => void;
}

export default function PricingPlans({
  modalType,
  plans,
  creditPackages,
  isPlansLoading,
  isCreditPackagesLoading,
  onSelectPlan,
  onClose,
}: PricingPlansProps) {
  const [currentPage, setCurrentPage] = useState(0);
  
  const heading = modalType === "change" ? "Change Plan" : "Buy Credits";
  const subtitle =
    modalType === "change"
      ? "Select change plan that fits your"
      : "Choose a credit pack for instant top-up.";
  const buttonText = modalType === "change" ? "Select Plan" : "Buy Credits";
  const isLoading = modalType === "change" ? isPlansLoading : isCreditPackagesLoading;
  const orderedPlans = [...plans].sort((a, b) => a.monthly_price - b.monthly_price);
  
  // Carousel logic for subscription plans
  const cardsPerPage = 3;
  const totalPages = Math.max(1, Math.ceil(orderedPlans.length / cardsPerPage));
  const safePageIndex = currentPage % totalPages;
  const visiblePlans = orderedPlans.slice(safePageIndex * cardsPerPage, (safePageIndex + 1) * cardsPerPage);
  
  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };
  
  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };
  
  // Group credit packages by plan_type: monthly first, then one_time
  const monthlyPackages = [...creditPackages]
    .filter(pkg => pkg.plan_type === "monthly")
    .sort((a, b) => a.price - b.price);
  const oneTimePackages = [...creditPackages]
    .filter(pkg => pkg.plan_type === "one_time")
    .sort((a, b) => a.price - b.price);

  const getGridClass = (count: number) => {
    if (count >= 4) return "grid grid-cols-1 md:grid-cols-4 gap-6";
    if (count === 3) return "grid grid-cols-1 md:grid-cols-3 gap-6";
    if (count === 2) return "grid grid-cols-1 md:grid-cols-2 gap-6";
    return "grid grid-cols-1 gap-6";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-6xl bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-2xl p-8 max-h-[92vh] overflow-y-auto scrollbar-hide"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        } as React.CSSProperties & { scrollbarWidth?: string; msOverflowStyle?: string }}>
        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-xl transition-colors"
        >
          ✕
        </button>

        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-2 text-gray-900 dark:text-white">
          {heading}
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 text-sm mb-10">
          {subtitle}
        </p>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-12 h-12 border-4 border-gray-300 dark:border-[#1A3155] border-t-cyan-500 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Loading plans...</p>
          </div>
        ) : modalType === "change" && plans.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm py-16">
            No active plans available. Ask admin to activate a subscription plan.
          </p>
        ) : modalType === "buy" && creditPackages.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm py-16">
            No credit packages available. Ask admin to add credit packages.
          </p>
        ) : (
          <div className="space-y-12">
            {/* Subscription Plans Section - with carousel */}
            {modalType === "change" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch">
                  {visiblePlans.map((plan, idx) => (
                    <div
                      key={plan.id}
                      className={`relative transition-all duration-300 flex flex-col h-full bg-linear-to-b border rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-cyan-500/10 ${
                        idx === 1
                          ? "from-gray-100 dark:from-gray-800/80 to-white dark:to-gray-900/80 border-cyan-500/50 shadow-lg shadow-cyan-500/5 ring-1 ring-cyan-500/20 md:ring-2"
                          : "from-gray-50 dark:from-gray-900/50 to-white dark:to-black border-gray-200 dark:border-gray-800/50"
                      }`}
                      style={{
                        padding: "28px",
                        minHeight: "580px",
                      }}
                    >
                      {idx === 1 && (
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 px-3 py-1 bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 text-xs font-semibold rounded-full">
                          Most Popular
                        </div>
                      )}
                      <div className="flex flex-col h-full flex-1 pt-2">
                        <div className="mb-6">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                          <div className="mb-2">
                            <span className="text-4xl font-bold text-gray-900 dark:text-white">
                              ${plan.monthly_price.toFixed(2)}
                            </span>
                            <span className="text-gray-500 text-sm ml-2">/month</span>
                          </div>
                          <p className="text-cyan-400 text-xs font-semibold">{plan.monthly_credits.toLocaleString()} Credits/Month</p>
                        </div>

                        <div className="space-y-3 flex-1">
                          {[
                            `${plan.monthly_credits.toLocaleString()} credits/month`,
                            `${plan.video_limit_per_month} videos/month`,
                            `Priority level ${plan.priority_level}`,
                            plan.commercial_usage_allowed ? "Commercial usage included" : "No commercial usage",
                          ].map((feature) => (
                            <div key={feature} className="flex items-start gap-3">
                              <Check className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                            </div>
                          ))}
                          <div className="flex items-start gap-3 pt-2">
                            <X className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              Max duration: {plan.max_video_duration}s
                            </span>
                          </div>
                        </div>

                        <div className="mt-8">
                          <button
                            onClick={() => onSelectPlan(plan.id, "plan")}
                            className={`w-full py-3 font-semibold transition text-sm rounded-xl ${
                              idx === 1
                                ? "bg-cyan-500 hover:bg-cyan-400 text-white shadow-lg shadow-cyan-500/30"
                                : "bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-cyan-500 hover:text-white hover:border-cyan-500"
                            }`}
                          >
                            {buttonText}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Carousel Controls - Dots and Prev/Next */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={prevPage}
                      className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-cyan-500 hover:text-cyan-500 transition-colors flex items-center justify-center"
                      aria-label="Previous plans"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-2">
                      {Array.from({ length: totalPages }).map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentPage(index)}
                          aria-label={`Go to plan page ${index + 1}`}
                        >
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              index === safePageIndex
                                ? "bg-cyan-400 w-6"
                                : "bg-gray-500/50 hover:bg-gray-400/70 w-2"
                            }`}
                          />
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={nextPage}
                      className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-cyan-500 hover:text-cyan-500 transition-colors flex items-center justify-center"
                      aria-label="Next plans"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Credit Packages Section */}
            {modalType === "buy" && (
              <div className="space-y-8">
                {/* Monthly Packages */}
                {monthlyPackages.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                      <div className="w-1 h-6 bg-cyan-500 rounded-full"></div>
                      Monthly Packages
                    </h3>
                    <div className={getGridClass(monthlyPackages.length)}>
                      {monthlyPackages.map((pkg, idx) => (
                        <CreditCard
                          key={pkg.id}
                          pkg={pkg}
                          buttonText={buttonText}
                          onSelectPlan={onSelectPlan}
                          isHighlighted={idx === 1 && monthlyPackages.length <= 2}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* One-time Packages */}
                {oneTimePackages.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                      <div className="w-1 h-6 bg-amber-500 rounded-full"></div>
                      One-Time Packages
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {oneTimePackages.map((pkg, idx) => (
                        <CreditCard
                          key={pkg.id}
                          pkg={pkg}
                          buttonText={buttonText}
                          onSelectPlan={onSelectPlan}
                          isHighlighted={idx === 1 && oneTimePackages.length <= 2}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper component for credit card
function CreditCard({
  pkg,
  buttonText,
  onSelectPlan,
  isHighlighted,
}: {
  pkg: CreditPackage;
  buttonText: string;
  onSelectPlan: (id: number, kind: "package") => void;
  isHighlighted: boolean;
}) {
  const features = [
    `${pkg.credits.toLocaleString()} credits`,
    "Instant top-up after successful payment",
    "Usable across all video generation flows",
    "No hidden fees",
  ];

  return (
    <div
      className={`relative transition-all duration-300 flex flex-col h-full bg-linear-to-b border rounded-2xl overflow-hidden hover:shadow-lg ${
        isHighlighted
          ? "from-gray-100 dark:from-gray-800/80 to-white dark:to-gray-900/80 border-cyan-500/50 shadow-lg shadow-cyan-500/5 ring-1 ring-cyan-500/20 md:ring-2"
          : "from-gray-50 dark:from-gray-900/50 to-white dark:to-black border-gray-200 dark:border-gray-800/50"
      }`}
      style={{
        padding: "28px",
      }}
    >
      {isHighlighted && (
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 px-3 py-1 bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 text-xs font-semibold rounded-full">
          Best Value
        </div>
      )}
      <div className="flex flex-col h-full flex-1 pt-2">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{pkg.name}</h3>
          <div className="mb-3">
            <span className="text-4xl font-bold text-gray-900 dark:text-white">
              ${pkg.price.toFixed(2)}
            </span>
            <span className="text-gray-500 text-sm ml-2">
              {pkg.plan_type === "monthly" ? "/month" : "one-time"}
            </span>
          </div>
          <div className="inline-block px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold rounded-lg">
            {pkg.credits.toLocaleString()} Credits
          </div>
        </div>

        <div className="space-y-3 flex-1">
          {features.map((feature) => (
            <div key={feature} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
              <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <button
            onClick={() => onSelectPlan(pkg.id, "package")}
            className={`w-full py-3 font-semibold transition text-sm rounded-xl ${
              isHighlighted
                ? "bg-cyan-500 hover:bg-cyan-400 text-white shadow-lg shadow-cyan-500/30"
                : "bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-cyan-500 hover:text-white hover:border-cyan-500"
            }`}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
