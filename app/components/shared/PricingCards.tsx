"use client";

import { Check, X } from "lucide-react";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useGetCreditPackagesQuery } from "@/lib/redux/features/admin/adminApi";
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

export default function PricingCards({
  variant = "section",
  onSelectPlan,
}: PricingCardsProps) {
  const router = useRouter();
  const token = useAppSelector((state) => state.auth.token);
  const userRole = useAppSelector((state) => state.auth.user?.role);
  const { data: creditPackages = [] } = useGetCreditPackagesQuery();
  const isSection = variant === "section";

  const displayPlans = useMemo<DisplayPlan[]>(() => {
    const activePackages = creditPackages
      .filter((pkg) => (pkg.status || "active").toLowerCase() === "active")
      .sort((a, b) => a.price - b.price);

    if (!activePackages.length) {
      return [];
    }

    const highlightedIndex = activePackages.length > 1 ? 1 : 0;

    return activePackages.map((pkg, idx) => ({
      name: pkg.name,
      price: `$${Number(pkg.price).toFixed(0)}`,
      period: "/one-time",
      credits: `${Number(pkg.credits).toLocaleString()} Credits Included`,
      features: [
        { text: "One-time purchase", included: true },
        { text: "Instant credit top-up", included: true },
        { text: "No recurring charge", included: true },
      ],
      button: "Buy Credits",
      highlighted: idx === highlightedIndex,
      badge: idx === highlightedIndex ? "MOST POPULAR" : undefined,
    }));
  }, [creditPackages]);

  const handleSelectPlan = (planName: string) => {
    if (onSelectPlan) {
      onSelectPlan(planName);
      return;
    }

    if (variant !== "section") return;

    const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
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
      router.push(`/dashboard/billing?checkout=1&package=${encodeURIComponent(planName)}`);
      return;
    }

    router.push("/login");
  };

  return (
    <div>
      {/* Heading */}
      <h2
        className={`font-bold text-center ${
          isSection
            ? "text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3"
            : "text-2xl sm:text-3xl mb-2"
        }`}
      >
        Simple, credit-based pricing
      </h2>
      <p
        className={`text-center text-gray-600 dark:text-gray-400 ${
          isSection
            ? "text-xs sm:text-sm mb-8 sm:mb-10 md:mb-12"
            : "text-sm mb-8"
        }`}
      >
        Each video generation uses 1 credit. No hidden fees.
      </p>

      {/* Cards Grid */}
      {displayPlans.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400 text-sm py-8">
          No active credit packages available right now.
        </p>
      ) : (
        <div
          className={`flex flex-col lg:flex-row justify-center items-center lg:items-end ${
            isSection ? "gap-4 sm:gap-6" : "gap-5"
          }`}
        >
          {displayPlans.map((plan) => (
            <div
              key={plan.name}
              className={`relative transition-all duration-300 flex flex-col w-full ${
                plan.highlighted
                  ? "bg-linear-to-b from-gray-100 dark:from-gray-800/80 to-white dark:to-gray-900/80 border-cyan-500/50 shadow-lg shadow-cyan-500/5 order-first lg:order-0"
                  : "bg-linear-to-b from-gray-50 dark:from-gray-900/50 to-white dark:to-black border-gray-200 dark:border-gray-800/50 hover:border-gray-300 dark:hover:border-gray-700/50"
              }`}
              style={
                isSection
                  ? {
                      width: "100%",
                      maxWidth: plan.highlighted ? "420.05px" : "396.78px",
                      height: "auto",
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
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-cyan-500 text-white text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap">
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Card Content */}
              <div className="flex flex-col h-full flex-1">
                <div style={{ marginBottom: isSection ? "35.46px" : "0" }} className={isSection ? "" : "mb-6"}>
                  <h3 className="text-lg font-semibold mb-1">
                    {plan.name}
                  </h3>
                  <div className="mb-1">
                    <span className="text-3xl font-bold">
                      {plan.price}
                    </span>
                    <span className="text-gray-500 text-sm ml-2">
                      {plan.period}
                    </span>
                  </div>
                  <p className="text-cyan-400 text-xs">{plan.credits}</p>
                </div>

                <div
                  className="space-y-3 flex-1"
                  style={{ marginBottom: isSection ? "35.46px" : "0" }}
                    >
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      {feature.included ? (
                        <Check className="w-4 h-4 text-cyan-500" />
                      ) : (
                        <X className="w-4 h-4 text-gray-600" />
                      )}
                      <span
                        className={`text-sm ${
                          feature.included ? "text-gray-700 dark:text-gray-300" : "text-gray-400 dark:text-gray-600"
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
                    className={`w-full py-3 font-medium transition text-sm ${
                      plan.highlighted
                        ? "bg-cyan-500 hover:bg-cyan-400 text-white"
                        : "bg-transparent border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600"
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
      )}
    </div>
  );
}
