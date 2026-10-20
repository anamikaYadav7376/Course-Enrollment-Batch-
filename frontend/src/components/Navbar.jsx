import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import StatusBadge from "./StatusBadge";

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-brand">
          <span className="brand-icon">🎓</span>
          <span className="brand-text">CourseHub</span>
        </NavLink>

        <nav className="navbar-links">
          <NavLink
            to="/courses"
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            Courses
          </NavLink>

          {user && user.role === "student" && (
            <NavLink
              to="/my-enrollments"
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              My Enrollments
            </NavLink>
          )}

          {user && user.role === "admin" && (
            <>
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/admin/courses/new"
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              >
                + Add Course
              </NavLink>
            </>
          )}
        </nav>

        <div className="navbar-auth">
          {user ? (
            <div className="user-profile">
              <div className="user-info">
                <span className="user-name">{user.name}</span>
                <StatusBadge status={user.role} text={user.role} />
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleLogoutClick}
                id="logout-button"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <NavLink to="/login" className="btn btn-outline btn-sm">
                Log In
              </NavLink>
              <NavLink to="/register" className="btn btn-primary btn-sm">
                Register
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
