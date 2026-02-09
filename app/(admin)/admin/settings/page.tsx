"use client";

import { useState } from "react";
import { Save, Shield, Bell, Globe, Database } from "lucide-react";
import { AdminHeader } from "@/app/components/admin";

interface ToggleProps {
  enabled: boolean;
  onChange: (val: boolean) => void;
}

function Toggle({ enabled, onChange }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-11 h-6 rounded-full transition-colors ${
        enabled ? "bg-cyan-500" : "bg-[#1A3155]"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
          enabled ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export default function AdminSettingsPage() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [newRegistrations, setNewRegistrations] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);

  return (
    <div>
      <AdminHeader />

      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-gray-400 mt-1">Platform configuration and preferences</p>
      </div>

      <div className="space-y-6 max-w-3xl">
        {/* General Settings */}
        <div className="bg-[#0D1117] border border-[#1A3155] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-[#1A2332] border border-[#1A3155] flex items-center justify-center">
              <Globe className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-white font-semibold">General</h2>
              <p className="text-xs text-gray-500">Platform-wide settings</p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white font-medium">Maintenance Mode</p>
                <p className="text-xs text-gray-500">Disable access for non-admin users</p>
              </div>
              <Toggle enabled={maintenanceMode} onChange={setMaintenanceMode} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white font-medium">New Registrations</p>
                <p className="text-xs text-gray-500">Allow new user sign-ups</p>
              </div>
              <Toggle enabled={newRegistrations} onChange={setNewRegistrations} />
            </div>

            <div>
              <label className="text-sm text-white font-medium block mb-2">
                Default Free Credits
              </label>
              <input
                type="number"
                defaultValue={50}
                className="w-full bg-[#0A0F18] border border-[#1A3155] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#2563EB] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-[#0D1117] border border-[#1A3155] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-[#1A2332] border border-[#1A3155] flex items-center justify-center">
              <Shield className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-white font-semibold">Security</h2>
              <p className="text-xs text-gray-500">Authentication & access control</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-white font-medium block mb-2">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                defaultValue={60}
                className="w-full bg-[#0A0F18] border border-[#1A3155] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#2563EB] transition-colors"
              />
            </div>
            <div>
              <label className="text-sm text-white font-medium block mb-2">
                Max Login Attempts
              </label>
              <input
                type="number"
                defaultValue={5}
                className="w-full bg-[#0A0F18] border border-[#1A3155] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#2563EB] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-[#0D1117] border border-[#1A3155] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-[#1A2332] border border-[#1A3155] flex items-center justify-center">
              <Bell className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-white font-semibold">Notifications</h2>
              <p className="text-xs text-gray-500">Alert preferences</p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white font-medium">Email Notifications</p>
                <p className="text-xs text-gray-500">Receive alerts via email</p>
              </div>
              <Toggle enabled={emailNotifications} onChange={setEmailNotifications} />
            </div>
          </div>
        </div>

        {/* Database */}
        <div className="bg-[#0D1117] border border-[#1A3155] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-[#1A2332] border border-[#1A3155] flex items-center justify-center">
              <Database className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-white font-semibold">Database & Backups</h2>
              <p className="text-xs text-gray-500">Data management</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white font-medium">Auto Backup</p>
              <p className="text-xs text-gray-500">Daily automatic database backup</p>
            </div>
            <Toggle enabled={autoBackup} onChange={setAutoBackup} />
          </div>
        </div>

        {/* Save */}
        <button className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-black font-medium px-6 py-3 rounded-lg text-sm transition-colors">
          <Save className="w-4 h-4" />
          Save Settings
        </button>
      </div>
    </div>
  );
}
