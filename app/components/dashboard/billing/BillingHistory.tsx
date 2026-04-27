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
}

export default function BillingHistory({ invoices, isLoading = false, isError = false }: BillingHistoryProps) {
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
      <div className="space-y-0 divide-y divide-gray-200 dark:divide-[#1A2332]">
        {!isLoading && !isError && invoices.map((invoice, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
          >
            <div>
              <p className="text-gray-900 dark:text-white text-sm font-semibold">{invoice.id}</p>
              <p className="text-gray-500 text-xs">{invoice.date}</p>
              <p className="text-gray-500 text-xs capitalize mt-0.5">
                {invoice.paymentType?.replace("_", " ") || "payment"}
              </p>
              {invoice.transactionId && (
                <p className="text-gray-400 text-[11px] mt-0.5 break-all">Txn: {invoice.transactionId}</p>
              )}
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-900 dark:text-white text-sm font-medium">
                {invoice.amount}
              </span>
              {getStatusBadge(invoice.status)}
              <button
                onClick={() => handleDownloadInvoice(invoice)}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                aria-label={`Download invoice ${invoice.id}`}
                title="Download PDF"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
