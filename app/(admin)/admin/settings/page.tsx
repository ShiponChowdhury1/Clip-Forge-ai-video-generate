"use client";

import { useState } from "react";
import {
  Settings2,
  CreditCard,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { AdminHeader } from "@/app/components/admin";
import { CreditSettings } from "@/app/components/admin/settings/CreditSettings";
import { SubscriptionPlans } from "@/app/components/admin/settings/SubscriptionPlans";
import { LegalPolicy } from "@/app/components/admin/settings/LegalPolicy";
import { AdminRoles } from "@/app/components/admin/settings/AdminRoles";

const tabs = [
  { id: "credit-settings", label: "Credit Settings", icon: Settings2 },
  { id: "plan-pricing", label: "Plan & Pricing", icon: CreditCard },
  { id: "legal-policy", label: "Legal & Policy", icon: Scale },
  { id: "admins-security", label: "Admins & Security", icon: ShieldCheck },
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("credit-settings");

  return (
    <div>
      <AdminHeader />

      <h3 className="text-white text-xl font-semibold mb-2">Settings</h3>
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
          {activeTab === "credit-settings" && <CreditSettings />}
          {activeTab === "plan-pricing" && <SubscriptionPlans />}
          {activeTab === "legal-policy" && <LegalPolicy />}
          {activeTab === "admins-security" && <AdminRoles />}
        </div>
      </div>
    </div>
  );
}
