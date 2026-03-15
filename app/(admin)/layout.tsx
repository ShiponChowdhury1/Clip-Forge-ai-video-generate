"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { useGetMeQuery } from "@/lib/redux/features/auth/authApi";
import { setUser } from "@/lib/redux/features/auth/authSlice";
import Sidebar from "@/app/components/dashboard/Sidebar";

const isAdminRole = (role?: string | null) => role === "admin" || role === "super_admin";

const normalizeRole = (role?: string | null) => (role || "").toLowerCase();

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://10.10.12.3:8000/api";
const ORIGIN = API_BASE_URL.replace(/\/api$/, "");

const resolveProfileImageUrl = (url?: string | null, fallback?: string) => {
  if (!url) return fallback;
  return url.startsWith("http") ? url : `${ORIGIN}${url}`;
};

const getStoredRole = () => {
  if (typeof window === "undefined") return "";
  try {
    const parsed = JSON.parse(localStorage.getItem("user") || "{}");
    return normalizeRole((parsed as { role?: string }).role);
  } catch {
    return "";
  }
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const user = useAppSelector((state) => state.auth.user);
  const { data: profile } = useGetMeQuery(undefined, { skip: !token });
  const storedRole = getStoredRole();
  const effectiveRole = normalizeRole(profile?.role || user?.role) || storedRole;
  const [mounted, setMounted] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved === "true") setSidebarCollapsed(true);
  }, []);

  // Sync fresh profile data into Redux + localStorage
  useEffect(() => {
    if (profile) {
      const freshUser = {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        credits: profile.credits,
        subscription_plan: profile.subscription_plan,
        role: profile.role || user?.role || "admin",
        picture: resolveProfileImageUrl(profile.profile_image_url, user?.picture),
      };
      dispatch(setUser(freshUser));
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(freshUser));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, user?.picture]);

  useEffect(() => {
    if (mounted) {
      const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token && !storedToken) {
        router.replace("/");
      } else if (effectiveRole && !isAdminRole(effectiveRole)) {
        router.replace("/dashboard");
      }
    }
  }, [mounted, token, effectiveRole, router]);

  if (!mounted || !token || (effectiveRole && !isAdminRole(effectiveRole))) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-300 dark:border-[#1A3155] border-t-[#3B82F6] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Sidebar role="admin" onCollapsedChange={setSidebarCollapsed} />
      <main className={`min-h-screen p-4 pt-18 lg:pt-6 lg:p-6 transition-all duration-300 ${sidebarCollapsed ? "lg:ml-26" : "lg:ml-77"}`}>{children}</main>
    </div>
  );
}
