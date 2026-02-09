"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Plus,
  Video,
  CreditCard,
  Users,
  LogOut,
  AlertTriangle,
  MessageCircle,
  Settings,
  BarChart3,
  History,
  Receipt,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";

// ── Menu configuration per role ──────────────────────────────────────────────
export type SidebarRole = "user" | "admin";

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

interface NavSection {
  label?: string;
  items: NavItem[];
}

const menusByRole: Record<SidebarRole, NavSection[]> = {
  user: [
    {
      items: [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Create Video", href: "/dashboard/create", icon: Plus },
        { name: "All Video", href: "/dashboard/videos", icon: Video },
      ],
    },
    {
      label: "Account",
      items: [
        { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
        { name: "Contact Support", href: "/dashboard/support", icon: MessageCircle },
        { name: "Settings", href: "/dashboard/settings", icon: Settings },
      ],
    },
  ],
  admin: [
    {
      items: [
        { name: "Overview", href: "/admin", icon: BarChart3 },
        { name: "Users", href: "/admin/users", icon: Users },
        { name: "Usage History", href: "/admin/usage-history", icon: History },
        { name: "Billing / Refunds", href: "/admin/billing-refunds", icon: Receipt },
        { name: "Settings", href: "/admin/settings", icon: Settings },
      ],
    },
  ],
};

// ── Profile data per role (placeholder) ──────────────────────────────────────
const profileByRole: Record<SidebarRole, { name: string; subtitle: string; initials: string }> = {
  user: { name: "John Doe", subtitle: "john@example.com", initials: "JD" },
  admin: { name: "Admin User", subtitle: "Super Admin", initials: "AU" },
};

// ── Component ────────────────────────────────────────────────────────────────
interface SidebarProps {
  role?: SidebarRole;
}

export default function Sidebar({ role = "user" }: SidebarProps) {
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const sections = menusByRole[role];
  const profile = profileByRole[role];

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleLogout = () => {
    setShowLogoutModal(false);
  };

  const sidebarContent = (
    <aside
      className={`
        bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl flex flex-col p-6 z-40
        /* Desktop: fixed sidebar */
        lg:w-74 lg:fixed lg:left-6 lg:top-6
        /* Mobile/Tablet: full height in overlay */
        w-[280px] h-full
      `}
      style={{ justifyContent: "space-between", minHeight: "calc(100vh - 48px)" }}
    >
      {/* Logo + Close button on mobile */}
      <div className="pb-6 flex items-center justify-between lg:justify-center">
        <Link href={role === "admin" ? "/admin" : "/dashboard"}>
          <Image
            src="/logo/sidebarLogo.png"
            alt="Clipforge Logo"
            width={100}
            height={100}
            className="w-[100px] h-25 rounded-lg"
          />
        </Link>
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden w-9 h-9 rounded-lg bg-[#1A2332] border border-[#1A3155] flex items-center justify-center text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 space-y-2 overflow-y-auto">
        {sections.map((section, sIdx) => (
          <div key={sIdx} className={section.label ? "pt-6 space-y-2" : "space-y-2"}>
            {section.label && (
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-3">
                {section.label}
              </p>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === (role === "admin" ? "/admin" : "/dashboard")
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

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
        ))}
      </nav>

      {/* User Profile & Logout */}
      <div className="pt-4 border-t border-[#1F1F1F] space-y-2">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-[#2563EB] flex items-center justify-center text-white font-semibold text-sm shrink-0">
            {profile.initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{profile.name}</p>
            <p className="text-xs text-gray-500 truncate">{profile.subtitle}</p>
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
  );

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-11 h-11 rounded-lg bg-[#0D1117] border border-[#1A3155] flex items-center justify-center text-gray-300 hover:text-white hover:border-[#2563EB] transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Desktop sidebar – always visible on lg+ */}
      <div className="hidden lg:block">
        {sidebarContent}
      </div>

      {/* Mobile/Tablet overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Sidebar panel */}
          <div className="relative z-10">
            {sidebarContent}
          </div>
        </div>
      )}

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
            Are you sure you want to sign out of your account? 
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
