import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://10.10.12.3:8000/api";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/v1/auth`,
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
    // 1. Register
    register: builder.mutation<
      RegisterResponse,
      RegisterRequest
    >({
      query: (body) => ({
        url: "/register",
        method: "POST",
        body,
      }),
    }),

    // 2. Login (OAuth2 form-urlencoded)
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: ({ email, password }) => ({
        url: "/login",
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "password",
          username: email,
          password,
          scope: "",
          client_id: "string",
          client_secret: "string",
        }).toString(),
      }),
    }),

    // 3. Forgot Password
    forgotPassword: builder.mutation<MessageResponse, ForgotPasswordRequest>({
      query: (body) => ({
        url: "/forgot-password",
        method: "POST",
        body,
      }),
    }),

    // 4. Verify OTP
    verifyOtp: builder.mutation<MessageResponse, VerifyOtpRequest>({
      query: (body) => ({
        url: "/verify-otp",
        method: "POST",
        body,
      }),
    }),

    // 5. Reset Password
    resetPassword: builder.mutation<MessageResponse, ResetPasswordRequest>({
      query: (body) => ({
        url: "/reset-password",
        method: "POST",
        body,
      }),
    }),

    // 6. Google Auth
    googleAuth: builder.mutation<LoginResponse, GoogleAuthRequest>({
      query: (body) => ({
        url: "/google",
        method: "POST",
        body,
      }),
    }),

    // 7. Logout
    logout: builder.mutation<MessageResponse, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),

    // 8. Get current user profile
    getMe: builder.query<UserProfile, void>({
      query: () => ({
        url: "/me",
        method: "GET",
      }),
    }),

    // 9. Request OTP for Change Password (Authenticated)
    requestChangePasswordOtp: builder.mutation<MessageResponse, void>({
      query: () => ({
        url: "/change-password/request-otp",
        method: "POST",
      }),
    }),

    // 10. Verify OTP for Change Password
    verifyChangePasswordOtp: builder.mutation<MessageResponse, ChangePasswordVerifyOtpRequest>({
      query: (body) => ({
        url: "/change-password/verify-otp",
        method: "POST",
        body,
      }),
    }),

    // 11. Change Password
    changePassword: builder.mutation<MessageResponse, ChangePasswordRequest>({
      query: (body) => ({
        url: "/change-password",
        method: "POST",
        body,
      }),
    }),

    // 12. Verify Register OTP
    verifyRegisterOtp: builder.mutation<MessageResponse, VerifyOtpRequest>({
      query: (body) => ({
        url: "/register-otp",
        method: "POST",
        body,
      }),
    }),

    // 13. Resend OTP
    resendOtp: builder.mutation<MessageResponse, ForgotPasswordRequest>({
      query: (body) => ({
        url: "/resend-otp",
        method: "POST",
        body,
      }),
    }),
  }),
});


// Types
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  name: string;
  email: string;
  id: number;
  credits: number;
  subscription_plan: string;
  created_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    name: string;
    email: string;
    credits: number;
    subscription_plan: string;
    role: string;
    created_at: string;
  };
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordRequest {
  email: string;
  new_password: string;
}

export interface GoogleAuthRequest {
  token: string;
}

export interface ChangePasswordVerifyOtpRequest {
  otp: string;
}

export interface ChangePasswordRequest {
  new_password: string;
}

export interface MessageResponse {
  message: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  credits: number;
  subscription_plan: string;
  created_at: string;
}

export const {
  useRegisterMutation,
  useLoginMutation,
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
  useGoogleAuthMutation,
  useLogoutMutation,
  useGetMeQuery,
  useRequestChangePasswordOtpMutation,
  useVerifyChangePasswordOtpMutation,
  useChangePasswordMutation,
  useVerifyRegisterOtpMutation,
  useResendOtpMutation,
} = authApi;
