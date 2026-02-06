"use client";

import { features } from "@/app/data";

export default function Features() {
  return (
    <section id="features" className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16 md:py-20">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 md:mb-16 px-2">
        Everything You Need to{" "}
        <span className="text-cyan-500">Create</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="bg-gradient-to-b from-gray-900/50 to-black border border-gray-800/50 rounded-xl p-5 sm:p-6 md:p-8 hover:border-gray-700/50 transition-all duration-300"
          >
            <div className={`w-10 h-10 sm:w-12 sm:h-12 ${feature.iconBg} rounded-lg flex items-center justify-center mb-4 sm:mb-5`}>
              <feature.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${feature.iconColor}`} />
            </div>
            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-white">{feature.title}</h3>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
