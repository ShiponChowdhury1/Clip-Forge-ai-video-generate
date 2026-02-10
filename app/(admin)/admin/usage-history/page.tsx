"use client";

import { useState } from "react";
import { Filter, Trash2, ArrowUpRight, ArrowDownRight, User } from "lucide-react";
import { AdminHeader } from "@/app/components/admin";

interface HistoryEntry {
  id: string;
  name: string;
  email: string;
  dateTime: string;
  actionType: "Video Generation" | "Credit Purchase" | "Admin Grant" | "Plan Upgrade";
  credits: number;
  referenceId: string;
  status: "SUCCESS" | "FAILED";
}

const mockHistory: HistoryEntry[] = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex@example.com",
    dateTime: "Feb 3, 2026 14:22",
    actionType: "Video Generation",
    credits: -25,
    referenceId: "VID-09283",
    status: "SUCCESS",
  },
  {
    id: "2",
    name: "Sarah Miller",
    email: "sarah.m@design.io",
    dateTime: "Feb 3, 2026 13:45",
    actionType: "Credit Purchase",
    credits: 1000,
    referenceId: "PAY-11202",
    status: "SUCCESS",
  },
  {
    id: "3",
    name: "David Chen",
    email: "dchen@tech.com",
    dateTime: "Feb 3, 2026 12:10",
    actionType: "Admin Grant",
    credits: 50,
    referenceId: "ADM-5541",
    status: "SUCCESS",
  },
  {
    id: "4",
    name: "Emma Wilson",
    email: "emma.w@gmail.com",
    dateTime: "Feb 3, 2026 11:30",
    actionType: "Video Generation",
    credits: -25,
    referenceId: "VID-09211",
    status: "FAILED",
  },
  {
    id: "5",
    name: "Michael Brown",
    email: "mbrown@creative.co",
    dateTime: "Feb 3, 2026 10:15",
    actionType: "Video Generation",
    credits: -25,
    referenceId: "VID-09192",
    status: "SUCCESS",
  },
  {
    id: "6",
    name: "Alex Johnson",
    email: "alex@example.com",
    dateTime: "Feb 2, 2026 18:40",
    actionType: "Video Generation",
    credits: -25,
    referenceId: "VID-09155",
    status: "SUCCESS",
  },
  {
    id: "7",
    name: "Sophia Garcia",
    email: "sophia@studio.net",
    dateTime: "Feb 2, 2026 17:20",
    actionType: "Plan Upgrade",
    credits: 500,
    referenceId: "PAY-11188",
    status: "SUCCESS",
  },
];

export default function AdminUsageHistoryPage() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div>
      <AdminHeader />

      {/* Description & Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <p className="text-gray-400 text-sm">
          Real-time log of all platform transactions and credit changes
        </p>
        <button className="flex items-center gap-2 bg-[#0D1117] border border-[#1A3155] rounded-lg px-4 py-2.5 text-sm text-gray-300 hover:border-[#2563EB] transition-colors">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#0D1117] border border-[#1A3155] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead>
              <tr className="border-b border-[#1A3155]">
                <th className="text-left py-4 px-5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="text-left py-4 px-5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="text-left py-4 px-5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  Action Type
                </th>
                <th className="text-left py-4 px-5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  Credits Change
                </th>
                <th className="text-left py-4 px-5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  Reference ID
                </th>
                <th className="text-left py-4 px-5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-4 px-5"></th>
              </tr>
            </thead>
            <tbody>
              {mockHistory.map((entry) => (
                <tr
                  key={entry.id}
                  className="border-b border-[#1A3155]/50 hover:bg-[#1A2332]/40 transition-colors"
                >
                  {/* User */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#1A2332] border border-[#1A3155] flex items-center justify-center text-gray-500">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{entry.name}</p>
                        <p className="text-gray-500 text-xs">{entry.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Date & Time */}
                  <td className="py-4 px-5">
                    <span className="text-gray-300 font-mono text-sm">
                      {entry.dateTime}
                    </span>
                  </td>

                  {/* Action Type */}
                  <td className="py-4 px-5">
                    <span className="text-gray-300">{entry.actionType}</span>
                  </td>

                  {/* Credits Change */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-1.5">
                      {entry.credits > 0 ? (
                        <ArrowUpRight className="w-4 h-4 text-[#00D492]" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-[#FF6467]" />
                      )}
                      <span
                        className={`font-semibold ${
                          entry.credits > 0 ? "text-[#00D492]" : "text-[#FF6467]"
                        }`}
                      >
                        {entry.credits > 0 ? "+" : ""}
                        {entry.credits}
                      </span>
                    </div>
                  </td>

                  {/* Reference ID */}
                  <td className="py-4 px-5">
                    <span className="text-gray-400 font-mono text-sm">
                      {entry.referenceId}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-5">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
                        entry.status === "SUCCESS"
                          ? "text-[#00D492] border-[#00D492] bg-[#00D492]/10"
                          : "text-[#FF3C3C] border-[#FF3C3C] bg-[#FF3C3C]/10"
                      }`}
                    >
                      {entry.status}
                    </span>
                  </td>

                  {/* Delete */}
                  <td className="py-4 px-5">
                    <button className="text-[#FF3C3C] hover:text-[#FF3C3C]/80 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-5 py-3 sm:py-4 border-t border-[#1A3155]">
          <p className="text-xs sm:text-sm text-gray-500">
            Showing 7 of 2,481 records
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 sm:px-4 py-2 rounded-lg bg-[#1A2332] border border-[#1A3155] text-xs sm:text-sm text-gray-400 hover:text-white hover:border-[#2563EB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 sm:px-4 py-2 rounded-lg bg-cyan-500 text-xs sm:text-sm text-white font-medium hover:bg-cyan-600 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
