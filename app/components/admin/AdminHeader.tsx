"use client";

import {
  Download,
  FileText,
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
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Loader2,
  Camera,
  Check,
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { useLogoutMutation, useRequestChangePasswordOtpMutation, useVerifyChangePasswordOtpMutation, useChangePasswordMutation, useUpdateProfileMutation } from "@/lib/redux/features/auth/authApi";
import { logout as logoutAction, setUser } from "@/lib/redux/features/auth/authSlice";
import { features, steps, plans, videos, videoCardData } from "@/app/data";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://10.10.12.3:8000/api";
const ORIGIN = API_BASE_URL.replace(/\/api$/, "");

interface AdminHeaderProps {
  exportPayload?: Record<string, unknown>;
  exportFilePrefix?: string;
}

interface UserNotification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  video_id: number | null;
  job_id: string | null;
  created_at: string;
}

function NotificationDetailsModal({
  notification,
  onClose,
}: {
  notification: UserNotification;
  onClose: () => void;
}) {
  const createdAt = new Date(notification.created_at).toLocaleString();

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/35 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white dark:bg-[#111827] rounded-2xl w-full max-w-lg mx-auto shadow-2xl border border-gray-200 dark:border-[#1E293B] overflow-hidden">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors z-10">
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{notification.title}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">{createdAt}</p>

          <div className="bg-gray-50 dark:bg-[#0D1117] border border-gray-200 dark:border-[#1A3155] rounded-xl p-4">
            <p className="text-sm leading-6 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{notification.message}</p>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium px-5 py-2.5 rounded-lg transition-colors text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── My Profile Modal ────────────────────────────────────────────
function ProfileModal({ onClose }: { onClose: () => void }) {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const [updateProfile] = useUpdateProfileMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState(user?.name || "");
  const [nameLoading, setNameLoading] = useState(false);
  const [pictureLoading, setPictureLoading] = useState(false);

  const resolveProfileImageUrl = (url?: string | null) => {
    const candidate = url
      ? url.startsWith("http")
        ? url
        : `${ORIGIN}${url}`
      : user?.picture;

    if (!candidate) return user?.picture;

    try {
      const parsed = new URL(candidate, ORIGIN);
      parsed.searchParams.set("t", Date.now().toString());
      return parsed.toString();
    } catch {
      const separator = candidate.includes("?") ? "&" : "?";
      return `${candidate}${separator}t=${Date.now()}`;
    }
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

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

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
      if (typeof window !== "undefined") localStorage.setItem("user", JSON.stringify(updatedUser));
      setIsEditingName(false);
    } catch {
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
      if (typeof window !== "undefined") localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("Profile picture changed successfully.");
    } catch {
      toast.error("Failed to update profile picture.");
    } finally {
      setPictureLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/35 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white dark:bg-[#111827] rounded-2xl w-full max-w-md mx-auto shadow-2xl border border-gray-200 dark:border-[#1E293B] overflow-hidden">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors z-10">
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-1">My Profile</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm text-center mb-6">Update your name and profile picture</p>

          {/* Avatar with camera overlay */}
          <div className="flex justify-center mb-6">
            <div className="relative group">
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePictureChange} className="hidden" />
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-cyan-500/30 bg-cyan-500/10">
                {user?.picture ? (
                  <Image src={user.picture} alt={user?.name || "Profile"} referrerPolicy="no-referrer" width={96} height={96} unoptimized className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-cyan-400 font-bold text-2xl">{user?.name ? getInitials(user.name) : "A"}</span>
                  </div>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={pictureLoading}
                className="absolute inset-0 rounded-2xl bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-[2px]"
              >
                {pictureLoading ? (
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <Camera className="w-5 h-5 text-white" />
                    <span className="text-[10px] text-white/80">Change</span>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-gray-100 dark:bg-[#1E293B]/60 rounded-2xl p-5 space-y-4">
            {/* Name */}
            <div>
              <label className="flex items-center gap-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                <User className="w-3.5 h-3.5" />
                Full Name
              </label>
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveName();
                      if (e.key === "Escape") { setIsEditingName(false); setEditName(user?.name || ""); }
                    }}
                    autoFocus
                    className="flex-1 bg-gray-100 dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-xl px-4 py-2.5 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                  <button onClick={handleSaveName} disabled={nameLoading} className="w-9 h-9 bg-cyan-500 hover:bg-cyan-600 rounded-lg flex items-center justify-center text-white shrink-0">
                    {nameLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  </button>
                  <button onClick={() => { setIsEditingName(false); setEditName(user?.name || ""); }} className="w-9 h-9 bg-gray-100 dark:bg-[#1A2332] hover:bg-gray-200 dark:hover:bg-[#252B3B] border border-gray-300 dark:border-[#2A3040] rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white shrink-0">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <p className="text-gray-900 dark:text-white text-sm font-medium">{user?.name || "—"}</p>
                  <button onClick={() => { setEditName(user?.name || ""); setIsEditingName(true); }} className="w-7 h-7 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                <Mail className="w-3.5 h-3.5" />
                Email Address
              </label>
              <p className="text-gray-900 dark:text-white text-sm font-medium">{user?.email || "—"}</p>
            </div>

            {/* Role */}
            <div>
              <label className="flex items-center gap-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                <Shield className="w-3.5 h-3.5" />
                Role
              </label>
              <p className="text-gray-900 dark:text-white text-sm font-medium capitalize">{user?.role || "admin"}</p>
            </div>

            {/* Verified */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">Identity Verified</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Change Password Modal (3-step: OTP request → verify → new password) ───
function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  type Step = "requesting" | "otp" | "password" | "success";
  const [step, setStep] = useState<Step>("requesting");
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const [requestOtp, { isLoading: isRequesting }] = useRequestChangePasswordOtpMutation();
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyChangePasswordOtpMutation();
  const [changePasswordApi, { isLoading: isChanging }] = useChangePasswordMutation();

  const requirements = [
    { label: "Minimum 8 characters", met: newPassword.length >= 8 },
    { label: "1 uppercase letter", met: /[A-Z]/.test(newPassword) },
    { label: "1 number", met: /\d/.test(newPassword) },
  ];

  useEffect(() => {
    let active = true;
    const requestInitialOtp = async () => {
      try {
        await requestOtp().unwrap();
        if (!active) return;
        setStep("otp");
        setResendCooldown(60);
      } catch (err) {
        if (!active) return;
        const detail = (err as { data?: { detail?: string } })?.data?.detail || "Failed to send OTP";
        setError(detail);
        setStep("otp");
      }
    };
    requestInitialOtp();
    return () => {
      active = false;
    };
  }, [requestOtp]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pasteData)) return;
    const newOtp = [...otp];
    pasteData.split("").forEach((char, i) => { newOtp[i] = char; });
    setOtp(newOtp);
    otpRefs.current[Math.min(pasteData.length, 5)]?.focus();
  };

  const handleVerifyOtp = async () => {
    setError("");
    const otpString = otp.join("");
    if (otpString.length !== 6) { setError("Please enter the 6-digit code"); return; }
    try {
      await verifyOtp({ otp: otpString }).unwrap();
      setStep("password");
    } catch (err) {
      setError((err as { data?: { detail?: string } })?.data?.detail || "Invalid OTP");
    }
  };

  const handleChangePassword = async () => {
    setError("");
    if (newPassword !== confirmPassword) { setError("Passwords do not match"); return; }
    if (!requirements.every((r) => r.met)) { setError("Password does not meet requirements"); return; }
    try {
      await changePasswordApi({ new_password: newPassword }).unwrap();
      setStep("success");
    } catch (err) {
      setError((err as { data?: { detail?: string } })?.data?.detail || "Failed to change password");
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setError("");
    setOtp(new Array(6).fill(""));
    try {
      await requestOtp().unwrap();
      setResendCooldown(60);
    } catch (err) {
      setError((err as { data?: { detail?: string } })?.data?.detail || "Failed to resend OTP");
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/35 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white dark:bg-[#111827] rounded-2xl w-full max-w-lg mx-auto shadow-2xl border border-gray-200 dark:border-[#1E293B] overflow-hidden">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors z-10">
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Step: Requesting */}
          {step === "requesting" && (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-10 h-10 text-[#3B82F6] animate-spin mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-sm">Sending verification code to your email...</p>
            </div>
          )}

          {/* Step: OTP */}
          {step === "otp" && (
            <>
              {/* Icon + Title */}
              <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 bg-gray-100 dark:bg-[#1A2332] border border-gray-300 dark:border-[#1A3155] rounded-2xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-[#2563EB]" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Verify Your Identity</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Enter the 6-digit code sent to your email</p>
              </div>

              {/* OTP Card */}
              <div className="bg-gray-50 dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-2xl p-6 sm:p-8">
                {/* OTP Inputs */}
                <div className="flex gap-2 sm:gap-3 justify-center mb-6">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { otpRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      onPaste={handleOtpPaste}
                      className="w-12 h-14 sm:w-14 sm:h-16 bg-gray-100 dark:bg-[#0A0E14] border border-gray-300 dark:border-[#1A3155] rounded-xl text-gray-900 dark:text-white text-center text-lg font-semibold outline-none focus:border-[#3B82F6]/50 transition"
                    />
                  ))}
                </div>

                {/* Resend */}
                <div className="text-center mb-6">
                  {resendCooldown > 0 ? (
                    <p className="text-gray-500 text-sm">
                      Resend code in <span className="text-gray-700 dark:text-gray-300">{resendCooldown}s</span>
                    </p>
                  ) : (
                    <button
                      onClick={handleResend}
                      disabled={isRequesting}
                      className="text-[#3B82F6] hover:text-[#60A5FA] text-sm font-medium transition-colors"
                    >
                      {isRequesting ? "Sending..." : "Resend Code"}
                    </button>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleVerifyOtp}
                    disabled={isVerifying || otp.join("").length !== 6}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#3B82F6] hover:bg-[#2563EB] disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-colors text-sm"
                  >
                    {isVerifying ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</>
                    ) : (
                      "Verify Code"
                    )}
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 bg-gray-100 dark:bg-[#1A1F2E] hover:bg-gray-200 dark:hover:bg-[#252B3B] border border-gray-300 dark:border-[#2A3040] text-gray-900 dark:text-white font-semibold py-3 rounded-xl transition-colors text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                  <div>
                    <p className="text-red-400 text-sm font-semibold">Error</p>
                    <p className="text-red-400/80 text-xs">{error}</p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Step: New Password */}
          {step === "password" && (
            <>
              {/* Icon + Title */}
              <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 bg-gray-100 dark:bg-[#1A2332] border border-gray-300 dark:border-[#1A3155] rounded-2xl flex items-center justify-center">
                    <Lock className="w-6 h-6 text-[#2563EB]" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Set New Password</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Create a strong new password</p>
              </div>

              {/* Password Card */}
              <div className="bg-gray-50 dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-2xl p-6 sm:p-8">
                {/* New Password */}
                <div className="mb-5">
                  <label className="block text-gray-900 dark:text-white text-sm font-semibold mb-2">New Password</label>
                  <div className="relative">
                    <input
                      type={showNew ? "text" : "password"}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-gray-100 dark:bg-[#0A0E14] border border-gray-300 dark:border-[#1A3155] rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-500/50 transition-colors pr-12"
                    />
                    <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                      {showNew ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="mb-6">
                  <label className="block text-gray-900 dark:text-white text-sm font-semibold mb-2">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-gray-100 dark:bg-[#0A0E14] border border-gray-300 dark:border-[#1A3155] rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-500/50 transition-colors pr-12"
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                      {showConfirm ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Password Requirements */}
                <div className="bg-gray-100 dark:bg-[#0A1628] border border-gray-300 dark:border-[#1A3155] rounded-lg p-4 mb-8">
                  <p className="text-gray-900 dark:text-white text-sm font-semibold mb-3">Password Requirements:</p>
                  <div className="space-y-2">
                    {requirements.map((req) => (
                      <div key={req.label} className="flex items-center gap-2">
                        <CheckCircle className={`w-3.5 h-3.5 ${req.met ? "text-green-400" : "text-gray-600"}`} />
                        <span className={`text-sm ${req.met ? "text-gray-700 dark:text-gray-300" : "text-gray-500"}`}>{req.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleChangePassword}
                    disabled={isChanging}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#3B82F6] hover:bg-[#2563EB] disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-colors text-sm"
                  >
                    {isChanging ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                    ) : (
                      "Save Password"
                    )}
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 bg-gray-100 dark:bg-[#1A1F2E] hover:bg-gray-200 dark:hover:bg-[#252B3B] border border-gray-300 dark:border-[#2A3040] text-gray-900 dark:text-white font-semibold py-3 rounded-xl transition-colors text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                  <div>
                    <p className="text-red-400 text-sm font-semibold">Error</p>
                    <p className="text-red-400/80 text-xs">{error}</p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Step: Success */}
          {step === "success" && (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 bg-green-500/10 border border-green-500/30 rounded-2xl flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-green-400" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Password Changed!</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">Your password has been updated successfully</p>
              <button onClick={onClose} className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium py-3 rounded-xl text-sm transition-colors">
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Admin Header ────────────────────────────────────────────────
export default function AdminHeader({ exportPayload, exportFilePrefix = "clipforge-home-data" }: AdminHeaderProps) {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<UserNotification | null>(null);
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsError, setNotificationsError] = useState<string | null>(null);
  const exportRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [mounted, setMounted] = useState(false);

  const user = useAppSelector((state) => state.auth.user);
  const authToken = useAppSelector((state) => state.auth.token);
  const [logoutApi] = useLogoutMutation();

  const serializeExportValue = (value: unknown): unknown => {
    if (typeof value === "function") {
      return value.name || "[function]";
    }
    if (Array.isArray(value)) {
      return value.map((item) => serializeExportValue(item));
    }
    if (value && typeof value === "object") {
      return Object.entries(value as Record<string, unknown>).reduce<Record<string, unknown>>((acc, [key, item]) => {
        acc[key] = serializeExportValue(item);
        return acc;
      }, {});
    }
    return value;
  };

  const buildExportPayload = () => ({
    ...(exportPayload || {
      features,
      steps,
      plans,
      videos,
      videoCardData,
    }),
  });

  const flattenExportRows = (value: unknown, path = "", rows: Array<{ path: string; value: string }> = []) => {
    if (value === null || value === undefined) {
      rows.push({ path, value: "" });
      return rows;
    }

    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      rows.push({ path, value: String(value) });
      return rows;
    }

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        flattenExportRows(item, `${path}[${index}]`, rows);
      });
      return rows;
    }

    if (typeof value === "object") {
      Object.entries(value as Record<string, unknown>).forEach(([key, item]) => {
        const nextPath = path ? `${path}.${key}` : key;
        flattenExportRows(item, nextPath, rows);
      });
      return rows;
    }

    rows.push({ path, value: String(value) });
    return rows;
  };

  const formatPathLabel = (path: string) => {
    return path
      .replace(/\[(\d+)\]/g, " $1")
      .replace(/\./g, " ")
      .replace(/_/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, (ch) => ch.toUpperCase());
  };

  const handleExportCsv = () => {
    setShowExportMenu(false);

    try {
      const payload = buildExportPayload();
      const rows = flattenExportRows(serializeExportValue(payload), "");

      const escapeCsv = (value: string) => `"${value.replace(/"/g, '""')}"`;
      const csvHeader = "path,value";
      const csvBody = rows
        .filter((row) => row.path)
        .map((row) => `${escapeCsv(row.path)},${escapeCsv(row.value)}`)
        .join("\n");

      const blob = new Blob([`${csvHeader}\n${csvBody}`], {
        type: "text/csv;charset=utf-8",
      });

      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${exportFilePrefix}.csv`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);

      toast.success("Home data exported as CSV.");
    } catch {
      toast.error("Failed to export CSV data.");
    }
  };

  const handleExportPdf = () => {
    setShowExportMenu(false);

    try {
      const payload = buildExportPayload();
      const rows = flattenExportRows(serializeExportValue(payload), "").filter((row) => row.path);
      const doc = new jsPDF({ unit: "pt", format: "a4" });

      const pageWidth = doc.internal.pageSize.getWidth();
      const generatedAt = new Date().toLocaleString();

      doc.setFillColor(6, 182, 212);
      doc.roundedRect(28, 24, pageWidth - 56, 64, 8, 8, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.text("Clip Forge Data Export", 42, 50);
      doc.setFontSize(10);
      doc.text(`Generated: ${generatedAt}`, 42, 68);
      doc.text(`Total Records: ${rows.length}`, 42, 82);
      doc.setTextColor(17, 24, 39);

      const summaryRows = [
        ["Time Range", String((payload as { time_range?: unknown }).time_range ?? "all")],
        ["Total Users", String((payload as { total_users?: unknown }).total_users ?? "-")],
        ["Active Users", String((payload as { active_users?: unknown }).active_users ?? "-")],
        ["Credits Consumed", String((payload as { credits_consumed?: unknown }).credits_consumed ?? "-")],
        ["Videos Generated", String((payload as { videos_generated?: unknown }).videos_generated ?? "-")],
        ["Revenue", String((payload as { revenue?: unknown }).revenue ?? "-")],
        ["Refunds Issued", String((payload as { refunds_issued?: unknown }).refunds_issued ?? "-")],
      ];

      autoTable(doc, {
        startY: 102,
        theme: "grid",
        head: [["Metric", "Value"]],
        body: summaryRows,
        styles: {
          fontSize: 9,
          cellPadding: 5,
          textColor: [31, 41, 55],
        },
        columnStyles: {
          0: { cellWidth: 190, fontStyle: "bold" },
          1: { cellWidth: 330 },
        },
        headStyles: {
          fillColor: [15, 23, 42],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
      });

      const detailsStartY = (doc as jsPDF & { lastAutoTable?: { finalY?: number } }).lastAutoTable?.finalY ?? 220;
      doc.setFontSize(12);
      doc.setTextColor(17, 24, 39);
      doc.text("Detailed Data", 40, detailsStartY + 18);

      autoTable(doc, {
        startY: detailsStartY + 28,
        theme: "grid",
        head: [["Field", "Value"]],
        body: rows.map((row) => [formatPathLabel(row.path), row.value]),
        alternateRowStyles: {
          fillColor: [248, 250, 252],
        },
        styles: {
          fontSize: 8.5,
          cellPadding: 5,
          overflow: "linebreak",
          valign: "top",
          textColor: [31, 41, 55],
        },
        columnStyles: {
          0: { cellWidth: 190, fontStyle: "bold" },
          1: { cellWidth: 330 },
        },
        headStyles: {
          fillColor: [15, 23, 42],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        didDrawPage: () => {
          const pageNumber = doc.getNumberOfPages();
          const pageHeight = doc.internal.pageSize.getHeight();
          doc.setFontSize(9);
          doc.setTextColor(107, 114, 128);
          doc.text(`Page ${pageNumber}`, pageWidth - 70, pageHeight - 16);
        },
      });

      doc.save(`${exportFilePrefix}.pdf`);
      toast.success("Home data exported as PDF.");
    } catch {
      toast.error("Failed to export PDF data.");
    }
  };

  const fetchNotifications = useCallback(async () => {
    setNotificationsLoading(true);
    setNotificationsError(null);

    const token = authToken || (typeof window !== "undefined" ? localStorage.getItem("token") : null);

    try {
      const response = await fetch(`${API_BASE_URL}/v1/users/notifications?unread_only=true&limit=50`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load notifications");
      }

      const data = (await response.json()) as UserNotification[];
      setNotifications(Array.isArray(data) ? data : []);
    } catch {
      setNotificationsError("Failed to load notifications");
    } finally {
      setNotificationsLoading(false);
    }
  }, [authToken]);

  const markNotificationAsRead = async (notificationId: number) => {
    const token = authToken || (typeof window !== "undefined" ? localStorage.getItem("token") : null);

    const response = await fetch(`${API_BASE_URL}/v1/users/notifications/${notificationId}/read`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error("Failed to mark notification as read");
    }
  };

  const handleNotificationClick = async (notification: UserNotification) => {
    setShowNotificationMenu(false);
    setSelectedNotification(notification);

    if (notification.is_read) {
      return;
    }

    try {
      await markNotificationAsRead(notification.id);
      setNotifications((prev) => prev.filter((item) => item.id !== notification.id));
    } catch {
      // Keep modal open even if read status update fails.
    }
  };

  useEffect(() => {
    fetchNotifications();
    const timer = setInterval(() => {
      fetchNotifications();
    }, 60000);

    return () => clearInterval(timer);
    // authToken change should refresh notifications for the new session.
  }, [fetchNotifications]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof document === "undefined" || typeof window === "undefined") return;

    const hasModalOpen =
      showProfileModal ||
      showPasswordModal ||
      showLogoutModal ||
      selectedNotification !== null;

    if (!hasModalOpen) return;

    const scrollY = window.scrollY;
    const originalBodyStyle = {
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
      overflowY: document.body.style.overflowY,
    };

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overflowY = "scroll";

    return () => {
      document.body.style.position = originalBodyStyle.position;
      document.body.style.top = originalBodyStyle.top;
      document.body.style.width = originalBodyStyle.width;
      document.body.style.overflowY = originalBodyStyle.overflowY;
      window.scrollTo(0, scrollY);
    };
  }, [mounted, selectedNotification, showLogoutModal, showPasswordModal, showProfileModal]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        exportRef.current &&
        !exportRef.current.contains(e.target as Node)
      ) {
        setShowExportMenu(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target as Node)
      ) {
        setShowNotificationMenu(false);
      }
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

  const handleLogout = async () => {
    setShowLogoutModal(false);
    try {
      await logoutApi().unwrap();
    } catch {
      // Even if API fails, clear local state
    }
    dispatch(logoutAction());
    router.push("/");
  };

  const displayName = user?.name || "Admin";
  const displayEmail = user?.email || "";
  const displayPicture = user?.picture || null;
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      <header className="flex items-center justify-end gap-3 mb-6 bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-[#1F1F1F] rounded-xl px-4 py-3">
        {/* Export button */}
        <div className="relative" ref={exportRef}>
          <button
            onClick={() => setShowExportMenu((prev) => !prev)}
            className="h-10 flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white font-medium px-4 rounded-lg text-sm transition-colors whitespace-nowrap"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export Data</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showExportMenu ? "rotate-180" : ""}`} />
          </button>

          {showExportMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-xl shadow-2xl z-100 py-2 overflow-hidden">
              <button
                onClick={handleExportPdf}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1A2332] hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span className="truncate">Export as PDF</span>
                <span className="ml-auto rounded-full bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300 px-2 py-0.5 text-[10px] font-semibold leading-none">
                  Best
                </span>
              </button>
              <button
                onClick={handleExportCsv}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1A2332] hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <FileText className="w-4 h-4" />
                Export as CSV
              </button>
            </div>
          )}
        </div>

        {/* Notification bell */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => {
              const nextValue = !showNotificationMenu;
              setShowNotificationMenu(nextValue);
              if (nextValue && !notificationsLoading) {
                fetchNotifications();
              }
            }}
            className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-[#2563EB] transition-colors relative shrink-0"
            aria-label="Open notifications"
          >
            <Bell className="w-5 h-5" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center leading-none border border-white dark:border-[#0D1117]">
                {notifications.length > 9 ? "9+" : notifications.length}
              </span>
            )}
          </button>

          {showNotificationMenu && (
            <div className="absolute right-0 top-full mt-2 w-84 max-w-[90vw] bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-xl shadow-2xl z-100 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-[#1A3155] flex items-center justify-between">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h4>
                <button
                  onClick={fetchNotifications}
                  className="text-xs text-[#3B82F6] hover:text-[#2563EB] font-medium"
                >
                  Refresh
                </button>
              </div>

              <div className="max-h-90 overflow-y-auto">
                {notificationsLoading ? (
                  <div className="py-8 flex items-center justify-center text-gray-500 dark:text-gray-400">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Loading...
                  </div>
                ) : notificationsError ? (
                  <p className="text-sm text-red-500 px-4 py-6">{notificationsError}</p>
                ) : notifications.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 px-4 py-6">No unread notifications.</p>
                ) : (
                  notifications.map((notification) => (
                    <button
                      key={notification.id}
                      onClick={() => {
                        handleNotificationClick(notification);
                      }}
                      className="w-full text-left px-4 py-3 border-b border-gray-100 dark:border-[#1A3155] last:border-b-0 hover:bg-gray-50 dark:hover:bg-[#1A2332] transition-colors"
                    >
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{notification.title}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{notification.message}</p>
                      <p className="text-[11px] text-gray-400 mt-1.5">{new Date(notification.created_at).toLocaleString()}</p>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User avatar + dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="h-10 flex items-center gap-2.5 bg-gray-50 dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] hover:border-[#2563EB] rounded-lg px-2.5 transition-all cursor-pointer"
          >
            {displayPicture ? (
              <Image
                src={displayPicture}
                alt={displayName}
                referrerPolicy="no-referrer"
                width={28}
                height={28}
                unoptimized
                className="w-7 h-7 rounded-full object-cover"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-[#2563EB] flex items-center justify-center text-white font-semibold text-[11px]">
                {initials}
              </div>
            )}
            <span className="text-gray-900 dark:text-white text-sm font-medium max-w-30 truncate hidden sm:inline">
              {displayName}
            </span>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showProfileMenu ? "rotate-180" : ""}`} />
          </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 top-full mt-2 bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-xl shadow-2xl z-100 min-w-55 py-2 overflow-hidden">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-gray-200 dark:border-[#1A3155]">
                  <p className="text-gray-900 dark:text-white text-sm font-semibold truncate">{displayName}</p>
                  <p className="text-gray-400 text-xs mt-0.5 truncate">
                    {displayEmail}
                  </p>
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setShowProfileModal(true);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1A2332] hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <span className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#111827] text-gray-600 dark:text-gray-300 flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </span>
                    My Profile
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setShowPasswordModal(true);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1A2332] hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <span className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#111827] text-gray-600 dark:text-gray-300 flex items-center justify-center">
                      <Lock className="w-4 h-4" />
                    </span>
                    Change Password
                  </button>
                </div>

                {/* Logout */}
                <div className="border-t border-gray-200 dark:border-[#1A3155] pt-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setShowLogoutModal(true);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-gray-100 dark:hover:bg-[#1A2332] transition-colors"
                  >
                    <span className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center">
                      <LogOut className="w-4 h-4" />
                    </span>
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
      </header>

      {/* Modals */}
      {mounted && typeof document !== "undefined" && showProfileModal &&
        createPortal(<ProfileModal onClose={() => setShowProfileModal(false)} />, document.body)}
      {mounted && typeof document !== "undefined" && showPasswordModal &&
        createPortal(<ChangePasswordModal onClose={() => setShowPasswordModal(false)} />, document.body)}
      {mounted && typeof document !== "undefined" && selectedNotification &&
        createPortal(
          <NotificationDetailsModal
            notification={selectedNotification}
            onClose={() => setSelectedNotification(null)}
          />,
          document.body
        )}

      {/* Logout Confirmation Modal */}
      {mounted && typeof document !== "undefined" &&
        showLogoutModal &&
        createPortal(
          <div className="fixed inset-0 z-9999 grid place-items-center p-4">
            <div
              className="absolute inset-0 bg-black/45 backdrop-blur-xl"
              onClick={() => setShowLogoutModal(false)}
            />
            <div className="relative z-10 bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-2xl p-8 w-full max-w-md shadow-2xl shadow-black/20 dark:shadow-black/50">
              <div className="flex justify-center mb-5">
                <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-red-400" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">
                Confirm Logout
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm text-center mb-8">
                Are you sure you want to sign out of your account?
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 bg-gray-100 dark:bg-[#1A1F2E] hover:bg-gray-200 dark:hover:bg-[#252B3B] border border-gray-300 dark:border-[#2A3040] text-gray-900 dark:text-white font-semibold py-3 rounded-xl transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Yes, Logout
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
