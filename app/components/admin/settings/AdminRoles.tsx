"use client";

import { Plus } from "lucide-react";

const admins = [
  { name: "Sarah Chen", email: "sarah@vidflow.com", role: "Super Admin", initials: "SC", color: "bg-[#2563EB]" },
  { name: "Mike Johnson", email: "mike@vidflow.com", role: "Admin", initials: "MJ", color: "bg-[#2563EB]" },
  { name: "Emma Davis", email: "emma@vidflow.com", role: "Support Agent", initials: "ED", color: "bg-[#2563EB]" },
];

export function AdminRoles() {
  return (
    <div className="bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-2xl p-4 sm:p-6 md:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <h2 className="text-gray-900 dark:text-white text-lg sm:text-xl font-bold">
          Admin Roles & Permissions
        </h2>
        <button className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white font-medium px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-sm transition-colors">
          <Plus className="w-4 h-4" />
          Add Admin
        </button>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {admins.map((admin) => (
          <div
            key={admin.email}
            className="bg-gray-50 dark:bg-[#0A0F18] border border-gray-200 dark:border-[#1A3155] rounded-xl p-3 sm:p-4 md:p-5 flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#2563EB] flex items-center justify-center text-white font-semibold text-xs sm:text-sm shrink-0">
                {admin.initials}
              </div>
              <div className="min-w-0">
                <p className="text-gray-900 dark:text-white font-semibold text-sm truncate">{admin.name}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5 truncate">
                  {admin.email} &bull;{" "}
                  <span className="text-cyan-400">{admin.role}</span>
                </p>
              </div>
            </div>
            <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full">
              Active
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
