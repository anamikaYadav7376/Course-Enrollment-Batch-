import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="card empty-card text-center py-5">
      <div className="empty-icon">🔍</div>
      <h1 className="hero-title mt-2">404 - Page Not Found</h1>
      <p className="text-muted mt-2">
        The page you are looking for does not exist or may have been moved.
      </p>
      <div className="mt-4">
        <Link to="/" className="btn btn-primary">
          Return to Home
        </Link>
        <Link to="/courses" className="btn btn-secondary ml-2">
          Browse Courses
        </Link>
      </div>
    </div>
  );
}
