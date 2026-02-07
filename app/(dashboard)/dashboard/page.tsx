import { Film } from "lucide-react";
import DashboardHeader from "@/app/components/dashboard/DashboardHeader";
import VideoCard from "@/app/components/dashboard/VideoCard";
import { videoCardData } from "@/app/data";

export default function DashboardPage() {
  return (
    <div>
      <DashboardHeader
        icon={
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Film className="w-6 h-6 text-white" />
          </div>
        }
        title="Clipforge"
        description="Transform scripts into AI-generated videos"
      />

      {/* Recently Generated Videos */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">
          Recently Generated Video
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {videoCardData.slice(0, 8).map((video) => (
            <VideoCard key={video.id} {...video} />
          ))}
        </div>
      </div>
    </div>
  );
}
