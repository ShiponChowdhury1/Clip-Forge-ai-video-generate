import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://10.10.12.3:8000/api";

interface SubscriptionCheckoutRequest {
  plan_id: number;
}

interface SubscriptionCheckoutResponse {
  checkout_url: string;
}

interface CreditCheckoutRequest {
  package_id: number;
}

interface CreditCheckoutResponse {
  checkout_url: string;
}

/** Build the Stripe success redirect URL from the current origin */
const getSuccessUrl = () => {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/dashboard/billing?payment_success=true`;
  }
  return "https://clipforgereels.com/dashboard/billing?payment_success=true";
};

export const billingApi = createApi({
  reducerPath: "billingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/v1/payments`,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as { auth: { token: string | null } };
      const tokenFromState = state.auth.token;
      const tokenFromStorage =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const token = tokenFromState || tokenFromStorage;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  endpoints: (builder) => ({
    // Subscription plan checkout → returns Stripe checkout URL
    subscriptionCheckout: builder.mutation<
      SubscriptionCheckoutResponse,
      SubscriptionCheckoutRequest
    >({
      query: (body) => ({
        url: "/subscription/checkout",
        method: "POST",
        body: {
          ...body,
          success_url: getSuccessUrl(),
        },
      }),
    }),

    // Credit package checkout → returns Stripe checkout URL
    creditCheckout: builder.mutation<
      CreditCheckoutResponse,
      CreditCheckoutRequest
    >({
      query: (body) => ({
        url: "/credit/checkout",
        method: "POST",
        body: {
          ...body,
          success_url: getSuccessUrl(),
        },
      }),
    }),
  }),
});

export const {
  useSubscriptionCheckoutMutation,
  useCreditCheckoutMutation,
} = billingApi;

