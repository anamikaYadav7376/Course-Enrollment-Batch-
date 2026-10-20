import { apiClient } from "./client";

export const batchApi = {
  getBatches: async (courseId = "") => {
    const query = courseId ? `?course=${encodeURIComponent(courseId)}` : "";
    return await apiClient(`/batches${query}`);
  },

  getBatchById: async (id) => {
    return await apiClient(`/batches/${id}`);
  },

  createBatch: async (batchData) => {
    return await apiClient("/batches", {
      method: "POST",
      body: batchData
    });
  },

  updateBatch: async (id, batchData) => {
    return await apiClient(`/batches/${id}`, {
      method: "PUT",
      body: batchData
    });
  },

  deleteBatch: async (id) => {
    return await apiClient(`/batches/${id}`, {
      method: "DELETE"
    });
  },

  getBatchStudents: async (id) => {
    return await apiClient(`/batches/${id}/students`);
  }
};
