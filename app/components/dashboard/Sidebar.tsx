"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Plus,
  Video,
  CreditCard,
  Headphones,
  User,
  LogOut,
  AlertTriangle,
} from "lucide-react";

const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Create Video",
    href: "/dashboard/create",
    icon: Plus,
  },
  {
    name: "All Video",
    href: "/dashboard/videos",
    icon: Video,
  },
];

const accountItems = [
  {
    name: "Billing",
    href: "/dashboard/billing",
    icon: CreditCard,
  },
  {
    name: "Contact Support",
    href: "/dashboard/support",
    icon: Headphones,
  },
  {
    name: "Profile & Settings",
    href: "/dashboard/settings",
    icon: User,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    // Handle actual logout logic here
    setShowLogoutModal(false);
  };

  return (
    <>
    <aside className="w-74 bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl flex flex-col fixed left-6 top-6 p-6 z-40" style={{ justifyContent: "space-between", minHeight: "calc(100vh - 48px)" }}>
      {/* Logo */}
      <div className="pb-6 flex justify-center">
        <Link href="/dashboard">
          <Image
            src="/logo/sidebarLogo.png"
            alt="Clipforge Logo"
            width={100}
            height={100}
            className="w-[100px] h-25 rounded-lg"
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 border ${
                isActive
                  ? "bg-[#2563EB] border-[#2563EB] text-white"
                  : "bg-[#0B0E10] border-[#1A3155] text-gray-300 hover:text-white hover:border-[#2563EB]"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}

        {/* Account Section */}
        <div className="pt-6 space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-3">
            Account
          </p>
          {accountItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 border ${
                  isActive
                    ? "bg-[#2563EB] border-[#2563EB] text-white"
                    : "bg-[#0B0E10] border-[#1A3155] text-gray-300 hover:text-white hover:border-[#2563EB]"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Profile & Logout */}
      <div className="pt-4 border-t border-[#1F1F1F] space-y-2">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-[#2563EB] flex items-center justify-center text-white font-semibold text-sm">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">John Doe</p>
            <p className="text-xs text-gray-500 truncate">john@example.com</p>
          </div>
        </div>
        <button
          onClick={() => setShowLogoutModal(true)}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 w-full transition-all duration-200 border border-[#1F1F1F] hover:border-red-500/30"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>

    {/* Logout Confirmation Modal */}
    {showLogoutModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop with blur */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowLogoutModal(false)}
        />

        {/* Modal */}
        <div className="relative bg-[#0D1117] border border-[#1A3155] rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl shadow-black/50 animate-in">
          {/* Warning Icon */}
          <div className="flex justify-center mb-5">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
          </div>

          <h3 className="text-xl font-bold text-white text-center mb-2">
            Confirm Logout
          </h3>
          <p className="text-gray-400 text-sm text-center mb-8">
            Are you sure you want to sign out of your account? You will need to
            log in again to access your dashboard.
          </p>

          {/* Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowLogoutModal(false)}
              className="flex-1 bg-[#1A1F2E] hover:bg-[#252B3B] border border-[#2A3040] text-white font-semibold py-3 rounded-xl transition-colors text-sm"
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
      </div>
    )}
    </>
  );
}
