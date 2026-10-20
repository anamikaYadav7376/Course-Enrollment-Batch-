import React, { useState, useEffect } from "react";

export default function BatchForm({
  courseId,
  initialData = {},
  onSubmit,
  onCancel,
  submitText = "Save Batch",
  serverError = null
}) {
  const [formData, setFormData] = useState({
    batchName: "",
    startDate: "",
    timing: "",
    mode: "Online",
    totalSeats: 25
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        batchName: initialData.batchName || "",
        startDate: initialData.startDate
          ? new Date(initialData.startDate).toISOString().split("T")[0]
          : "",
        timing: initialData.timing || "",
        mode: initialData.mode || "Online",
        totalSeats: initialData.totalSeats || 25
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.batchName.trim()) errors.batchName = "Batch name is required.";
    if (!formData.startDate) errors.startDate = "Start date is required.";
    if (!formData.timing.trim()) errors.timing = "Timing is required (e.g. 10:00 AM - 12:00 PM).";
    if (!formData.mode) errors.mode = "Mode is required.";
    if (!formData.totalSeats || Number(formData.totalSeats) < 1) {
      errors.totalSeats = "Total seats must be at least 1.";
    }
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
        course: courseId,
        ...formData,
        totalSeats: Number(formData.totalSeats)
      });
    } catch (err) {
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="batch-form">
      {serverError && (
        <div className="alert alert-error mb-4" role="alert">
          {serverError}
        </div>
      )}

      <div className="form-group">
        <label className="form-label" htmlFor="batchName">
          Batch Name <span className="required">*</span>
        </label>
        <input
          type="text"
          id="batchName"
          name="batchName"
          className={`form-input ${fieldErrors.batchName ? "input-error" : ""}`}
          placeholder="e.g., Morning Fast-Track Batch"
          value={formData.batchName}
          onChange={handleChange}
          disabled={submitting}
        />
        {fieldErrors.batchName && <span className="field-error">{fieldErrors.batchName}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="startDate">
            Start Date <span className="required">*</span>
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            className={`form-input ${fieldErrors.startDate ? "input-error" : ""}`}
            value={formData.startDate}
            onChange={handleChange}
            disabled={submitting}
          />
          {fieldErrors.startDate && <span className="field-error">{fieldErrors.startDate}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="mode">
            Mode <span className="required">*</span>
          </label>
          <select
            id="mode"
            name="mode"
            className="form-input"
            value={formData.mode}
            onChange={handleChange}
            disabled={submitting}
          >
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="totalSeats">
            Total Seats <span className="required">*</span>
          </label>
          <input
            type="number"
            id="totalSeats"
            name="totalSeats"
            min="1"
            max="500"
            className={`form-input ${fieldErrors.totalSeats ? "input-error" : ""}`}
            value={formData.totalSeats}
            onChange={handleChange}
            disabled={submitting}
          />
          {fieldErrors.totalSeats && <span className="field-error">{fieldErrors.totalSeats}</span>}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="timing">
          Timing / Schedule <span className="required">*</span>
        </label>
        <input
          type="text"
          id="timing"
          name="timing"
          className={`form-input ${fieldErrors.timing ? "input-error" : ""}`}
          placeholder="e.g., 07:00 PM - 09:00 PM (Mon - Fri)"
          value={formData.timing}
          onChange={handleChange}
          disabled={submitting}
        />
        {fieldErrors.timing && <span className="field-error">{fieldErrors.timing}</span>}
      </div>

      <div className="form-actions">
        {onCancel && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting}
          id="submit-batch-btn"
        >
          {submitting ? "Saving..." : submitText}
        </button>
      </div>
    </form>
  );
}
