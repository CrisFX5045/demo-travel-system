const errorApiBaseUrl = "https://error.api";
const apiBaseUrl = envOrFallback(
  "VITE_TICA_TOUR_API_BASE_URL",
  errorApiBaseUrl,
);
const supabaseAuthBaseUrl = envOrFallback(
  "VITE_SUPABASE_AUTH_BASE_URL",
  errorApiBaseUrl,
);

function envOrFallback(name: keyof ImportMetaEnv, fallback: string) {
  const value = import.meta.env[name];

  if (typeof value === "string" && value.trim()) {
    return value;
  }

  return fallback;
}

function missingEnvPath(name: keyof ImportMetaEnv) {
  return `/missing-env/${name}`;
}

function joinUrl(baseUrl: string, path: string) {
  if (/^https?:\/\//i.test(path)) return path;
  return `${baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

function pathWithParams(path: string, params: Record<string, string | number>) {
  return Object.entries(params).reduce(
    (current, [key, value]) =>
      current
        .replace(`{${key}}`, encodeURIComponent(String(value)))
        .replace(`:${key}`, encodeURIComponent(String(value))),
    path,
  );
}

function withQuery(path: string, query?: Record<string, string | number | boolean | undefined>) {
  if (!query) return path;

  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== "") params.set(key, String(value));
  });

  const queryString = params.toString();
  return queryString ? `${path}?${queryString}` : path;
}

export const authEndpoints = {
  login: () =>
    joinUrl(
      supabaseAuthBaseUrl,
      envOrFallback("VITE_API_CLIENT_LOGIN", missingEnvPath("VITE_API_CLIENT_LOGIN")),
    ),
  refresh: () =>
    joinUrl(
      supabaseAuthBaseUrl,
      envOrFallback("VITE_API_CLIENT_REFRESH", missingEnvPath("VITE_API_CLIENT_REFRESH")),
    ),
  profileMe: () =>
    joinUrl(
      apiBaseUrl,
      envOrFallback("VITE_API_CLIENT_PROFILE", missingEnvPath("VITE_API_CLIENT_PROFILE")),
    ),
  updateProfile: () => joinUrl(apiBaseUrl, "/Me/Profile"),
  registerTraveler: () =>
    joinUrl(apiBaseUrl, envOrFallback("VITE_API_CLIENT_SIGNUP", missingEnvPath("VITE_API_CLIENT_SIGNUP"))),
  logout: () => joinUrl(apiBaseUrl, envOrFallback("VITE_API_CLIENT_LOGOUT", missingEnvPath("VITE_API_CLIENT_LOGOUT"))),
};

export const publicEndpoints = {
  experiences: () => joinUrl(apiBaseUrl, "/Experiences"),
  experienceDetail: (slug: string) =>
    joinUrl(apiBaseUrl, pathWithParams("/Experiences/{slug}", { slug })),
  experienceReviews: (slug: string) =>
    joinUrl(apiBaseUrl, pathWithParams("/Experiences/{slug}/Reviews", { slug })),
  categories: () => joinUrl(apiBaseUrl, "/Categories"),
  createLead: () => joinUrl(apiBaseUrl, "/Leads"),
};

export const clientEndpoints = {
  experiences: () => joinUrl(apiBaseUrl, "/Me/Experiences"),
  experienceDetail: (slug: string) =>
    joinUrl(apiBaseUrl, pathWithParams("/Me/Experiences/{slug}", { slug })),
  favorites: (category?: string) =>
    joinUrl(apiBaseUrl, withQuery("/Me/Favorites", { category })),
  favorite: (experienceSlug: string) =>
    joinUrl(apiBaseUrl, pathWithParams("/Me/Favorites/{experienceSlug}", { experienceSlug })),
  bookings: (status?: "upcoming" | "past") =>
    joinUrl(apiBaseUrl, withQuery("/Me/Bookings", { status })),
  bookingDetail: (bookingId: string) =>
    joinUrl(apiBaseUrl, pathWithParams("/Me/Bookings/{bookingId}", { bookingId })),
  cancelBooking: (bookingId: string) =>
    joinUrl(apiBaseUrl, pathWithParams("/Me/Bookings/{bookingId}/cancel", { bookingId })),
  createBooking: () => joinUrl(apiBaseUrl, "/Bookings"),
  createReview: (bookingId: string) =>
    joinUrl(apiBaseUrl, pathWithParams("/Me/Bookings/{bookingId}/Review", { bookingId })),
  reviews: () => joinUrl(apiBaseUrl, "/Me/Reviews"),
  notifications: (isRead?: boolean) =>
    joinUrl(apiBaseUrl, withQuery("/Me/Notifications", { isRead })),
  readNotification: (notificationId: string) =>
    joinUrl(apiBaseUrl, pathWithParams("/Me/Notifications/{notificationId}/read", { notificationId })),
  readAllNotifications: () => joinUrl(apiBaseUrl, "/Me/Notifications/read-all"),
};

export const companyEndpoints = {
  register: () => joinUrl(apiBaseUrl, "/Auth/register-company"),
  dashboard: (companySlug: string, dates?: { dateFrom?: string; dateTo?: string }) =>
    joinUrl(apiBaseUrl, withQuery("/Company/Dashboard", { companySlug, ...dates })),
  experiences: (companySlug?: string) =>
    joinUrl(apiBaseUrl, withQuery("/Company/Experiences", { companySlug })),
  experience: (experienceSlug: string) =>
    joinUrl(apiBaseUrl, pathWithParams("/Company/Experiences/{experienceSlug}", { experienceSlug })),
  media: (experienceSlug: string) =>
    joinUrl(apiBaseUrl, pathWithParams("/Company/Experiences/{experienceSlug}/Media", { experienceSlug })),
  mediaItem: (experienceSlug: string, id: string | number) =>
    joinUrl(apiBaseUrl, pathWithParams("/Company/Experiences/{experienceSlug}/Media/{id}", { experienceSlug, id })),
  pickupStops: (experienceSlug: string) =>
    joinUrl(apiBaseUrl, pathWithParams("/Company/Experiences/{experienceSlug}/PickupStops", { experienceSlug })),
  pickupStop: (experienceSlug: string, id: string | number) =>
    joinUrl(apiBaseUrl, pathWithParams("/Company/Experiences/{experienceSlug}/PickupStops/{id}", { experienceSlug, id })),
  promotions: (experienceSlug: string) =>
    joinUrl(apiBaseUrl, pathWithParams("/Company/Experiences/{experienceSlug}/Promotions", { experienceSlug })),
  promotion: (experienceSlug: string, id: string | number) =>
    joinUrl(apiBaseUrl, pathWithParams("/Company/Experiences/{experienceSlug}/Promotions/{id}", { experienceSlug, id })),
  users: (companySlug?: string) =>
    joinUrl(apiBaseUrl, withQuery("/Company/Users", { companySlug })),
  user: (userId: string, companySlug?: string) =>
    joinUrl(apiBaseUrl, withQuery(pathWithParams("/Company/Users/{userId}", { userId }), { companySlug })),
  bookings: (companySlug: string, status?: "Pending" | "Confirmed") =>
    joinUrl(apiBaseUrl, withQuery("/Company/Bookings", { companySlug, status })),
  bookingDetail: (bookingId: string, companySlug: string) =>
    joinUrl(apiBaseUrl, withQuery(pathWithParams("/Company/Bookings/{bookingId}", { bookingId }), { companySlug })),
  bookingStatus: (bookingId: string, companySlug: string) =>
    joinUrl(apiBaseUrl, withQuery(pathWithParams("/Company/Bookings/{bookingId}/status", { bookingId }), { companySlug })),
  leads: (companySlug: string, status?: "New") =>
    joinUrl(apiBaseUrl, withQuery("/Company/Leads", { companySlug, status })),
  leadStatus: (leadId: string) =>
    joinUrl(apiBaseUrl, pathWithParams("/Company/Leads/{leadId}/status", { leadId })),
  campaigns: (companySlug?: string, status?: "Scheduled") =>
    joinUrl(apiBaseUrl, withQuery("/Company/Campaigns", { companySlug, status })),
  campaign: (campaignId: string, companySlug?: string) =>
    joinUrl(apiBaseUrl, withQuery(pathWithParams("/Company/Campaigns/{campaignId}", { campaignId }), { companySlug })),
};

export const adminEndpoints = {
  categories: () => joinUrl(apiBaseUrl, "/Admin/Categories"),
  category: (categorySlug: string) =>
    joinUrl(apiBaseUrl, pathWithParams("/Admin/Categories/{categorySlug}", { categorySlug })),
  users: (role?: "traveler" | "company_admin" | "platform_admin") =>
    joinUrl(apiBaseUrl, withQuery("/Admin/Users", { role })),
  user: (userId: string) =>
    joinUrl(apiBaseUrl, pathWithParams("/Admin/Users/{userId}", { userId })),
  userProfile: (userId: string) =>
    joinUrl(apiBaseUrl, pathWithParams("/Admin/Users/{userId}/profile", { userId })),
  userRole: (userId: string) =>
    joinUrl(apiBaseUrl, pathWithParams("/Admin/Users/{userId}/role", { userId })),
};
