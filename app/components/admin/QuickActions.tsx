"use client";

import { Coins, FileText, UserSearch } from "lucide-react";

const actions = [
  {
    icon: Coins,
    title: "Grant Credits",
    desc: "Add bonus credits to user accounts",
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
  },
  {
    icon: FileText,
    title: "Export Report",
    desc: "Generate custom usage analytics",
    color: "text-orange-400",
    bg: "bg-orange-400/10",
  },
  {
    icon: UserSearch,
    title: "Find User",
    desc: "Quick lookup by ID or Email",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
  },
];

export default function QuickActions() {
  return (
    <div className="bg-[#0D1117] border border-[#1A3155] rounded-xl p-6">
      <h3 className="text-white font-semibold text-lg mb-6">Quick Actions</h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.title}
              className="bg-[#0A0F18] border border-[#1A3155] rounded-xl p-4 text-left hover:border-[#2563EB] transition-colors group"
            >
              <div
                className={`w-10 h-10 rounded-lg ${action.bg} flex items-center justify-center mb-3`}
              >
                <Icon className={`w-5 h-5 ${action.color}`} />
              </div>
              <p className="text-sm font-medium text-white group-hover:text-cyan-400 transition-colors">
                {action.title}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{action.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
