"use client";

import { Play } from "lucide-react";

export default function VideoSection() {
  const videos = [
    {
      title: "Storytelling",
      desc: "Generate viral storytelling content in minutes.",
      bgImage: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
      bgColor: "from-slate-900 via-slate-800 to-slate-900",
    },
    {
      title: "Educational",
      desc: "Generate viral educational content in minutes.",
      bgImage: "linear-gradient(135deg, #0d1117 0%, #161b22 50%, #21262d 100%)",
      bgColor: "from-gray-900 via-gray-800 to-gray-900",
    },
    {
      title: "Product Promo",
      desc: "Generate viral product promo content in minutes.",
      bgImage: "linear-gradient(135deg, #0a192f 0%, #112240 50%, #1d3557 100%)",
      bgColor: "from-blue-950 via-blue-900 to-cyan-900",
    },
    {
      title: "Cinematic",
      desc: "Generate viral cinematic content in minutes.",
      bgImage: "linear-gradient(135deg, #000000 0%, #0d1b2a 50%, #1b263b 100%)",
      bgColor: "from-black via-slate-900 to-slate-800",
    },
  ];

  return (
    <section className="w-full max-w-[1662px] mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-10 md:py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
        {videos.map((item, index) => (
          <div
            key={item.title}
            className={`relative aspect-[3/4] bg-gradient-to-br ${item.bgColor} rounded-2xl overflow-hidden cursor-pointer group border border-gray-800/50 hover:border-gray-700/50 transition-all duration-300`}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent" />
            </div>
            
            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-cyan-500/80 rounded-full flex items-center justify-center group-hover:bg-cyan-500 group-hover:scale-110 transition-all duration-300 backdrop-blur-sm">
                <Play className="w-5 h-5 sm:w-6 sm:h-6 text-black fill-black ml-1" />
              </div>
            </div>
            
            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
              <h3 className="text-white font-semibold text-base sm:text-lg mb-1">{item.title}</h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
