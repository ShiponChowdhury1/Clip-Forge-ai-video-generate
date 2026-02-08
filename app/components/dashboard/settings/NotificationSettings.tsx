"use client";

import { useState } from "react";
import { Bell } from "lucide-react";

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

const defaultNotifications: NotificationItem[] = [
  {
    id: "email",
    title: "Email Notifications",
    description: "Receive updates and alerts via email",
    enabled: true,
  },
  {
    id: "credits",
    title: "Credit Low Balance Alerts",
    description: "Get notified when your credits are running low",
    enabled: true,
  },
  {
    id: "payments",
    title: "Payment & Invoice Notifications",
    description: "Updates about payments, invoices, and billing",
    enabled: true,
  },
  {
    id: "video",
    title: "Video Generation Status",
    description: "Real-time updates on video generation progress",
    enabled: true,
  },
  {
    id: "product",
    title: "Product Updates",
    description: "News about new features and platform improvements",
    enabled: false,
  },
];

interface NotificationSettingsProps {
  onBack: () => void;
}

export default function NotificationSettings({
  onBack,
}: NotificationSettingsProps) {
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(defaultNotifications);

  const toggleNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n))
    );
  };

  const resetToDefault = () => {
    setNotifications(defaultNotifications);
  };

  return (
    <div>
      {/* Icon + Title */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 bg-[#0A2E1A] border border-emerald-500/20 rounded-2xl flex items-center justify-center">
            <Bell className="w-6 h-6 text-emerald-400" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white">
          Notification Settings
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Manage your alerts and preferences
        </p>
      </div>

      {/* Notification Items */}
      <div className="max-w-2xl mx-auto bg-[#0D1117] border border-[#1A3155] rounded-2xl p-6 mb-6">
        <div className="space-y-3">
          {notifications.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-[#0A1020] border border-[#1A2332] rounded-xl px-5 py-4"
            >
              <div>
                <p className="text-white text-sm font-semibold">
                  {item.title}
                </p>
                <p className="text-gray-500 text-xs mt-0.5">
                  {item.description}
                </p>
              </div>
              {/* Toggle Switch */}
              <button
                onClick={() => toggleNotification(item.id)}
                className={`relative shrink-0 w-12 h-6 rounded-full transition-colors duration-200 ${
                  item.enabled ? "bg-emerald-500" : "bg-gray-600"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-all duration-200 ${
                    item.enabled ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <button
          onClick={resetToDefault}
          className="text-cyan-400 hover:text-cyan-300 text-sm underline underline-offset-2 transition-colors"
        >
          Reset to Default
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="bg-[#1A1F2E] hover:bg-[#252B3B] border border-[#2A3040] text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm"
          >
            Back
          </button>
          <button className="bg-[#1A1F2E] hover:bg-[#252B3B] text-gray-300 font-medium px-6 py-2.5 rounded-xl transition-colors text-sm">
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
