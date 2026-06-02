import { companyEndpoints } from "../endpoints";
import { apiRequest } from "../http";

export const companyApi = {
  register(payload: unknown) {
    return apiRequest<unknown>(companyEndpoints.register(), {
      method: "POST",
      auth: false,
      body: JSON.stringify(payload),
    });
  },
  dashboard(companySlug: string, dates?: { dateFrom?: string; dateTo?: string }) {
    return apiRequest<unknown>(companyEndpoints.dashboard(companySlug, dates));
  },
  getExperiences(companySlug?: string) {
    return apiRequest<unknown>(companyEndpoints.experiences(companySlug));
  },
  createExperience(payload: unknown) {
    return apiRequest<unknown>(companyEndpoints.experiences(), {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  updateExperience(experienceSlug: string, payload: unknown) {
    return apiRequest<unknown>(companyEndpoints.experience(experienceSlug), {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },
  deleteExperience(experienceSlug: string) {
    return apiRequest<unknown>(companyEndpoints.experience(experienceSlug), {
      method: "DELETE",
    });
  },
  getBookings(companySlug: string, status?: "Pending" | "Confirmed") {
    return apiRequest<unknown>(companyEndpoints.bookings(companySlug, status));
  },
  updateBookingStatus(bookingId: string, companySlug: string, status: string) {
    return apiRequest<unknown>(companyEndpoints.bookingStatus(bookingId, companySlug), {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },
  getLeads(companySlug: string, status?: "New") {
    return apiRequest<unknown>(companyEndpoints.leads(companySlug, status));
  },
  updateLeadStatus(leadId: string, status: string) {
    return apiRequest<unknown>(companyEndpoints.leadStatus(leadId), {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },
  getCampaigns(companySlug?: string, status?: "Scheduled") {
    return apiRequest<unknown>(companyEndpoints.campaigns(companySlug, status));
  },
  createCampaign(payload: unknown) {
    return apiRequest<unknown>(companyEndpoints.campaigns(), {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  updateCampaign(campaignId: string, companySlug: string, payload: unknown) {
    return apiRequest<unknown>(companyEndpoints.campaign(campaignId, companySlug), {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },
};
