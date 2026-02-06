"use client";

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

  return (
    <aside className="w-74 bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl flex flex-col fixed left-6 top-6 p-6" style={{ justifyContent: "space-between", minHeight: "calc(100vh - 48px)" }}>
      {/* Logo */}
      <div className="pb-6 flex justify-center">
        <Link href="/dashboard">
          <Image
            src="/logo.png"
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
        <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-[#1A1A1A] w-full transition-all duration-200 border border-[#1F1F1F]">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
