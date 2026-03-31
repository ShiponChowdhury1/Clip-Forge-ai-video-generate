"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Trash2, User, X, AlertTriangle } from "lucide-react";
import { toast } from "react-toastify";
import { AdminHeader } from "@/app/components/admin";
import { useAppSelector } from "@/lib/redux/hooks";
import { useGetAdminLogsQuery, useDeleteAdminLogMutation } from "@/lib/redux/features/admin/adminApi";

const LIMIT = 10;

export default function AdminUsageHistoryPage() {
  const token = useAppSelector((state) => state.auth.token);
  const [page, setPage] = useState(0);
  const [deleteLog] = useDeleteAdminLogMutation();
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);

  const { data: logs, isLoading, refetch } = useGetAdminLogsQuery({
    skip: page * LIMIT,
    limit: LIMIT,
  }, { skip: !token });

  const entries = logs ?? [];

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteLog(deleteTarget.id).unwrap();
      toast.success("Log deleted successfully");
      refetch();
    } catch {
      toast.error("Failed to delete log");
    }
    setDeleteTarget(null);
  };

  return (
    <div>
      <AdminHeader />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Usage History</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Real-time log of all platform transactions and credit changes
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-200 dark:border-[#1A3155]">
                <th className="text-left py-4 px-5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">User</th>
                <th className="text-left py-4 px-5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="text-left py-4 px-5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Action Type</th>
                <th className="text-left py-4 px-5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Reference ID</th>
                <th className="text-left py-4 px-5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-5"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <div className="flex justify-center">
                      <div className="w-6 h-6 border-2 border-[#1A3155] border-t-cyan-500 rounded-full animate-spin" />
                    </div>
                  </td>
                </tr>
              ) : entries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500 text-sm">No records found.</td>
                </tr>
              ) : (
                entries.map((entry) => {
                  const date = new Date(entry.date_time).toLocaleString("en-US", {
                    month: "short", day: "numeric", year: "numeric",
                    hour: "2-digit", minute: "2-digit",
                  });
                  return (
                    <tr key={entry.id} className="border-b border-gray-100 dark:border-[#1A3155]/50 hover:bg-gray-50 dark:hover:bg-[#1A2332]/40 transition-colors">
                      {/* User */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#1A2332] border border-gray-300 dark:border-[#1A3155] flex items-center justify-center text-gray-500">
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-gray-900 dark:text-white font-medium">{entry.name}</p>
                            <p className="text-gray-500 text-xs">{entry.email}</p>
                          </div>
                        </div>
                      </td>
                      {/* Date & Time */}
                      <td className="py-4 px-5">
                        <span className="text-gray-700 dark:text-gray-300 font-mono text-sm">{date}</span>
                      </td>
                      {/* Action Type */}
                      <td className="py-4 px-5">
                        <span className="text-gray-700 dark:text-gray-300">{entry.action_type}</span>
                      </td>
                      {/* Reference ID */}
                      <td className="py-4 px-5">
                        <span className="text-gray-500 dark:text-gray-400 font-mono text-sm">{entry.reference_id}</span>
                      </td>
                      {/* Status */}
                      <td className="py-4 px-5">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
                            entry.status === "success"
                              ? "text-[#00D492] border-[#00D492] bg-[#00D492]/10"
                              : "text-[#FF3C3C] border-[#FF3C3C] bg-[#FF3C3C]/10"
                          }`}
                        >
                          {entry.status}
                        </span>
                      </td>
                      {/* Delete */}
                      <td className="py-4 px-5">
                        <button
                          onClick={() => setDeleteTarget({ id: entry.id, name: entry.name })}
                          className="text-[#FF3C3C] hover:text-[#FF3C3C]/70 transition-colors"
                          title="Delete log"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-5 py-3 sm:py-4 border-t border-gray-200 dark:border-[#1A3155]">
          <p className="text-xs sm:text-sm text-gray-500">
            Showing {entries.length} records
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#1A2332] border border-gray-300 dark:border-[#1A3155] flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-lg bg-[#2563EB] text-white text-xs font-medium flex items-center justify-center">
              {page + 1}
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={entries.length < LIMIT}
              className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#1A2332] border border-gray-300 dark:border-[#1A3155] flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white dark:bg-[#111827] rounded-2xl w-full max-w-sm mx-auto shadow-2xl border border-gray-200 dark:border-[#1E293B] p-6">
            <button onClick={() => setDeleteTarget(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-[#FF3C3C]/10 border border-[#FF3C3C]/20 flex items-center justify-center mb-4">
                <AlertTriangle className="w-7 h-7 text-[#FF3C3C]" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete Log Entry</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                Are you sure you want to delete the log for <span className="text-gray-900 dark:text-white font-medium">{deleteTarget.name}</span>? This action cannot be undone.
              </p>
              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-[#1A2332] border border-gray-300 dark:border-[#1A3155] text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:border-[#2563EB] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-[#FF3C3C] hover:bg-[#FF3C3C]/80 text-sm text-white font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
