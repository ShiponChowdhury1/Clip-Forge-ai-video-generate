"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Play,
  Download,
  Trash2,
  Eye,
  Volume2,
  VolumeX,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDeleteVideoMutation } from "@/lib/redux/features/videos/videosApi";
import { useMute } from "./MuteContext";

interface VideoCardProps {
  id: number;
  title: string;
  style: string;
  path: string;
  thumbnail_path?: string | null;
  created_at: string;
  status?: string;
}

function buildVideoUrl(path: string | null | undefined): string {
  if (!path || typeof path !== "string" || path.trim() === "") return "";
  if (path.startsWith("http")) return path;
  // Extract relative path starting from "outputs/" (handles absolute server filesystem paths)
  const match = path.match(/outputs\/.+$/);
  const relativePath = match ? `/${match[0]}` : path;
  // Use Next.js proxy to avoid cross-origin cache issues
  return `/api/video-proxy?path=${encodeURIComponent(relativePath)}`;
}

function parseBackendDate(dateStr: string): Date {
  const normalized = dateStr.trim().replace(" ", "T");
  const hasTimezone = /[zZ]$|[+-]\d{2}:?\d{2}$/.test(normalized);
  const safeIso = hasTimezone ? normalized : `${normalized}Z`;
  return new Date(safeIso);
}

function formatRelativeDate(dateStr: string, nowMs: number) {
  const date = parseBackendDate(dateStr);
  const diffMs = nowMs - date.getTime();

  if (!Number.isFinite(diffMs) || diffMs < 0) {
    return "Just now";
  }

  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}min ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}hr ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 30) return `${diffDay}d ago`;
  return date.toLocaleDateString();
}

export default function VideoCard({
  id,
  title,
  style,
  path,
  thumbnail_path,
  created_at,
}: VideoCardProps) {
  const router = useRouter();
  const hasVideo = typeof path === "string" && path.trim().length > 0;
  const videoUrl = hasVideo ? buildVideoUrl(path) : "";
  const category = style;
  const [nowMs, setNowMs] = useState(() => Date.now());
  const createdAt = formatRelativeDate(created_at, nowMs);
  const { isMuted, toggleMute } = useMute();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const [deleteVideo, { isLoading: isDeleting }] = useDeleteVideoMutation();

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNowMs(Date.now());
    }, 60000);

    return () => window.clearInterval(timer);
  }, []);

  const handleDelete = async () => {
    try {
      await deleteVideo(id).unwrap();
      setShowDeleteConfirm(false);
    } catch (error: unknown) {
      const err = error as { status?: number; data?: { detail?: string } };
      if (err.status === 404) {
        alert("Video not found. It may have already been deleted.");
        setShowDeleteConfirm(false);
      } else {
        alert(err.data?.detail || "Failed to delete video. Please try again.");
      }
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoUrl) return;
    const link = document.createElement("a");
    link.href = videoUrl;
    link.download = `${title}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCardClick = () => {
    router.push(`/dashboard/videos/${id}`);
  };

  const formatDuration = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = Math.floor(sec % 60);
    if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const handleSoundToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleMute();
    if (previewVideoRef.current) previewVideoRef.current.muted = !isMuted;
  };

  useEffect(() => {
    if (isHovered && videoLoaded && previewVideoRef.current) {
      previewVideoRef.current.muted = isMuted;
      previewVideoRef.current.play().catch(() => {});
    }
  }, [isHovered, videoLoaded, isMuted]);

  // Play preview on hover — lazy load video src
  const handleMouseEnter = () => {
    setIsHovered(true);
    if (!videoLoaded) {
      setVideoLoaded(true);
    } else if (previewVideoRef.current) {
      previewVideoRef.current.currentTime = 0;
      previewVideoRef.current.muted = isMuted;
      previewVideoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (previewVideoRef.current) {
      previewVideoRef.current.pause();
      previewVideoRef.current.currentTime = 0;
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        onClick={handleCardClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-[#1F1F1F] rounded-xl overflow-hidden group hover:border-gray-300 dark:hover:border-[#2A2A2A] transition-all duration-300 cursor-pointer hover:shadow-lg dark:hover:shadow-black/30"
      >
        {/* Video Preview */}
        <div className="relative aspect-video bg-gray-100 dark:bg-[#0A0A0A] overflow-hidden">
          <video
            ref={previewVideoRef}
            src={videoLoaded && videoUrl ? videoUrl : undefined}
            poster={thumbnail_path ? buildVideoUrl(thumbnail_path) : undefined}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            preload="none"
            muted
            loop
            playsInline
            onTimeUpdate={(e) => {
              const video = e.currentTarget;
              if (video.currentTime >= 10) {
                video.currentTime = 0;
                video.play().catch(() => {});
              }
            }}
            onLoadedMetadata={(e) => {
              const d = (e.target as HTMLVideoElement).duration;
              if (d && isFinite(d)) setDuration(d);
            }}
          />
          {/* Play Button Overlay — hides on hover when preview plays */}
          <AnimatePresence>
            {!isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0 flex items-center justify-center bg-black/10"
              >
                <div className="w-12 h-12 bg-white/10 backdrop-blur-[2px] border border-white/30 rounded-full flex items-center justify-center">
                  <Play className="w-5 h-5 text-white/90 fill-white/90 ml-0.5" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sound Toggle - top right (YouTube style) */}
          {isHovered && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleSoundToggle}
              className="absolute top-3 right-3 w-9 h-9 bg-black/70 hover:bg-black/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors z-10"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-white" />
              ) : (
                <Volume2 className="w-4 h-4 text-white" />
              )}
            </motion.button>
          )}

          {/* Duration badge - bottom right (YouTube style) */}
          {duration !== null && (
            <div className="absolute bottom-3 right-3 bg-black/80 text-white text-[11px] font-medium px-1.5 py-0.5 rounded">
              {formatDuration(duration)}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-gray-900 dark:text-white font-semibold text-[15px] mb-1 line-clamp-1">{title}</h3>
          <p className="text-gray-500 dark:text-gray-400 text-xs mb-3">{category} · {createdAt}</p>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); router.push(`/dashboard/videos/${id}`); }}
              className="flex items-center justify-center gap-1.5 flex-1 h-9 bg-[#009927] hover:bg-[#007a1f] text-white rounded-lg text-[13px] font-medium transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              Preview
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center justify-center gap-1.5 flex-1 h-9 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg text-[13px] font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(true); }}
              className="flex items-center justify-center w-9 h-9 bg-gray-100 dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#1F1F1F] hover:border-red-400 dark:hover:border-[#E33629] rounded-lg transition-all duration-200 shrink-0"
            >
              <Trash2 className="w-4 h-4 text-[#E33629]" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-2xl p-6 w-full max-w-sm mx-4"
            >
              <h3 className="text-gray-900 dark:text-white text-lg font-bold mb-2">Delete Video</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                Are you sure you want to delete <span className="text-gray-900 dark:text-white font-medium">&quot;{title}&quot;</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-[#1A3155] text-gray-700 dark:text-gray-300 text-sm font-medium hover:border-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 rounded-xl bg-[#E33629] hover:bg-[#c42d22] disabled:opacity-50 text-white text-sm font-medium transition-colors"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}