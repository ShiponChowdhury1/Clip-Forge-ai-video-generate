"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import {
  useUpdateUserRoleMutation,
  type AdminUser,
} from "@/lib/redux/features/admin/adminApi";
import { useAppSelector } from "@/lib/redux/hooks";
import { useGetMeQuery } from "@/lib/redux/features/auth/authApi";

type ManagedRole = "user" | "admin" | "super_admin";

function normalizeRole(role?: string | null): string {
  return (role || "").toLowerCase().replace(/\s+/g, "_").trim();
}

function isSuperAdmin(role?: string | null): boolean {
  return normalizeRole(role) === "super_admin";
}

function decodeBase64Url(value: string): string {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4;
  const padded = padding ? normalized + "=".repeat(4 - padding) : normalized;

  if (typeof atob === "function") {
    return atob(padded);
  }

  return "";
}

function getRoleFromToken(token?: string | null): string | null {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const decoded = JSON.parse(decodeBase64Url(payload)) as {
      role?: string;
    };
    return decoded.role ?? null;
  } catch {
    return null;
  }
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function roleLabel(role: ManagedRole): string {
  if (role === "super_admin") return "Super Admin";
  if (role === "admin") return "Admin";
  return "User";
}

function getApiErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === "object" && error !== null) {
    const maybeData = (error as { data?: unknown }).data;
    if (typeof maybeData === "object" && maybeData !== null) {
      const detail = (maybeData as { detail?: unknown }).detail;
      if (typeof detail === "string" && detail.trim()) {
        return detail;
      }
    }
  }
  return fallback;
}

export function AdminRoles() {
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);
  const [localRoles, setLocalRoles] = useState<Record<number, ManagedRole>>({});
  const [listActionStatus, setListActionStatus] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [allUsers, setAllUsers] = useState<AdminUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [storedRole, setStoredRole] = useState("");
  const token = useAppSelector((state) => state.auth.token);
  const currentUser = useAppSelector((state) => state.auth.user);
  const { data: me } = useGetMeQuery(undefined, { skip: !token });
  const [updateUserRole] = useUpdateUserRoleMutation();

  const tokenRole = getRoleFromToken(token);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      const parsed = raw ? (JSON.parse(raw) as { role?: string }) : {};
      setStoredRole(normalizeRole(parsed.role));
    } catch {
      setStoredRole("");
    }
  }, []);

  const canManageRoles =
    isSuperAdmin(me?.role) ||
    isSuperAdmin(currentUser?.role) ||
    isSuperAdmin(tokenRole) ||
    storedRole === "super_admin";

  useEffect(() => {
    let ignore = false;

    const loadAllUsers = async () => {
      if (!token) return;
      setLoadingUsers(true);
      setListActionStatus("");

      try {
        const apiRoot = process.env.NEXT_PUBLIC_API_URL || "http://10.10.12.3:8000/api";
        const pageSize = 100;
        let skip = 0;
        const collected: AdminUser[] = [];

        while (true) {
          const res = await fetch(`${apiRoot}/v1/admin/users?skip=${skip}&limit=${pageSize}&time_filter=all`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!res.ok) break;

          const page = (await res.json()) as AdminUser[];
          if (!Array.isArray(page) || page.length === 0) break;

          collected.push(...page);
          if (page.length < pageSize) break;
          skip += pageSize;
        }

        if (!ignore) {
          setAllUsers(collected);
        }
      } catch (error) {
        if (!ignore) {
          setAllUsers([]);
          setListActionStatus(getApiErrorMessage(error, "Failed to load users list. Check network or request-blocking extension."));
        }
      } finally {
        if (!ignore) {
          setLoadingUsers(false);
        }
      }
    };

    loadAllUsers();

    return () => {
      ignore = true;
    };
  }, [token]);

  const admins = useMemo(() => {
      const fromApi = allUsers;

      const profileUser = me
        ? {
            id: me.id,
            name: me.name,
            email: me.email,
            is_verified: true,
            subscription_plan: me.subscription_plan,
            total_payment_made: 0,
            credits_left: me.credits,
            credits_used: 0,
            total_videos_generated: 0,
            status: "active" as const,
            role: me.role,
            created_at: me.created_at,
          }
        : null;

      const effectiveCurrentUser =
        currentUser ??
        (profileUser
          ? {
              id: profileUser.id,
              name: profileUser.name,
              email: profileUser.email,
              credits: profileUser.credits_left,
              subscription_plan: profileUser.subscription_plan,
              role: profileUser.role,
            }
          : null);

      const seen = new Set<number>();
      const deduped = fromApi.filter((user) => {
        if (seen.has(user.id)) return false;
        seen.add(user.id);
        return true;
      });

      if (!effectiveCurrentUser) {
        return deduped;
      }

      const alreadyIncluded = deduped.some((user) => user.id === effectiveCurrentUser.id);
      if (alreadyIncluded) return deduped;

      return [
        {
          id: effectiveCurrentUser.id,
          name: effectiveCurrentUser.name,
          email: effectiveCurrentUser.email,
          is_verified: true,
          subscription_plan: effectiveCurrentUser.subscription_plan,
          total_payment_made: 0,
          credits_left: effectiveCurrentUser.credits,
          credits_used: 0,
          total_videos_generated: 0,
          status: "active",
          role: effectiveCurrentUser.role,
          created_at: "",
        },
        ...deduped,
      ];
    },
    [allUsers, currentUser, me],
  );

  const perPage = 10;
  const normalizedEmailQuery = searchEmail.trim().toLowerCase();

  const filteredAdmins = useMemo(() => {
    if (!normalizedEmailQuery) return admins;
    return admins.filter((user) => user.email.toLowerCase().includes(normalizedEmailQuery));
  }, [admins, normalizedEmailQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredAdmins.length / perPage));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedAdmins = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return filteredAdmins.slice(start, start + perPage);
  }, [filteredAdmins, currentPage]);

  const pageNumbers = useMemo(() => {
    const maxVisiblePages = 3;
    const tentativeStart = Math.max(1, currentPage - 1);
    const startPage = Math.min(
      tentativeStart,
      Math.max(1, totalPages - maxVisiblePages + 1)
    );
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  }, [currentPage, totalPages]);

  const handleRoleChange = async (userId: number, nextRole: ManagedRole) => {
    if (!canManageRoles) return;
    setListActionStatus("");
    const previousRole = localRoles[userId] ?? admins.find((a) => a.id === userId)?.role;
    if (previousRole === nextRole) {
      setListActionStatus(`Role is already ${roleLabel(nextRole)}.`);
      return;
    }
    setLocalRoles((prev) => ({ ...prev, [userId]: nextRole }));
    setUpdatingUserId(userId);

    try {
      await updateUserRole({ userId, role: nextRole }).unwrap();
      const successMessage =
        nextRole === "super_admin"
          ? "Super admin successfully."
          : nextRole === "admin"
            ? "Admin successfully."
            : "User successfully.";
      toast.success(successMessage);
      setListActionStatus("");
    } catch (error) {
      const errorMessage = getApiErrorMessage(error, "Role update failed.");
      setListActionStatus(errorMessage);
      toast.error(errorMessage);
      if (previousRole) {
        setLocalRoles((prev) => ({ ...prev, [userId]: previousRole }));
      }
    } finally {
      setUpdatingUserId(null);
    }
  };

  return (
    <div className="bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-2xl p-4 sm:p-6 md:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <h2 className="text-gray-900 dark:text-white text-lg sm:text-xl font-bold">
          Admins & Security
        </h2>
        <input
          type="text"
          value={searchEmail}
          onChange={(e) => {
            setSearchEmail(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search by email"
          className="w-full sm:w-95 bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-[#2563EB]"
        />
      </div>

      {listActionStatus && (
        <div className="mb-4 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-2 text-xs sm:text-sm text-cyan-300">
          {listActionStatus}
        </div>
      )}

      {loadingUsers ? (
        <div className="space-y-3 sm:space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-gray-50 dark:bg-[#0A0F18] border border-gray-200 dark:border-[#1A3155] rounded-xl p-4 sm:p-5 animate-pulse"
            >
              <div className="h-4 w-40 bg-gray-200 dark:bg-[#1A2332] rounded mb-3" />
              <div className="h-3 w-56 bg-gray-200 dark:bg-[#1A2332] rounded" />
            </div>
          ))}
        </div>
      ) : filteredAdmins.length === 0 ? (
        <div className="bg-gray-50 dark:bg-[#0A0F18] border border-gray-200 dark:border-[#1A3155] rounded-xl p-6 text-sm text-gray-600 dark:text-gray-400">
          No users found for this email.
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {paginatedAdmins.map((admin) => {
            const activeRole = localRoles[admin.id] ?? admin.role;
            const isUpdating = updatingUserId === admin.id;

            return (
              <div
                key={admin.id}
                className="bg-gray-50 dark:bg-[#0A0F18] border border-gray-200 dark:border-[#1A3155] rounded-xl p-3 sm:p-4 md:p-5 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#2563EB] flex items-center justify-center text-white font-semibold text-xs sm:text-sm shrink-0">
                    {getInitials(admin.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-gray-900 dark:text-white font-semibold text-sm truncate">{admin.name}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5 truncate">{admin.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={activeRole}
                    onChange={(e) => handleRoleChange(admin.id, e.target.value as ManagedRole)}
                    disabled={isUpdating || !canManageRoles}
                    className="bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-lg px-3 py-2 text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#2563EB] disabled:opacity-70"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                  <span className="text-xs font-medium text-cyan-400 bg-cyan-400/10  py-3 rounded-full min-w-23 text-center">
                    {isUpdating ? (
                      <span className="inline-flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Updating
                      </span>
                    ) : (
                      roleLabel(activeRole)
                    )}
                  </span>
                </div>
              </div>
            );
          })}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-gray-200 dark:border-[#1A3155]">
            <p className="text-xs sm:text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 sm:px-4 py-2 rounded-lg bg-gray-100 dark:bg-[#1A2332] border border-gray-300 dark:border-[#1A3155] text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-[#2563EB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {pageNumbers.map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`min-w-9 px-2.5 py-2 rounded-lg border text-xs sm:text-sm transition-colors ${
                    currentPage === page
                      ? "bg-cyan-500 border-cyan-500 text-white"
                      : "bg-gray-100 dark:bg-[#1A2332] border-gray-300 dark:border-[#1A3155] text-gray-700 dark:text-gray-300 hover:border-[#2563EB]"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 sm:px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white text-xs sm:text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
