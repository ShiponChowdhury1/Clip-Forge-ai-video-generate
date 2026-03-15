// Auth-related types

export type UserRole = "user" | "admin" | "super_admin";

export interface AuthState {
  token: string | null;
  user: AuthUser | null;
  resetEmail: string | null;
  otpVerified: boolean;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  credits: number;
  subscription_plan: string;
  role: UserRole;
  picture?: string;
}

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
    role: UserRole;
    created_at: string;
    picture?: string;
    profile_image_url?: string | null;
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
  role: UserRole;
  profile_image_url?: string | null;
  created_at: string;
}

export interface UpdateProfileResponse {
  name: string;
  email: string;
  id: number;
  profile_image_url: string | null;
  is_verified: boolean;
  subscription_plan: string;
  credits: number;
  status: string;
  role: UserRole;
  created_at: string;
}
