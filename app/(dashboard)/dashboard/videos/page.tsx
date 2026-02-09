"use client";

import Image from "next/image";
import DashboardHeader from "@/app/components/dashboard/DashboardHeader";
import VideoCard from "@/app/components/dashboard/VideoCard";
import { useState, forwardRef } from "react";
import { videoCardData } from "@/app/data";
import { Calendar, X } from "lucide-react";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";

// Custom Input for DatePicker
const CustomDateInput = forwardRef<
  HTMLButtonElement,
  { value?: string; onClick?: () => void; onClear?: () => void }
>(({ value, onClick, onClear }, ref) => (
  <button
    ref={ref}
    onClick={onClick}
    className={`flex items-center gap-2 bg-[#0D1117] border rounded-xl px-4 py-3.5 text-sm transition-all ${
      value
        ? "border-[#3B82F6] text-white"
        : "border-[#1A3155] text-gray-400 hover:text-white hover:border-[#3B82F6]"
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
          className="ml-1 p-0.5 rounded-full hover:bg-[#1A3155] transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </span>
      </>
    ) : null}
  </button>
));
CustomDateInput.displayName = "CustomDateInput";

export default function AllVideosPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const filteredVideos = videoCardData.filter((video) => {
    const matchesSearch =
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Date filtering logic (if video has a date property)
    if (selectedDate) {
      // For now, just return search matches since videoCardData may not have dates
      return matchesSearch;
    }
    
    return matchesSearch;
  });

  return (
    <div>
      {/* Header - Reusable */}
      <DashboardHeader
        icon={
          <Image
            src="/logo/video.png"
            alt="All Videos"
            width={48}
            height={48}
            className="w-12 h-12 rounded-xl object-cover"
          />
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
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your generated video"
            className="w-full bg-[#0D1117] border border-[#1A3155] rounded-xl pl-12 pr-4 py-3.5 text-white text-sm placeholder:text-gray-500 focus:border-[#3B82F6] focus:outline-none transition-colors"
          />
        </div>
        <DatePicker
          selected={selectedDate}
          onChange={(date: Date | null) => setSelectedDate(date)}
          dateFormat="MMM d, yyyy"
          customInput={
            <CustomDateInput
              value={selectedDate ? format(selectedDate, "MMM d, yyyy") : ""}
              onClear={() => setSelectedDate(null)}
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
        <div className="bg-[#0D1117] border border-[#1A3155] rounded-xl p-5">
          <p className="text-gray-400 text-sm mb-2">Total Videos</p>
          <p className="text-white text-3xl font-bold">10</p>
        </div>
        <div className="bg-[#0D1117] border border-[#1A3155] rounded-xl p-5">
          <p className="text-gray-400 text-sm mb-2">Completed</p>
          <p className="text-[#009927] text-3xl font-bold">10</p>
        </div>
        <div className="bg-[#0D1117] border border-[#1A3155] rounded-xl p-5">
          <p className="text-gray-400 text-sm mb-2">Processing</p>
          <p className="text-[#F59E0B] text-3xl font-bold">0</p>
        </div>
        <div className="bg-[#0D1117] border border-[#1A3155] rounded-xl p-5">
          <p className="text-gray-400 text-sm mb-2">Failed</p>
          <p className="text-[#E33629] text-3xl font-bold">0</p>
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {filteredVideos.map((video) => (
          <VideoCard key={video.id} {...video} />
        ))}
      </div>

      {filteredVideos.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No videos found</p>
        </div>
      )}
    </div>
  );
}
