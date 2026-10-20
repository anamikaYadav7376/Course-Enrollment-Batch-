import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { enrollmentApi } from "../api/enrollmentApi";
import StatusBadge from "../components/StatusBadge";

export default function MyEnrollments({ user }) {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await enrollmentApi.getMyEnrollments();
      if (res.success && res.data) {
        setEnrollments(res.data);
      }
    } catch (err) {
      setError(err.message || "Failed to load enrollments.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-enrollments-page">
      <div className="page-header">
        <div>
          <h1>My Enrollments</h1>
          <p className="text-muted">
            Track your enrolled programs, upcoming batch schedules, and status
          </p>
        </div>
        <Link to="/courses" className="btn btn-outline">
          + Explore More Courses
        </Link>
      </div>

      {loading && (
        <div className="card status-card">
          <div className="loading-spinner"></div>
          <p>Loading your enrolled courses...</p>
        </div>
      )}

      {error && (
        <div className="alert alert-error" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && enrollments.length === 0 && (
        <div className="card empty-card text-center">
          <div className="empty-icon">🎓</div>
          <h3>You Haven't Enrolled in Any Course Yet</h3>
          <p className="text-muted">
            Browse our course catalog, pick a batch that matches your timing, and start learning today!
          </p>
          <Link to="/courses" className="btn btn-primary mt-3">
            Browse All Courses
          </Link>
        </div>
      )}

      {!loading && enrollments.length > 0 && (
        <div className="enrollments-list">
          {enrollments.map((enr) => {
            const batch = enr.batch;
            const course = batch?.course;

            return (
              <div key={enr._id} className="card enrollment-card">
                <div className="enrollment-header">
                  <div>
                    <span className="course-code-pill">
                      {course?.courseCode || "COURSE"}
                    </span>
                    <h2 className="enrollment-course-title mt-2">
                      {course ? (
                        <Link to={`/courses/${course._id}`}>{course.title}</Link>
                      ) : (
                        "Course Record"
                      )}
                    </h2>
                  </div>

                  <StatusBadge status={enr.status} text={enr.status} />
                </div>

                <div className="enrollment-details-grid mt-3">
                  <div className="enrollment-detail-item">
                    <span className="detail-label">Batch Name</span>
                    <span className="detail-value">{batch?.batchName || "N/A"}</span>
                  </div>

                  <div className="enrollment-detail-item">
                    <span className="detail-label">Start Date</span>
                    <span className="detail-value">
                      {batch?.startDate
                        ? new Date(batch.startDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })
                        : "N/A"}
                    </span>
                  </div>

                  <div className="enrollment-detail-item">
                    <span className="detail-label">Schedule & Mode</span>
                    <span className="detail-value">
                      {batch?.timing || "N/A"} ({batch?.mode || "Online"})
                    </span>
                  </div>

                  <div className="enrollment-detail-item">
                    <span className="detail-label">Enrolled On</span>
                    <span className="detail-value">
                      {new Date(enr.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </span>
                  </div>
                </div>

                <div className="enrollment-footer mt-3">
                  {course && (
                    <Link to={`/courses/${course._id}`} className="btn btn-secondary btn-sm">
                      View Course Details →
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
