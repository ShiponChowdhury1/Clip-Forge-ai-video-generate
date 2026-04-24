"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { toast } from "react-toastify";
import {
  useGetNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation,
} from "@/lib/redux/features/auth/authApi";

type NotificationKey =
  | "email"
  | "low_balance"
  | "payment"
  | "video_status"
  | "message"
  | "product_update";

interface NotificationSettingsPayload {
  email: boolean;
  low_balance: boolean;
  payment: boolean;
  video_status: boolean;
  message: boolean;
  product_update: boolean;
}

interface NotificationItem {
  id: NotificationKey;
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
    id: "low_balance",
    title: "Credit Low Balance Alerts",
    description: "Get notified when your credits are running low",
    enabled: true,
  },
  {
    id: "payment",
    title: "Payment & Invoice Notifications",
    description: "Updates about payments, invoices, and billing",
    enabled: true,
  },
  {
    id: "video_status",
    title: "Video Generation Status",
    description: "Real-time updates on video generation progress",
    enabled: true,
  },
  {
    id: "message",
    title: "Support Messages",
    description: "Updates when support replies to your inquiries",
    enabled: true,
  },
  {
    id: "product_update",
    title: "Product Updates",
    description: "News about new features and platform improvements",
    enabled: false,
  },
];

const toItems = (settings: NotificationSettingsPayload): NotificationItem[] =>
  defaultNotifications.map((item) => ({
    ...item,
    enabled: settings[item.id],
  }));

const toPayload = (items: NotificationItem[]): NotificationSettingsPayload => {
  const map = items.reduce<Record<NotificationKey, boolean>>(
    (acc, item) => ({ ...acc, [item.id]: item.enabled }),
    {
      email: true,
      low_balance: true,
      payment: true,
      video_status: true,
      message: true,
      product_update: false,
    }
  );

  return {
    email: map.email,
    low_balance: map.low_balance,
    payment: map.payment,
    video_status: map.video_status,
    message: map.message,
    product_update: map.product_update,
  };
};

interface NotificationSettingsProps {
  onBack: () => void;
}

export default function NotificationSettings({
  onBack,
}: NotificationSettingsProps) {
  const {
    data: notificationSettings,
    isLoading,
    isFetching,
    isError,
  } = useGetNotificationSettingsQuery();
  const [updateNotificationSettings, { isLoading: isSaving }] =
    useUpdateNotificationSettingsMutation();

  const [notifications, setNotifications] =
    useState<NotificationItem[]>(defaultNotifications);

  useEffect(() => {
    if (notificationSettings) {
      setNotifications(toItems(notificationSettings));
    }
  }, [notificationSettings]);

  useEffect(() => {
    if (isError) {
      toast.error("Failed to load notification settings.");
    }
  }, [isError]);

  const toggleNotification = (id: NotificationKey) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n))
    );
  };

  const resetToDefault = async () => {
    const confirmed = window.confirm(
      "Reset all notification preferences to default settings?"
    );
    if (!confirmed) return;

    try {
      const payload = toPayload(defaultNotifications);
      const data = await updateNotificationSettings(payload).unwrap();
      setNotifications(toItems(data));
      toast.success("Notification settings reset to default.");
    } catch {
      toast.error("Failed to reset notification settings.");
    }
  };

  const handleSavePreferences = async () => {
    try {
      const payload = toPayload(notifications);
      const data = await updateNotificationSettings(payload).unwrap();
      setNotifications(toItems(data));
      toast.success("Notification settings updated successfully.");
    } catch {
      toast.error("Failed to update notification settings.");
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 bg-[#0A2E1A] border border-emerald-500/20 rounded-2xl flex items-center justify-center">
            <Bell className="w-6 h-6 text-emerald-400" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Notification Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
          Manage your alerts and preferences
        </p>
      </div>

      <div className="max-w-2xl mx-auto bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-2xl p-6 mb-6">
        <div className="space-y-3">
          {isLoading && (
            <p className="text-xs text-gray-500 dark:text-gray-400 pb-1">
              Loading notification settings...
            </p>
          )}
          {notifications.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-gray-50 dark:bg-[#0A1020] border border-gray-200 dark:border-[#1A2332] rounded-xl px-5 py-4"
            >
              <div>
                <p className="text-gray-900 dark:text-white text-sm font-semibold">
                  {item.title}
                </p>
                <p className="text-gray-500 text-xs mt-0.5">
                  {item.description}
                </p>
              </div>
              <button
                onClick={() => toggleNotification(item.id)}
                disabled={isLoading || isFetching || isSaving}
                className={`relative shrink-0 w-12 h-6 rounded-full transition-colors duration-200 ${
                  item.enabled ? "bg-emerald-500" : "bg-gray-300 dark:bg-gray-600"
                } ${(isLoading || isFetching || isSaving) ? "opacity-60 cursor-not-allowed" : ""}`}
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

      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <button
          onClick={resetToDefault}
          disabled={isLoading || isFetching || isSaving}
          className="text-cyan-400 hover:text-cyan-300 text-sm underline underline-offset-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Reset to Default
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="bg-gray-100 dark:bg-[#1A1F2E] hover:bg-gray-200 dark:hover:bg-[#252B3B] border border-gray-300 dark:border-[#2A3040] text-gray-900 dark:text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm"
          >
            Back
          </button>
          <button
            onClick={handleSavePreferences}
            disabled={isLoading || isFetching || isSaving}
            className="bg-gray-100 dark:bg-[#1A1F2E] hover:bg-gray-200 dark:hover:bg-[#252B3B] text-gray-700 dark:text-gray-300 font-medium px-6 py-2.5 rounded-xl transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : "Save Preferences"}
          </button>
        </div>
      </div>
    </div>
  );
}
