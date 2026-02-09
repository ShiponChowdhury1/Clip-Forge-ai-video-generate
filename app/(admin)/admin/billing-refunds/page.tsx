"use client";

import { useState } from "react";
import { Search, Filter, Download, ChevronLeft, ChevronRight, CheckCircle, XCircle, Clock } from "lucide-react";
import { AdminHeader } from "@/app/components/admin";

const mockTransactions = [
  { id: "TXN-001", user: "Alice Johnson", type: "Purchase", amount: "$10.00", credits: 3000, status: "Completed", date: "2026-02-09" },
  { id: "TXN-002", user: "Dan Wilson", type: "Purchase", amount: "$25.00", credits: 10000, status: "Completed", date: "2026-02-09" },
  { id: "TXN-003", user: "Carol Davis", type: "Refund", amount: "-$10.00", credits: -3000, status: "Processed", date: "2026-02-08" },
  { id: "TXN-004", user: "Bob Smith", type: "Purchase", amount: "$10.00", credits: 3000, status: "Completed", date: "2026-02-08" },
  { id: "TXN-005", user: "Eve Martinez", type: "Purchase", amount: "$25.00", credits: 10000, status: "Pending", date: "2026-02-07" },
  { id: "TXN-006", user: "Frank Lee", type: "Refund", amount: "-$25.00", credits: -10000, status: "Processed", date: "2026-02-06" },
  { id: "TXN-007", user: "Grace Chen", type: "Purchase", amount: "$10.00", credits: 3000, status: "Completed", date: "2026-02-06" },
  { id: "TXN-008", user: "Henry Patel", type: "Purchase", amount: "$25.00", credits: 10000, status: "Completed", date: "2026-02-05" },
];

const statusConfig: Record<string, { icon: typeof CheckCircle; color: string }> = {
  Completed: { icon: CheckCircle, color: "text-green-400 bg-green-400/10" },
  Processed: { icon: CheckCircle, color: "text-blue-400 bg-blue-400/10" },
  Pending: { icon: Clock, color: "text-yellow-400 bg-yellow-400/10" },
  Failed: { icon: XCircle, color: "text-red-400 bg-red-400/10" },
};

export default function AdminBillingRefundsPage() {
  const [search, setSearch] = useState("");
  const filtered = mockTransactions.filter(
    (t) =>
      t.user.toLowerCase().includes(search.toLowerCase()) ||
      t.type.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <AdminHeader />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Billing / Refunds</h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage transactions, payments and refund requests
          </p>
        </div>
        <button className="flex items-center gap-2 bg-[#0D1117] border border-[#1A3155] rounded-lg px-4 py-2.5 text-sm text-gray-300 hover:border-[#2563EB] transition-colors">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#0D1117] border border-[#1A3155] rounded-xl p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Total Revenue</p>
          <p className="text-2xl font-bold text-white mt-1">$42,850</p>
        </div>
        <div className="bg-[#0D1117] border border-[#1A3155] rounded-xl p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Refunds Issued</p>
          <p className="text-2xl font-bold text-white mt-1">$350</p>
        </div>
        <div className="bg-[#0D1117] border border-[#1A3155] rounded-xl p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Net Revenue</p>
          <p className="text-2xl font-bold text-white mt-1">$42,500</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transactions..."
            className="w-full bg-[#0D1117] border border-[#1A3155] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#2563EB] transition-colors"
          />
        </div>
        <button className="flex items-center gap-2 bg-[#0D1117] border border-[#1A3155] rounded-lg px-4 py-2.5 text-sm text-gray-300 hover:border-[#2563EB] transition-colors">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#0D1117] border border-[#1A3155] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="border-b border-[#1A3155]">
              <th className="text-left py-3 px-4 text-gray-500 font-medium">ID</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">User</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Type</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Amount</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Credits</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Status</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((txn) => {
              const cfg = statusConfig[txn.status] ?? statusConfig.Pending;
              const StatusIcon = cfg.icon;
              return (
                <tr
                  key={txn.id}
                  className="border-b border-[#1A3155]/50 hover:bg-[#1A2332]/40 transition-colors"
                >
                  <td className="py-3 px-4 text-gray-400 font-mono text-xs">{txn.id}</td>
                  <td className="py-3 px-4 text-white">{txn.user}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-xs font-medium ${
                        txn.type === "Refund" ? "text-red-400" : "text-green-400"
                      }`}
                    >
                      {txn.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-300">{txn.amount}</td>
                  <td className="py-3 px-4 text-gray-300">
                    {txn.credits > 0 ? "+" : ""}
                    {txn.credits.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${cfg.color}`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {txn.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-500 text-xs">{txn.date}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t border-[#1A3155]">
          <p className="text-xs text-gray-500">
            Showing {filtered.length} of {mockTransactions.length} transactions
          </p>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 rounded-lg bg-[#1A2332] border border-[#1A3155] flex items-center justify-center text-gray-400 hover:text-white transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-lg bg-[#2563EB] text-white text-xs font-medium flex items-center justify-center">
              1
            </button>
            <button className="w-8 h-8 rounded-lg bg-[#1A2332] border border-[#1A3155] flex items-center justify-center text-gray-400 hover:text-white transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
