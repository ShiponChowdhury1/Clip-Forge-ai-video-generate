"use client";

import { Check, X } from "lucide-react";
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
  const heading = modalType === "change" ? "Change Plan" : "Buy Credits";
  const buttonText = modalType === "change" ? "Select Plan" : "Buy Credits";
  const isLoading = modalType === "change" ? isPlansLoading : isCreditPackagesLoading;
  const orderedPlans = [...plans].sort((a, b) => a.monthly_price - b.monthly_price);
  const orderedCreditPackages = [...creditPackages].sort((a, b) => a.price - b.price);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-5xl mx-4 bg-white dark:bg-[#0A0E14] border border-gray-300 dark:border-[#1A3155] rounded-2xl p-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-xl transition-colors"
        >
          ✕
        </button>

        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-gray-900 dark:text-white">
          {heading}
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 text-sm mb-8">
          Select from active plans configured in admin settings.
        </p>

        {isLoading ? (
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm py-10">Loading plans...</p>
        ) : modalType === "change" && plans.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm py-10">
            No active plans available. Ask admin to activate a subscription plan.
          </p>
        ) : modalType === "buy" && creditPackages.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm py-10">
            No credit packages available. Ask admin to add credit packages.
          </p>
        ) : (
          <div className="flex flex-col lg:flex-row justify-center items-stretch gap-5">
            {(modalType === "change" ? orderedPlans : orderedCreditPackages).map((item, idx) => {
              if (modalType === "buy") {
                const pkg = item as CreditPackage;
                const features = [
                  `${pkg.credits.toLocaleString()} credits`,
                  "Instant top-up after successful payment",
                  "Usable across all video generation flows",
                  "No hidden fees",
                ];

                return (
                  <div
                    key={pkg.id}
                    className={`relative transition-all duration-300 flex flex-col w-full bg-linear-to-b border ${
                      idx === 1
                        ? "from-gray-100 dark:from-gray-800/80 to-white dark:to-gray-900/80 border-cyan-500/50 shadow-lg shadow-cyan-500/5"
                        : "from-gray-50 dark:from-gray-900/50 to-white dark:to-black border-gray-200 dark:border-gray-800/50"
                    }`}
                    style={{
                      maxWidth: "340px",
                      padding: "24px",
                      borderRadius: "16px",
                      borderWidth: "1px",
                    }}
                  >
                    <div className="flex flex-col h-full flex-1">
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{pkg.name}</h3>
                        <div className="mb-1">
                          <span className="text-3xl font-bold text-gray-900 dark:text-white">
                            ${pkg.price.toFixed(2)}
                          </span>
                          <span className="text-gray-500 text-sm ml-2">one-time</span>
                        </div>
                        <p className="text-cyan-400 text-xs">{pkg.credits.toLocaleString()} Credits Included</p>
                      </div>

                      <div className="space-y-3 flex-1">
                        {features.map((feature) => (
                          <div key={feature} className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-cyan-500" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6">
                        <button
                          onClick={() => onSelectPlan(pkg.id, "package")}
                          className={`w-full py-3 font-medium transition text-sm rounded-xl ${
                            idx === 1
                              ? "bg-cyan-500 hover:bg-cyan-400 text-white"
                              : "bg-transparent border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 text-gray-900 dark:text-white"
                          }`}
                        >
                          {buttonText}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }

              const plan = item as SubscriptionPlan;
              const features = [
                `${plan.monthly_credits.toLocaleString()} credits/month`,
                `${plan.video_limit_per_month} videos/month`,
                `Priority level ${plan.priority_level}`,
                plan.commercial_usage_allowed ? "Commercial usage included" : "No commercial usage",
              ];

              return (
                <div
                  key={plan.id}
                  className={`relative transition-all duration-300 flex flex-col w-full bg-linear-to-b border ${
                    idx === 1
                      ? "from-gray-100 dark:from-gray-800/80 to-white dark:to-gray-900/80 border-cyan-500/50 shadow-lg shadow-cyan-500/5"
                      : "from-gray-50 dark:from-gray-900/50 to-white dark:to-black border-gray-200 dark:border-gray-800/50"
                  }`}
                  style={{
                    maxWidth: "340px",
                    padding: "24px",
                    borderRadius: "16px",
                    borderWidth: "1px",
                  }}
                >
                  <div className="flex flex-col h-full flex-1">
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{plan.name}</h3>
                      <div className="mb-1">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">
                          ${plan.monthly_price.toFixed(2)}
                        </span>
                        <span className="text-gray-500 text-sm ml-2">/month</span>
                      </div>
                      <p className="text-cyan-400 text-xs">{plan.monthly_credits.toLocaleString()} Credits Included</p>
                    </div>

                    <div className="space-y-3 flex-1">
                      {features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-cyan-500" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                        </div>
                      ))}
                      <div className="flex items-center gap-2">
                        <X className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Max duration: {plan.max_video_duration}s
                        </span>
                      </div>
                    </div>

                    <div className="mt-6">
                      <button
                        onClick={() => onSelectPlan(plan.id, "plan")}
                        className={`w-full py-3 font-medium transition text-sm rounded-xl ${
                          idx === 1
                            ? "bg-cyan-500 hover:bg-cyan-400 text-white"
                            : "bg-transparent border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 text-gray-900 dark:text-white"
                        }`}
                      >
                        {buttonText}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
