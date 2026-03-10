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
        url: `${API_BASE_URL}/v1/users/${userId}/status`,
        method: "PUT",
        body: { status },
      }),
    }),

    // 3. Get Subscription Plans
    getSubscriptions: builder.query<SubscriptionPlan[], void>({
      query: () => `${API_BASE_URL}/v1/subscriptions/?skip=0&limit=100`,
    }),

    // 4. Create Subscription Plan
    createSubscription: builder.mutation<SubscriptionPlan, Omit<SubscriptionPlan, "id" | "created_at">>({
      query: (body) => ({
        url: `${API_BASE_URL}/v1/subscriptions/`,
        method: "POST",
        body,
      }),
    }),

    // 5. Update Subscription Plan
    updateSubscription: builder.mutation<SubscriptionPlan, { id: number } & Omit<SubscriptionPlan, "id" | "created_at">>({
      query: ({ id, ...body }) => ({
        url: `${API_BASE_URL}/v1/subscriptions/${id}`,
        method: "PUT",
        body,
      }),
    }),

    // 6. Delete Subscription Plan
    deleteSubscription: builder.mutation<SubscriptionPlan, number>({
      query: (id) => ({
        url: `${API_BASE_URL}/v1/subscriptions/${id}`,
        method: "DELETE",
      }),
    }),

    // 7. Toggle Subscription Plan Status
    toggleSubscriptionStatus: builder.mutation<SubscriptionPlan, number>({
      query: (id) => ({
        url: `${API_BASE_URL}/v1/subscriptions/${id}/toggle-status`,
        method: "PUT",
      }),
    }),

    // 8. Get Privacy Policy
    getPrivacyPolicy: builder.query<PrivacyPolicy, void>({
      query: () => `${API_BASE_URL}/v1/privacy-policy/`,
    }),

    // 9. Update Privacy Policy
    updatePrivacyPolicy: builder.mutation<PrivacyPolicy, { content: string }>({
      query: (body) => ({
        url: `${API_BASE_URL}/v1/privacy-policy/`,
        method: "PUT",
        body,
      }),
    }),
  }),
});

export const {
  useGetAdminUsersQuery,
  useUpdateUserStatusMutation,
  useGetSubscriptionsQuery,
  useCreateSubscriptionMutation,
  useUpdateSubscriptionMutation,
  useDeleteSubscriptionMutation,
  useToggleSubscriptionStatusMutation,
  useGetPrivacyPolicyQuery,
  useUpdatePrivacyPolicyMutation,
} = adminApi;

// ─── Types ──────────────────────────────────────────────────────────────────

export interface AdminUsersParams {
  skip?: number;
  limit?: number;
  time_filter?: "all" | "7days" | "30days" | "90days";
  search?: string;
}

export interface SubscriptionPlan {
  id: number;
  name: string;
  monthly_price: number;
  monthly_credits: number;
  video_limit_per_month: number;
  priority_level: number;
  commercial_usage_allowed: boolean;
  max_video_duration: number;
  max_concurrent_jobs: number;
  max_queued_jobs: number;
  max_retry_attempts: number;
  plan_status: string;
  created_at: string;
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

export interface PrivacyPolicy {
  id: number;
  content: string;
  updated_at: string;
}
