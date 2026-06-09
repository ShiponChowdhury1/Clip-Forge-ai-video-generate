"use client";

import DashboardHeader from "@/app/components/dashboard/DashboardHeader";
import VideoCard from "@/app/components/dashboard/VideoCard";
import QueueCard from "@/app/components/dashboard/QueueCard";
import { useState, forwardRef, useMemo } from "react";
import { useGetAllVideosQuery, useGetQueueQuery } from "@/lib/redux/features/videos/videosApi";
import { useAppSelector } from "@/lib/redux/hooks";
import { Calendar, X, ChevronLeft, ChevronRight, Video } from "lucide-react";
import DatePicker from "react-datepicker";
import { format, isSameDay } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";

const VIDEOS_PER_PAGE = 12;

// Custom Input for DatePicker
const CustomDateInput = forwardRef<
  HTMLButtonElement,
  { value?: string; onClick?: () => void; onClear?: () => void }
>(({ value, onClick, onClear }, ref) => (
  <button
    ref={ref}
    onClick={onClick}
    className={`flex items-center gap-2 bg-white dark:bg-[#0D1117] border rounded-xl px-4 py-3.5 text-sm transition-all ${
      value
        ? "border-[#3B82F6] text-gray-900 dark:text-white"
        : "border-gray-300 dark:border-[#1A3155] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-[#3B82F6]"
    }`}
  >
    <Calendar className="w-5 h-5" />
    {value ? (
      <>
        <span>{value}</span>
        <span
          onClick={(e) => {
            e.stopPropagation();
            onClear?.();
          }}
          className="ml-1 p-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-[#1A3155] transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </span>
      </>
    ) : null}
  </button>
));
CustomDateInput.displayName = "CustomDateInput";

export default function AllVideosPage() {
  const token = useAppSelector((state) => state.auth.token);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { data: queue } = useGetQueueQuery(undefined, {
    pollingInterval: 5000,
    skipPollingIfUnfocused: true,
    skip: !token
  });

  const processingItems = queue?.processing ?? [];
  const queuedItems = queue?.queued ?? [];
  const hasQueueItems = processingItems.length > 0 || queuedItems.length > 0;

  const { data: videos = [], isLoading } = useGetAllVideosQuery(
    { skip: 0, limit: 100 },
    {
      refetchOnMountOrArgChange: true,
      pollingInterval: hasQueueItems ? 4000 : 60000,
      skipPollingIfUnfocused: true,
      skip: !token
    }
  );

  const filteredVideos = useMemo(() => {
    return videos.filter((video) => {
      const matchesSearch =
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.style.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.status.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDate = selectedDate
        ? isSameDay(new Date(video.created_at), selectedDate)
        : true;

      return matchesSearch && matchesDate;
    });
  }, [videos, searchQuery, selectedDate]);

  // Reset to page 1 when filters change
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    setCurrentPage(1);
  };

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredVideos.length / VIDEOS_PER_PAGE));
  const startIndex = (currentPage - 1) * VIDEOS_PER_PAGE;
  const paginatedVideos = filteredVideos.slice(startIndex, startIndex + VIDEOS_PER_PAGE);

  // Generate visible page numbers
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const totalVideos = videos.length;
  const completedCount = videos.filter((v) => v.status.toLowerCase() === "completed").length;
  const processingCount = videos.filter((v) => v.status.toLowerCase() === "processing").length + processingItems.length + queuedItems.length;
  const failedCount = videos.filter((v) => v.status.toLowerCase() === "failed").length;

  return (
    <div>
      {/* Header - Reusable */}
      <DashboardHeader
        icon={
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#3B82F6] text-white shadow-sm shadow-cyan-500/20">
            <Video className="h-6 w-6" />
          </div>
        }
        title="All Generated Video"
        description="Manage & Review Your Generated Videos"
      />

      {/* Search Bar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-full lg:w-1/2 relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <path strokeLinecap="round" d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search your generated video"
            className="w-full bg-white dark:bg-[#0A0A0A] border border-gray-300 dark:border-[#1A3155] rounded-xl pl-12 pr-4 py-3.5 text-gray-900 dark:text-white text-sm placeholder:text-gray-500 focus:border-[#3B82F6] focus:outline-none transition-colors"
          />
        </div>
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="MMM d, yyyy"
          customInput={
            <CustomDateInput
              value={selectedDate ? format(selectedDate, "MMM d, yyyy") : ""}
              onClear={() => handleDateChange(null)}
            />
          }
          popperClassName="date-picker-popper"
          calendarClassName="custom-datepicker"
          showPopperArrow={false}
          todayButton="Today"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-[#0A0A0A] border border-gray-300 dark:border-[#1A3155] rounded-xl p-5">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Total Videos</p>
          <p className="text-gray-900 dark:text-white text-3xl font-bold">{totalVideos}</p>
        </div>
        <div className="bg-white dark:bg-[#0A0A0A] border border-gray-300 dark:border-[#1A3155] rounded-xl p-5">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Completed</p>
          <p className="text-[#009927] text-3xl font-bold">{completedCount}</p>
        </div>
        <div className="bg-white dark:bg-[#0A0A0A] border border-gray-300 dark:border-[#1A3155] rounded-xl p-5">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Processing</p>
          <p className="text-[#F59E0B] text-3xl font-bold">{processingCount}</p>
        </div>
        <div className="bg-white dark:bg-[#0A0A0A] border border-gray-300 dark:border-[#1A3155] rounded-xl p-5">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Failed</p>
          <p className="text-[#E33629] text-3xl font-bold">{failedCount}</p>
        </div>
      </div>

      {/* Video Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-[#1F1F1F] rounded-xl overflow-hidden animate-pulse">
              <div className="aspect-video bg-gray-200 dark:bg-[#0A0A0A]" />
              <div className="p-5 space-y-3">
                <div className="h-5 bg-gray-200 dark:bg-[#0A0A0A] rounded w-3/4" />
                <div className="h-4 bg-gray-200 dark:bg-[#0A0A0A] rounded w-1/2" />
                <div className="h-3 bg-gray-200 dark:bg-[#0A0A0A] rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* Queue cards only on page 1 */}
          {currentPage === 1 && (
            <>
              {processingItems.map((item) => (
                <QueueCard key={item.id} item={item} type="processing" />
              ))}
              {queuedItems.map((item, idx) => (
                <QueueCard key={item.id} item={item} type="queued" position={idx + 1} />
              ))}
            </>
          )}
          {/* Paginated videos */}
          {paginatedVideos.map((video) => (
            <VideoCard key={video.id} {...video} />
          ))}
        </div>
      )}

      {filteredVideos.length === 0 && !hasQueueItems && (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No videos found</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-8 mb-4">
          {/* Info */}
          <p className="text-gray-500 text-sm">
            Showing{" "}
            <span className="text-gray-700 dark:text-gray-300 font-medium">{startIndex + 1}</span>
            {" - "}
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {Math.min(startIndex + VIDEOS_PER_PAGE, filteredVideos.length)}
            </span>
            {" of "}
            <span className="text-gray-700 dark:text-gray-300 font-medium">{filteredVideos.length}</span>
            {" videos"}
          </p>

          {/* Page Controls */}
          <div className="flex items-center gap-1.5">
            {/* Previous */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-2 bg-white dark:bg-[#0A0A0A] border border-gray-300 dark:border-[#1A3155] rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-[#3B82F6] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-300 dark:disabled:hover:border-[#1A3155] disabled:hover:text-gray-600 dark:disabled:hover:text-gray-400 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Prev</span>
            </button>

            {/* Page Numbers */}
            {getPageNumbers().map((page, idx) =>
              page === "..." ? (
                <span key={`dots-${idx}`} className="px-2 text-gray-600 text-sm">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`min-w-[36px] h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
                    currentPage === page
                            ? "bg-[#3B82F6] text-white"
                            : "bg-white dark:bg-[#0A0A0A] border border-gray-300 dark:border-[#1A3155] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-[#3B82F6]"
                  }`}
                >
                  {page}
                </button>
              )
            )}

            {/* Next */}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-2 bg-white dark:bg-[#0A0A0A] border border-gray-300 dark:border-[#1A3155] rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-[#3B82F6] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-300 dark:disabled:hover:border-[#1A3155] disabled:hover:text-gray-600 dark:disabled:hover:text-gray-400 transition-all"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
