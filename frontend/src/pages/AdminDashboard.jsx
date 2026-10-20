import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { dashboardApi } from "../api/dashboardApi";
import StatusBadge from "../components/StatusBadge";

export default function AdminDashboard({ user }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await dashboardApi.getDashboardStats();
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      setError(err.message || "Failed to load dashboard metrics.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard-page">
      <div className="page-header">
        <div>
          <h1>Admin Management Dashboard</h1>
          <p className="text-muted">
            Real-time enrollment analytics, batch occupancy, and curriculum oversight
          </p>
        </div>

        <div className="header-actions">
          <Link to="/admin/courses/new" className="btn btn-primary" id="dashboard-add-course-btn">
            + Add New Course
          </Link>
          <button type="button" className="btn btn-secondary" onClick={fetchStats}>
            ↻ Refresh
          </button>
        </div>
      </div>

      {loading && (
        <div className="card status-card">
          <div className="loading-spinner"></div>
          <p>Calculating database statistics...</p>
        </div>
      )}

      {error && (
        <div className="alert alert-error mb-4" role="alert">
          {error}
        </div>
      )}

      {!loading && stats && (
        <>
          <div className="stats-grid">
            <div className="card stat-card">
              <div className="stat-icon-wrapper icon-blue">📚</div>
              <div className="stat-content">
                <span className="stat-label">Total Courses</span>
                <span className="stat-value">{stats.totalCourses}</span>
                <span className="stat-subtext">Active academic programs</span>
              </div>
            </div>

            <div className="card stat-card">
              <div className="stat-icon-wrapper icon-green">🗓️</div>
              <div className="stat-content">
                <span className="stat-label">Active Batches</span>
                <span className="stat-value">{stats.activeBatches}</span>
                <span className="stat-subtext">
                  Out of {stats.totalBatches} total scheduled batches
                </span>
              </div>
            </div>

            <div className="card stat-card">
              <div className="stat-icon-wrapper icon-purple">🎓</div>
              <div className="stat-content">
                <span className="stat-label">Active Enrollments</span>
                <span className="stat-value">{stats.totalActiveEnrollments}</span>
                <span className="stat-subtext">
                  {stats.totalHistoricalEnrollments} historical enrollments
                </span>
              </div>
            </div>

            <div className="card stat-card">
              <div className="stat-icon-wrapper icon-amber">⭐</div>
              <div className="stat-content">
                <span className="stat-label">Most Popular Course</span>
                <span className="stat-value stat-value-sm">
                  {stats.mostPopularCourse
                    ? stats.mostPopularCourse.courseCode
                    : "No Data"}
                </span>
                <span className="stat-subtext text-truncate" title={stats.mostPopularCourse?.title}>
                  {stats.mostPopularCourse
                    ? `${stats.mostPopularCourse.activeEnrollments} active students (${stats.mostPopularCourse.title})`
                    : "Awaiting enrollments"}
                </span>
              </div>
            </div>
          </div>

          <div className="card breakdown-card mt-4">
            <h2 className="card-title">Enrollment Distribution & Historical Statuses</h2>
            <div className="breakdown-grid mt-3">
              <div className="breakdown-item">
                <span className="breakdown-count text-success">
                  {stats.totalActiveEnrollments}
                </span>
                <span className="breakdown-label">Active Learning</span>
                <small className="text-muted">Occupying batch seats</small>
              </div>

              <div className="breakdown-item">
                <span className="breakdown-count text-primary">
                  {stats.totalCompletedEnrollments}
                </span>
                <span className="breakdown-label">Completed</span>
                <small className="text-muted">Successfully graduated</small>
              </div>

              <div className="breakdown-item">
                <span className="breakdown-count text-danger">
                  {stats.totalDroppedEnrollments}
                </span>
                <span className="breakdown-label">Dropped</span>
                <small className="text-muted">Freed up batch seats</small>
              </div>

              <div className="breakdown-item">
                <span className="breakdown-count text-muted">
                  {stats.totalAllEnrollments}
                </span>
                <span className="breakdown-label">Total Cumulative</span>
                <small className="text-muted">Across all semesters</small>
              </div>
            </div>
          </div>

          <div className="card recent-activity-card mt-4">
            <div className="card-header-row">
              <h2 className="card-title">Recent Enrollment Activity</h2>
              <Link to="/courses" className="btn btn-secondary btn-sm">
                View All Courses →
              </Link>
            </div>

            {stats.recentEnrollments && stats.recentEnrollments.length === 0 ? (
              <p className="text-muted text-center py-4">No enrollment activity recorded yet.</p>
            ) : (
              <div className="table-responsive mt-3">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Email</th>
                      <th>Course</th>
                      <th>Batch</th>
                      <th>Status</th>
                      <th>Enrolled Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentEnrollments.map((enr) => (
                      <tr key={enr._id}>
                        <td>
                          <strong>{enr.student?.name || "Deleted Student"}</strong>
                        </td>
                        <td>{enr.student?.email || "N/A"}</td>
                        <td>
                          {enr.batch?.course ? (
                            <Link to={`/courses/${enr.batch.course._id}`}>
                              {enr.batch.course.courseCode} - {enr.batch.course.title}
                            </Link>
                          ) : (
                            "N/A"
                          )}
                        </td>
                        <td>{enr.batch?.batchName || "N/A"}</td>
                        <td>
                          <StatusBadge status={enr.status} text={enr.status} />
                        </td>
                        <td>
                          {new Date(enr.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
