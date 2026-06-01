/**
 * Backend base URL.
 * Configure it in .env with VITE_TICA_TOUR_API_BASE_URL.
 **/

export const JWT_HOST_API: string =
  import.meta.env.VITE_TICA_TOUR_API_BASE_URL ??
  "https://jwt-api-node.vercel.app";
