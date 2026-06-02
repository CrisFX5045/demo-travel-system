import { adminEndpoints } from "../endpoints";
import { apiRequest } from "../http";

export const adminApi = {
  getCategories() {
    return apiRequest<unknown>(adminEndpoints.categories());
  },
  createCategory(payload: unknown) {
    return apiRequest<unknown>(adminEndpoints.categories(), {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  updateCategory(categorySlug: string, payload: unknown) {
    return apiRequest<unknown>(adminEndpoints.category(categorySlug), {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },
  deleteCategory(categorySlug: string) {
    return apiRequest<unknown>(adminEndpoints.category(categorySlug), {
      method: "DELETE",
    });
  },
  getUsers(role?: "traveler" | "company_admin" | "platform_admin") {
    return apiRequest<unknown>(adminEndpoints.users(role));
  },
  getUser(userId: string) {
    return apiRequest<unknown>(adminEndpoints.user(userId));
  },
  updateUserProfile(userId: string, payload: unknown) {
    return apiRequest<unknown>(adminEndpoints.userProfile(userId), {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },
  updateUserRole(userId: string, role: string) {
    return apiRequest<unknown>(adminEndpoints.userRole(userId), {
      method: "PATCH",
      body: JSON.stringify({ role }),
    });
  },
};
