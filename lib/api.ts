import { getToken, logout } from "./auth";

const API_BASE =
  typeof window !== "undefined"
    ? "/api"
    : (process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://roast-pilot.com/api");

function ensureBaseUrl(): string {
  return API_BASE.replace(/\/+$/, "");
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const url = ensureBaseUrl() + path;
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init?.headers as Record<string, string> | undefined)
  };

  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url, { ...init, headers });

  if (res.status === 401) {
    logout();
    if (typeof window !== "undefined") {
      window.location.href = "/auth/login";
    }
    throw new Error("Unauthorized");
  }

  let data: any = null;
  const text = await res.text();
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const msg =
      (data && (data.detail || data.message)) ||
      `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return data as T;
}

import type { AuthTokenResponse, RoastSummary, RoastDetailResponse } from "./types";

function assertValidLoginPayload(payload: unknown): asserts payload is { email: string; password: string } {
  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
    throw new Error("Login payload must be an object");
  }
  const p = payload as Record<string, unknown>;
  if (typeof p.email !== "string") {
    throw new Error("email must be string");
  }
  if (typeof p.password !== "string") {
    throw new Error("password must be string");
  }
}

/** 로그인: POST /auth/login, application/json + JSON.stringify(payload) only. No double stringify, no FormData. */
export async function login(email: string, password: string): Promise<AuthTokenResponse> {
  const url = `${ensureBaseUrl()}/auth/login`;

  const payload = {
    email: String(email).trim(),
    password: String(password),
  };
  assertValidLoginPayload(payload);

  if (process.env.NODE_ENV !== "production") {
    console.log("LOGIN DEBUG:", {
      url,
      contentType: "application/json",
      payloadType: typeof payload,
      payloadKeys: Object.keys(payload),
    });
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (res.status === 401) {
    logout();
    if (typeof window !== "undefined") {
      window.location.href = "/auth/login";
    }
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const d = data as { detail?: string | { msg?: string }[]; message?: string } | null;
    const msg =
      d && typeof d === "object"
        ? typeof d.detail === "string"
          ? d.detail
          : Array.isArray(d.detail) && d.detail[0] && typeof d.detail[0].msg === "string"
            ? d.detail[0].msg
            : typeof d.message === "string"
              ? d.message
              : `Request failed (${res.status})`
        : `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return data as AuthTokenResponse;
}

export async function getRoasts(params?: {
  limit?: number;
  offset?: number;
}): Promise<RoastSummary[]> {
  const search = new URLSearchParams();
  if (params?.limit != null) search.set("limit", String(params.limit));
  if (params?.offset != null) search.set("offset", String(params.offset));
  const q = search.toString();
  return apiFetch<RoastSummary[]>(`/roasts${q ? `?${q}` : ""}`);
}

export async function getRoast(id: string): Promise<RoastDetailResponse> {
  return apiFetch<RoastDetailResponse>(`/roasts/${encodeURIComponent(id)}`);
}
