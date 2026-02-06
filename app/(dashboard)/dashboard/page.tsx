import DashboardHeader from "@/app/components/dashboard/DashboardHeader";
import VideoCard from "@/app/components/dashboard/VideoCard";

const recentVideos = [
  {
    id: "1",
    title: "Mountain Peak",
    category: "Nature",
    thumbnail: "/video/cinematic.png",
    createdAt: "Created 10min ago",
  },
  {
    id: "2",
    title: "Itachi Uchiha",
    category: "Anime",
    thumbnail: "/video/storytelling.png",
    createdAt: "Created 10min ago",
  },
  {
    id: "3",
    title: "Car Racing",
    category: "Racing",
    thumbnail: "/video/productPromo.png",
    createdAt: "Created 10min ago",
  },
  {
    id: "4",
    title: "Mountain Peak",
    category: "Nature",
    thumbnail: "/video/educational.png",
    createdAt: "Created 10min ago",
  },
  {
    id: "5",
    title: "Itachi Uchiha",
    category: "Anime",
    thumbnail: "/video/storytelling.png",
    createdAt: "Created 10min ago",
  },
  {
    id: "6",
    title: "Car Racing",
    category: "Racing",
    thumbnail: "/video/cinematic.png",
    createdAt: "Created 10min ago",
  },
];

export default function DashboardPage() {
  return (
    <div>
      <DashboardHeader />

      {/* Recently Generated Videos */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">
          Recently Generated Video
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {recentVideos.map((video) => (
            <VideoCard key={video.id} {...video} />
          ))}
        </div>
      </div>
    </div>
  );
}
