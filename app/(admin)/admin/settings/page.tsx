"use client";

import { useState } from "react";
import {
  Save,
  Settings2,
  CreditCard,
  Gauge,
  Wallet,
  Scale,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import { AdminHeader } from "@/app/components/admin";

// Toggle Component
function Toggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-12 h-6 rounded-full transition-colors ${
        enabled ? "bg-cyan-500" : "bg-[#1A3155]"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
          enabled ? "translate-x-6" : "translate-x-0"
        }`}
      />
    </button>
  );
}

// Sidebar Tabs
const tabs = [
  { id: "credit-settings", label: "Credit Settings", icon: Settings2 },
  { id: "plan-pricing", label: "Plan & Pricing", icon: CreditCard },
  { id: "usage-limits", label: "Usage Limits", icon: Gauge },
  { id: "payment-rules", label: "Payment Rules", icon: Wallet },
  { id: "legal-policy", label: "Legal & Policy", icon: Scale },
  { id: "admins-security", label: "Admins & Security", icon: ShieldCheck },
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("credit-settings");
  const [creditCostPerVideo, setCreditCostPerVideo] = useState("25");
  const [addOnCreditCost, setAddOnCreditCost] = useState("4.99");
  const [creditExpiry, setCreditExpiry] = useState("Never");
  const [allowNegativeBalance, setAllowNegativeBalance] = useState(false);

  return (
    <div>
      <AdminHeader />

      {/* Description */}
      <p className="text-gray-400 text-sm mb-6">
        Configure platform-wide rules, pricing, and system parameters
      </p>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Sidebar Navigation */}
        <div className="w-full lg:w-64 shrink-0">
          <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-[#3B82F6] text-white"
                      : "text-gray-400 hover:text-white hover:bg-[#1A2332]"
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Content */}
        <div className="flex-1">
          {activeTab === "credit-settings" && (
            <div className="bg-[#0D1117] border border-[#1A3155] rounded-2xl p-6 sm:p-8">
              <h2 className="text-white text-xl font-bold mb-8">
                Credit Consumption Rules
              </h2>

              {/* Credit Cost Per Video & Add-On Credit Cost */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                    Credit Cost Per Video
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={creditCostPerVideo}
                      onChange={(e) => setCreditCostPerVideo(e.target.value)}
                      className="w-full bg-[#0A0F18] border border-[#1A3155] rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-[#3B82F6] transition-colors pr-20"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                      CREDITS
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs mt-2">
                    Number of credits deducted for standard generation
                  </p>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                    Add-On Credit Cost
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                      $
                    </span>
                    <input
                      type="text"
                      value={addOnCreditCost}
                      onChange={(e) => setAddOnCreditCost(e.target.value)}
                      className="w-full bg-[#0A0F18] border border-[#1A3155] rounded-xl pl-8 pr-4 py-3.5 text-white text-sm focus:outline-none focus:border-[#3B82F6] transition-colors"
                    />
                  </div>
                  <p className="text-gray-500 text-xs mt-2">
                    Base price for 100 extra credits
                  </p>
                </div>
              </div>

              {/* Credit Expiry Rules & Allow Negative Balance */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                    Credit Expiry Rules
                  </label>
                  <div className="relative">
                    <select
                      value={creditExpiry}
                      onChange={(e) => setCreditExpiry(e.target.value)}
                      className="w-full bg-[#0A0F18] border border-[#1A3155] rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-[#3B82F6] transition-colors appearance-none cursor-pointer"
                    >
                      <option value="Never">Never</option>
                      <option value="30 Days">30 Days</option>
                      <option value="60 Days">60 Days</option>
                      <option value="90 Days">90 Days</option>
                      <option value="1 Year">1 Year</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>
                  <p className="text-gray-500 text-xs mt-2">
                    When do purchased credits expire?
                  </p>
                </div>

                <div className="bg-[#0A0F18] border border-[#1A3155] rounded-xl p-5 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                      Allow Negative Balance
                    </p>
                    <p className="text-gray-500 text-xs">
                      Enable overdraft for enterprise customers
                    </p>
                  </div>
                  <Toggle
                    enabled={allowNegativeBalance}
                    onChange={setAllowNegativeBalance}
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button className="flex items-center gap-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium px-6 py-3 rounded-full text-sm transition-colors">
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === "plan-pricing" && (
            <div className="bg-[#0D1117] border border-[#1A3155] rounded-2xl p-6 sm:p-8">
              <h2 className="text-white text-xl font-bold mb-4">Plan & Pricing</h2>
              <p className="text-gray-500 text-sm">
                Configure subscription plans and pricing tiers. Coming soon...
              </p>
            </div>
          )}

          {activeTab === "usage-limits" && (
            <div className="bg-[#0D1117] border border-[#1A3155] rounded-2xl p-6 sm:p-8">
              <h2 className="text-white text-xl font-bold mb-4">Usage Limits</h2>
              <p className="text-gray-500 text-sm">
                Set rate limits and usage caps per plan. Coming soon...
              </p>
            </div>
          )}

          {activeTab === "payment-rules" && (
            <div className="bg-[#0D1117] border border-[#1A3155] rounded-2xl p-6 sm:p-8">
              <h2 className="text-white text-xl font-bold mb-4">Payment Rules</h2>
              <p className="text-gray-500 text-sm">
                Configure payment gateways and billing rules. Coming soon...
              </p>
            </div>
          )}

          {activeTab === "legal-policy" && (
            <div className="bg-[#0D1117] border border-[#1A3155] rounded-2xl p-6 sm:p-8">
              <h2 className="text-white text-xl font-bold mb-4">Legal & Policy</h2>
              <p className="text-gray-500 text-sm">
                Manage terms of service and privacy policies. Coming soon...
              </p>
            </div>
          )}

          {activeTab === "admins-security" && (
            <div className="bg-[#0D1117] border border-[#1A3155] rounded-2xl p-6 sm:p-8">
              <h2 className="text-white text-xl font-bold mb-4">Admins & Security</h2>
              <p className="text-gray-500 text-sm">
                Manage admin accounts and security settings. Coming soon...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
