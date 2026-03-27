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
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const [previewAspectRatio, setPreviewAspectRatio] = useState<number | null>(null);

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
        source_video_id: video.id,
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

  const hasVideo = typeof video.path === "string" && video.path.trim().length > 0 && video.status.toLowerCase() === "completed";
  const videoUrl = hasVideo ? buildVideoUrl(video.path.trim()) : "";
  const normalizedFormat = (video.format || "9:16").replace(/\s+/g, "").toLowerCase();
  const fallbackAspectRatio =
    normalizedFormat.includes("1:1") || normalizedFormat.includes("square")
      ? 1
      : normalizedFormat.includes("16:9") || normalizedFormat.includes("landscape")
        ? 16 / 9
        : normalizedFormat.includes("9:16") || normalizedFormat.includes("portrait")
          ? 9 / 16
          : 16 / 9;
  const effectiveAspectRatio = previewAspectRatio ?? fallbackAspectRatio;

  const togglePlay = async () => {
    if (!videoRef.current || !hasVideo) return;
    if (videoRef.current.paused) {
      try {
        await videoRef.current.play();
        setPlaybackError(null);
        setIsPlaying(true);
      } catch {
        setPlaybackError("This video source is unsupported or unavailable.");
        setIsPlaying(false);
      }
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
      className="w-full space-y-6"
    >
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-300 dark:border-[#1A3155] bg-linear-to-br from-white via-gray-50 to-blue-50/70 dark:from-[#0D1117] dark:via-[#0B1220] dark:to-[#0A1A2E] p-4 sm:p-5">
        <div className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.22),_transparent_45%)]" />
        <div className="relative flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl border border-gray-300 dark:border-[#1A3155] bg-white/70 dark:bg-[#0D1117]/70 hover:bg-white dark:hover:bg-[#111a2c] transition-colors mt-0.5"
            >
              <ArrowLeft className="w-5 h-5 text-gray-900 dark:text-white" />
            </button>
            <div className="min-w-0">
              <h1 className="text-gray-900 dark:text-white text-lg sm:text-2xl font-bold leading-snug truncate">{video.title}</h1>
              <div className="flex items-center gap-2 mt-1.5">
                <Clock className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                <span className="text-gray-500 text-xs sm:text-sm">{createdDate}</span>
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
      </div>

      {/* Main Content - 60/40 Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[60%_1fr] gap-6">
        {/* Left: Video Player */}
        <div>
          <div className="bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-2xl overflow-hidden h-full flex flex-col shadow-[0_20px_50px_-30px_rgba(37,99,235,0.55)] dark:shadow-[0_20px_60px_-35px_rgba(59,130,246,0.45)]">
            <div className="px-4 sm:px-5 pt-4 pb-2 border-b border-gray-200/70 dark:border-[#1A3155]/60 bg-gray-50/70 dark:bg-[#0B1320]/55">
              <h2 className="text-gray-900 dark:text-white text-sm font-semibold tracking-wide">Video Preview</h2>
              <p className="text-[11px] text-gray-500 mt-0.5">Tap to play, inspect output quality, then download</p>
            </div>

            <div className="px-4 sm:px-5 py-4 flex-1 flex items-center justify-center bg-linear-to-b from-transparent to-gray-50/60 dark:to-[#091121]/35">
              <div
                className="relative max-h-[470px] w-full bg-black rounded-2xl overflow-hidden ring-1 ring-black/10 dark:ring-white/10 shadow-[0_18px_40px_-22px_rgba(0,0,0,0.9)]"
                style={{ aspectRatio: String(effectiveAspectRatio) }}
              >
                {hasVideo ? (
                  <>
                    <video
                      ref={videoRef}
                      src={videoUrl}
                      className="w-full h-full object-cover"
                      preload="metadata"
                      controls={isPlaying}
                      onClick={togglePlay}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      onLoadedMetadata={(e) => {
                        const target = e.currentTarget;
                        if (target.videoWidth > 0 && target.videoHeight > 0) {
                          setPreviewAspectRatio(target.videoWidth / target.videoHeight);
                        }
                      }}
                      onLoadedData={() => setPlaybackError(null)}
                      onError={() => {
                        setPlaybackError("This video source is unsupported or unavailable.");
                        setIsPlaying(false);
                      }}
                    />

                    {!isPlaying && !playbackError && (
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

                    {playbackError && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/70 px-4 text-center">
                        <p className="text-white text-xs">{playbackError}</p>
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
            <div className="px-4 sm:px-5 pb-5 grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
              <button
                onClick={() => router.push("/dashboard/create")}
                className="group relative overflow-hidden flex items-center justify-center gap-2.5 bg-white dark:bg-[#142238] border border-gray-300 dark:border-[#27456f] text-gray-900 dark:text-white rounded-2xl py-3.5 px-4 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_20px_-12px_rgba(59,130,246,0.55)] hover:bg-blue-50 dark:hover:bg-[#1b304e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0D1117]"
                aria-label="Create a new video"
              >
                <PlusCircle className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                Create New
              </button>
              <button
                className="group relative overflow-hidden flex items-center justify-center gap-2.5 bg-white dark:bg-[#142238] border border-gray-300 dark:border-[#27456f] text-gray-900 dark:text-white rounded-2xl py-3.5 px-4 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_20px_-12px_rgba(59,130,246,0.55)] hover:bg-blue-50 dark:hover:bg-[#1b304e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0D1117]"
                onClick={handleEditRegenerate}
                aria-label="Edit current video and regenerate"
              >
                <RefreshCw className="w-4 h-4 transition-transform duration-200 group-hover:rotate-90" />
                Edit & Regenerate
              </button>
              <button
                onClick={handleDownload}
                disabled={!hasVideo}
                className={`group relative overflow-hidden flex items-center justify-center gap-2.5 rounded-2xl py-3.5 px-4 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0D1117] ${
                  hasVideo
                    ? "bg-linear-to-r from-[#00A63E] to-[#009927] hover:from-[#00B144] hover:to-[#008a22] text-white hover:-translate-y-0.5 hover:shadow-[0_12px_22px_-12px_rgba(0,166,62,0.65)]"
                    : "bg-gray-100 dark:bg-[#1A2332] text-gray-500 cursor-not-allowed border border-gray-300 dark:border-[#1A3155]"
                }`}
                aria-label="Download video"
              >
                <Download className="w-4 h-4 transition-transform duration-200 group-hover:-translate-y-0.5" />
                Download
              </button>
            </div>
          </div>
        </div>

        {/* Right: Details */}
        <div>
          <div className="bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-2xl overflow-hidden h-full shadow-[0_18px_48px_-34px_rgba(2,132,199,0.55)] dark:shadow-[0_18px_52px_-34px_rgba(59,130,246,0.35)]">
            <div className="p-4 pb-2 border-b border-gray-200/70 dark:border-[#1A3155]/60 bg-gray-50/70 dark:bg-[#0B1320]/55">
              <h2 className="text-gray-900 dark:text-white text-sm font-semibold tracking-wide">Generation Details</h2>
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
