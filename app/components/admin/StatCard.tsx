"use client";

import { type LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  change: string;
  positive?: boolean;
}

export default function StatCard({
  icon: Icon,
  label,
  value,
  change,
  positive = true,
}: StatCardProps) {
  return (
    <div className="bg-[#0D1117] border border-[#1A3155] rounded-xl p-4 sm:p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-lg bg-[#1A2332] border border-[#1A3155] flex items-center justify-center">
          <Icon className="w-5 h-5 text-cyan-400" />
        </div>
        <span
          className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
            positive
              ? "bg-[#00D492]/10 text-[#00D492]"
              : "bg-[#FF6467]/10 text-[#FF6467]"
          }`}
        >
          {positive ? (
            <ArrowUpRight className="w-3.5 h-3.5" />
          ) : (
            <ArrowDownRight className="w-3.5 h-3.5" />
          )}
          {change}
        </span>
      </div>
      <div>
        <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-xl sm:text-2xl font-bold text-white mt-1">{value}</p>
      </div>
    </div>
  );
}
