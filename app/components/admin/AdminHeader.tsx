"use client";

import {
  Search,
  Download,
  Bell,
  ChevronDown,
  User,
  Lock,
  LogOut,
  Pencil,
  Eye,
  EyeOff,
  Mail,
  Shield,
  ShieldCheck,
  X,
  CircleUserRound,
  AlertTriangle,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface AdminHeaderProps {
  onExport?: () => void;
}

const timeRanges = ["Last 7 Days", "Last 30 Days", "Last 90 Days", "All Time"];

// ─── My Profile Modal ────────────────────────────────────────────
function ProfileModal({ onClose }: { onClose: () => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("Admin User");
  const [email, setEmail] = useState("superadmin@vidflow.io");
  const [role] = useState("Super Admin");

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#111827] rounded-2xl w-full max-w-md mx-auto shadow-2xl border border-[#1E293B] overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Description */}
          <p className="text-gray-400 text-sm text-center mb-6">
            Manage your administrative identity and personal information
          </p>

          {/* Avatar */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-2xl bg-cyan-500/10 border-2 border-cyan-500/30 flex items-center justify-center">
              <CircleUserRound className="w-10 h-10 text-cyan-400" />
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-[#1E293B]/60 rounded-2xl p-5 sm:p-6 space-y-5">
            {/* Full Name */}
            <div>
              <label className="flex items-center gap-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                <User className="w-3.5 h-3.5" />
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#0D1117] border border-[#1A3155] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                />
              ) : (
                <p className="text-white text-sm font-medium">{fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                <Mail className="w-3.5 h-3.5" />
                Email Address
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0D1117] border border-[#1A3155] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                />
              ) : (
                <p className="text-white text-sm font-medium">{email}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="flex items-center gap-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                <Shield className="w-3.5 h-3.5" />
                Administrative Role
              </label>
              <p className="text-white text-sm font-medium">{role}</p>
            </div>

            {/* Identity Verified */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                  Identity Verified
                </p>
                <p className="text-emerald-400/60 text-[11px] mt-0.5">
                  Last verified: February 1, 2026
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-center">
            {isEditing ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2.5 rounded-full bg-[#1E293B] text-gray-300 text-sm font-medium hover:bg-[#2D3B4E] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-medium transition-colors"
                >
                  Save Changes
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1E293B] border border-[#2D3B4E] text-gray-300 text-sm font-medium hover:bg-[#2D3B4E] hover:text-white transition-colors"
              >
                <Pencil className="w-4 h-4" />
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Change Password Modal ───────────────────────────────────────
function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const hasMinLength = newPassword.length >= 12;
  const hasUpperLower = /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword);
  const hasNumberSymbol =
    /[0-9]/.test(newPassword) && /[^a-zA-Z0-9]/.test(newPassword);
  const notPrevious = newPassword.length > 0 && newPassword !== currentPassword;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#111827] rounded-2xl w-full max-w-md mx-auto shadow-2xl border border-[#1E293B] overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Lock Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center">
              <Lock className="w-8 h-8 text-red-400" />
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-400 text-sm text-center mb-8">
            Update your administrative credentials for better security
          </p>

          {/* Form Card */}
          <div className="bg-[#1E293B]/60 rounded-2xl p-5 sm:p-6 space-y-5">
            {/* Current Password */}
            <div>
              <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="w-full bg-[#0D1117] border border-[#1A3155] rounded-xl px-4 py-3 pr-11 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showCurrent ? (
                    <EyeOff className="w-4.5 h-4.5" />
                  ) : (
                    <Eye className="w-4.5 h-4.5" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="w-full bg-[#0D1117] border border-[#1A3155] rounded-xl px-4 py-3 pr-11 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showNew ? (
                    <EyeOff className="w-4.5 h-4.5" />
                  ) : (
                    <Eye className="w-4.5 h-4.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="w-full bg-[#0D1117] border border-[#1A3155] rounded-xl px-4 py-3 pr-11 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showConfirm ? (
                    <EyeOff className="w-4.5 h-4.5" />
                  ) : (
                    <Eye className="w-4.5 h-4.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Security Requirements */}
            <div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Security Requirements
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      hasMinLength ? "bg-emerald-400" : "bg-gray-600"
                    }`}
                  />
                  <span className="text-gray-400 text-xs">
                    At least 12 characters
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      hasUpperLower ? "bg-emerald-400" : "bg-gray-600"
                    }`}
                  />
                  <span className="text-gray-400 text-xs">
                    Uppercase & Lowercase
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      hasNumberSymbol ? "bg-emerald-400" : "bg-gray-600"
                    }`}
                  />
                  <span className="text-gray-400 text-xs">
                    Numbers & Symbols
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      notPrevious ? "bg-emerald-400" : "bg-gray-600"
                    }`}
                  />
                  <span className="text-gray-400 text-xs">
                    Not a previous password
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Update Password Button */}
          <button
            onClick={onClose}
            className="w-full mt-6 flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3.5 rounded-xl text-sm transition-colors"
          >
            <ShieldCheck className="w-4.5 h-4.5" />
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Admin Header ────────────────────────────────────────────────
export default function AdminHeader({ onExport }: AdminHeaderProps) {
  const [selectedRange, setSelectedRange] = useState("Last 30 Days");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-6">
        {/* Search */}
        <div className="relative w-full sm:flex-1 sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search users by name, email or userid..."
            className="w-full bg-[#0D1117] border border-[#1A3155] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#2563EB] transition-colors"
          />
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto flex-wrap sm:flex-nowrap">
          {/* Time range selector */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 bg-[#0D1117] border border-[#1A3155] rounded-lg px-3 sm:px-4 py-2.5 text-sm text-gray-300 hover:border-[#2563EB] transition-colors whitespace-nowrap"
            >
              <span className="hidden sm:inline">📅</span>
              <span className="hidden md:inline">{selectedRange}</span>
              <span className="md:hidden">📅</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {showDropdown && (
              <div className="absolute right-0 top-full mt-1 bg-[#0D1117] border border-[#1A3155] rounded-lg py-1 z-50 min-w-40">
                {timeRanges.map((range) => (
                  <button
                    key={range}
                    onClick={() => {
                      setSelectedRange(range);
                      setShowDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-[#1A2332] transition-colors ${
                      selectedRange === range
                        ? "text-cyan-400"
                        : "text-gray-300"
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Export button */}
          <button
            onClick={onExport}
            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white font-medium px-3 sm:px-4 py-2.5 rounded-lg text-sm transition-colors whitespace-nowrap"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export Data</span>
          </button>

          {/* Notification bell */}
          <button className="w-10 h-10 rounded-lg bg-[#0D1117] border border-[#1A3155] flex items-center justify-center text-gray-400 hover:text-white hover:border-[#2563EB] transition-colors relative">
            <Bell className="w-5 h-5" />
          </button>

          {/* User avatar + dropdown */}
          <div className="relative" ref={profileRef}>
            <div
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-10 h-10 rounded-full bg-[#2563EB] flex items-center justify-center text-white font-semibold text-sm cursor-pointer hover:ring-2 hover:ring-cyan-500/40 transition-all"
            >
              AU
            </div>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 top-full mt-2 bg-[#0D1117] border border-[#1A3155] rounded-xl shadow-2xl z-60 min-w-55 py-2 overflow-hidden">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-[#1A3155]">
                  <p className="text-white text-sm font-semibold">Admin User</p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    superadmin@vidflow.io
                  </p>
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setShowProfileModal(true);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-[#1A2332] hover:text-white transition-colors"
                  >
                    <User className="w-4 h-4" />
                    My Profile
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setShowPasswordModal(true);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-[#1A2332] hover:text-white transition-colors"
                  >
                    <Lock className="w-4 h-4" />
                    Change Password
                  </button>
                </div>

                {/* Logout */}
                <div className="border-t border-[#1A3155] pt-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setShowLogoutModal(true);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-[#1A2332] transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modals */}
      {showProfileModal && (
        <ProfileModal onClose={() => setShowProfileModal(false)} />
      )}
      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowLogoutModal(false)}
          />
          <div className="relative bg-[#0D1117] border border-[#1A3155] rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl shadow-black/50">
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-white text-center mb-2">
              Confirm Logout
            </h3>
            <p className="text-gray-400 text-sm text-center mb-8">
              Are you sure you want to sign out of your account?
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 bg-[#1A1F2E] hover:bg-[#252B3B] border border-[#2A3040] text-white font-semibold py-3 rounded-xl transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
