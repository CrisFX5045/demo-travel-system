export type ApiList<T> = T[] | { data?: T[]; items?: T[]; results?: T[] };

export type TravelerProfile = {
  id?: string;
  fullName?: string;
  role?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string | null;
  preferredLanguage?: string;
  preferredCurrency?: string;
  darkMode?: boolean;
  isIdentityVerified?: boolean;
  profileCompletion?: number;
  stats?: {
    completedExperiences?: number;
    favoriteExperiences?: number;
    pendingBookings?: number;
    totalReviews?: number;
  };
  memberSince?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type TravelerProfileUpdatePayload = {
  fullName?: string;
  phone?: string;
  avatarUrl?: string | null;
  preferredLanguage?: string;
  preferredCurrency?: string;
  darkMode?: boolean;
};

export type BookingStatus =
  | "Pending"
  | "Confirmed"
  | "Cancelled"
  | "Completed"
  | "upcoming"
  | "past";

export type BookingDTO = {
  id?: string;
  bookingId?: string;
  status?: BookingStatus;
  experience?: unknown;
  experienceSlug?: string;
  bookingDate?: string;
  slotLabel?: string;
  guestsAdults?: number;
  guestsChildren?: number;
  meetingPoint?: string;
  notes?: string;
};

export type LeadCreateDTO = {
  experienceSlug: string;
  travelerName: string;
  travelerEmail: string;
  travelerPhone?: string;
  channel: "Marketplace" | "WhatsApp" | "Campaign";
  estimatedValue?: number;
  currency?: "CRC" | "USD";
  message?: string;
};

export type BookingCreateDTO = {
  experienceSlug: string;
  guestsAdults: number;
  guestsChildren?: number;
  bookingDate: string;
  slotLabel?: string;
  meetingPoint?: string;
  notes?: string;
};

export type ReviewCreateDTO = {
  rating: number;
  comment: string;
};
