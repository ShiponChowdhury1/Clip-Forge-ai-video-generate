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
  PanelLeftClose,
  PanelLeftOpen,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

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
        { name: "Dashboard",    href: "/dashboard",        icon: LayoutDashboard },
        { name: "Create Video", href: "/dashboard/create", icon: Plus            },
        { name: "All Videos",  href: "/dashboard/videos", icon: Video           },
      ],
    },
    {
      label: "Account",
      items: [
        { name: "Billing",         href: "/dashboard/billing",  icon: CreditCard    },
        { name: "Contact Support", href: "/dashboard/support",  icon: MessageCircle },
        { name: "Settings",        href: "/dashboard/settings", icon: Settings      },
      ],
    },
  ],
  admin: [
    {
      items: [
        { name: "Overview",          href: "/admin",                  icon: BarChart3 },
        { name: "Users",             href: "/admin/users",            icon: Users     },
        { name: "Usage History",     href: "/admin/usage-history",    icon: History   },
        { name: "Billing / Refunds", href: "/admin/billing-refunds",  icon: Receipt   },
        { name: "Settings",          href: "/admin/settings",         icon: Settings  },
      ],
    },
  ],
};

interface SidebarProps {
  role?: SidebarRole;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export default function Sidebar({ role = "user", onCollapsedChange }: SidebarProps) {
  const pathname  = usePathname();
  const router    = useRouter();
  const dispatch  = useAppDispatch();
  const user      = useAppSelector((state) => state.auth.user);
  const [logoutApi, { isLoading: isLoggingOut }] = useLogoutMutation();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [mobileOpen,      setMobileOpen]      = useState(false);
  const [collapsed,       setCollapsed]       = useState(false);

  const sections       = menusByRole[role];
  const canAccessAdmin = user?.role === "admin" || user?.role === "super_admin";

  useEffect(() => {
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

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleLogout = async () => {
    try { await logoutApi().unwrap(); } catch { /* ignore */ }
    dispatch(logoutAction());
    setShowLogoutModal(false);
    router.push("/");
  };

  /* ── shared helpers ── */
  const actionBtn = (col: boolean) =>
    `flex items-center ${col ? "justify-center px-0" : "gap-3 px-4"} py-2.5 rounded-lg text-sm font-medium w-full transition-all duration-200 border bg-gray-50 dark:bg-[#0B0E10] border-gray-200 dark:border-[#1A3155]`;

  const iconWrap = (col: boolean, colorCls: string) =>
    `w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${col ? "mx-auto" : ""} ${colorCls}`;

  const sidebarContent = (
    <aside
      className={`
        relative bg-white dark:bg-[#0A0A0A]
        border border-gray-200 dark:border-[#1F1F1F]
        rounded-xl flex flex-col z-40 overflow-visible
        transition-all duration-300 ease-in-out
        lg:fixed lg:left-6 lg:top-6
        ${collapsed ? "lg:w-20 lg:px-3 lg:py-6 p-3" : "lg:w-74 p-6"}
        w-[280px] h-full
      `}
      style={{ minHeight: "calc(100vh - 48px)" }}
    >
      {/* ── Logo ── */}
      <div className="pb-6 flex items-center justify-center relative">
        <Link href={role === "admin" ? "/admin" : "/dashboard"}>
          <Image
            src="/logo/sidebarLogo.png"
            alt="Clipforge"
            width={collapsed ? 48 : 100}
            height={collapsed ? 48 : 100}
            className={`rounded-xl transition-all duration-300 ${collapsed ? "w-12 h-12" : "w-[100px]"}`}
          />
        </Link>

        {/* Mobile close */}
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden absolute right-0 w-9 h-9 rounded-lg bg-gray-100 dark:bg-[#1A2332] border border-gray-200 dark:border-[#1A3155] flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 py-2 space-y-1.5 overflow-y-auto">
        {sections.map((section, sIdx) => (
          <div key={sIdx} className={section.label ? "pt-5 space-y-1.5" : "space-y-1.5"}>
            {section.label && !collapsed && (
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-2 mb-2">
                {section.label}
              </p>
            )}
            {section.label && collapsed && (
              <div className="border-t border-gray-200 dark:border-[#1F1F1F] my-2" />
            )}

            {section.items.map((item) => {
              const Icon     = item.icon;
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
                  className={`flex items-center ${collapsed ? "justify-center px-0 py-3" : "gap-3 px-4 py-3"} rounded-lg text-sm font-medium transition-all duration-200 border ${
                    isActive
                      ? "bg-[#2563EB] border-[#2563EB] text-white"
                      : "bg-gray-50 dark:bg-[#0B0E10] border-gray-200 dark:border-[#1A3155] text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-[#2563EB]/10 hover:text-gray-900 dark:hover:text-gray-100 hover:border-blue-300 dark:hover:border-[#2563EB]/50"
                  }`}
                >
                  <Icon className="w-[18px] h-[18px] shrink-0" />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* ── Bottom Section (no profile — topbar এ আছে) ── */}
      <div className="pt-4 border-t border-gray-200 dark:border-[#1F1F1F] space-y-1.5">

        {/* 1. Switch to Admin */}
        {role === "user" && canAccessAdmin && (
          <button
            onClick={() => router.push("/admin")}
            title={collapsed ? "Switch to Admin" : undefined}
            className={`${actionBtn(collapsed)} text-[#2563EB] hover:bg-blue-50 dark:hover:bg-[#2563EB]/10 hover:border-[#2563EB]/50`}
          >
            <span className={iconWrap(collapsed, "bg-[#2563EB]/10 text-[#2563EB]")}>
              <ShieldCheck className="w-4 h-4" />
            </span>
            {!collapsed && "Switch to Admin"}
          </button>
        )}

        {/* 1. Switch to User */}
        {role === "admin" && canAccessAdmin && (
          <button
            onClick={() => router.push("/dashboard")}
            title={collapsed ? "Switch to User" : undefined}
            className={`${actionBtn(collapsed)} text-[#2563EB] hover:bg-blue-50 dark:hover:bg-[#2563EB]/10 hover:border-[#2563EB]/50`}
          >
            <span className={iconWrap(collapsed, "bg-[#2563EB]/10 text-[#2563EB]")}>
              <LayoutDashboard className="w-4 h-4" />
            </span>
            {!collapsed && "Switch to User"}
          </button>
        )}

        {/* 2. Logout */}
        <button
          onClick={() => setShowLogoutModal(true)}
          title={collapsed ? "Logout" : undefined}
          className={`${actionBtn(collapsed)} text-red-400 hover:bg-red-500/5 dark:hover:bg-red-500/10 hover:border-red-500/30`}
        >
          <span className={iconWrap(collapsed, "bg-red-500/10 text-red-400")}>
            <LogOut className="w-4 h-4" />
          </span>
          {!collapsed && "Logout"}
        </button>

        {/* 3. Collapse / Expand — desktop only */}
        <button
          onClick={toggleCollapsed}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={`hidden lg:flex items-center ${collapsed ? "justify-center px-0" : "gap-3 px-4"} py-2.5 rounded-lg text-sm font-medium w-full transition-all duration-200 border bg-gray-50 dark:bg-[#0B0E10] border-gray-200 dark:border-[#1A3155] text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1A2332] hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-[#2A3A55]`}
        >
          <span className={iconWrap(collapsed, "bg-gray-100 dark:bg-[#1A2332] text-gray-500 dark:text-gray-400")}>
            {collapsed
              ? <PanelLeftOpen  className="w-4 h-4" />
              : <PanelLeftClose className="w-4 h-4" />
            }
          </span>
          {!collapsed && "Hide Sidebar"}
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-11 h-11 rounded-lg bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:border-[#2563EB] transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Desktop sidebar */}
      <div className="hidden lg:block">{sidebarContent}</div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10">{sidebarContent}</div>
        </div>
      )}

      {/* Logout modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[9999] grid place-items-center p-4">
          <div className="absolute inset-0 bg-black/45 backdrop-blur-xl" onClick={() => setShowLogoutModal(false)} />
          <div className="relative z-10 bg-white dark:bg-[#0D1117] border border-gray-200 dark:border-[#1A3155] rounded-2xl p-8 w-full max-w-md shadow-2xl dark:shadow-black/50 animate-in">
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-center mb-2">Confirm Logout</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm text-center mb-8">
              Are you sure you want to sign out of your account?
            </p>
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