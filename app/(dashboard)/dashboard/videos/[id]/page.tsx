"use client";

import { useParams, useRouter } from "next/navigation";
import { videoCardData } from "@/app/data";
import {
  ArrowLeft,
  Play,
  Download,
  RefreshCw,
  Pencil,
} from "lucide-react";
import { useRef, useState } from "react";
import { motion } from "framer-motion";

export default function VideoDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const videoId = params.id as string;
  const video = videoCardData.find((v) => v.id === videoId);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  if (!video) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-white text-xl font-semibold mb-2">
            Video not found
          </p>
          <p className="text-gray-500 text-sm mb-6">
            The video you are looking for does not exist.
          </p>
          <button
            onClick={() => router.back()}
            className="text-[#3B82F6] hover:underline text-sm"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = video.videoUrl;
    link.download = `${video.title}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const detailRows = [
    { label: "Video Title:", value: video.title },
    { label: "Keywords:", value: video.keywords || "N/A" },
    { label: "Negative Keywords:", value: video.negativeKeywords || "N/A" },
    { label: "Video Format:", value: video.videoFormat || "9:16" },
    { label: "Video Style:", value: video.videoStyle || video.category },
    { label: "Voice Type:", value: video.voiceType || "Griffin" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#1A1A1A] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-white text-2xl font-bold">Video Details</h1>
        </div>

        {/* Status Badge */}
        <div
          className={`px-5 py-2 rounded-full text-sm font-semibold ${
            video.status === "Completed"
              ? "bg-[#009927] text-white"
              : video.status === "Processing"
                ? "bg-[#F59E0B] text-black"
                : "bg-[#E33629] text-white"
          }`}
        >
          {video.status || "Completed"}
        </div>
      </div>

      {/* Video Preview Section */}
      <div className="bg-[#0D1117] border border-[#1A3155] rounded-2xl overflow-hidden mb-6">
        <div className="p-5 pb-3">
          <h2 className="text-white text-lg font-semibold">Video Preview</h2>
        </div>

        {/* Video Player */}
        <div className="px-5 pb-5">
          <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
            <video
              ref={videoRef}
              src={video.videoUrl}
              className="w-full h-full object-contain"
              preload="metadata"
              controls={isPlaying}
              onClick={togglePlay}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />

            {/* Play Overlay */}
            {!isPlaying && (
              <div
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer transition-all hover:bg-black/40"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30"
                >
                  <Play className="w-7 h-7 text-white fill-white ml-1" />
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Video Details Section */}
      <div className="bg-[#0D1117] border border-[#1A3155] rounded-2xl overflow-hidden mb-6">
        <div className="p-5 pb-3">
          <h2 className="text-white text-lg font-semibold">Video Details</h2>
        </div>

        <div className="px-5 pb-5">
          <div className="space-y-4">
            {detailRows.map((row) => (
              <div key={row.label} className="flex items-start gap-4">
                <span className="text-gray-400 text-sm w-44 shrink-0">
                  {row.label}
                </span>
                <span className="text-white text-sm">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        <button className="flex-1 flex items-center justify-center gap-2 bg-[#0D1117] border border-[#1A3155] hover:border-[#3B82F6] text-white rounded-xl py-3.5 text-sm font-medium transition-all">
          <RefreshCw className="w-4 h-4" />
          Regenerate
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 bg-[#0D1117] border border-[#1A3155] hover:border-[#3B82F6] text-white rounded-xl py-3.5 text-sm font-medium transition-all">
          <Pencil className="w-4 h-4" />
          Edit Details
        </button>
        <button
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-2 bg-[#009927] hover:bg-[#007a1f] text-white rounded-xl py-3.5 text-sm font-medium transition-colors"
        >
          <Download className="w-4 h-4" />
          Download
        </button>
      </div>
    </motion.div>
  );
}
