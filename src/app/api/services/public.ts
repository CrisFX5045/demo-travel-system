import { apiRequest } from "../http";
import { normalizeExperiences } from "../normalizers";
import { publicEndpoints } from "../endpoints";
import type { ApiList, LeadCreateDTO } from "../types";

export const publicApi = {
  async getExperiences() {
    const data = await apiRequest<ApiList<unknown>>(publicEndpoints.experiences(), {
      auth: false,
    });
    return normalizeExperiences(data);
  },

  async getExperienceDetail(slug: string) {
    const data = await apiRequest<unknown>(publicEndpoints.experienceDetail(slug), {
      auth: false,
    });
    return data;
  },

  getExperienceReviews(slug: string) {
    return apiRequest<unknown>(publicEndpoints.experienceReviews(slug), {
      auth: false,
    });
  },

  getCategories() {
    return apiRequest<unknown>(publicEndpoints.categories(), { auth: false });
  },

  createLead(payload: LeadCreateDTO) {
    return apiRequest<unknown>(publicEndpoints.createLead(), {
      method: "POST",
      auth: false,
      body: JSON.stringify(payload),
    });
  },
};
