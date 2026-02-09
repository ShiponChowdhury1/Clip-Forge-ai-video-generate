"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { type ReactNode } from "react";

interface DashboardHeaderProps {
  icon: ReactNode;
  title: string;
  description: string;
  showCreateButton?: boolean;
}

export default function DashboardHeader({
  icon,
  title,
  description,
  showCreateButton = true,
}: DashboardHeaderProps) {
  return (
    <div className="bg-[#0D1117] border border-[#1A3155] rounded-2xl p-4 sm:p-6 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          {icon}
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-white">{title}</h1>
            <p className="text-xs sm:text-sm text-gray-400">{description}</p>
          </div>
        </div>
        {showCreateButton && (
          <Link
            href="/dashboard/create"
            className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 sm:px-5 py-2.5 rounded-lg font-medium transition-colors text-sm w-full sm:w-auto justify-center"
          >
            <Plus className="w-5 h-5" />
            Create New Video
          </Link>
        )}
      </div>
    </div>
  );
}
