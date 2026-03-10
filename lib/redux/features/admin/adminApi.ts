import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://10.10.12.3:8000/api";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/v1/admin`,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as { auth: { token: string | null } };
      const token = state.auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // 1. Get Users
    getAdminUsers: builder.query<AdminUser[], AdminUsersParams>({
      query: ({ skip = 0, limit = 10, time_filter = "all", search } = {}) => {
        const params = new URLSearchParams({
          skip: String(skip),
          limit: String(limit),
          time_filter,
        });
        if (search) params.set("search", search);
        return `/users?${params.toString()}`;
      },
    }),

    // 2. Suspend / Activate User
    updateUserStatus: builder.mutation<void, { userId: number; status: "active" | "suspended" }>({
      query: ({ userId, status }) => ({
        url: `/users/${userId}/status`,
        method: "PATCH",
        body: { status },
      }),
    }),
  }),
});

export const {
  useGetAdminUsersQuery,
  useUpdateUserStatusMutation,
} = adminApi;

// ─── Types ──────────────────────────────────────────────────────────────────

export interface AdminUsersParams {
  skip?: number;
  limit?: number;
  time_filter?: "all" | "7days" | "30days" | "90days";
  search?: string;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  is_verified: boolean;
  subscription_plan: string;
  total_payment_made: number;
  credits_left: number;
  credits_used: number;
  total_videos_generated: number;
  status: "active" | "suspended";
  role: string;
  created_at: string;
}
