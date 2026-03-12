"use client";

import Image from "next/image";
import DashboardHeader from "@/app/components/dashboard/DashboardHeader";
import VideoCard from "@/app/components/dashboard/VideoCard";
import { useGetAllVideosQuery } from "@/lib/redux/features/videos/videosApi";

export default function DashboardPage() {
  const { data: videos = [], isLoading } = useGetAllVideosQuery({ skip: 0, limit: 8 });

  return (
    <div>
      <DashboardHeader
        icon={
          <Image
            src="/logo/logo.png"
            alt="Clipforge"
            width={48}
            height={48}
            className="w-12 h-12 rounded-xl object-cover"
          />
        }
        title="Clipforge"
        description="Transform scripts into AI-generated videos"
      />

      {/* Recently Generated Videos */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
          Recently Generated Video
        </h2>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-[#1F1F1F] rounded-2xl overflow-hidden animate-pulse">
                <div className="h-[230px] bg-gray-200 dark:bg-[#1A1A1A]" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-gray-200 dark:bg-[#1A1A1A] rounded w-3/4" />
                  <div className="h-4 bg-gray-200 dark:bg-[#1A1A1A] rounded w-1/2" />
                  <div className="h-3 bg-gray-200 dark:bg-[#1A1A1A] rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No videos yet. Create your first video!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
            {videos.slice(0, 8).map((video) => (
              <VideoCard key={video.id} {...video} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
