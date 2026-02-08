"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";

interface ChangePasswordProps {
  onBack: () => void;
}

export default function ChangePassword({ onBack }: ChangePasswordProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  const requirements = [
    { label: "Minimum 8 characters", met: newPassword.length >= 8 },
    { label: "1 uppercase letter", met: /[A-Z]/.test(newPassword) },
    { label: "1 number", met: /\d/.test(newPassword) },
  ];

  const handleSave = () => {
    if (!currentPassword) {
      setError("Current password is incorrect");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!requirements.every((r) => r.met)) {
      setError("Password does not meet requirements");
      return;
    }
    setError("");
    // Handle save
  };

  return (
    <div>
      {/* Icon + Title */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 bg-[#1A2332] border border-[#1A3155] rounded-2xl flex items-center justify-center">
            <Lock className="w-6 h-6 text-[#2563EB]" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white">Change Password</h1>
        <p className="text-gray-400 text-sm mt-1">
          Update your security credentials
        </p>
      </div>

      {/* Form Card */}
      <div className="max-w-2xl mx-auto bg-[#0D1117] border border-[#1A3155] rounded-2xl p-8 mb-6">
        {/* Current Password */}
        <div className="mb-5">
          <label className="block text-white text-sm font-semibold mb-2">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-[#0A0E14] border border-[#1A3155] rounded-lg px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-500/50 transition-colors pr-12"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
            >
              {showCurrent ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="mb-5">
          <label className="block text-white text-sm font-semibold mb-2">
            New Password
          </label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-[#0A0E14] border border-[#1A3155] rounded-lg px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-500/50 transition-colors pr-12"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
            >
              {showNew ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm New Password */}
        <div className="mb-6">
          <label className="block text-white text-sm font-semibold mb-2">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-[#0A0E14] border border-[#1A3155] rounded-lg px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-500/50 transition-colors pr-12"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
            >
              {showConfirm ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Password Requirements */}
        <div className="bg-[#0A1628] border border-[#1A3155] rounded-lg p-4 mb-8">
          <p className="text-white text-sm font-semibold mb-3">
            Password Requirements:
          </p>
          <div className="space-y-2">
            {requirements.map((req, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <CheckCircle
                  className={`w-3.5 h-3.5 ${
                    req.met ? "text-green-400" : "text-gray-600"
                  }`}
                />
                <span
                  className={`text-sm ${
                    req.met ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  {req.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            className="flex-1 bg-[#1A1F2E] hover:bg-[#252B3B] text-gray-300 font-medium py-3 rounded-xl transition-colors text-sm"
          >
            Save Password
          </button>
          <button
            onClick={onBack}
            className="flex-1 bg-[#1A1F2E] hover:bg-[#252B3B] border border-[#2A3040] text-white font-semibold py-3 rounded-xl transition-colors text-sm"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Error Toast */}
      {error && (
        <div className="max-w-2xl mx-auto bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <div>
            <p className="text-red-400 text-sm font-semibold">Error</p>
            <p className="text-red-400/80 text-xs">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
