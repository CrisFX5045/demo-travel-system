/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_TICA_TOUR_API_BASE_URL?: string;
  readonly VITE_TICA_TOUR_API_TIMEOUT_MS?: string;
  readonly VITE_SUPABASE_AUTH_BASE_URL?: string;
  readonly VITE_SUPABASE_AUTH_CALLBACK_URL?: string;
  readonly VITE_CLIENT_AUTH_CALLBACK_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_API_CLIENT_LOGIN?: string;
  readonly VITE_API_CLIENT_LOGOUT?: string;
  readonly VITE_API_CLIENT_REFRESH?: string;
  readonly VITE_API_CLIENT_PROFILE?: string;
  readonly VITE_API_CLIENT_SIGNUP?: string;
  readonly VITE_API_CLIENT_SOCIAL_LOGIN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
