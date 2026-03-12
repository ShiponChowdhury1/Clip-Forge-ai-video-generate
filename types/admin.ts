// Admin-related types

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
