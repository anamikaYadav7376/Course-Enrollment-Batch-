import { apiClient } from "./client";

export const dashboardApi = {
  getDashboardStats: async () => {
    return await apiClient("/dashboard/stats");
  }
};
