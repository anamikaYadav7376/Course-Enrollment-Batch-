import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { batchApi } from "../api/batchApi";
import { enrollmentApi } from "../api/enrollmentApi";
import StatusBadge from "../components/StatusBadge";

export default function BatchStudents({ user }) {
  const { id } = useParams();

  const [batchInfo, setBatchInfo] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchBatchStudents();
  }, [id]);

  const fetchBatchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await batchApi.getBatchStudents(id);
      if (res.success) {
        setBatchInfo(res.batch);
        setStudents(res.data);
      }
    } catch (err) {
      setError(err.message || "Failed to load enrolled students.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (enrollmentId, newStatus) => {
    try {
      setUpdatingId(enrollmentId);
      setError(null);
      setActionSuccess(null);

      const res = await enrollmentApi.updateEnrollmentStatus(enrollmentId, newStatus);
      if (res.success) {
        setActionSuccess(`Enrollment status updated to '${newStatus}'.`);
        await fetchBatchStudents();
      }
    } catch (err) {
      setError(err.message || "Failed to update enrollment status.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="card status-card">
        <div className="loading-spinner"></div>
        <p>Loading enrolled students...</p>
      </div>
    );
  }

  return (
    <div className="batch-students-page">
      <div className="breadcrumb mb-3">
        <Link to="/courses">Courses</Link> /{" "}
        {batchInfo?.course ? (
          <Link to={`/courses/${batchInfo.course._id}`}>{batchInfo.course.title}</Link>
        ) : (
          <span>Course</span>
        )}{" "}
        / <span>{batchInfo?.batchName || "Batch"} Students</span>
      </div>

      <div className="page-header">
        <div>
          <h1>Enrolled Students</h1>
          <p className="text-muted">
            Batch: <strong>{batchInfo?.batchName}</strong> | Mode:{" "}
            <strong>{batchInfo?.mode}</strong> | Schedule:{" "}
            <strong>{batchInfo?.timing}</strong>
          </p>
        </div>

        {batchInfo?.course && (
          <Link to={`/courses/${batchInfo.course._id}`} className="btn btn-secondary">
            ← Back to Course Batches
          </Link>
        )}
      </div>

      {actionSuccess && (
        <div className="alert alert-success" role="status">
          {actionSuccess}
        </div>
      )}

      {error && (
        <div className="alert alert-error" role="alert">
          {error}
        </div>
      )}

      {students.length === 0 ? (
        <div className="card empty-card text-center">
          <div className="empty-icon">👥</div>
          <h3>No Students Enrolled in This Batch Yet</h3>
          <p className="text-muted">
            When students register for this batch, they will appear in this administrative roster.
          </p>
        </div>
      ) : (
        <div className="card table-card">
          <div className="card-header-row">
            <h2 className="card-title">Enrolled Roster ({students.length} Total)</h2>
            <span className="badge badge-neutral">
              Total Seats: {batchInfo?.totalSeats}
            </span>
          </div>

          <div className="table-responsive mt-3">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student Name</th>
                  <th>Email Address</th>
                  <th>Enrolled On</th>
                  <th>Current Status</th>
                  <th>Update Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((item, index) => (
                  <tr key={item.enrollmentId}>
                    <td>{index + 1}</td>
                    <td>
                      <strong>{item.student?.name || "Unknown Student"}</strong>
                    </td>
                    <td>{item.student?.email || "N/A"}</td>
                    <td>
                      {new Date(item.enrolledAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </td>
                    <td>
                      <StatusBadge status={item.status} text={item.status} />
                    </td>
                    <td>
                      <div className="status-action-group">
                        <select
                          className="status-select"
                          value={item.status}
                          disabled={updatingId === item.enrollmentId}
                          onChange={(e) =>
                            handleStatusChange(item.enrollmentId, e.target.value)
                          }
                          aria-label={`Change enrollment status for ${item.student?.name}`}
                        >
                          <option value="Active">Active</option>
                          <option value="Completed">Completed</option>
                          <option value="Dropped">Dropped</option>
                        </select>
                        {updatingId === item.enrollmentId && (
                          <span className="updating-spinner">...</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
