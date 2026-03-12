"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetVideoQuery } from "@/lib/redux/features/videos/videosApi";
import {
  ArrowLeft,
  Play,
  Download,
  RefreshCw,
  Loader2,
  FileText,
  Clock,
  Film,
  Palette,
  Mic,
  Timer,
  Tag,
  Copy,
  Check,
  PlusCircle,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

function buildVideoUrl(path: string): string {
  if (path.startsWith("http")) return path;
  const match = path.match(/outputs\/.+$/);
  const relativePath = match ? `/${match[0]}` : path;
  return `/api/video-proxy?path=${encodeURIComponent(relativePath)}`;
}

export default function VideoDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const videoId = Number(params.id);
  const { data: video, isLoading, refetch } = useGetVideoQuery(videoId);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyScript = async () => {
    if (!video?.script) return;
    await navigator.clipboard.writeText(video.script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEditRegenerate = () => {
    if (!video) return;
    sessionStorage.setItem(
      "editVideoData",
      JSON.stringify({
        title: video.title,
        script: video.script || "",
        format: video.format || "9:16",
        style: video.style || "",
        voice: video.voice || "",
        keywords: video.keywords || "",
        negative_keywords: video.negative_keywords || "",
        music_id: video.music_id || 0,
        subtitle_id: video.subtitle_id || 1,
        media_option: video.media_option || "all_images",
      })
    );
    router.push("/dashboard/create");
  };

  // Auto-refresh while video is still processing
  const isProcessing = video && video.status.toLowerCase() !== "completed" && video.status.toLowerCase() !== "failed";
  useEffect(() => {
    if (!isProcessing) return;
    const interval = setInterval(() => refetch(), 5000);
    return () => clearInterval(interval);
  }, [isProcessing, refetch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#3B82F6] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading video...</p>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-gray-900 dark:text-white text-xl font-semibold mb-2">
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

  const hasVideo = video.path && video.status.toLowerCase() === "completed";
  const videoUrl = hasVideo ? buildVideoUrl(video.path) : "";

  const togglePlay = () => {
    if (!videoRef.current || !hasVideo) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleDownload = () => {
    if (!hasVideo) return;
    const link = document.createElement("a");
    link.href = videoUrl;
    link.download = `${video.title}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const detailRows = [
    { label: "Format", value: video.format || "9:16", icon: Film },
    { label: "Style", value: video.style, icon: Palette },
    { label: "Voice", value: video.voice || "N/A", icon: Mic },
    { label: "Duration", value: video.duration ? `${video.duration}s` : "N/A", icon: Timer },
  ];

  const createdDate = new Date(video.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full space-y-5"
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 shrink-0 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-[#1A1A1A] transition-colors mt-0.5"
          >
            <ArrowLeft className="w-5 h-5 text-gray-900 dark:text-white" />
          </button>
          <div className="min-w-0">
            <h1 className="text-gray-900 dark:text-white text-lg font-bold leading-snug">{video.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Clock className="w-3 h-3 text-gray-500 shrink-0" />
              <span className="text-gray-500 text-xs">{createdDate}</span>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div
          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold capitalize whitespace-nowrap ${
            video.status.toLowerCase() === "completed"
              ? "bg-[#009927]/15 text-[#22C55E] border border-[#009927]/30"
              : video.status.toLowerCase() === "processing"
                ? "bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30"
                : "bg-[#E33629]/15 text-[#E33629] border border-[#E33629]/30"
          }`}
        >
          {video.status}
        </div>
      </div>

      {/* Main Content - 60/40 Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[60%_1fr] gap-5">
        {/* Left: Video Player */}
        <div>
          <div className="bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-2xl overflow-hidden h-full flex flex-col">
            <div className="p-4 pb-2">
              <h2 className="text-gray-900 dark:text-white text-sm font-semibold">Preview</h2>
            </div>

            <div className="px-4 pb-4 flex-1 flex items-center justify-center">
              <div className="relative aspect-[9/16] max-h-[400px] w-full bg-black rounded-xl overflow-hidden">
                {hasVideo ? (
                  <>
                    <video
                      ref={videoRef}
                      src={videoUrl}
                      className="w-full h-full object-contain"
                      preload="metadata"
                      controls={isPlaying}
                      onClick={togglePlay}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                    />

                    {!isPlaying && (
                      <div
                        onClick={togglePlay}
                        className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer transition-all hover:bg-black/40"
                      >
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30"
                        >
                          <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                        </motion.div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-8 h-8 text-[#3B82F6] animate-spin" />
                    <p className="text-gray-400 text-xs">
                      {video.status.toLowerCase() === "failed"
                        ? "Generation failed"
                        : "Generating video..."}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons inside video card */}
            <div className="px-4 pb-4 grid grid-cols-3 gap-2">
              <button
                onClick={() => router.push("/dashboard/create")}
                className="flex flex-col items-center justify-center gap-1.5 bg-gray-100 dark:bg-[#1A2332] hover:bg-gray-200 dark:hover:bg-[#243044] border border-gray-300 dark:border-[#1A3155] text-gray-900 dark:text-white rounded-xl py-3 text-xs font-medium transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                Create New
              </button>
              <button className="flex flex-col items-center justify-center gap-1.5 bg-gray-100 dark:bg-[#1A2332] hover:bg-gray-200 dark:hover:bg-[#243044] border border-gray-300 dark:border-[#1A3155] text-gray-900 dark:text-white rounded-xl py-3 text-xs font-medium transition-colors"
                onClick={handleEditRegenerate}
              >
                <RefreshCw className="w-4 h-4" />
                Edit & Regenerate
              </button>
              <button
                onClick={handleDownload}
                disabled={!hasVideo}
                className={`flex flex-col items-center justify-center gap-1.5 rounded-xl py-3 text-xs font-medium transition-colors ${
                  hasVideo
                    ? "bg-[#009927] hover:bg-[#007a1f] text-white"
                    : "bg-gray-100 dark:bg-[#1A2332] text-gray-500 cursor-not-allowed border border-gray-300 dark:border-[#1A3155]"
                }`}
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>
        </div>

        {/* Right: Details */}
        <div>
          <div className="bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-2xl overflow-hidden h-full">
            <div className="p-4 pb-2">
              <h2 className="text-gray-900 dark:text-white text-sm font-semibold">Details</h2>
            </div>

            <div className="px-4 pb-4">
              <div className="grid grid-cols-2 gap-3">
                {detailRows.map((row) => (
                  <div
                    key={row.label}
                    className="bg-gray-50 dark:bg-[#0B0E12] border border-gray-200 dark:border-[#1A3155]/50 rounded-xl p-3"
                  >
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <row.icon className="w-3.5 h-3.5 text-gray-500" />
                      <span className="text-gray-500 text-xs">{row.label}</span>
                    </div>
                    <p className="text-gray-900 dark:text-white text-sm font-medium truncate capitalize">
                      {row.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Keywords */}
            {video.keywords && (
              <div className="px-4 pb-3 mt-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <Tag className="w-3.5 h-3.5 text-gray-500" />
                  <span className="text-gray-500 text-xs">Keywords</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {video.keywords.split(",").map((kw) => kw.trim()).filter(Boolean).map((kw) => (
                    <span key={kw} className="bg-gray-50 dark:bg-[#0B0E12] border border-gray-200 dark:border-[#1A3155]/50 text-gray-700 dark:text-gray-300 text-xs px-2.5 py-1 rounded-full">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Negative Keywords */}
            {video.negative_keywords && (
              <div className="px-4 pb-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <Tag className="w-3.5 h-3.5 text-[#E33629]/70" />
                  <span className="text-gray-500 text-xs">Negative Keywords</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {video.negative_keywords.split(",").map((kw) => kw.trim()).filter(Boolean).map((kw) => (
                    <span key={kw} className="bg-[#E33629]/10 border border-[#E33629]/20 text-[#E33629]/80 text-xs px-2.5 py-1 rounded-full">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Script Section - Full Width */}
      <div className="bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-2xl overflow-hidden">
        <div className="p-4 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#3B82F6]" />
            <h2 className="text-gray-900 dark:text-white text-sm font-semibold">Script</h2>
          </div>
          <div className="flex items-center gap-3">
            {video.script && (
              <span className="text-gray-500 text-xs shrink-0">
                {video.script.split(/\s+/).length} words
              </span>
            )}
            {video.script && (
              <button
                onClick={handleCopyScript}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
              >
                {copied ? (
                  <><Check className="w-3.5 h-3.5 text-[#22C55E]" /><span className="text-[#22C55E]">Copied!</span></>
                ) : (
                  <><Copy className="w-3.5 h-3.5" /><span>Copy</span></>
                )}
              </button>
            )}
          </div>
        </div>

        <div className="px-4 pb-4">
          {video.script ? (
            <div className="bg-gray-50 dark:bg-[#0B0E12] border border-gray-200 dark:border-[#1A3155]/50 rounded-xl p-4 overflow-y-auto custom-scrollbar">
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed break-words w-full">
                {video.script}
              </p>
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-[#0B0E12] border border-gray-200 dark:border-[#1A3155]/50 rounded-xl p-6 text-center">
              <FileText className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No script available</p>
            </div>
          )}
        </div>
      </div>

    </motion.div>
  );
}
