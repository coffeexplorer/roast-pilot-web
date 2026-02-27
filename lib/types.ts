export type AuthTokenResponse = {
  access_token: string;
  token_type: string;
};

export type MeResponse = {
  id: string;
  email: string;
  created_at?: string;
  plan?: string;
};

export type UsageWarning = {
  type: string;
  current: number;
  limit: number;
  message: string;
  warning_only?: boolean;
};

export type UsageResponse = {
  period: { tz: string; start: string; end: string };
  plan: string;
  uploads_count: number;
  uploads_limit: number;
  points_sum: number;
  points_limit: number;
  usage_ratio?: { uploads: number; points: number };
  upgrade_required?: boolean;
  warnings?: UsageWarning[];
};
