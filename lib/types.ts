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

// --- Roast (list / detail / compare) ---

export type TimeseriesPayload = {
  time_unit: string;
  time: number[];
  channels: Record<string, number[]>;
};

export type RoastSummary = {
  id: string;
  client_uuid: string;
  batch_name?: string | null;
  started_at?: string | null;
  ended_at?: string | null;
  points_count: number;
  channels: string[];
};

export type RoastDetail = {
  id: string;
  client_uuid: string;
  batch_name?: string | null;
  started_at?: string | null;
  ended_at?: string | null;
  points_count: number;
  channels: string[];
  yellow_time_s?: number | null;
  first_crack_time_s?: number | null;
  dev_time_s?: number | null;
  dev_ratio?: number | null;
  drop_bt?: number | null;
  drop_et?: number | null;
  charge_weight_g?: number | null;
  drop_weight_g?: number | null;
  weight_loss_pct?: number | null;
  notes?: string | null;
  tags?: unknown[] | null;
};

export type RoastDetailResponse = {
  roast: RoastDetail;
  timeseries: TimeseriesPayload;
};
