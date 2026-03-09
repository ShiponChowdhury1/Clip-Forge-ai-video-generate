"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/redux/hooks";
import Sidebar from "@/app/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const token = useAppSelector((state) => state.auth.token);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !token) {
      router.replace("/");
    }
  }, [mounted, token, router]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#1A3155] border-t-[#3B82F6] rounded-full animate-spin" />
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#1A3155] border-t-[#3B82F6] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Sidebar />
      <main className="min-h-screen p-4 pt-18 lg:pt-6 lg:ml-[308px] lg:p-6">{children}</main>
    </div>
  );
}
