"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/redux/hooks";
import Sidebar from "@/app/components/dashboard/Sidebar";
import { MuteProvider } from "@/app/components/dashboard/MuteContext";

const normalizeRole = (role?: string | null) => (role || "").toLowerCase();

const getStoredRole = () => {
  if (typeof window === "undefined") return "";
  try {
    const parsed = JSON.parse(localStorage.getItem("user") || "{}");
    return normalizeRole((parsed as { role?: string }).role);
  } catch {
    return "";
  }
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const token = useAppSelector((state) => state.auth.token);
  const user = useAppSelector((state) => state.auth.user);
  const storedRole = getStoredRole();
  const effectiveRole = normalizeRole(user?.role) || storedRole;
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    () => typeof window !== "undefined" && localStorage.getItem("sidebar-collapsed") === "true"
  );

  useEffect(() => {
    if (!token) {
      const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!storedToken) router.replace("/");
      return;
    }

    if (effectiveRole === "admin") {
      router.replace("/admin");
      return;
    }

    if (effectiveRole && !["user", "super_admin"].includes(effectiveRole)) {
      router.replace("/");
    }
  }, [token, effectiveRole, router]);

  if (!token || effectiveRole === "admin") {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-300 dark:border-[#1A3155] border-t-[#3B82F6] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <MuteProvider>
      <div className="min-h-screen bg-white dark:bg-black">
        <Sidebar onCollapsedChange={setSidebarCollapsed} />
        <main className={`min-h-screen p-4 pt-18 lg:pt-6 lg:p-6 transition-all duration-300 ${sidebarCollapsed ? "lg:ml-[104px]" : "lg:ml-[308px]"}`}>{children}</main>
      </div>
    </MuteProvider>
  );
}
