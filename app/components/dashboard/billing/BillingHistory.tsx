"use client";

import { Download, CheckCircle } from "lucide-react";

export interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: "PAID" | "PENDING" | "FAILED";
  paymentType?: string;
  transactionId?: string;
  credits?: number;
  userEmail?: string;
}

interface BillingHistoryProps {
  invoices: Invoice[];
  isLoading?: boolean;
  isError?: boolean;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export default function BillingHistory({
  invoices,
  isLoading = false,
  isError = false,
  page = 1,
  totalPages = 1,
  onPageChange,
}: BillingHistoryProps) {
  const safeTotalPages = Math.max(1, totalPages);
  const maxVisiblePages = 3;
  const tentativeStart = Math.max(1, page - 1);
  const startPage = Math.min(
    tentativeStart,
    Math.max(1, safeTotalPages - maxVisiblePages + 1)
  );
  const endPage = Math.min(safeTotalPages, startPage + maxVisiblePages - 1);
  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  const handleDownloadInvoice = async (invoice: Invoice) => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("ClipForge Invoice", 14, 20);

    doc.setFontSize(11);
    doc.text(`Invoice ID: ${invoice.id}`, 14, 34);
    doc.text(`Date: ${invoice.date}`, 14, 42);
    doc.text(`Amount: ${invoice.amount}`, 14, 50);
    doc.text(`Status: ${invoice.status}`, 14, 58);
    doc.text(`Payment Type: ${invoice.paymentType || "N/A"}`, 14, 66);
    doc.text(`Credits: ${invoice.credits ?? 0}`, 14, 74);
    doc.text(`User: ${invoice.userEmail || "N/A"}`, 14, 82);

    if (invoice.transactionId) {
      doc.text("Transaction ID:", 14, 90);
      const splitTransactionId = doc.splitTextToSize(invoice.transactionId, 180);
      doc.text(splitTransactionId, 14, 98);
    }

    doc.save(`invoice-${invoice.id}.pdf`);
  };

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
    <div className="bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-2xl p-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Billing History</h3>
      {isLoading && (
        <p className="text-sm text-gray-500 dark:text-gray-400 py-3">Loading billing history...</p>
      )}
      {isError && !isLoading && (
        <p className="text-sm text-red-500 py-3">Failed to load billing history.</p>
      )}
      {!isLoading && !isError && invoices.length === 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400 py-3">No billing history found.</p>
      )}
      <div className="space-y-3">
        {!isLoading && !isError && invoices.map((invoice, idx) => (
          <div
            key={idx}
            className="bg-gray-50 dark:bg-[#161D28] border border-gray-200 dark:border-[#2A3655] rounded-lg p-3 sm:p-4 hover:bg-gray-100 dark:hover:bg-[#1A2330] transition-colors"
          >
            {/* Top Row: ID and Date */}
            <div className="flex items-baseline justify-between gap-2 mb-2.5">
              <p className="text-gray-900 dark:text-white text-sm font-bold truncate">{invoice.id}</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs whitespace-nowrap">{invoice.date}</p>
            </div>

            {/* Middle Row: Badges and Amount (Mobile Stack, Desktop Horizontal) */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 mb-2.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-gray-600 dark:text-gray-400 text-xs capitalize px-2.5 py-1 bg-gray-200 dark:bg-[#2A3655] rounded-md whitespace-nowrap">
                  {invoice.paymentType?.replace("_", " ") || "payment"}
                </span>
                {invoice.credits !== undefined && (
                  <span className="text-xs px-2.5 py-1 bg-blue-500/10 text-blue-500 rounded-md whitespace-nowrap">
                    {invoice.credits} Credits
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
                <span className="text-gray-900 dark:text-white text-sm sm:text-base font-bold">{invoice.amount}</span>
                {getStatusBadge(invoice.status)}
                <button
                  onClick={() => handleDownloadInvoice(invoice)}
                  className="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-200 dark:bg-[#2A3655] text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-[#3A4565] hover:text-gray-900 dark:hover:text-white transition-colors shrink-0"
                  aria-label={`Download invoice ${invoice.id}`}
                  title="Download PDF"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Bottom Row: Transaction ID */}
            {invoice.transactionId && (
              <p className="text-gray-500 dark:text-gray-400 text-xs break-all">
                <span className="font-semibold">Txn:</span> <span className="font-mono text-[10px]">{invoice.transactionId}</span>
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 mt-4 border-t border-gray-200 dark:border-[#1A3155]">
        <p className="text-xs sm:text-sm text-gray-500">
          Page {page} of {safeTotalPages}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange?.(Math.max(1, page - 1))}
            disabled={page === 1 || isLoading}
            className="px-3 sm:px-4 py-2 rounded-lg bg-gray-100 dark:bg-[#1A2332] border border-gray-300 dark:border-[#1A3155] text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-[#2563EB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {pageNumbers.map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => onPageChange?.(pageNumber)}
              disabled={isLoading}
              className={`min-w-9 px-2.5 py-2 rounded-lg border text-xs sm:text-sm transition-colors ${
                pageNumber === page
                  ? "bg-cyan-500 border-cyan-500 text-white"
                  : "bg-gray-100 dark:bg-[#1A2332] border-gray-300 dark:border-[#1A3155] text-gray-700 dark:text-gray-300 hover:border-[#2563EB]"
              }`}
            >
              {pageNumber}
            </button>
          ))}
          <button
            onClick={() => onPageChange?.(Math.min(safeTotalPages, page + 1))}
            disabled={page === safeTotalPages || isLoading}
            className="px-3 sm:px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white text-xs sm:text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
