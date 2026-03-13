"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useLogoutMutation } from "@/lib/redux/features/auth/authApi";
import { logout as logoutAction } from "@/lib/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
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
  ChevronsLeft,
  ChevronsRight,
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
        { name: "All Videos", href: "/dashboard/videos", icon: Video },
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

// ── Helper: get initials from name ──────────────────────────────────────
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ── Component ────────────────────────────────────────────────────────────────
interface SidebarProps {
  role?: SidebarRole;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export default function Sidebar({ role = "user", onCollapsedChange }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const user = useAppSelector((state) => state.auth.user);
  const [logoutApi, { isLoading: isLoggingOut }] = useLogoutMutation();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const sections = menusByRole[role];

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved === "true") {
      setCollapsed(true);
      onCollapsedChange?.(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("sidebar-collapsed", String(next));
    onCollapsedChange?.(next);
  };

  const profile = {
    name: mounted ? (user?.name || "User") : "User",
    subtitle: mounted ? (user?.email || "") : "",
    initials: mounted && user?.name ? getInitials(user.name) : "U",
  };

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

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch {
      // Even if API fails, clear local state
    }
    dispatch(logoutAction());
    setShowLogoutModal(false);
    router.push("/");
  };

  const sidebarContent = (
    <aside
      className={`
        relative bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-[#1F1F1F] rounded-xl flex flex-col p-6 z-40 overflow-visible
        transition-all duration-300 ease-in-out
        /* Desktop: fixed sidebar */
        lg:fixed lg:left-6 lg:top-6
        ${collapsed ? "lg:w-20 lg:px-3 lg:py-6" : "lg:w-74"}
        /* Mobile/Tablet: full height in overlay (always expanded) */
        w-[280px] h-full
      `}
      style={{ justifyContent: "space-between", minHeight: "calc(100vh - 48px)" }}
    >
      {/* Logo + Close/Collapse */}
      <div className="pb-6 relative flex items-center justify-center">
        <Link href={role === "admin" ? "/admin" : "/dashboard"}>
          {collapsed ? (
            <Image
              src="/logo/sidebarLogo.png"
              alt="Clipforge"
              width={56}
              height={56}
              className="w-14 h-14 rounded-xl"
            />
          ) : (
            <Image
              src="/logo/sidebarLogo.png"
              alt="Clipforge Logo"
              width={100}
              height={100}
              className="w-[100px] h-25 rounded-lg"
            />
          )}
        </Link>
        {/* Collapse toggle - desktop only, absolutely right */}
        {!collapsed && (
          <button
            onClick={toggleCollapsed}
            className="hidden lg:flex absolute right-0 w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#1A2332] border border-gray-300 dark:border-[#1A3155] items-center justify-center text-gray-500 dark:text-gray-400 transition-colors"
            title="Collapse sidebar"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden absolute right-0 w-9 h-9 rounded-lg bg-gray-100 dark:bg-[#1A2332] border border-gray-300 dark:border-[#1A3155] flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Expand button - floating on sidebar edge when collapsed */}
      {collapsed && (
        <button
          onClick={toggleCollapsed}
          className="hidden lg:flex absolute -right-3 top-8 w-6 h-6 rounded-full bg-gray-100 dark:bg-[#1A2332] border border-gray-300 dark:border-[#1A3155] items-center justify-center text-gray-500 dark:text-gray-400 transition-colors z-50 shadow-lg"
          title="Expand sidebar"
        >
          <ChevronsRight className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Navigation */}
      <nav className="flex-1 py-4 space-y-2 overflow-y-auto">
        {sections.map((section, sIdx) => (
          <div key={sIdx} className={section.label ? "pt-6 space-y-2" : "space-y-2"}>
            {section.label && !collapsed && (
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-3">
                {section.label}
              </p>
            )}
            {section.label && collapsed && (
              <div className="border-t border-gray-200 dark:border-[#1F1F1F] my-2" />
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
                  onClick={() => setMobileOpen(false)}
                  title={collapsed ? item.name : undefined}
                  className={`flex items-center ${collapsed ? "justify-center" : "gap-3"} ${collapsed ? "px-0 py-3" : "px-4 py-3"} rounded-lg text-sm font-medium transition-all duration-200 border ${
                    isActive
                      ? "bg-[#2563EB] border-[#2563EB] text-white"
                      : "bg-gray-50 dark:bg-[#0B0E10] border-gray-200 dark:border-[#1A3155] text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-[#2563EB]/10 hover:text-gray-900 dark:hover:text-gray-100 hover:border-blue-300 dark:hover:border-[#2563EB]/50"
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {!collapsed && item.name}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User Profile & Logout */}
      <div className="pt-4 border-t border-gray-200 dark:border-[#1F1F1F] space-y-2">
        {collapsed ? (
          /* Collapsed: avatar only */
          <div className="flex justify-center px-2">
            {mounted && user?.picture ? (
              <img
                src={user.picture}
                alt={profile.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full shrink-0 object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#2563EB] flex items-center justify-center text-white font-semibold text-sm shrink-0">
                {profile.initials}
              </div>
            )}
          </div>
        ) : (
          /* Expanded: full profile */
          <div className="flex items-center gap-3 px-2">
            {mounted && user?.picture ? (
              <img
                src={user.picture}
                alt={profile.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full shrink-0 object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#2563EB] flex items-center justify-center text-white font-semibold text-sm shrink-0">
                {profile.initials}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{profile.name}</p>
              <p className="text-xs text-gray-500 truncate">{profile.subtitle}</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setShowLogoutModal(true)}
          title={collapsed ? "Logout" : undefined}
          className={`flex items-center ${collapsed ? "justify-center" : "gap-3"} ${collapsed ? "px-0" : "px-4"} py-3 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 w-full transition-all duration-200 border border-gray-200 dark:border-[#1F1F1F] hover:border-red-500/30`}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && "Logout"}
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-11 h-11 rounded-lg bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:border-blue-500 dark:hover:border-[#2563EB] transition-colors"
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
      <div className="fixed inset-0 z-[9999] grid place-items-center p-4">
        {/* Backdrop with blur */}
        <div
          className="absolute inset-0 bg-black/45 backdrop-blur-xl"
          onClick={() => setShowLogoutModal(false)}
        />

        {/* Modal */}
        <div className="relative z-10 bg-white dark:bg-[#0D1117] border border-gray-200 dark:border-[#1A3155] rounded-2xl p-8 w-full max-w-md shadow-2xl shadow-black/10 dark:shadow-black/50 animate-in">
          {/* Warning Icon */}
          <div className="flex justify-center mb-5">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
          </div>

          <h3 className="text-xl font-bold text-center mb-2">
            Confirm Logout
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm text-center mb-8">
            Are you sure you want to sign out of your account? 
          </p>

          {/* Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowLogoutModal(false)}
              className="flex-1 bg-gray-100 dark:bg-[#1A1F2E] hover:bg-gray-200 dark:hover:bg-[#252B3B] border border-gray-300 dark:border-[#2A3040] font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              {isLoggingOut ? "Logging out..." : "Yes, Logout"}
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
