"use client";

import {
  User,
  Mail,
  Crown,
  CreditCard,
  Lock,
  Bell,
  LogOut,
  Settings,
} from "lucide-react";

interface ProfileSectionProps {
  onNavigate: (view: "wallet" | "password" | "notifications") => void;
  onLogout: () => void;
}

export default function ProfileSection({
  onNavigate,
  onLogout,
}: ProfileSectionProps) {
  return (
    <div>
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Profile</h1>
        <p className="text-gray-400 text-sm mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-[#0D1117] border border-[#1A3155] rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-5">
          {/* Avatar */}
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-[#2563EB] flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#2563EB] rounded-full flex items-center justify-center border-2 border-[#0D1117]">
              <Crown className="w-3 h-3 text-white" />
            </div>
          </div>

          {/* Info */}
          <div>
            <h2 className="text-xl font-bold text-white">John Doe</h2>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <span className="flex items-center gap-1.5 text-gray-400 text-sm">
                <Mail className="w-3.5 h-3.5" />
                john.doe@example.com
              </span>
              <span className="flex items-center gap-1.5 bg-cyan-500/10 text-cyan-400 text-xs font-semibold px-3 py-1 rounded-full">
                <Crown className="w-3 h-3" />
                Pro Plan
              </span>
            </div>

            {/* Credits Badge */}
            <div className="mt-3 inline-flex items-center gap-2 bg-[#0A1628] border border-[#1A3155] rounded-lg px-4 py-2">
              <CreditCard className="w-4 h-4 text-cyan-400" />
              <div>
                <p className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold">
                  Available Credits
                </p>
                <p className="text-white font-bold text-lg leading-tight">
                  150
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-[#0D1117] border border-[#1A3155] rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-2 mb-5">
          <Settings className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-bold text-white">Quick Actions</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Credit Wallet */}
          <button
            onClick={() => onNavigate("wallet")}
            className="bg-[#0A1628] border border-cyan-500/20 rounded-xl p-5 text-left hover:border-cyan-500/40 transition-all group"
          >
            <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-3">
              <CreditCard className="w-5 h-5 text-cyan-400" />
            </div>
            <p className="text-white font-semibold text-sm">Credit Wallet</p>
            <p className="text-gray-500 text-xs mt-0.5">
              View balance & history
            </p>
          </button>

          {/* Change Password */}
          <button
            onClick={() => onNavigate("password")}
            className="bg-[#0A1020] border border-[#1A2332] rounded-xl p-5 text-left hover:border-gray-600 transition-all group"
          >
            <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center mb-3">
              <Lock className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-white font-semibold text-sm">Change Password</p>
            <p className="text-gray-500 text-xs mt-0.5">Update security</p>
          </button>

          {/* Notifications */}
          <button
            onClick={() => onNavigate("notifications")}
            className="bg-[#0A1020] border border-[#1A2332] rounded-xl p-5 text-left hover:border-gray-600 transition-all group"
          >
            <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center mb-3">
              <Bell className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-white font-semibold text-sm">Notifications</p>
            <p className="text-gray-500 text-xs mt-0.5">Manage alerts</p>
          </button>
        </div>
      </div>

      {/* Logout */}
      <div className="bg-[#0D1117] border border-[#1A3155] rounded-2xl p-6">
        <div className="border-t border-[#1A2332] pt-0">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold">Logout</h3>
              <p className="text-gray-500 text-sm">Sign out of your account</p>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 px-5 py-2.5 rounded-xl font-medium transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
