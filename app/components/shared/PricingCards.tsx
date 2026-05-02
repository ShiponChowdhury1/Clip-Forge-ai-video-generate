"use client";

import { Check, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useGetSubscriptionsQuery } from "@/lib/redux/features/admin/adminApi";
import { useAppSelector } from "@/lib/redux/hooks";

type DisplayPlan = {
  name: string;
  price: string;
  period: string;
  credits: string;
  features: { text: string; included: boolean }[];
  button: string;
  highlighted: boolean;
  badge?: string;
};

interface PricingCardsProps {
  /** "section" for home page full-width section, "compact" for modal/billing use */
  variant?: "section" | "compact";
  /** Called when a plan button is clicked. If not provided, buttons are non-interactive. */
  onSelectPlan?: (planName: string) => void;
}

/* ── Static fallback plans (shown when API has no data) ───────────── */
const fallbackPlans: DisplayPlan[] = [
  {
    name: "Starter",
    price: "$0",
    period: "/month",
    credits: "50 Credits / month",
    features: [
      { text: "1080p Export", included: true },
      { text: "Standard Voices", included: true },
      { text: "Basic Support", included: true },
      { text: "No Watermark", included: true },
      { text: "Commercial Usage", included: false },
    ],
    button: "Get Started",
    highlighted: false,
  },
  {
    name: "Growth",
    price: "$10",
    period: "/month",
    credits: "3,000 Credits / month",
    features: [
      { text: "4K Export", included: true },
      { text: "Premium AI Voices", included: true },
      { text: "Priority Support", included: true },
      { text: "Unlimited Assets", included: true },
      { text: "Commercial Usage", included: true },
    ],
    button: "Choose Plan",
    highlighted: true,
    badge: "MOST POPULAR",
  },
  {
    name: "Pro",
    price: "$25",
    period: "/month",
    credits: "6,000 Credits / month",
    features: [
      { text: "API Access", included: true },
      { text: "Custom Branding", included: true },
      { text: "Dedicated Manager", included: true },
      { text: "Bulk Generation", included: true },
      { text: "Commercial Usage", included: true },
    ],
    button: "Choose Plan",
    highlighted: false,
  },
];

export default function PricingCards({
  variant = "section",
  onSelectPlan,
}: PricingCardsProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const token = useAppSelector((state) => state.auth.token);
  const userRole = useAppSelector((state) => state.auth.user?.role);
  const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const { data: subscriptionPlans = [] } = useGetSubscriptionsQuery();
  const isSection = variant === "section";

  const displayPlans = useMemo<DisplayPlan[]>(() => {
    const activePlans = subscriptionPlans
      .filter((p) => (p.plan_status || "active").toLowerCase() === "active")
      .sort((a, b) => a.monthly_price - b.monthly_price);

    if (!activePlans.length) return fallbackPlans;

    const highlightedIndex = activePlans.length > 1 ? 1 : 0;

    return activePlans.map((plan, idx) => ({
      name: plan.name,
      price: plan.monthly_price === 0 ? "Free" : `$${Number(plan.monthly_price).toFixed(0)}`,
      period: plan.monthly_price === 0 ? "" : "/month",
      credits: `${Number(plan.monthly_credits).toLocaleString()} Credits / month`,
      features: [
        { text: `Up to ${plan.video_limit_per_month} videos/month`, included: true },
        { text: `Max ${plan.max_video_duration}s video duration`, included: true },
        { text: `${plan.max_concurrent_jobs} concurrent job${plan.max_concurrent_jobs > 1 ? "s" : ""}`, included: true },
        { text: `Priority Level ${plan.priority_level}`, included: true },
        { text: "Commercial Usage", included: plan.commercial_usage_allowed },
      ],
      button: plan.monthly_price === 0 ? "Get Started" : "Choose Plan",
      highlighted: idx === highlightedIndex,
      badge: idx === highlightedIndex ? "MOST POPULAR" : undefined,
    }));
  }, [subscriptionPlans]);

  const cardsPerPage = 3;
  const totalPages = Math.max(1, Math.ceil(displayPlans.length / cardsPerPage));
  const safePageIndex = currentPage % totalPages;

  const visiblePlans =
    isSection && displayPlans.length > cardsPerPage
      ? displayPlans.slice(safePageIndex * cardsPerPage, (safePageIndex + 1) * cardsPerPage)
      : displayPlans;

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const handleSelectPlan = (planName: string) => {
    if (onSelectPlan) {
      onSelectPlan(planName);
      return;
    }

    if (variant !== "section") return;

    const storedRole =
      typeof window !== "undefined"
        ? (() => {
          try {
            const parsed = JSON.parse(localStorage.getItem("user") || "{}");
            return (parsed as { role?: string }).role || null;
          } catch {
            return null;
          }
        })()
        : null;
    const effectiveToken = token || storedToken;
    const effectiveRole = (userRole || storedRole || "").toLowerCase();

    if (!effectiveToken) {
      router.push("/login");
      return;
    }

    if (effectiveRole === "admin") {
      router.push("/admin");
      return;
    }

    if (effectiveRole === "user" || effectiveRole === "super_admin") {
      router.push(`/dashboard/billing?checkout=1&plan=${encodeURIComponent(planName)}`);
      return;
    }

    router.push("/login");
  };

  return (
    <div>
      {/* Heading */}
      <h2
        className={`font-bold text-center ${isSection
            ? "text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3"
            : "text-2xl sm:text-3xl mb-2"
          }`}
      >
        Choose Your Subscription Plan
      </h2>
      <p
        className={`text-center text-gray-600 dark:text-gray-400 ${isSection
            ? "text-xs sm:text-sm mb-8 sm:mb-10 md:mb-12"
            : "text-sm mb-8"
          }`}
      >
        Scale your video creation with a plan that matches your needs.
      </p>

      {/* Cards Grid */}
      {displayPlans.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400 text-sm py-8">
          No active plans available right now.
        </p>
      ) : (
        <div className="space-y-6">
          <div
            className={
              isSection
                ? "grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch"
                : "flex flex-col lg:flex-row justify-center items-center lg:items-end gap-5"
            }
          >
            {visiblePlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative transition-all duration-300 flex flex-col w-full ${plan.highlighted
                    ? "bg-linear-to-b from-gray-100 dark:from-gray-800/80 to-white dark:to-gray-900/80 border-cyan-500/50 shadow-lg shadow-cyan-500/5"
                    : "bg-linear-to-b from-gray-50 dark:from-gray-900/50 to-white dark:to-black border-gray-200 dark:border-gray-800/50 hover:border-gray-300 dark:hover:border-gray-700/50"
                  }`}
                style={
                  isSection
                    ? {
                      minHeight: plan.highlighted ? "607.36px" : "555.26px",
                      paddingTop: "44.33px",
                      paddingBottom: "44.33px",
                      paddingLeft: "44.33px",
                      paddingRight: "44.33px",
                      borderRadius: "26.6px",
                      borderWidth: "1.23px",
                      borderStyle: "solid" as const,
                      borderColor: plan.highlighted
                        ? "rgba(6, 182, 212, 0.5)"
                        : "rgba(55, 65, 81, 0.5)",
                    }
                    : {
                      maxWidth: "340px",
                      padding: "24px",
                      borderRadius: "16px",
                      borderWidth: "1px",
                      borderStyle: "solid" as const,
                      borderColor: plan.highlighted
                        ? "rgba(6, 182, 212, 0.5)"
                        : "rgba(55, 65, 81, 0.5)",
                    }
                }
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-cyan-500 text-white text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="flex flex-col h-full flex-1">
                  <div style={{ marginBottom: isSection ? "35.46px" : "0" }} className={isSection ? "" : "mb-6"}>
                    <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
                    <div className="mb-1">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      {plan.period && (
                        <span className="text-gray-500 text-sm ml-2">{plan.period}</span>
                      )}
                    </div>
                    <p className="text-cyan-400 text-xs">{plan.credits}</p>
                  </div>

                  <div className="space-y-3 flex-1" style={{ marginBottom: isSection ? "35.46px" : "0" }}>
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        {feature.included ? (
                          <Check className="w-4 h-4 text-cyan-500" />
                        ) : (
                          <X className="w-4 h-4 text-gray-600" />
                        )}
                        <span
                          className={`text-sm ${feature.included
                              ? "text-gray-700 dark:text-gray-300"
                              : "text-gray-400 dark:text-gray-600"
                            }`}
                        >
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className={isSection ? "mt-auto" : "mt-6"}>
                    <button
                      onClick={() => handleSelectPlan(plan.name)}
                      className={`w-full py-3 font-medium transition text-sm ${plan.highlighted
                          ? "bg-cyan-500 hover:bg-cyan-400 text-white"
                          : "bg-transparent border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-cyan-500 hover:text-white hover:border-cyan-500"
                        }`}
                      style={{ borderRadius: "12px" }}
                    >
                      {plan.button}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {isSection && totalPages > 1 && (
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={prevPage}
                className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-cyan-500 hover:text-cyan-500 transition-colors flex items-center justify-center"
                aria-label="Previous pricing cards"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index)}
                    aria-label={`Go to pricing page ${index + 1}`}
                  >
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${index === safePageIndex
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
                aria-label="Next pricing cards"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
