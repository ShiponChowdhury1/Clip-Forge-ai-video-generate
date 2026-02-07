"use client";

import { User, Save } from "lucide-react";
import DashboardHeader from "@/app/components/dashboard/DashboardHeader";
import { useState } from "react";

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    fullName: "John Doe",
    email: "john@example.com",
    phone: "",
    bio: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  return (
    <div>
      {/* Header - Reusable */}
      <DashboardHeader
        icon={
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
        }
        title="Profile & Settings"
        description="Manage your account preferences"
        showCreateButton={false}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-[#0D1117] border border-[#1A3155] rounded-2xl p-6 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-[#2563EB] flex items-center justify-center text-white font-bold text-3xl mb-4">
            JD
          </div>
          <h3 className="text-white text-lg font-semibold">{profile.fullName}</h3>
          <p className="text-gray-400 text-sm mb-4">{profile.email}</p>
          <span className="inline-block bg-[#009927]/20 text-[#009927] text-xs font-semibold px-3 py-1 rounded-full">
            Growth Plan
          </span>
        </div>

        {/* Settings Form */}
        <div className="lg:col-span-2 bg-[#0D1117] border border-[#1A3155] rounded-2xl p-6">
          <h3 className="text-white text-lg font-semibold mb-6">
            Personal Information
          </h3>
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-white text-sm font-semibold mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleChange}
                  className="w-full bg-[#0B0E12] border border-[#1A3155] rounded-lg px-4 py-3 text-white text-sm focus:border-[#3B82F6] focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-white text-sm font-semibold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="w-full bg-[#0B0E12] border border-[#1A3155] rounded-lg px-4 py-3 text-white text-sm focus:border-[#3B82F6] focus:outline-none transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="w-full bg-[#0B0E12] border border-[#1A3155] rounded-lg px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:border-[#3B82F6] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself..."
                rows={4}
                className="w-full bg-[#0B0E12] border border-[#1A3155] rounded-lg px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:border-[#3B82F6] focus:outline-none transition-colors resize-none"
              />
            </div>
            <button className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold py-3 px-6 rounded-xl flex items-center gap-2 transition-colors text-sm">
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
