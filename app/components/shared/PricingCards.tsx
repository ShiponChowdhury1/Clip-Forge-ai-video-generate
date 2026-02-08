"use client";

import { Check, X } from "lucide-react";
import { plans } from "@/app/data";

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
  const isSection = variant === "section";

  return (
    <div>
      {/* Heading */}
      <h2
        className={`font-bold text-center text-white ${
          isSection
            ? "text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3"
            : "text-2xl sm:text-3xl mb-2"
        }`}
      >
        Simple, credit-based pricing
      </h2>
      <p
        className={`text-center text-gray-400 ${
          isSection
            ? "text-xs sm:text-sm mb-8 sm:mb-10 md:mb-12"
            : "text-sm mb-8"
        }`}
      >
        Each video generation uses 1 credit. No hidden fees.
      </p>

      {/* Cards Grid */}
      <div
        className={`flex flex-col lg:flex-row justify-center items-center lg:items-end ${
          isSection ? "gap-4 sm:gap-6" : "gap-5"
        }`}
      >
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative transition-all duration-300 flex flex-col w-full ${
              plan.highlighted
                ? "bg-linear-to-b from-gray-800/80 to-gray-900/80 border-cyan-500/50 shadow-lg shadow-cyan-500/5 order-first lg:order-none"
                : "bg-linear-to-b from-gray-900/50 to-black border-gray-800/50 hover:border-gray-700/50"
            }`}
            style={
              isSection
                ? {
                    width: "100%",
                    maxWidth:
                      plan.name === "Growth" ? "420.05px" : "396.78px",
                    height: "auto",
                    minHeight:
                      plan.name === "Growth" ? "607.36px" : "555.26px",
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
                <span className="bg-cyan-500 text-black text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap">
                  {plan.badge}
                </span>
              </div>
            )}

            {/* Card Content */}
            <div className="flex flex-col h-full flex-1">
              <div style={{ marginBottom: isSection ? "35.46px" : "0" }} className={isSection ? "" : "mb-6"}>
                <h3 className="text-lg font-semibold mb-1 text-white">
                  {plan.name}
                </h3>
                <div className="mb-1">
                  <span className="text-3xl font-bold text-white">
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
                        feature.included ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              <div className={isSection ? "mt-auto" : "mt-6"}>
                <button
                  onClick={() => onSelectPlan?.(plan.name)}
                  className={`w-full py-3 font-medium transition text-sm ${
                    plan.highlighted
                      ? "bg-cyan-500 hover:bg-cyan-400 text-black"
                      : "bg-transparent border border-gray-700 hover:border-gray-600 text-white"
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
    </div>
  );
}
