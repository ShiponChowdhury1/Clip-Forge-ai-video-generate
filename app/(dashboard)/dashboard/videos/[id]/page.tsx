"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetAllVideosQuery, useGetVideoQuery } from "@/lib/redux/features/videos/videosApi";
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRef, useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useAppSelector } from "@/lib/redux/hooks";

function buildVideoUrl(path: string | null | undefined): string {
  if (!path || typeof path !== "string" || path.trim() === "") return "";
  if (path.startsWith("http")) return path;
  const match = path.match(/outputs\/.+$/);
  const relativePath = match ? `/${match[0]}` : path;
  return `/api/video-proxy?path=${encodeURIComponent(relativePath)}`;
}

export default function VideoDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const videoId = Number(params.id);
  const [selectedVideoId, setSelectedVideoId] = useState<number>(videoId);
  const token = useAppSelector((state) => state.auth.token);
  const { data: video, isLoading, refetch } = useGetVideoQuery(selectedVideoId);
  const { data: allVideos = [] } = useGetAllVideosQuery(
    { skip: 0, limit: 12 },
    { skip: !token, refetchOnMountOrArgChange: true }
  );
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const [previewAspectRatio, setPreviewAspectRatio] = useState<number | null>(null);
  const [thumbStart, setThumbStart] = useState(0);
  const [showFullScript, setShowFullScript] = useState(false);

  const thumbVideos = useMemo(
    () =>
      allVideos
        .filter((item) => Boolean(item.path) && item.status.toLowerCase() === "completed")
        .slice(0, 12),
    [allVideos]
  );

  const visibleThumbCount = 6;
  const maxThumbStart = Math.max(0, thumbVideos.length - visibleThumbCount);
  const clampedThumbStart = Math.min(thumbStart, maxThumbStart);
  const visibleThumbs = useMemo(
    () => thumbVideos.slice(clampedThumbStart, clampedThumbStart + visibleThumbCount),
    [thumbVideos, clampedThumbStart]
  );

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
        music_id: video.music_id ?? null,
        subtitle_id: video.subtitle_id ?? null,
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
  const isPortrait = normalizedFormat.includes("9:16") || normalizedFormat.includes("portrait");
  const isSquare = normalizedFormat.includes("1:1") || normalizedFormat.includes("square");
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
      <div className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-[#1F1F1F] bg-white dark:bg-[#0A0A0A] p-4 sm:p-5">
        <div className="relative flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl border border-gray-300 dark:border-[#1A3155] bg-white/70 dark:bg-[#0A0A0A]/70 hover:bg-white dark:hover:bg-[#111a2c] transition-colors mt-0.5"
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
          <div className={`bg-white dark:bg-[#0A0A0A] border border-gray-300 dark:border-[#1A3155] rounded-2xl overflow-hidden ${isPortrait ? "min-h-160" : "min-h-180"} h-full flex flex-col shadow-[0_20px_50px_-30px_rgba(37,99,235,0.55)] dark:shadow-[0_20px_60px_-35px_rgba(59,130,246,0.45)]`}>
            <div className="px-4 sm:px-5 pt-3 pb-2 border-b border-gray-200/70 dark:border-[#1A3155]/60 bg-gray-50/70 dark:bg-[#0A0A0A]/55">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                  Browse other videos
                </span>
                {thumbVideos.length > visibleThumbCount && (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setThumbStart((prev) => Math.max(0, prev - visibleThumbCount))}
                        disabled={thumbStart === 0}
                        className="w-7 h-7 rounded-lg border border-gray-300 dark:border-[#1A3155] text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:border-[#3B82F6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Previous videos"
                      >
                        <ChevronLeft className="w-4 h-4 mx-auto" />
                      </button>
                      <span
                        className={`text-xs font-medium ${
                          thumbStart === 0
                            ? "text-gray-400 dark:text-gray-500"
                            : "text-gray-600 dark:text-gray-300"
                        }`}
                      >
                        Previous
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setThumbStart((prev) => Math.min(maxThumbStart, prev + visibleThumbCount))}
                        disabled={thumbStart >= maxThumbStart}
                        className="w-7 h-7 rounded-lg border border-gray-300 dark:border-[#1A3155] text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:border-[#3B82F6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Next videos"
                      >
                        <ChevronRight className="w-4 h-4 mx-auto" />
                      </button>
                      <span
                        className={`text-xs font-medium ${
                          thumbStart >= maxThumbStart
                            ? "text-gray-400 dark:text-gray-500"
                            : "text-gray-600 dark:text-gray-300"
                        }`}
                      >
                        Next
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {visibleThumbs.length > 0 && (
                <div className="mt-3 flex gap-2 justify-center">
                  {visibleThumbs.map((item) => {
                    const isActive = item.id === video.id;
                    const thumbUrl = buildVideoUrl(item.path);
                    return (
                      <button
                        key={item.id}
                        onClick={() => setSelectedVideoId(item.id)}
                        className={`relative h-20 w-36 shrink-0 overflow-hidden rounded-lg border transition-colors ${
                          isActive
                            ? "border-[#3B82F6] ring-2 ring-[#3B82F6]/20"
                            : "border-gray-200 dark:border-[#1A3155] hover:border-[#3B82F6]/60"
                        }`}
                        title={item.title}
                      >
                        <video
                          src={thumbUrl}
                          poster={item.thumbnail_path ? buildVideoUrl(item.thumbnail_path) : undefined}
                          className="h-full w-full object-contain"
                          muted
                          loop
                          playsInline
                          preload="metadata"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

              <div className="px-4 sm:px-5 py-3 flex-1 flex items-center justify-center bg-linear-to-b from-transparent to-gray-50/60 dark:to-[#0A0A0A]/35">
              <div
                className={`relative ${isPortrait ? "max-h-140" : isSquare ? "max-h-120 max-w-120 mx-auto" : "max-h-180"} w-full bg-black rounded-2xl overflow-hidden ring-1 ring-black/10 dark:ring-white/10 shadow-[0_18px_40px_-22px_rgba(0,0,0,0.9)]`}
                style={{ aspectRatio: String(effectiveAspectRatio) }}
              >
                {hasVideo ? (
                  <>
                    <video
                      ref={videoRef}
                      src={videoUrl}
                      poster={video.thumbnail_path ? buildVideoUrl(video.thumbnail_path) : undefined}
                      className="w-full h-full object-contain"
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
            <div className="px-4 sm:px-5 pb-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
              <button
                onClick={() => router.push("/dashboard/create")}
                className="group relative overflow-hidden flex items-center justify-center gap-2.5 bg-white dark:bg-[#0A0A0A] border border-gray-300 dark:border-[#27456f] text-gray-900 dark:text-white rounded-2xl py-3.5 px-4 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_20px_-12px_rgba(59,130,246,0.55)] hover:bg-blue-50 dark:hover:bg-[#1b304e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0A0A0A]"
                aria-label="Create a new video"
              >
                <PlusCircle className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                Create New
              </button>
              <button
                className="group relative overflow-hidden flex items-center justify-center gap-2.5 bg-white dark:bg-[#0A0A0A] border border-gray-300 dark:border-[#27456f] text-gray-900 dark:text-white rounded-2xl py-3.5 px-4 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_20px_-12px_rgba(59,130,246,0.55)] hover:bg-blue-50 dark:hover:bg-[#1b304e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0A0A0A]"
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
                    : "bg-gray-100 dark:bg-[#0A0A0A] text-gray-500 cursor-not-allowed border border-gray-300 dark:border-[#1A3155]"
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
          <div className="bg-white dark:bg-[#0A0A0A] border border-gray-300 dark:border-[#1A3155] rounded-2xl overflow-hidden min-h-180 h-full shadow-[0_18px_48px_-34px_rgba(2,132,199,0.55)] dark:shadow-[0_18px_52px_-34px_rgba(59,130,246,0.35)]">
            <div className="p-4 pb-1 bg-gray-50/70 dark:bg-[#0A0A0A]/55">
              <h2 className="text-gray-900 dark:text-white text-sm font-semibold tracking-wide m-2">Generation Details</h2>
            </div>

            <div className="px-4 pb-3">
              <div className="grid grid-cols-4 gap-3">
                {detailRows.map((row) => (
                  <div
                    key={row.label}
                    className="bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-[#1A3155]/50 rounded-xl p-3"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <row.icon className="w-3.5 h-3.5 text-gray-500" />
                      </div>
                      <span className="text-gray-900 dark:text-white text-xs font-semibold truncate capitalize">
                        {row.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Keywords */}
            {video.keywords && (
              <div className="px-4 pb-2 mt-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <Tag className="w-3.5 h-3.5 text-gray-500" />
                  <span className="text-gray-500 text-xs">Keywords</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {video.keywords.split(",").map((kw) => kw.trim()).filter(Boolean).map((kw) => (
                    <span key={kw} className="bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-[#1A3155]/50 text-gray-700 dark:text-gray-300 text-xs px-2.5 py-1 rounded-full">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Negative Keywords */}
            {video.negative_keywords && (
              <div className="px-4 pb-3">
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

            {/* Script */}
            <div className="px-4 pb-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#3B82F6]" />
                  <h3 className="text-gray-900 dark:text-white text-sm font-semibold">Script</h3>
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

              {video.script ? (
                <div className=" dark:border-[#1A3155]/50 rounded-xl p-4 overflow-y-auto custom-scrollbar max-h-112">
                  {(() => {
                    const scriptWords = video.script.split(/\s+/).filter(Boolean);
                    const shouldTruncate = scriptWords.length > 270;
                    const visibleText = showFullScript
                      ? video.script
                      : scriptWords.slice(0, 270).join(" ");

                    return (
                      <>
                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed wrap-break-word w-full">
                          {visibleText}
                          {!showFullScript && shouldTruncate ? "..." : ""}
                        </p>
                        {shouldTruncate && (
                          <button
                            onClick={() => setShowFullScript((prev) => !prev)}
                            className="mt-2 text-xs font-semibold text-[#3B82F6] hover:underline"
                          >
                            {showFullScript ? "Show less" : "More"}
                          </button>
                        )}
                      </>
                    );
                  })()}
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-[#1A3155]/50 rounded-xl p-6 text-center">
                  <FileText className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No script available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </motion.div>
  );
}
