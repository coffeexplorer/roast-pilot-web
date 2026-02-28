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

/** 로그인: POST ${API_BASE}/auth/login, 토큰은 호출 측에서 setToken으로 저장. */
export async function login(email: string, password: string): Promise<AuthTokenResponse> {
  return apiFetch<AuthTokenResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
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
