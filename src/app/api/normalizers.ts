import type { Experience } from "@/app/data/tourism";
import type { ApiList, BookingDTO, TravelerProfile } from "./types";

function pickString(record: Record<string, unknown>, keys: string[], fallback = "") {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return fallback;
}

function pickNumber(record: Record<string, unknown>, keys: string[], fallback = 0) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "number") return value;
    if (typeof value === "string" && value.trim() && !Number.isNaN(Number(value))) {
      return Number(value);
    }
  }
  return fallback;
}

function pickOptionalNumber(record: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "number") return value;
    if (typeof value === "string" && value.trim() && !Number.isNaN(Number(value))) {
      return Number(value);
    }
  }
  return undefined;
}

function pickOptionalCount(record: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (Array.isArray(value)) return value.length;
    if (typeof value === "number") return value;
    if (typeof value === "string" && value.trim() && !Number.isNaN(Number(value))) {
      return Number(value);
    }
  }
  return undefined;
}

function pickArray(record: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (Array.isArray(value)) return value;
  }
  return [];
}

export function extractList<T>(value: ApiList<T> | null | undefined) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return value.data ?? value.items ?? value.results ?? [];
}

export function normalizeExperience(value: unknown): Experience {
  const record = (value && typeof value === "object" ? value : {}) as Record<string, unknown>;
  const slug = pickString(record, ["slug", "experienceSlug"]);
  const id = pickString(record, ["publicCode", "id", "code"], slug);
  const image = pickString(record, ["mainImageUrl", "image", "imageUrl"], "/images/travel/travel-2.jpg");
  const media = pickArray(record, ["media", "images"]);
  const images = media
    .map((item) => {
      if (typeof item === "string") return item;
      if (item && typeof item === "object") {
        return pickString(item as Record<string, unknown>, ["url", "imageUrl"]);
      }
      return "";
    })
    .filter(Boolean);

  return {
    id,
    title: pickString(record, ["title", "name"], "Experiencia"),
    company: pickString(record, ["companyName", "company"], "Tica Tour"),
    province: pickString(record, ["province"], "Costa Rica"),
    zone: pickString(record, ["zone", "location"], "Costa Rica"),
    category: pickString(record, ["categoryName", "category", "categorySlug"], "Aventura"),
    price: pickNumber(record, ["price"], 0),
    priceCurrency: pickString(record, ["priceCurrency", "currency"], "CRC") === "USD" ? "USD" : "CRC",
    duration: pickString(record, ["durationLabel", "duration"], ""),
    rating: pickNumber(record, ["rating", "averageRating"], 0),
    reviews: pickNumber(record, ["reviews", "reviewsCount", "reviewCount"], 0),
    difficulty: pickString(record, ["difficulty"], ""),
    status: pickString(record, ["status"], "Published") as Experience["status"],
    image,
    images: images.length > 0 ? images : [image],
    tags: pickArray(record, ["tags"]).filter((item): item is string => typeof item === "string"),
    leads: pickNumber(record, ["leads", "leadsCount"], 0),
    views: pickNumber(record, ["views", "viewsCount"], 0),
    favorites: pickNumber(record, ["favorites", "favoritesCount"], 0),
    nextSlot: pickString(record, ["nextSlotLabel", "nextSlot"], ""),
    promoted: Boolean(record.promoted),
  };
}

export function normalizeExperiences(value: ApiList<unknown>) {
  return extractList(value).map(normalizeExperience);
}

export function normalizeTravelerProfile(value: unknown): TravelerProfile {
  const root = (value && typeof value === "object" ? value : {}) as Record<string, unknown>;
  const record = (root.data && typeof root.data === "object"
    ? root.data
    : root) as Record<string, unknown>;
  const profile = ((record.profile && typeof record.profile === "object"
    ? record.profile
    : record) ?? {}) as Record<string, unknown>;
  const stats = ((record.stats && typeof record.stats === "object"
    ? record.stats
    : profile.stats && typeof profile.stats === "object"
      ? profile.stats
      : {}) ?? {}) as Record<string, unknown>;

  return {
    id: pickString(profile, ["id", "userId"], pickString(record, ["userId", "id"])),
    fullName: pickString(profile, ["fullName", "name"]),
    role: pickString(profile, ["role"], pickString(record, ["role"])),
    email: pickString(profile, ["email"], pickString(record, ["email"])),
    phone: pickString(profile, ["phone"]),
    avatarUrl: pickString(profile, ["avatarUrl", "avatar"]),
    preferredLanguage: pickString(profile, ["preferredLanguage"]),
    preferredCurrency: pickString(profile, ["preferredCurrency"]),
    darkMode: typeof profile.darkMode === "boolean" ? profile.darkMode : undefined,
    isIdentityVerified:
      typeof profile.isIdentityVerified === "boolean"
        ? profile.isIdentityVerified
        : undefined,
    profileCompletion: pickOptionalNumber(profile, ["profileCompletion", "completion"]),
    stats: {
      completedExperiences: pickOptionalNumber(stats, ["completedExperiences"]),
      favoriteExperiences: pickOptionalCount(stats, ["favoriteExperiences"]),
      pendingBookings: pickOptionalNumber(stats, ["pendingBookings"]),
      totalReviews: pickOptionalNumber(stats, ["totalReviews"]),
    },
    memberSince: pickString(profile, ["memberSince", "createdAt"]),
    createdAt: pickString(profile, ["createdAt"], pickString(record, ["createdAt"])),
    updatedAt: pickString(profile, ["updatedAt"], pickString(record, ["updatedAt"])),
  };
}

export function normalizeBookingExperiences(value: unknown): Experience[] {
  return extractList(value as ApiList<BookingDTO>)
    .map((booking) => {
      if (booking && typeof booking === "object") {
        const record = booking as BookingDTO & Record<string, unknown>;
        if (record.experience) return normalizeExperience(record.experience);
        if (record.experienceSlug || record.title) return normalizeExperience(record);
      }

      return null;
    })
    .filter((experience): experience is Experience => Boolean(experience));
}

export function normalizeFavoriteExperiences(value: unknown): Experience[] {
  return extractList(value as ApiList<unknown>)
    .map((item) => {
      if (item && typeof item === "object") {
        const record = item as Record<string, unknown>;
        return normalizeExperience(record.experience ?? record);
      }

      return null;
    })
    .filter((experience): experience is Experience => Boolean(experience));
}
