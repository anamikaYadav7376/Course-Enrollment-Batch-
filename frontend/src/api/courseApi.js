import { apiClient } from "./client";

export const courseApi = {
  getCourses: async (search = "") => {
    const query = search && search.trim() ? `?search=${encodeURIComponent(search.trim())}` : "";
    return await apiClient(`/courses${query}`);
  },

  getCourseById: async (id) => {
    return await apiClient(`/courses/${id}`);
  },

  createCourse: async (courseData) => {
    return await apiClient("/courses", {
      method: "POST",
      body: courseData
    });
  },

  updateCourse: async (id, courseData) => {
    return await apiClient(`/courses/${id}`, {
      method: "PUT",
      body: courseData
    });
  },

  deleteCourse: async (id) => {
    return await apiClient(`/courses/${id}`, {
      method: "DELETE"
    });
  }
};
