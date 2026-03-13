"use client";

import { useEffect, useRef, useState } from "react";
import {
  Coins,
  BadgeDollarSign,
  FileText,
  MessageCircleQuestion,
  ShieldCheck,
} from "lucide-react";
import { AdminHeader } from "@/app/components/admin";
import { CreditSettings } from "@/app/components/admin/settings/CreditSettings";
import { SubscriptionPlans } from "@/app/components/admin/settings/SubscriptionPlans";
import { LegalPolicy } from "@/app/components/admin/settings/LegalPolicy";
import { AdminRoles } from "@/app/components/admin/settings/AdminRoles";
import { FAQQuestions } from "@/app/components/admin/settings";

const tabs = [
  { id: "credit-settings", label: "Credit Settings", icon: Coins },
  { id: "plan-pricing", label: "Plan & Pricing", icon: BadgeDollarSign },
  { id: "legal-policy", label: "Legal & Policy", icon: FileText },
  { id: "frequently-asked-questions", label: "FAQ Questions", icon: MessageCircleQuestion },
  { id: "admins-security", label: "Admins & Security", icon: ShieldCheck },
];

const ACTIVE_TAB_STORAGE_KEY = "admin-settings-active-tab";
const validTabIds = new Set(tabs.map((tab) => tab.id));

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window === "undefined") return "credit-settings";
    const savedTab = localStorage.getItem(ACTIVE_TAB_STORAGE_KEY);
    return savedTab && validTabIds.has(savedTab) ? savedTab : "credit-settings";
  });
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [tabsTopOffset, setTabsTopOffset] = useState(96);

  useEffect(() => {
    localStorage.setItem(ACTIVE_TAB_STORAGE_KEY, activeTab);
  }, [activeTab]);

  useEffect(() => {
    const headerEl = headerRef.current;
    if (!headerEl) return;

    const updateOffset = () => {
      const headerHeight = headerEl.getBoundingClientRect().height;
      setTabsTopOffset(Math.round(headerHeight + 16));
    };

    updateOffset();
    const observer = new ResizeObserver(updateOffset);
    observer.observe(headerEl);
    window.addEventListener("resize", updateOffset);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateOffset);
    };
  }, []);

  return (
    <div>
      <div
        ref={headerRef}
        className={`${
          activeTab === "admins-security" ? "relative z-70" : "sticky top-0 z-70"
        } bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur [&>header]:mb-0`}
      >
        <AdminHeader />
      </div>


      <div className="mt-6 flex flex-col lg:flex-row gap-6">
        {/* Left Sidebar Navigation */}
        <div
          className="w-full lg:w-64 shrink-0 sticky z-40 self-start"
          style={{ top: `${tabsTopOffset}px` }}
        >
          <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 bg-white/95 dark:bg-[#0A0A0A]/95 rounded-xl">
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
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#1A2332]"
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
          {activeTab === "frequently-asked-questions" && <FAQQuestions />}
          {activeTab === "admins-security" && <AdminRoles />}
        </div>
      </div>
    </div>
  );
}
