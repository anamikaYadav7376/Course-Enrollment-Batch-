import React from "react";
import { Link } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";

export default function Home({ user }) {
  return (
    <div className="home-page">
      <section className="hero-section card">
        <div className="hero-content">
          <div className="badge-pill mb-2">Academic & Career Excellence</div>
          <h1 className="hero-title">Course Enrollment & Batch Management System</h1>
          <p className="hero-subtitle">
            A comprehensive, transparent platform for students to discover cutting-edge tech courses,
            explore schedule batches with real-time seat availability, and manage active enrollments.
          </p>

          <div className="hero-cta">
            <Link to="/courses" className="btn btn-primary btn-lg">
              Explore Courses
            </Link>

            {!user ? (
              <>
                <Link to="/register" className="btn btn-outline btn-lg">
                  Student Registration
                </Link>
                <Link to="/login" className="btn btn-secondary btn-lg">
                  Sign In
                </Link>
              </>
            ) : user.role === "student" ? (
              <Link to="/my-enrollments" className="btn btn-outline btn-lg">
                View My Enrollments
              </Link>
            ) : (
              <Link to="/admin/dashboard" className="btn btn-outline btn-lg">
                Open Admin Dashboard
              </Link>
            )}
          </div>
        </div>
      </section>

      {user && (
        <section className="user-welcome-card card">
          <div className="welcome-header">
            <div>
              <h2>Welcome back, {user.name}!</h2>
              <p className="text-muted">Signed in as {user.email}</p>
            </div>
            <StatusBadge status={user.role} text={`${user.role.toUpperCase()} ACCOUNT`} />
          </div>

          <div className="quick-actions-grid">
            {user.role === "student" ? (
              <>
                <div className="quick-action-card">
                  <h3>Browse Catalog</h3>
                  <p>Explore available technical tracks, batch schedules, and enroll before seats fill up.</p>
                  <Link to="/courses" className="btn btn-secondary btn-sm mt-2">
                    Browse Courses →
                  </Link>
                </div>
                <div className="quick-action-card">
                  <h3>My Schedule</h3>
                  <p>Keep track of your active learning programs, batch timings, and completion statuses.</p>
                  <Link to="/my-enrollments" className="btn btn-secondary btn-sm mt-2">
                    My Enrollments →
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="quick-action-card">
                  <h3>System Metrics</h3>
                  <p>Review real-time enrollment statistics, active batch distributions, and popular tracks.</p>
                  <Link to="/admin/dashboard" className="btn btn-secondary btn-sm mt-2">
                    View Analytics →
                  </Link>
                </div>
                <div className="quick-action-card">
                  <h3>Curriculum Management</h3>
                  <p>Publish new course offerings, schedule morning/evening batches, and manage enrollments.</p>
                  <Link to="/admin/courses/new" className="btn btn-secondary btn-sm mt-2">
                    Add New Course →
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>
      )}

      <section className="features-grid">
        <div className="feature-card card">
          <div className="feature-icon">⚡</div>
          <h3>Real-Time Seat Tracking</h3>
          <p>
            Dynamic seat counts ensure concurrency safety. Occupied seats are derived exclusively from active
            enrollments, guaranteeing zero over-subscription.
          </p>
        </div>

        <div className="feature-card card">
          <div className="feature-icon">🛡️</div>
          <h3>Course Integrity Rules</h3>
          <p>
            Strict business validation prevents students from registering for the same course twice, preserving
            academic fairness across multiple batches.
          </p>
        </div>

        <div className="feature-card card">
          <div className="feature-icon">📊</div>
          <h3>Role-Based Access</h3>
          <p>
            Robust JWT authentication and permission boundaries separate administrative oversight from student
            learning portals on both frontend and backend.
          </p>
        </div>
      </section>
    </div>
  );
}
