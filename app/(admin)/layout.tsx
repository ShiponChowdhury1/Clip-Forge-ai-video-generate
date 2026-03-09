"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/redux/hooks";
import Sidebar from "@/app/components/dashboard/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const token = useAppSelector((state) => state.auth.token);
  const user = useAppSelector((state) => state.auth.user);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#1A3155] border-t-[#3B82F6] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Sidebar role="admin" />
      <main className="min-h-screen p-4 pt-18 lg:pt-6 lg:ml-[308px] lg:p-6">{children}</main>
    </div>
  );
}
