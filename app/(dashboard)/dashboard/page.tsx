import Image from "next/image";
import DashboardHeader from "@/app/components/dashboard/DashboardHeader";
import VideoCard from "@/app/components/dashboard/VideoCard";
import { videoCardData } from "@/app/data";

export default function DashboardPage() {
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
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
          Recently Generated Video
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
          {videoCardData.slice(0, 8).map((video) => (
            <VideoCard key={video.id} {...video} />
          ))}
        </div>
      </div>
    </div>
  );
}
