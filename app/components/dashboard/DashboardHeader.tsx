"use client";

import { Film, Plus } from "lucide-react";
import Link from "next/link";

export default function DashboardHeader() {
  return (
    <div className="bg-[#111111] border border-[#1F1F1F] rounded-2xl p-6 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Film className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Clipforge</h1>
            <p className="text-sm text-gray-400">
              Transform scripts into AI-generated videos
            </p>
          </div>
        </div>
        <Link
          href="/dashboard/create"
          className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-2.5 rounded-lg font-medium transition-colors text-sm"
        >
          <Plus className="w-5 h-5" />
          Create New Video
        </Link>
      </div>
    </div>
  );
}
