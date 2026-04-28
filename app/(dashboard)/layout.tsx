"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { useGetMeQuery } from "@/lib/redux/features/auth/authApi";
import { setUser } from "@/lib/redux/features/auth/authSlice";
import Sidebar from "@/app/components/dashboard/Sidebar";
import { MuteProvider } from "@/app/components/dashboard/MuteContext";

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

export default function DashboardLayout({
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    () => typeof window !== "undefined" && localStorage.getItem("sidebar-collapsed") === "true"
  );

  // Use a ref to avoid including `user` in the dependency array,
  // which would cause an infinite loop: setUser -> user changes -> effect re-runs -> setUser...
  const userRef = useRef(user);
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    if (!profile) return;

    const currentUser = userRef.current;
    const normalizedProfilePlan = profile.subscription_plan?.trim();
    const resolvedPlan = normalizedProfilePlan || currentUser?.subscription_plan || "Free";
    const resolvedPicture = resolveProfileImageUrl(profile.profile_image_url, currentUser?.picture);

    const freshUser = {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      credits: profile.credits,
      subscription_plan: resolvedPlan,
      role: profile.role,
      picture: resolvedPicture,
    };

    const isSameUser =
      currentUser?.id === freshUser.id &&
      currentUser?.name === freshUser.name &&
      currentUser?.email === freshUser.email &&
      currentUser?.credits === freshUser.credits &&
      (currentUser?.subscription_plan || "Free") === freshUser.subscription_plan &&
      currentUser?.role === freshUser.role &&
      currentUser?.picture === freshUser.picture;

    if (isSameUser) return;

    dispatch(setUser(freshUser));
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(freshUser));
    }
  }, [dispatch, profile]);

  useEffect(() => {
    if (!token) {
      const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!storedToken) router.replace("/");
      return;
    }

    if (effectiveRole && !["user", "admin", "super_admin"].includes(effectiveRole)) {
      router.replace("/");
    }
  }, [token, effectiveRole, router]);

  if (!token) {
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
        <main className={`min-h-screen p-4 pt-18 lg:pt-6 lg:p-6 transition-all duration-300 ${sidebarCollapsed ? "lg:ml-26" : "lg:ml-77"}`}>
          {children}
        </main>
      </div>
    </MuteProvider>
  );
}
