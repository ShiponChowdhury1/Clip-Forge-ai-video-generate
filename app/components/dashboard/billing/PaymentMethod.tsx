"use client";

import { CreditCard } from "lucide-react";

interface PaymentMethodProps {
  cardLast4: string;
  expiry: string;
  onUpdate: () => void;
}

export default function PaymentMethod({
  cardLast4,
  expiry,
  onUpdate,
}: PaymentMethodProps) {
  return (
    <div className="bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-2xl p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gray-100 dark:bg-[#1A2332] border border-gray-300 dark:border-[#1A3155] rounded-lg flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </div>
          <div>
            <p className="text-gray-900 dark:text-white text-sm font-medium">
              •••• •••• •••• {cardLast4}
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-xs">Expires {expiry}</p>
          </div>
        </div>
        <button
          onClick={onUpdate}
          className="text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 text-sm font-medium transition-colors"
        >
          Update
        </button>
      </div>
    </div>
  );
}
