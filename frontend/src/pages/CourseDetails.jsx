import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { courseApi } from "../api/courseApi";
import { batchApi } from "../api/batchApi";
import { enrollmentApi } from "../api/enrollmentApi";
import BatchForm from "../components/BatchForm";
import StatusBadge from "../components/StatusBadge";

export default function CourseDetails({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [studentEnrollments, setStudentEnrollments] = useState([]);
  const [enrollingBatchId, setEnrollingBatchId] = useState(null);
  const [enrollmentFeedback, setEnrollmentFeedback] = useState(null);

  const [showBatchModal, setShowBatchModal] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);
  const [batchActionError, setBatchActionError] = useState(null);

  useEffect(() => {
    loadCourseDetails();
    if (user && user.role === "student") {
      loadStudentEnrollments();
    }
  }, [id, user]);

  const loadCourseDetails = async () => {
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

  const loadStudentEnrollments = async () => {
    try {
      const res = await enrollmentApi.getMyEnrollments();
      if (res.success && res.data) {
        setStudentEnrollments(res.data);
      }
    } catch (err) {
      console.error("Failed to load user enrollments:", err);
    }
  };

  // Business rule check: verify if the current student is already enrolled in any batch of this course
  const enrolledInThisCourse = studentEnrollments.find(
    (e) =>
      e.batch?.course?._id === id ||
      e.batch?.course === id ||
      (typeof e.batch?.course === "object" && e.batch?.course?._id === id)
  );

  const handleEnroll = async (batchId) => {
    if (!user) {
      navigate("/login", { state: { from: { pathname: `/courses/${id}` } } });
      return;
    }

    try {
      setEnrollingBatchId(batchId);
      setEnrollmentFeedback(null);
      const res = await enrollmentApi.enrollInBatch(batchId);
      if (res.success) {
        setEnrollmentFeedback({
          type: "success",
          message: "🎉 Congratulations! You have successfully enrolled in this batch."
        });
        await loadCourseDetails();
        await loadStudentEnrollments();
      }
    } catch (err) {
      setEnrollmentFeedback({
        type: "error",
        message: err.message || "Enrollment failed. Please try again."
      });
    } finally {
      setEnrollingBatchId(null);
    }
  };

  const handleCreateOrUpdateBatch = async (batchData) => {
    try {
      setBatchActionError(null);
      if (editingBatch) {
        await batchApi.updateBatch(editingBatch._id, batchData);
      } else {
        await batchApi.createBatch(batchData);
      }
      setShowBatchModal(false);
      setEditingBatch(null);
      await loadCourseDetails();
    } catch (err) {
      setBatchActionError(err.message || "Failed to save batch.");
      throw err;
    }
  };

  const handleDeleteBatch = async (batchId, batchName) => {
    const confirmed = window.confirm(`Are you sure you want to delete batch '${batchName}'?`);
    if (!confirmed) return;

    try {
      setError(null);
      await batchApi.deleteBatch(batchId);
      await loadCourseDetails();
    } catch (err) {
      setError(err.message || "Failed to delete batch.");
    }
  };

  if (loading) {
    return (
      <div className="card status-card">
        <div className="loading-spinner"></div>
        <p>Loading course information & batches...</p>
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
    <div className="course-details-page">
      <div className="breadcrumb mb-3">
        <Link to="/courses">← All Courses</Link> / <span>{course.courseCode}</span>
      </div>

      {enrollmentFeedback && (
        <div
          className={`alert ${enrollmentFeedback.type === "success" ? "alert-success" : "alert-error"} mb-4`}
          role="alert"
        >
          {enrollmentFeedback.message}
        </div>
      )}

      <div className="card course-header-card mb-4">
        <div className="course-header-top">
          <div>
            <span className="course-code-pill">{course.courseCode}</span>
            <h1 className="course-title-lg mt-2">{course.title}</h1>
          </div>
          <div className="course-price-box">
            <span className="price-label">Tuition Fee</span>
            <span className="price-value">₹{course.fee.toLocaleString()}</span>
          </div>
        </div>

        <p className="course-full-description mt-3">{course.description}</p>

        <div className="course-specs-grid mt-4">
          <div className="spec-card">
            <span className="spec-label">Duration</span>
            <span className="spec-value">{course.durationWeeks} Weeks</span>
          </div>
          <div className="spec-card">
            <span className="spec-label">Total Batches</span>
            <span className="spec-value">{course.batches ? course.batches.length : 0} Available</span>
          </div>
          <div className="spec-card">
            <span className="spec-label">Mode</span>
            <span className="spec-value">Online & Offline</span>
          </div>
        </div>
      </div>

      <div className="batches-section">
        <div className="section-header">
          <div>
            <h2>Available Batches & Schedules</h2>
            <p className="text-muted">
              Select a batch with open seats to enroll. Active seats update in real time.
            </p>
          </div>

          {user && user.role === "admin" && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setEditingBatch(null);
                setBatchActionError(null);
                setShowBatchModal(true);
              }}
              id="add-batch-modal-btn"
            >
              + Create Batch
            </button>
          )}
        </div>

        {user && user.role === "student" && enrolledInThisCourse && (
          <div className="alert alert-info mb-4">
            📌 You are currently enrolled in this course (Batch:{" "}
            <strong>{enrolledInThisCourse.batch?.batchName || "Enrolled"}</strong>, Status:{" "}
            <strong>{enrolledInThisCourse.status}</strong>). Students cannot register for the same course twice.
          </div>
        )}

        {course.batches && course.batches.length === 0 ? (
          <div className="card empty-card text-center">
            <div className="empty-icon">🗓️</div>
            <h3>No Batches Scheduled Yet</h3>
            <p className="text-muted">
              There are currently no active batches for this course. Please check back later.
            </p>
          </div>
        ) : (
          <div className="batches-grid">
            {course.batches.map((batch) => {
              const isFull = batch.seatsLeft <= 0;
              const isEnrolledInThisBatch =
                enrolledInThisCourse &&
                (enrolledInThisCourse.batch?._id === batch._id ||
                  enrolledInThisCourse.batch === batch._id);

              return (
                <div key={batch._id} className="card batch-card">
                  <div className="batch-card-header">
                    <h3>{batch.batchName}</h3>
                    <StatusBadge status={batch.mode} text={batch.mode} />
                  </div>

                  <div className="batch-details-list">
                    <div className="detail-row">
                      <span className="detail-label">Start Date:</span>
                      <span className="detail-value">
                        {new Date(batch.startDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </span>
                    </div>

                    <div className="detail-row">
                      <span className="detail-label">Schedule:</span>
                      <span className="detail-value">{batch.timing}</span>
                    </div>

                    <div className="seats-indicator-box">
                      <div className="seats-text-row">
                        <span>
                          Seats: <strong>{batch.occupiedSeats}</strong> / {batch.totalSeats} occupied
                        </span>
                        <span className={`seats-left-badge ${isFull ? "badge-full" : "badge-open"}`}>
                          {isFull ? "Full (0 seats left)" : `${batch.seatsLeft} seats left`}
                        </span>
                      </div>

                      <div className="progress-bar-bg">
                        <div
                          className={`progress-bar-fill ${isFull ? "fill-full" : ""}`}
                          style={{
                            width: `${Math.min(100, (batch.occupiedSeats / batch.totalSeats) * 100)}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="batch-card-actions">
                    {!user && (
                      <Link
                        to="/login"
                        state={{ from: { pathname: `/courses/${id}` } }}
                        className="btn btn-outline btn-block"
                      >
                        Log in to Enroll
                      </Link>
                    )}

                    {user && user.role === "student" && (
                      <>
                        {isEnrolledInThisBatch ? (
                          <button type="button" className="btn btn-secondary btn-block" disabled>
                            ✓ Already Enrolled ({enrolledInThisCourse.status})
                          </button>
                        ) : enrolledInThisCourse ? (
                          <button
                            type="button"
                            className="btn btn-secondary btn-block"
                            disabled
                            title="You cannot enroll in the same course twice."
                          >
                            Course Already Active
                          </button>
                        ) : isFull ? (
                          <button type="button" className="btn btn-secondary btn-block" disabled>
                            Batch Full
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-primary btn-block"
                            disabled={enrollingBatchId === batch._id}
                            onClick={() => handleEnroll(batch._id)}
                            id={`enroll-batch-${batch._id}`}
                          >
                            {enrollingBatchId === batch._id ? "Enrolling..." : "Enroll in Batch"}
                          </button>
                        )}
                      </>
                    )}

                    {user && user.role === "admin" && (
                      <div className="admin-batch-buttons">
                        <Link
                          to={`/admin/batches/${batch._id}/students`}
                          className="btn btn-outline btn-sm"
                        >
                          View Students ({batch.occupiedSeats})
                        </Link>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            setEditingBatch(batch);
                            setBatchActionError(null);
                            setShowBatchModal(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteBatch(batch._id, batch.batchName)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showBatchModal && (
        <div className="modal-overlay">
          <div className="card modal-card">
            <div className="modal-header">
              <h2>{editingBatch ? `Edit Batch: ${editingBatch.batchName}` : "Create New Batch"}</h2>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => {
                  setShowBatchModal(false);
                  setEditingBatch(null);
                }}
              >
                ✕
              </button>
            </div>

            <BatchForm
              courseId={id}
              initialData={editingBatch || {}}
              onSubmit={handleCreateOrUpdateBatch}
              onCancel={() => {
                setShowBatchModal(false);
                setEditingBatch(null);
              }}
              submitText={editingBatch ? "Update Batch" : "Create Batch"}
              serverError={batchActionError}
            />
          </div>
        </div>
      )}
    </div>
  );
}
