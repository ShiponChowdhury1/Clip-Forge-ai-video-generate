"use client";

import { Download, CheckCircle } from "lucide-react";

export interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: "PAID" | "PENDING" | "FAILED";
}

interface BillingHistoryProps {
  invoices: Invoice[];
}

export default function BillingHistory({ invoices }: BillingHistoryProps) {
  const getStatusBadge = (status: Invoice["status"]) => {
    switch (status) {
      case "PAID":
        return (
          <span className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full">
            <CheckCircle className="w-3 h-3" />
            PAID
          </span>
        );
      case "PENDING":
        return (
          <span className="flex items-center gap-1 bg-yellow-500/10 text-yellow-400 text-xs font-semibold px-3 py-1 rounded-full">
            PENDING
          </span>
        );
      case "FAILED":
        return (
          <span className="flex items-center gap-1 bg-red-500/10 text-red-400 text-xs font-semibold px-3 py-1 rounded-full">
            FAILED
          </span>
        );
    }
  };

  return (
    <div className="bg-[#0D1117] border border-[#1A3155] rounded-2xl p-6">
      <h3 className="text-lg font-bold text-white mb-4">Billing History</h3>
      <div className="space-y-0 divide-y divide-[#1A2332]">
        {invoices.map((invoice, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
          >
            <div>
              <p className="text-white text-sm font-semibold">{invoice.id}</p>
              <p className="text-gray-500 text-xs">{invoice.date}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-white text-sm font-medium">
                +{invoice.amount}
              </span>
              {getStatusBadge(invoice.status)}
              <button className="text-gray-400 hover:text-white transition-colors">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
