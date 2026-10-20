import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { courseApi } from "../api/courseApi";
import CourseForm from "../components/CourseForm";

export default function AddCourse() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState(null);

  const handleCreateCourse = async (courseData) => {
    try {
      setServerError(null);
      const res = await courseApi.createCourse(courseData);
      if (res.success && res.data) {
        navigate(`/courses/${res.data._id}`);
      }
    } catch (err) {
      setServerError(err.message || "Failed to create course.");
      throw err;
    }
  };

  return (
    <div className="form-page-container">
      <div className="breadcrumb mb-3">
        <Link to="/courses">← All Courses</Link> / <span>Add New Course</span>
      </div>

      <div className="page-header">
        <div>
          <h1>Create New Course</h1>
          <p className="text-muted">
            Define course syllabus, duration, fee, and assign a unique course code
          </p>
        </div>
      </div>

      <CourseForm
        onSubmit={handleCreateCourse}
        submitText="Publish Course"
        serverError={serverError}
      />
    </div>
  );
}
