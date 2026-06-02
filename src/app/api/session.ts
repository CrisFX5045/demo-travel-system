export type ClientSession = {
  provider: "email" | "google" | "apple";
  status: "authenticated" | "demo-authenticated";
  accessToken?: string;
  refreshToken?: string;
  tokenType?: string;
  expiresIn?: number;
  expiresAt?: number;
  user?: unknown;
  profile?: unknown;
  profileFetchedAt?: string;
  profileNeedsRefresh?: boolean;
  createdAt: string;
};

const CLIENT_SESSION_KEY = "clientSession";
export const CLIENT_SESSION_EVENT = "client-session";

export function getClientSession() {
  if (typeof window === "undefined") return null;

  try {
    const value = window.localStorage.getItem(CLIENT_SESSION_KEY);
    return value ? (JSON.parse(value) as ClientSession) : null;
  } catch {
    return null;
  }
}

export function setClientSession(session: ClientSession) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CLIENT_SESSION_KEY, JSON.stringify(session));
  notifyClientSessionChange();
}

export function clearClientSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CLIENT_SESSION_KEY);
  notifyClientSessionChange();
}

export function getClientAccessToken() {
  return getClientSession()?.accessToken ?? null;
}

export function hasClientAccessToken() {
  return Boolean(getClientAccessToken());
}

export function getClientRefreshToken() {
  return getClientSession()?.refreshToken ?? null;
}

export function updateClientSession(patch: Partial<ClientSession>) {
  const current = getClientSession();

  if (!current) return null;

  const next = { ...current, ...patch };
  setClientSession(next);
  return next;
}

function notifyClientSessionChange() {
  window.dispatchEvent(new Event(CLIENT_SESSION_EVENT));
}
