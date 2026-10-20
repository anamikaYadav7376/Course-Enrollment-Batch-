import { apiClient } from "./client";

export const enrollmentApi = {
  enrollInBatch: async (batchId) => {
    return await apiClient("/enrollments", {
      method: "POST",
      body: { batchId }
    });
  },

  getMyEnrollments: async () => {
    return await apiClient("/enrollments/my");
  },

  updateEnrollmentStatus: async (id, status) => {
    return await apiClient(`/enrollments/${id}/status`, {
      method: "PUT",
      body: { status }
    });
  }
};
