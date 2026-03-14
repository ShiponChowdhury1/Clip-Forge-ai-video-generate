"use client";

import { steps } from "@/app/data";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16 md:py-20">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center sm:mb-12 ">
        How It Works
      </h2>

      <p className="text-gray-600 dark:text-gray-400 text-center mb-8 sm:mb-12 md:mb-16 max-w-2xl mx-auto">
        From idea to finished video in minutes. <br />
        No editing software. No complicated timelines. No design skills required.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 md:gap-12">
        {steps.map((item) => (
          <div key={item.step} className="h-full w-full max-w-sm mx-auto text-left flex flex-col items-start p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/20 backdrop-blur-sm transition-all hover:border-cyan-500/30">
            <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 bg-cyan-500/10 border border-cyan-500/20 rounded-xl sm:rounded-2xl flex items-center justify-center">
              <item.icon className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-500" />
            </div>
            <h3 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3 w-full text-center">
              {item.step}. {item.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm leading-relaxed w-full">
              {item.desc}
            </p>
            {item.points && item.points.length > 0 && (
              <div className="mt-4 w-full space-y-2 text-left">
                {item.points.map((point) => (
                  <div
                    key={point.label}
                    className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300"
                  >
                    <point.icon className="w-4 h-4 text-cyan-500 shrink-0" />
                    <span>{point.label}</span>
                  </div>
                ))}
              </div>
            )}
            {item.note && (
              <p className="mt-4 text-gray-600 dark:text-gray-400 text-xs sm:text-sm leading-relaxed w-full text-left">
                {item.note}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
