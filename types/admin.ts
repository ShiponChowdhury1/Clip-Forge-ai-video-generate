// Admin-related types

export type AdminRole = "user" | "admin" | "super_admin";

export interface AdminUsersParams {
  skip?: number;
  limit?: number;
  time_filter?: "all" | "7d" | "30d" | "90d";
  search?: string;
}

export interface SubscriptionPlan {
  id: number;
  name: string;
  monthly_price: number;
  product_id?: string | null;
  stripe_price_id?: string | null;
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

export interface CreditPackage {
  id: number;
  name: string;
  credits: number;
  price: number;
  plan_type?: "monthly" | "one_time";
  product_id?: string | null;
  stripe_price_id?: string | null;
  status?: "active" | "inactive";
  created_at: string;
}

export interface CreateCreditPackagePayload {
  name: string;
  credits: number;
  price: number;
  plan_type?: "monthly" | "one_time";
  product_id?: string | null;
  stripe_price_id?: string | null;
  status?: "active" | "inactive";
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
  role: AdminRole;
  created_at: string;
}

export interface GiveUserCreditsPayload {
  userId: number;
  amount: number;
}

export interface GiveUserCreditsResponse {
  message: string;
  user_id: number;
  credits_granted: number;
  new_balance: number;
  transaction_id: number;
}

export interface AdminOverview {
  total_users: number;
  active_users: number;
  total_videos_generated: number;
  credits_consumed: number;
  total_revenue: number;
  refunds_issued: number;
  credits_used_over_time: { date: string; count: number }[];
  videos_generated_over_time: { date: string; count: number }[];
  plan_distribution: { plan_name: string; user_count: number }[];
}

export interface PrivacyPolicy {
  id: number;
  content: string;
  updated_at: string;
}

// Single legal-policy payload for one API handling multiple policy sections.
export interface LegalPoliciesPayload {
  privacy_policy: string;
  terms_of_service: string;
  refund_policy?: string;
}

export interface LegalPolicies extends LegalPoliciesPayload {
  id: number;
  updated_at: string;
  updated_by?: number;
}

export interface AdminBillingParams {
  skip?: number;
  limit?: number;
  time_filter?: "all" | "7d" | "30d" | "90d";
}

export interface AdminLogEntry {
  id: number;
  name: string;
  email: string;
  action_type: string;
  reference_id: string;
  status: "success" | "failed";
  date_time: string;
}

export interface AdminBillingRecord {
  id: number;
  user: string;
  payment_type: "purchase" | "refund";
  amount: number;
  credits: number;
  transaction_id: string;
  status: "pending" | "completed" | "failed";
  created_at: string;
}

export interface AdminBillingResponse {
  total_revenue: number;
  refund_amount: number;
  net_revenue: number;
  records: AdminBillingRecord[];
}

export interface AdminFaq {
  id: number;
  Question: string;
  Answer: string;
  updated_at: string;
}

export interface AdminFaqParams {
  skip?: number;
  limit?: number;
}

export interface CreateAdminFaqPayload {
  Question: string;
  Answer: string;
}

export interface UpdateAdminFaqPayload extends CreateAdminFaqPayload {
  id: number;
}
