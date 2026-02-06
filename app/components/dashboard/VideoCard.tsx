"use client";

import Image from "next/image";
import { Play, Download, Eye, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

interface VideoCardProps {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  createdAt: string;
}

export default function VideoCard({
  id,
  title,
  category,
  thumbnail,
  createdAt,
}: VideoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#111111] border border-[#1F1F1F] rounded-2xl overflow-hidden group hover:border-[#2A2A2A] transition-all duration-300"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-[#0A0A0A] overflow-hidden">
        <Image
          src={thumbnail}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/50 transition-all duration-300">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center cursor-pointer shadow-lg"
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
          <button className="flex items-center justify-center gap-2 bg-[#009927] hover:bg-[#007a1f] text-white rounded-lg text-sm font-medium transition-colors" style={{ width: '203px', height: '42px', padding: '12px 20px' }}>
            <Eye className="w-6 h-4" />
            Preview
          </button>
          <button className="flex items-center justify-center gap-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg text-sm font-medium transition-colors" style={{ width: '203px', height: '42px', padding: '12px 20px' }}>
            <Download className="w-6 h-4" />
            Download
          </button>
          <button className="bg-[#1A1A1A] hover:bg-[#1A1A1A] border border-[#1F1F1F] hover:border-[#E33629] rounded-lg transition-all duration-200 flex items-center justify-center" style={{ width: '40px', height: '40px', padding: '12px' }}>
            <Trash2 className="w-6 h-6 text-[#E33629]" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
