import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { courseApi } from "../api/courseApi";
import CourseForm from "../components/CourseForm";

export default function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [serverError, setServerError] = useState(null);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await courseApi.getCourseById(id);
      if (res.success && res.data) {
        setCourse(res.data);
      }
    } catch (err) {
      setError(err.message || "Failed to load course details.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCourse = async (courseData) => {
    try {
      setServerError(null);
      const res = await courseApi.updateCourse(id, courseData);
      if (res.success) {
        navigate(`/courses/${id}`);
      }
    } catch (err) {
      setServerError(err.message || "Failed to update course.");
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="card status-card">
        <div className="loading-spinner"></div>
        <p>Loading course for editing...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="card status-card">
        <div className="alert alert-error mb-3">{error || "Course not found."}</div>
        <Link to="/courses" className="btn btn-secondary">
          ← Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="form-page-container">
      <div className="breadcrumb mb-3">
        <Link to="/courses">← All Courses</Link> /{" "}
        <Link to={`/courses/${id}`}>{course.courseCode}</Link> / <span>Edit</span>
      </div>

      <div className="page-header">
        <div>
          <h1>Edit Course: {course.courseCode}</h1>
          <p className="text-muted">Update course title, pricing, duration, or syllabus description</p>
        </div>
      </div>

      <CourseForm
        initialData={course}
        onSubmit={handleUpdateCourse}
        submitText="Save Changes"
        serverError={serverError}
      />
    </div>
  );
}
