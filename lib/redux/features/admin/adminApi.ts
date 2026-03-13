import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  AdminUsersParams,
  AdminUser,
  SubscriptionPlan,
  AdminOverview,
  PrivacyPolicy,
  AdminBillingParams,
  AdminBillingResponse,
  AdminLogEntry,
  AdminFaq,
  AdminFaqParams,
  CreateAdminFaqPayload,
  UpdateAdminFaqPayload,
  LegalPolicies,
  LegalPoliciesPayload,
} from "@/types/admin";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://10.10.12.3:8000/api";

export const adminApi = createApi({
  reducerPath: "adminApi",
  tagTypes: ["AdminFaq", "AdminPolicies"],
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

    // 8. Get Admin Overview
    getAdminOverview: builder.query<AdminOverview, string>({
      query: (time_filter = "all") => `/overview?time_filter=${time_filter}`,
    }),

    // 9. Get Admin Billing
    getAdminBilling: builder.query<AdminBillingResponse, AdminBillingParams>({
      query: ({ skip = 0, limit = 50, time_filter = "all" } = {}) =>
        `/billing?skip=${skip}&limit=${limit}&time_filter=${time_filter}`,
    }),

    // 10. Get Admin Logs
    getAdminLogs: builder.query<AdminLogEntry[], { skip?: number; limit?: number }>({
      query: ({ skip = 0, limit = 50 } = {}) => `/logs?skip=${skip}&limit=${limit}`,
    }),

    // 11. Delete Admin Log
    deleteAdminLog: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/logs/${id}`,
        method: "DELETE",
      }),
    }),

    // 11. Get Privacy Policy
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

    // 12. Get Unified Policies
    getAdminPolicies: builder.query<LegalPolicies[], void>({
      query: () => "/policies",
      providesTags: ["AdminPolicies"],
    }),

    // 13. Create Unified Policies
    createAdminPolicies: builder.mutation<LegalPolicies, LegalPoliciesPayload>({
      query: (body) => ({
        url: "/policies",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AdminPolicies"],
    }),

    // 14. Update Unified Policies
    updateAdminPolicies: builder.mutation<LegalPolicies, { id: number; body: LegalPoliciesPayload }>({
      query: ({ id, body }) => ({
        url: `/policies/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["AdminPolicies"],
    }),

    // 15. Get FAQ
    getAdminFaq: builder.query<AdminFaq[], AdminFaqParams>({
      query: ({ skip = 0, limit = 50 } = {}) => `/faq?skip=${skip}&limit=${limit}`,
      providesTags: ["AdminFaq"],
    }),

    // 16. Create FAQ
    createAdminFaq: builder.mutation<AdminFaq, CreateAdminFaqPayload>({
      query: (body) => ({
        url: "/faq",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AdminFaq"],
    }),

    // 17. Update FAQ
    updateAdminFaq: builder.mutation<AdminFaq, UpdateAdminFaqPayload>({
      query: ({ id, ...body }) => ({
        url: `/faq/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["AdminFaq"],
    }),

    // 18. Delete FAQ
    deleteAdminFaq: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/faq/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdminFaq"],
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
  useGetAdminOverviewQuery,
  useGetAdminBillingQuery,
  useGetAdminLogsQuery,
  useDeleteAdminLogMutation,
  useGetPrivacyPolicyQuery,
  useUpdatePrivacyPolicyMutation,
  useGetAdminPoliciesQuery,
  useCreateAdminPoliciesMutation,
  useUpdateAdminPoliciesMutation,
  useGetAdminFaqQuery,
  useCreateAdminFaqMutation,
  useUpdateAdminFaqMutation,
  useDeleteAdminFaqMutation,
} = adminApi;

export type {
  AdminUsersParams,
  AdminUser,
  SubscriptionPlan,
  AdminOverview,
  PrivacyPolicy,
  AdminBillingParams,
  AdminBillingResponse,
  AdminBillingRecord,
  AdminLogEntry,
  AdminFaq,
  AdminFaqParams,
  CreateAdminFaqPayload,
  UpdateAdminFaqPayload,
  LegalPolicies,
  LegalPoliciesPayload,
} from "@/types/admin";
