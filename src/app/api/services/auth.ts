import { authEndpoints } from "../endpoints";
import { clearApiResourceCache } from "../hooks";
import { apiRequest } from "../http";
import { normalizeTravelerProfile } from "../normalizers";
import {
  clearClientSession,
  getClientSession,
  setClientSession,
  updateClientSession,
} from "../session";
import type { TravelerProfile, TravelerProfileUpdatePayload } from "../types";

export type PasswordLoginPayload = {
  email: string;
  password: string;
};

export type TravelerSignupPayload = {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  preferredLanguage: "es" | "en";
  preferredCurrency: "CRC" | "USD";
  darkMode?: boolean;
};

export type SupabasePasswordTokenResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  expires_at?: number;
  user: unknown;
};

type TravelerSignupResponse = {
  data?: {
    accessToken?: string;
    refreshToken?: string;
    user?: unknown;
  };
  message?: string;
};

export const authApi = {
  async loginWithPassword(payload: PasswordLoginPayload) {
    clearClientSession();
    const data = await fetchSupabaseToken(authEndpoints.login(), payload);

    if (!data.access_token || !data.refresh_token) {
      throw new Error("La respuesta de autenticacion no contiene tokens.");
    }

    setClientSession({
      provider: "email",
      status: "authenticated",
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      tokenType: data.token_type,
      expiresIn: data.expires_in,
      expiresAt: data.expires_at,
      user: data.user,
      createdAt: new Date().toISOString(),
    });

    const profile = await authApi.getProfileMe(data.access_token);
    updateClientSession({ profile, profileFetchedAt: new Date().toISOString() });

    return { session: data, profile };
  },

  async getProfileMe(accessToken?: string) {
    const data = await apiRequest<unknown>(authEndpoints.profileMe(), {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
    });
    const profile = normalizeTravelerProfile(data);

    updateClientSession({
      profile,
      profileFetchedAt: new Date().toISOString(),
      profileNeedsRefresh: false,
    });

    return profile;
  },

  async updateProfile(payload: TravelerProfileUpdatePayload) {
    const data = await apiRequest<unknown>(authEndpoints.updateProfile(), {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    const currentProfile = getStoredProfile();
    const responseProfile = normalizeTravelerProfile(data);
    const profile = {
      ...currentProfile,
      ...payload,
      ...removeEmptyProfileFields(responseProfile),
    };

    updateClientSession({
      profile,
      profileFetchedAt: new Date().toISOString(),
      profileNeedsRefresh: false,
    });

    return profile;
  },

  async registerTraveler(payload: TravelerSignupPayload) {
    const response = await apiRequest<TravelerSignupResponse>(
      authEndpoints.registerTraveler(),
      {
        method: "POST",
        auth: false,
        body: JSON.stringify(payload),
      },
    );
    const data = response.data;

    if (!data?.accessToken || !data.refreshToken) {
      throw new Error("La respuesta de registro no contiene tokens.");
    }

    const profile = normalizeTravelerProfile({
      data: {
        email: payload.email,
        user: data.user,
        profile: {
          ...(data.user && typeof data.user === "object" ? data.user : {}),
          fullName: payload.fullName,
          phone: payload.phone,
          preferredLanguage: payload.preferredLanguage,
          preferredCurrency: payload.preferredCurrency,
          darkMode: payload.darkMode ?? false,
          profileCompletion: 30,
        },
      },
    });

    setClientSession({
      provider: "email",
      status: "authenticated",
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      tokenType: "bearer",
      user: data.user,
      profile,
      profileFetchedAt: new Date().toISOString(),
      profileNeedsRefresh: true,
      createdAt: new Date().toISOString(),
    });

    return { session: data, profile };
  },

  async logoutClient() {
    // TODO: call authEndpoints.logout() when the backend logout endpoint is ready.
    clearClientSession();
    clearApiResourceCache();
  },
};

function getStoredProfile() {
  const sessionProfile = getClientSession()?.profile;
  return sessionProfile ? normalizeTravelerProfile(sessionProfile) : {};
}

function removeEmptyProfileFields(profile: TravelerProfile) {
  return Object.fromEntries(
    Object.entries(profile).filter(([, value]) => value !== "" && value !== undefined),
  ) as TravelerProfile;
}

async function fetchSupabaseToken(url: string, payload: unknown) {
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  if (anonKey) headers.apikey = anonKey;

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error_description ?? data?.message ?? data?.msg ?? "No se pudo iniciar sesion.",
    );
  }

  return data as SupabasePasswordTokenResponse;
}
