/**
 * Backend base URL.
 * Configure it in .env with VITE_TICA_TOUR_API_BASE_URL.
 **/

export const JWT_HOST_API: string = requireAuthEnv(
  "VITE_TICA_TOUR_API_BASE_URL",
);

function requireAuthEnv(name: keyof ImportMetaEnv) {
  const value = import.meta.env[name];

  if (typeof value === "string" && value.trim()) {
    return value;
  }

  throw new Error(`Missing required environment variable: ${name}`);
}
