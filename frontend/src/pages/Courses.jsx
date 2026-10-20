import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { courseApi } from "../api/courseApi";
import StatusBadge from "../components/StatusBadge";

export default function Courses({ user }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamValue = searchParams.get("search") || "";

  const [courses, setCourses] = useState([]);
  const [searchInput, setSearchInput] = useState(searchParamValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);

  useEffect(() => {
    setSearchInput(searchParamValue);
  }, [searchParamValue]);

  useEffect(() => {
    fetchCourses(searchParamValue);
  }, [searchParamValue]);

  const fetchCourses = async (query = "") => {
    try {
      setLoading(true);
      setError(null);
      const res = await courseApi.getCourses(query);
      if (res.success && res.data) {
        setCourses(res.data);
      }
    } catch (err) {
      setError(err.message || "Failed to load courses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ search: searchInput.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchParams({});
  };

  const handleDeleteCourse = async (courseId, courseTitle) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete '${courseTitle}'? This action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      setError(null);
      setActionMessage(null);
      const res = await courseApi.deleteCourse(courseId);
      if (res.success) {
        setActionMessage(`Course '${courseTitle}' was deleted successfully.`);
        fetchCourses(searchParamValue);
      }
    } catch (err) {
      setError(err.message || "Could not delete course.");
    }
  };

  return (
    <div className="courses-page">
      <div className="page-header">
        <div>
          <h1>Explore Courses</h1>
          <p className="text-muted">Browse available technical programs and batch schedules</p>
        </div>

        {user && user.role === "admin" && (
          <Link to="/admin/courses/new" className="btn btn-primary" id="add-course-btn">
            + Add New Course
          </Link>
        )}
      </div>

      {actionMessage && (
        <div className="alert alert-success" role="status">
          {actionMessage}
        </div>
      )}

      {error && (
        <div className="alert alert-error" role="alert">
          {error}
        </div>
      )}

      <div className="card search-card mb-4">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search by course title (e.g., Python) or course code (e.g., FS101)..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              id="course-search-input"
            />
          </div>
          <button type="submit" className="btn btn-primary" id="search-submit-btn">
            Search
          </button>
          {searchParamValue && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClearSearch}
            >
              Clear
            </button>
          )}
        </form>

        {searchParamValue && (
          <div className="search-status mt-2">
            <span>
              Showing results for: <strong>"{searchParamValue}"</strong>
            </span>
          </div>
        )}
      </div>

      {loading && (
        <div className="card status-card">
          <div className="loading-spinner"></div>
          <p>Loading course catalog...</p>
        </div>
      )}

      {!loading && !error && courses.length === 0 && (
        <div className="card empty-card text-center">
          <div className="empty-icon">📚</div>
          <h3>No Courses Found</h3>
          <p className="text-muted">
            {searchParamValue
              ? `No course matches your query "${searchParamValue}". Try another keyword or clear search.`
              : "No courses are currently available in the database."}
          </p>
          {searchParamValue && (
            <button onClick={handleClearSearch} className="btn btn-secondary mt-3">
              Clear Search Query
            </button>
          )}
        </div>
      )}

      {!loading && courses.length > 0 && (
        <div className="courses-grid">
          {courses.map((course) => (
            <div key={course._id} className="card course-card">
              <div className="course-card-header">
                <span className="course-code-pill">{course.courseCode}</span>
                <span className="course-fee">₹{course.fee.toLocaleString()}</span>
              </div>

              <h2 className="course-title">
                <Link to={`/courses/${course._id}`}>{course.title}</Link>
              </h2>

              <p className="course-description">{course.description}</p>

              <div className="course-meta">
                <span className="meta-item">⏱️ {course.durationWeeks} Weeks</span>
                <span className="meta-item">
                  👥 {course.batchCount !== undefined ? `${course.batchCount} Batch(es)` : "Active"}
                </span>
              </div>

              <div className="course-card-footer">
                <Link to={`/courses/${course._id}`} className="btn btn-outline btn-sm">
                  View Batches & Details →
                </Link>

                {user && user.role === "admin" && (
                  <div className="admin-actions">
                    <Link
                      to={`/admin/courses/${course._id}/edit`}
                      className="btn btn-secondary btn-sm"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteCourse(course._id, course.title)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
