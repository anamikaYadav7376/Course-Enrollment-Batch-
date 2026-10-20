import { apiClient } from "./client";

export const authApi = {
  login: async (email, password) => {
    return await apiClient("/auth/login", {
      method: "POST",
      body: { email, password }
    });
  },

  register: async (name, email, password) => {
    return await apiClient("/auth/register", {
      method: "POST",
      body: { name, email, password }
    });
  },

  getMe: async () => {
    return await apiClient("/auth/me");
  },

  logout: async () => {
    return await apiClient("/auth/logout", {
      method: "POST"
    });
  }
};
