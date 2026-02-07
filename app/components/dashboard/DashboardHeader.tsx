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
    <div className="bg-[#0D1117] border border-[#1A3155] rounded-2xl p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {icon}
          <div>
            <h1 className="text-xl font-bold text-white">{title}</h1>
            <p className="text-sm text-gray-400">{description}</p>
          </div>
        </div>
        {showCreateButton && (
          <Link
            href="/dashboard/create"
            className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-2.5 rounded-lg font-medium transition-colors text-sm"
          >
            <Plus className="w-5 h-5" />
            Create New Video
          </Link>
        )}
      </div>
    </div>
  );
}
