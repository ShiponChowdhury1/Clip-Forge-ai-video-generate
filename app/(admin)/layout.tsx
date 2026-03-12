"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { useGetMeQuery } from "@/lib/redux/features/auth/authApi";
import { setUser } from "@/lib/redux/features/auth/authSlice";
import Sidebar from "@/app/components/dashboard/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const user = useAppSelector((state) => state.auth.user);
  const [mounted, setMounted] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const { data: profile } = useGetMeQuery(undefined, { skip: !token });

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved === "true") setSidebarCollapsed(true);
  }, []);

  // Sync fresh profile data into Redux + localStorage
  useEffect(() => {
    if (profile && user) {
      if (profile.name !== user.name || profile.email !== user.email) {
        const freshUser = {
          ...user,
          id: profile.id,
          name: profile.name,
          email: profile.email,
          credits: profile.credits,
          subscription_plan: profile.subscription_plan,
          role: profile.role || user.role,
        };
        dispatch(setUser(freshUser));
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(freshUser));
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  useEffect(() => {
    if (mounted) {
      if (!token) {
        router.replace("/");
      } else if (user && user.role !== "admin") {
        router.replace("/dashboard");
      }
    }
  }, [mounted, token, user, router]);

  if (!mounted || !token || (user && user.role !== "admin")) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-300 dark:border-[#1A3155] border-t-[#3B82F6] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Sidebar role="admin" onCollapsedChange={setSidebarCollapsed} />
      <main className={`min-h-screen p-4 pt-18 lg:pt-6 lg:p-6 transition-all duration-300 ${sidebarCollapsed ? "lg:ml-[104px]" : "lg:ml-[308px]"}`}>{children}</main>
    </div>
  );
}
