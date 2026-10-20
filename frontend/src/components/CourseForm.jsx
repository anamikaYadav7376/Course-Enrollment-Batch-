import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Reusable form component used for both adding a new course and editing an existing one
export default function CourseForm({
  initialData = {},
  onSubmit,
  submitText = "Save Course",
  serverError = null
}) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    courseCode: "",
    durationWeeks: "",
    fee: "",
    description: ""
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        title: initialData.title || "",
        courseCode: initialData.courseCode || "",
        durationWeeks: initialData.durationWeeks !== undefined ? initialData.durationWeeks : "",
        fee: initialData.fee !== undefined ? initialData.fee : "",
        description: initialData.description || ""
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "courseCode" ? value.toUpperCase() : value
    }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = "Course title is required.";
    else if (formData.title.trim().length < 3) errors.title = "Title must be at least 3 characters.";

    if (!formData.courseCode.trim()) errors.courseCode = "Course code is required.";
    else if (formData.courseCode.trim().length < 2) errors.courseCode = "Course code must be at least 2 characters.";

    if (!formData.durationWeeks) errors.durationWeeks = "Duration is required.";
    else if (Number(formData.durationWeeks) < 1) errors.durationWeeks = "Duration must be at least 1 week.";

    if (formData.fee === "" || formData.fee === null) errors.fee = "Course fee is required.";
    else if (Number(formData.fee) < 0) errors.fee = "Fee cannot be negative.";

    if (!formData.description.trim()) errors.description = "Course description is required.";
    else if (formData.description.trim().length < 10) errors.description = "Description must be at least 10 characters.";

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit({
        ...formData,
        durationWeeks: Number(formData.durationWeeks),
        fee: Number(formData.fee)
      });
    } catch (err) {
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card form-card">
      {serverError && (
        <div className="alert alert-error" role="alert">
          {serverError}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="title" className="form-label">
          Course Title <span className="required">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          className={`form-input ${fieldErrors.title ? "input-error" : ""}`}
          placeholder="e.g., Full Stack Web Development"
          value={formData.title}
          onChange={handleChange}
          disabled={submitting}
        />
        {fieldErrors.title && <span className="field-error">{fieldErrors.title}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="courseCode" className="form-label">
            Course Code <span className="required">*</span>
          </label>
          <input
            type="text"
            id="courseCode"
            name="courseCode"
            className={`form-input ${fieldErrors.courseCode ? "input-error" : ""}`}
            placeholder="e.g., FS101"
            value={formData.courseCode}
            onChange={handleChange}
            disabled={submitting}
          />
          {fieldErrors.courseCode && <span className="field-error">{fieldErrors.courseCode}</span>}
          <small className="help-text">Unique uppercase code (e.g., CS101, PY201)</small>
        </div>

        <div className="form-group">
          <label htmlFor="durationWeeks" className="form-label">
            Duration (Weeks) <span className="required">*</span>
          </label>
          <input
            type="number"
            id="durationWeeks"
            name="durationWeeks"
            min="1"
            max="104"
            className={`form-input ${fieldErrors.durationWeeks ? "input-error" : ""}`}
            placeholder="e.g., 12"
            value={formData.durationWeeks}
            onChange={handleChange}
            disabled={submitting}
          />
          {fieldErrors.durationWeeks && <span className="field-error">{fieldErrors.durationWeeks}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="fee" className="form-label">
            Course Fee (₹) <span className="required">*</span>
          </label>
          <input
            type="number"
            id="fee"
            name="fee"
            min="0"
            className={`form-input ${fieldErrors.fee ? "input-error" : ""}`}
            placeholder="e.g., 25000"
            value={formData.fee}
            onChange={handleChange}
            disabled={submitting}
          />
          {fieldErrors.fee && <span className="field-error">{fieldErrors.fee}</span>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="description" className="form-label">
          Course Description <span className="required">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows="4"
          className={`form-input form-textarea ${fieldErrors.description ? "input-error" : ""}`}
          placeholder="Describe syllabus, technologies taught, and prerequisites..."
          value={formData.description}
          onChange={handleChange}
          disabled={submitting}
        />
        {fieldErrors.description && <span className="field-error">{fieldErrors.description}</span>}
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate(-1)}
          disabled={submitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting}
          id="submit-course-btn"
        >
          {submitting ? "Saving..." : submitText}
        </button>
      </div>
    </form>
  );
}
