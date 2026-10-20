import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { authApi } from "../api/authApi";

export default function Login({ onLoginSuccess }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || "/";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.email.trim()) errors.email = "Email address is required.";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      errors.email = "Please enter a valid email address.";
    }

    if (!formData.password) errors.password = "Password is required.";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      setLoading(true);
      const res = await authApi.login(formData.email.trim().toLowerCase(), formData.password);
      if (res.success && res.token && res.user) {
        onLoginSuccess(res.user, res.token);
        if (res.user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate(from === "/login" ? "/courses" : from);
        }
      }
    } catch (err) {
      setServerError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (email, password) => {
    setFormData({ email, password });
    setFieldErrors({});
    setServerError(null);
  };

  return (
    <div className="auth-container">
      <div className="card auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p className="text-muted">Sign in to your account to continue</p>
        </div>

        {serverError && (
          <div className="alert alert-error" role="alert">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-input ${fieldErrors.email ? "input-error" : ""}`}
              placeholder="e.g., student@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              autoComplete="email"
            />
            {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className={`form-input ${fieldErrors.password ? "input-error" : ""}`}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              autoComplete="current-password"
            />
            {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
            id="login-submit-btn"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account? <Link to="/register">Create one here</Link>
          </p>
        </div>

        <div className="demo-credentials-box">
          <p className="demo-title">⚡ Quick Demo Logins</p>
          <div className="demo-buttons">
            <button
              type="button"
              className="btn btn-sm btn-outline"
              onClick={() => fillCredentials("admin@example.com", "Admin@123")}
            >
              Fill Admin (admin@example.com)
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline"
              onClick={() => fillCredentials("rahul@example.com", "Student@123")}
            >
              Fill Student (rahul@example.com)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
