import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import MyEnrollments from "./pages/MyEnrollments";
import AdminDashboard from "./pages/AdminDashboard";
import AddCourse from "./pages/AddCourse";
import EditCourse from "./pages/EditCourse";
import BatchStudents from "./pages/BatchStudents";
import NotFound from "./pages/NotFound";

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const handleLoginSuccess = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <div className="app-layout">
      <Navbar user={user} onLogout={handleLogout} />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/register" element={<Register onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/courses" element={<Courses user={user} />} />
          <Route path="/courses/:id" element={<CourseDetails user={user} />} />

          <Route
            path="/my-enrollments"
            element={
              <ProtectedRoute user={user} allowedRoles={["student"]}>
                <MyEnrollments user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute user={user} allowedRoles={["admin"]}>
                <AdminDashboard user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/courses/new"
            element={
              <ProtectedRoute user={user} allowedRoles={["admin"]}>
                <AddCourse />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/courses/:id/edit"
            element={
              <ProtectedRoute user={user} allowedRoles={["admin"]}>
                <EditCourse />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/batches/:id/students"
            element={
              <ProtectedRoute user={user} allowedRoles={["admin"]}>
                <BatchStudents user={user} />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="footer">
        <div className="footer-container">
          <p>
            CourseHub — Simple Full-Stack Course Enrollment & Batch Management System
          </p>
          <p className="footer-subtext">
            Built with Node.js, Express, MongoDB Atlas, React, and Vite.
          </p>
        </div>
      </footer>
    </div>
  );
}
