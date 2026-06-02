import { clientEndpoints } from "../endpoints";
import { apiRequest } from "../http";
import { normalizeExperiences } from "../normalizers";
import type { ApiList, BookingCreateDTO, ReviewCreateDTO } from "../types";

export const travelerApi = {
  async getExperiences() {
    return normalizeExperiences(
      await apiRequest<ApiList<unknown>>(clientEndpoints.experiences()),
    );
  },

  getExperienceDetail(slug: string) {
    return apiRequest<unknown>(clientEndpoints.experienceDetail(slug));
  },

  getFavorites(category?: string) {
    return apiRequest<unknown>(clientEndpoints.favorites(category));
  },

  addFavorite(experienceSlug: string) {
    return apiRequest<unknown>(clientEndpoints.favorites(), {
      method: "POST",
      body: JSON.stringify({ experienceSlug }),
    });
  },

  deleteFavorite(experienceSlug: string) {
    return apiRequest<unknown>(clientEndpoints.favorite(experienceSlug), {
      method: "DELETE",
    });
  },

  createBooking(payload: BookingCreateDTO) {
    return apiRequest<unknown>(clientEndpoints.createBooking(), {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  getBookings(status?: "upcoming" | "past") {
    return apiRequest<ApiList<unknown>>(clientEndpoints.bookings(status));
  },

  getBookingDetail(bookingId: string) {
    return apiRequest<unknown>(clientEndpoints.bookingDetail(bookingId));
  },

  cancelBooking(bookingId: string) {
    return apiRequest<unknown>(clientEndpoints.cancelBooking(bookingId), {
      method: "PATCH",
    });
  },

  createReview(bookingId: string, payload: ReviewCreateDTO) {
    return apiRequest<unknown>(clientEndpoints.createReview(bookingId), {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  getReviews() {
    return apiRequest<unknown>(clientEndpoints.reviews());
  },

  getNotifications(isRead?: boolean) {
    return apiRequest<unknown>(clientEndpoints.notifications(isRead));
  },

  readNotification(notificationId: string) {
    return apiRequest<unknown>(clientEndpoints.readNotification(notificationId), {
      method: "PATCH",
    });
  },

  readAllNotifications() {
    return apiRequest<unknown>(clientEndpoints.readAllNotifications(), {
      method: "PATCH",
    });
  },
};
