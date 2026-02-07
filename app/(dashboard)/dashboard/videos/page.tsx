"use client";

import { Video } from "lucide-react";
import DashboardHeader from "@/app/components/dashboard/DashboardHeader";
import VideoCard from "@/app/components/dashboard/VideoCard";
import { useState } from "react";
import { videoCardData } from "@/app/data";

export default function AllVideosPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVideos = videoCardData.filter(
    (video) =>
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Header - Reusable */}
      <DashboardHeader
        icon={
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
            <Video className="w-6 h-6 text-white" />
          </div>
        }
        title="All Generated Video"
        description="Manage & Review Your Generated Videos"
      />

      {/* Search Bar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <path strokeLinecap="round" d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your generated video"
            className="w-full bg-[#0D1117] border border-[#1A3155] rounded-xl pl-12 pr-4 py-3.5 text-white text-sm placeholder:text-gray-500 focus:border-[#3B82F6] focus:outline-none transition-colors"
          />
        </div>
        <button className="bg-[#0D1117] border border-[#1A3155] rounded-xl p-3.5 text-gray-400 hover:text-white hover:border-[#3B82F6] transition-all">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#0D1117] border border-[#1A3155] rounded-xl p-5">
          <p className="text-gray-400 text-sm mb-2">Total Videos</p>
          <p className="text-white text-3xl font-bold">10</p>
        </div>
        <div className="bg-[#0D1117] border border-[#1A3155] rounded-xl p-5">
          <p className="text-gray-400 text-sm mb-2">Completed</p>
          <p className="text-[#009927] text-3xl font-bold">10</p>
        </div>
        <div className="bg-[#0D1117] border border-[#1A3155] rounded-xl p-5">
          <p className="text-gray-400 text-sm mb-2">Processing</p>
          <p className="text-[#F59E0B] text-3xl font-bold">0</p>
        </div>
        <div className="bg-[#0D1117] border border-[#1A3155] rounded-xl p-5">
          <p className="text-gray-400 text-sm mb-2">Failed</p>
          <p className="text-[#E33629] text-3xl font-bold">0</p>
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {filteredVideos.map((video) => (
          <VideoCard key={video.id} {...video} />
        ))}
      </div>

      {filteredVideos.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No videos found</p>
        </div>
      )}
    </div>
  );
}
