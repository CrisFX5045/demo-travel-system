/**
 * Backend base URL.
 * Configure it in .env with VITE_TICA_TOUR_API_BASE_URL.
 **/

export const JWT_HOST_API: string = authEnvOrFallback(
  "VITE_TICA_TOUR_API_BASE_URL",
  "https://error.api",
);

function authEnvOrFallback(name: keyof ImportMetaEnv, fallback: string) {
  const value = import.meta.env[name];

  if (typeof value === "string" && value.trim()) {
    return value;
  }

  return fallback;
}
