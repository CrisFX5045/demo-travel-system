import {
  getClientAccessToken,
  getClientRefreshToken,
  updateClientSession,
} from "./session";
import { authEndpoints } from "./endpoints";

type ApiRequestOptions = RequestInit & {
  auth?: boolean;
  retryOnUnauthorized?: boolean;
};

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export async function apiRequest<T>(
  url: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const response = await fetch(url, buildRequestOptions(options));

  if (response.status === 401 && options.auth !== false && options.retryOnUnauthorized !== false) {
    const refreshed = await refreshClientToken();

    if (refreshed) {
      return apiRequest<T>(url, { ...options, retryOnUnauthorized: false });
    }
  }

  const data = await readResponse<T>(response);

  if (!response.ok) {
    throw new ApiError(getApiErrorMessage(data), response.status, data);
  }

  return data;
}

function buildRequestOptions(options: ApiRequestOptions) {
  const headers = new Headers(options.headers);

  if (!headers.has("Accept")) headers.set("Accept", "application/json");
  if (options.body && !headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (options.auth !== false) {
    const token = getClientAccessToken();
    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  return {
    ...options,
    headers,
  };
}

async function refreshClientToken() {
  const refreshToken = getClientRefreshToken();
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!refreshToken) return false;

  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  if (anonKey) headers.apikey = anonKey;

  const response = await fetch(authEndpoints.refresh(), {
    method: "POST",
    headers,
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  const data = await readResponse<{
    access_token?: string;
    refresh_token?: string;
    token_type?: string;
    expires_in?: number;
    expires_at?: number;
    user?: unknown;
  }>(response);

  if (!response.ok || !data?.access_token) return false;

  updateClientSession({
    accessToken: data.access_token,
    refreshToken: data.refresh_token ?? refreshToken,
    tokenType: data.token_type,
    expiresIn: data.expires_in,
    expiresAt: data.expires_at,
    user: data.user,
  });

  return true;
}

async function readResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) return null as T;

  const text = await response.text();
  if (!text) return null as T;

  try {
    return JSON.parse(text) as T;
  } catch {
    return text as T;
  }
}

function getApiErrorMessage(data: unknown) {
  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    const nestedError =
      record.error && typeof record.error === "object"
        ? (record.error as Record<string, unknown>)
        : null;

    if (typeof record.message === "string") return record.message;
    if (typeof record.msg === "string") return record.msg;
    if (typeof nestedError?.message === "string") return nestedError.message;
    if (typeof nestedError?.msg === "string") return nestedError.msg;
    if (typeof record.error_description === "string") return record.error_description;
    if (typeof record.error === "string") return record.error;
    if (typeof record.title === "string") return record.title;
  }

  return "No se pudo completar la solicitud.";
}
