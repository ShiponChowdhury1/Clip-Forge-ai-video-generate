"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/redux/hooks";
import { Navbar } from "@/app/components";

const isAdminRole = (role?: string | null) => role === "admin" || role === "super_admin";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const token = useAppSelector((state) => state.auth.token);
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (token) {
      router.replace(isAdminRole(user?.role) ? "/admin" : "/dashboard");
    }
  }, [token, user, router]);

  if (token) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-300 dark:border-[#1A3155] border-t-[#3B82F6] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-6 sm:py-8">
        {children}
      </div>
    </div>
  );
}
