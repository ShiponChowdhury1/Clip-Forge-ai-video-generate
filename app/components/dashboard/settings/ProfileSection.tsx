"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import {
  Mail,
  Crown,
  CreditCard,
  Lock,
  Bell,
  Settings,
  Pencil,
  Check,
  X,
  Camera,
  Loader2,
  Sparkles,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { useUpdateProfileMutation } from "@/lib/redux/features/auth/authApi";
import { setUser } from "@/lib/redux/features/auth/authSlice";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://10.10.12.3:8000/api";
const ORIGIN = API_BASE.replace(/\/api$/, "");

interface ProfileSectionProps {
  onNavigate: (view: "wallet" | "password" | "notifications") => void;
}

export default function ProfileSection({
  onNavigate,
}: ProfileSectionProps) {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const [updateProfile] = useUpdateProfileMutation();

  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState(user?.name || "");
  const [nameLoading, setNameLoading] = useState(false);
  const [pictureLoading, setPictureLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resolveProfileImageUrl = (url?: string | null) => {
    if (!url) return user?.picture;
    const absolute = url.startsWith("http") ? url : `${ORIGIN}${url}`;
    return `${absolute}${absolute.includes("?") ? "&" : "?"}t=${Date.now()}`;
  };

  const buildUpdatedUser = (res: {
    id: number;
    name: string;
    email: string;
    credits: number;
    subscription_plan?: string;
    role: "user" | "admin" | "super_admin";
    profile_image_url?: string | null;
  }) => ({
    id: res.id,
    name: res.name,
    email: res.email,
    credits: res.credits,
    subscription_plan: res.subscription_plan || user?.subscription_plan || "Free",
    role: res.role,
    picture: resolveProfileImageUrl(res.profile_image_url),
  });

  const handleSaveName = async () => {
    const trimmed = editName.trim();
    if (!trimmed || trimmed === user?.name) {
      setIsEditingName(false);
      setEditName(user?.name || "");
      return;
    }
    setNameLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", trimmed);
      const res = await updateProfile(formData).unwrap();
      const updatedUser = buildUpdatedUser(res);
      dispatch(setUser(updatedUser));
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
      setIsEditingName(false);
    } catch {
      // revert
      setEditName(user?.name || "");
      setIsEditingName(false);
    } finally {
      setNameLoading(false);
    }
  };

  const handlePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPictureLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", user?.name || "");
      formData.append("profile_image", file);
      const res = await updateProfile(formData).unwrap();
      const updatedUser = buildUpdatedUser(res);
      dispatch(setUser(updatedUser));
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    } catch {
      // silently fail
    } finally {
      setPictureLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Card */}
      <div className="w-full lg:w-[60%] bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-2xl overflow-hidden">
        {/* Cover Banner with mesh gradient */}
        <div className="h-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-[#1E3A5F] via-[#0D2847] to-[#162447]" />
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #3B82F6 0%, transparent 50%), radial-gradient(circle at 80% 30%, #06B6D4 0%, transparent 50%)" }} />
        </div>

        <div className="px-6 pb-6 sm:px-8 sm:pb-8">
          {/* Avatar - overlaps banner */}
          <div className="-mt-14 mb-4">
            <div className="relative group inline-block">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePictureChange}
                className="hidden"
              />
              <div className="w-26 h-26 rounded-2xl ring-[5px] ring-white dark:ring-[#0D1117] overflow-hidden shadow-xl shadow-black/10 dark:shadow-black/30">
                {user?.picture ? (
                  <Image
                    src={user.picture}
                    alt={user.name || "User"}
                    referrerPolicy="no-referrer"
                    width={104}
                    height={104}
                    unoptimized
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">
                      {user?.name ? getInitials(user.name) : "U"}
                    </span>
                  </div>
                )}
              </div>
              {/* Camera overlay */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={pictureLoading}
                className="absolute inset-0 rounded-2xl bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer backdrop-blur-[2px]"
              >
                {pictureLoading ? (
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <Camera className="w-5 h-5 text-white" />
                    <span className="text-[10px] text-white/80 font-medium">Change</span>
                  </div>
                )}
              </button>
              {/* Status dot */}
              <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-emerald-500 rounded-md border-[3px] border-white dark:border-[#0D1117] rotate-45" />
            </div>
          </div>

          {/* Name + Email + Plan badge */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1 min-w-0">
              {/* Name row */}
              <div className="flex items-center gap-2.5 h-9">
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveName();
                        if (e.key === "Escape") {
                          setIsEditingName(false);
                          setEditName(user?.name || "");
                        }
                      }}
                      autoFocus
                      className="bg-gray-100 dark:bg-[#0A1628] border border-gray-300 dark:border-[#1A3155] rounded-lg px-3 py-1 text-gray-900 dark:text-white text-lg font-bold focus:outline-none focus:border-[#3B82F6] transition-colors w-48 h-9"
                    />
                    <button
                      onClick={handleSaveName}
                      disabled={nameLoading}
                      className="w-8 h-8 bg-[#3B82F6] hover:bg-[#2563EB] rounded-lg flex items-center justify-center text-white transition-colors shrink-0"
                    >
                      {nameLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingName(false);
                        setEditName(user?.name || "");
                      }}
                      className="w-8 h-8 bg-gray-100 dark:bg-[#1A1F2E] hover:bg-gray-200 dark:hover:bg-[#252B3B] border border-gray-300 dark:border-[#2A3040] rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white truncate">{user?.name || "User"}</h2>
                    <button
                      onClick={() => {
                        setEditName(user?.name || "");
                        setIsEditingName(true);
                      }}
                      className="w-7 h-7 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all shrink-0"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
              {/* Email */}
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 text-sm">
                  <Mail className="w-3.5 h-3.5" />
                  {user?.email || "—"}
                </span>
                <span className="flex items-center gap-1 text-emerald-400 text-xs font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified
                </span>
              </div>
            </div>

            {/* Plan badge - right side on desktop */}
            <div className="shrink-0">
              <div className="inline-flex items-center gap-2 bg-linear-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-semibold px-4 py-2 rounded-xl">
                <Sparkles className="w-4 h-4" />
                <span className="capitalize">{user?.subscription_plan || "Free"} Plan</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-8">
            <div className="bg-gray-50 dark:bg-[#0A1628]/80 border border-gray-200 dark:border-[#1A3155] rounded-xl p-4 text-center">
              <div className="w-9 h-9 bg-cyan-500/10 rounded-lg flex items-center justify-center mx-auto mb-2.5">
                <CreditCard className="w-4 h-4 text-cyan-400" />
              </div>
              <p className="text-gray-900 dark:text-white font-bold text-2xl leading-none">{user?.credits ?? 0}</p>
              <p className="text-gray-500 text-[11px] uppercase tracking-wider font-medium mt-1.5">Credits</p>
            </div>
            <div className="bg-gray-50 dark:bg-[#0A1628]/80 border border-gray-200 dark:border-[#1A3155] rounded-xl p-4 text-center">
              <div className="w-9 h-9 bg-purple-500/10 rounded-lg flex items-center justify-center mx-auto mb-2.5">
                <Crown className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-cyan-400 font-bold text-2xl leading-none capitalize">{user?.subscription_plan || "Free"}</p>
              <p className="text-gray-500 text-[11px] uppercase tracking-wider font-medium mt-1.5">Plan</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Settings className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Quick Actions</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Credit Wallet */}
          <button
            onClick={() => onNavigate("wallet")}
            className="bg-gray-50 dark:bg-[#0A1628] border border-cyan-500/20 rounded-xl p-5 text-left hover:border-cyan-500/40 hover:bg-gray-100 dark:hover:bg-[#0B1A30] transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-cyan-400" />
              </div>
              <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-cyan-400 transition-colors" />
            </div>
            <p className="text-gray-900 dark:text-white font-semibold text-sm">Credit Wallet</p>
            <p className="text-gray-500 text-xs mt-0.5">View balance & history</p>
          </button>

          {/* Change Password */}
          <button
            onClick={() => onNavigate("password")}
            className="bg-gray-50 dark:bg-[#0A1020] border border-gray-200 dark:border-[#1A2332] rounded-xl p-5 text-left hover:border-[#3B82F6]/30 hover:bg-gray-100 dark:hover:bg-[#0B1322] transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Lock className="w-5 h-5 text-blue-400" />
              </div>
              <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-blue-400 transition-colors" />
            </div>
            <p className="text-gray-900 dark:text-white font-semibold text-sm">Change Password</p>
            <p className="text-gray-500 text-xs mt-0.5">Update security</p>
          </button>

          {/* Notifications */}
          <button
            onClick={() => onNavigate("notifications")}
            className="bg-gray-50 dark:bg-[#0A1020] border border-gray-200 dark:border-[#1A2332] rounded-xl p-5 text-left hover:border-amber-500/30 hover:bg-gray-100 dark:hover:bg-[#0B1322] transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-amber-400" />
              </div>
              <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-amber-400 transition-colors" />
            </div>
            <p className="text-gray-900 dark:text-white font-semibold text-sm">Notifications</p>
            <p className="text-gray-500 text-xs mt-0.5">Manage alerts</p>
          </button>
        </div>
      </div>
    </div>
  );
}
