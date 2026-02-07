"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Play,
  Pause,
  Download,
  Eye,
  Trash2,
  X,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VideoCardProps {
  id: string;
  title: string;
  category: string;
  videoUrl: string;
  createdAt: string;
}

export default function VideoCard({
  id,
  title,
  category,
  videoUrl,
  createdAt,
}: VideoCardProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const modalVideoContainerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Format time (seconds to mm:ss)
  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Auto-hide controls
  const resetControlsTimeout = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  }, [isPlaying]);

  // Handler functions (defined before useEffects that reference them)
  const handlePlayClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setShowModal(false);
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
  }, []);

  const togglePlayPause = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    resetControlsTimeout();
  }, [resetControlsTimeout]);

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(!isMuted);
  }, [isMuted]);

  const toggleFullscreen = useCallback(async () => {
    if (!modalVideoContainerRef.current) return;
    if (!document.fullscreenElement) {
      await modalVideoContainerRef.current.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  }, []);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const dur = videoRef.current.duration;
    setCurrentTime(current);
    setProgress((current / dur) * 100);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    videoRef.current.currentTime = percentage * videoRef.current.duration;
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    setShowControls(true);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = videoUrl;
    link.download = `${title}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Effects
  useEffect(() => {
    if (showModal && videoRef.current) {
      videoRef.current.play();
    }
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [showModal]);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    if (!showModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case " ":
          e.preventDefault();
          togglePlayPause();
          break;
        case "m":
          toggleMute();
          break;
        case "f":
          toggleFullscreen();
          break;
        case "Escape":
          handleCloseModal();
          break;
        case "ArrowRight":
          if (videoRef.current) videoRef.current.currentTime += 5;
          break;
        case "ArrowLeft":
          if (videoRef.current) videoRef.current.currentTime -= 5;
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showModal, togglePlayPause, toggleMute, toggleFullscreen, handleCloseModal]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#111111] border border-[#1F1F1F] rounded-2xl overflow-hidden group hover:border-[#2A2A2A] transition-all duration-300"
      >
        {/* Video Preview */}
        <div className="relative h-[230px] bg-[#0A0A0A] overflow-hidden">
          <video
            ref={previewVideoRef}
            src={videoUrl}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            preload="metadata"
            muted
          />
          {/* Play Button Overlay */}
          <div
            onClick={handlePlayClick}
            className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/50 transition-all duration-300 cursor-pointer"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg"
            >
              <Play className="w-7 h-7 text-black fill-black ml-1" />
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-white font-semibold text-lg mb-1">{title}</h3>
          <p className="text-gray-500 text-sm mb-3">{category}</p>
          <p className="text-gray-600 text-xs mb-4">{createdAt}</p>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push(`/dashboard/videos/${id}`)}
              className="flex items-center justify-center gap-2 bg-[#009927] hover:bg-[#007a1f] text-white rounded-lg text-sm font-medium transition-colors"
              style={{ width: "203px", height: "42px", padding: "12px 20px" }}
            >
              <Eye className="w-6 h-4" />
              Preview
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center justify-center gap-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg text-sm font-medium transition-colors"
              style={{ width: "203px", height: "42px", padding: "12px 20px" }}
            >
              <Download className="w-6 h-4" />
              Download
            </button>
            <button className="bg-[#1A1A1A] hover:bg-[#1A1A1A] border border-[#1F1F1F] hover:border-[#E33629] rounded-lg transition-all duration-200 flex items-center justify-center" style={{ width: '40px', height: '40px', padding: '12px' }}>
              <Trash2 className="w-6 h-6 text-[#E33629]" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Professional Video Player Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-3xl mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={handleCloseModal}
                className="absolute -top-12 right-0 z-20 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors group/close"
              >
                <X className="w-5 h-5 text-white/70 group-hover/close:text-white" />
              </button>

              {/* Video Container */}
              <div
                ref={modalVideoContainerRef}
                className="relative bg-black rounded-2xl overflow-hidden shadow-2xl shadow-black/50"
                onMouseMove={resetControlsTimeout}
                onMouseLeave={() => {
                  if (isPlaying) setShowControls(false);
                }}
              >
                {/* Video Element */}
                <div className="relative w-full aspect-9/16 max-h-[80vh] mx-auto bg-black">
                  <video
                    ref={videoRef}
                    src={videoUrl}
                    autoPlay
                    onClick={togglePlayPause}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={handleVideoEnd}
                    className="w-full h-full object-contain cursor-pointer"
                  />

                  {/* Center Play/Pause indicator (shows briefly on click) */}
                  <AnimatePresence>
                    {!isPlaying && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                      >
                        <div className="w-20 h-20 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <Play className="w-9 h-9 text-white fill-white ml-1" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Custom Controls Overlay */}
                  <motion.div
                    initial={false}
                    animate={{ opacity: showControls ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/90 via-black/40 to-transparent pt-16 pb-4 px-4"
                  >
                    {/* Progress Bar */}
                    <div
                      className="w-full h-1.5 bg-white/20 rounded-full mb-4 cursor-pointer group/progress relative"
                      onClick={handleProgressClick}
                    >
                      {/* Buffered bar */}
                      <div className="absolute inset-0 bg-white/10 rounded-full" />
                      {/* Progress */}
                      <div
                        className="h-full bg-[#3B82F6] rounded-full relative transition-all duration-100"
                        style={{ width: `${progress}%` }}
                      >
                        {/* Thumb */}
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#3B82F6] rounded-full border-2 border-white shadow-lg opacity-0 group-hover/progress:opacity-100 transition-opacity" />
                      </div>
                    </div>

                    {/* Controls Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {/* Play/Pause */}
                        <button
                          onClick={togglePlayPause}
                          className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors"
                        >
                          {isPlaying ? (
                            <Pause className="w-5 h-5 text-white fill-white" />
                          ) : (
                            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                          )}
                        </button>

                        {/* Mute/Unmute */}
                        <button
                          onClick={toggleMute}
                          className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors"
                        >
                          {isMuted ? (
                            <VolumeX className="w-5 h-5 text-white" />
                          ) : (
                            <Volume2 className="w-5 h-5 text-white" />
                          )}
                        </button>

                        {/* Time Display */}
                        <span className="text-white/80 text-sm font-mono">
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Download */}
                        <button
                          onClick={handleDownload}
                          className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors"
                          title="Download"
                        >
                          <Download className="w-5 h-5 text-white" />
                        </button>

                        {/* Fullscreen */}
                        <button
                          onClick={toggleFullscreen}
                          className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors"
                          title="Fullscreen"
                        >
                          {isFullscreen ? (
                            <Minimize className="w-5 h-5 text-white" />
                          ) : (
                            <Maximize className="w-5 h-5 text-white" />
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Video Info Bar */}
                <div className="px-5 py-4 bg-[#0A0A0A] flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-semibold text-base">
                      {title}
                    </h3>
                    <p className="text-gray-500 text-sm">{category}</p>
                  </div>
                  <span className="text-gray-600 text-xs">{createdAt}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}