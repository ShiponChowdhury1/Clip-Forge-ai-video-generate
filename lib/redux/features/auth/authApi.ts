import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  AuthUser,
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  ForgotPasswordRequest,
  VerifyOtpRequest,
  ResetPasswordRequest,
  GoogleAuthRequest,
  ChangePasswordVerifyOtpRequest,
  ChangePasswordRequest,
  MessageResponse,
  UserProfile,
  UpdateProfileResponse,
} from "@/types/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://10.10.12.3:8000/api";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/v1/auth`,
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
      queryFn: () => {
        const readStoredUser = (): AuthUser | null => {
          if (typeof window === "undefined") return null;
          try {
            const raw = localStorage.getItem("user");
            if (!raw) return null;
            const parsed = JSON.parse(raw) as Partial<AuthUser>;
            if (
              typeof parsed.id !== "number" ||
              typeof parsed.name !== "string" ||
              typeof parsed.email !== "string"
            ) {
              return null;
            }

            return {
              id: parsed.id,
              name: parsed.name,
              email: parsed.email,
              credits: typeof parsed.credits === "number" ? parsed.credits : 0,
              subscription_plan:
                typeof parsed.subscription_plan === "string"
                  ? parsed.subscription_plan
                  : "",
              role:
                parsed.role === "admin" ||
                parsed.role === "super_admin" ||
                parsed.role === "user"
                  ? parsed.role
                  : "user",
              picture:
                typeof parsed.picture === "string" ? parsed.picture : undefined,
            };
          } catch {
            return null;
          }
        };

        const user = readStoredUser();

        if (!user) {
          return {
            error: {
              status: 404,
              data: "User not found in local auth state",
            },
          };
        }

        return {
          data: {
            id: user.id,
            name: user.name,
            email: user.email,
            credits: user.credits,
            subscription_plan: user.subscription_plan,
            role: user.role,
            profile_image_url: user.picture ?? null,
            created_at: "",
          },
        };
      },
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

    // 14. Update Profile (name + profile image)
    updateProfile: builder.mutation<UpdateProfileResponse, FormData>({
      query: (formData) => ({
        url: `${API_BASE_URL}/v1/users/update-profile`,
        method: "PUT",
        body: formData,
      }),
    }),

    // 15. Get user credit balance
    getUserCreditBalance: builder.query<number, number>({
      query: (userId) => ({
        url: `${API_BASE_URL}/v1/users/${userId}/credit-balance`,
        method: "GET",
      }),
    }),
  }),
});

export type {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  ForgotPasswordRequest,
  VerifyOtpRequest,
  ResetPasswordRequest,
  GoogleAuthRequest,
  ChangePasswordVerifyOtpRequest,
  ChangePasswordRequest,
  MessageResponse,
  UserProfile,
  UpdateProfileResponse,
} from "@/types/auth";

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
  useUpdateProfileMutation,
  useGetUserCreditBalanceQuery,
} = authApi;
