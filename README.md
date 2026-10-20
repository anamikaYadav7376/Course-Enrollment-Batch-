# Course Enrollment & Batch Management System

A beginner-friendly, robust, full-stack web application designed for educational academies to manage curriculum offerings, schedule batches, track seat availability dynamically, and handle student enrollments safely.

Built with **Node.js, Express, MongoDB Atlas / Mongoose, React, and Vite**.

---

## 📌 Problem Statement

Academic institutions often struggle with managing student enrollments across overlapping course tracks. Manual or poorly validated systems lead to serious operational issues:
- **Over-enrollment**: Batches get booked beyond classroom or server limits.
- **Duplicate enrollments**: Students inadvertently register for the same course multiple times across different batches.
- **Inaccurate metrics**: Seats left are miscalculated when students drop or complete courses.
- **Broken access boundaries**: Students gaining access to administrative actions or seeing other students' personal enrollments.

This project solves these challenges by implementing atomic, database-backed validation rules on the backend, coupled with an intuitive, responsive React frontend.

---

## ✨ Features

### For Students
- **Explore Courses**: Search the academic catalog by title or course code with real-time URL state (`/courses?search=...`).
- **Batch Schedules & Live Seat Counts**: View upcoming batches with start dates, timings, modes (Online/Offline), occupied seats, and remaining seats.
- **One-Click Enrollment**: Enroll in available batches with immediate feedback and live seat deduction.
- **Personal Learning Schedule**: Dedicated "My Enrollments" dashboard displaying active, completed, and dropped courses.
- **Academic Integrity Guard**: Automatic prevention against enrolling in the same course twice, even across different batches.

### For Administrators
- **Executive Analytics Dashboard**: Real-time aggregated statistics from MongoDB:
  - Total course catalog count
  - Active batches currently running
  - Active enrolled students vs. historical enrollments (completed and dropped)
  - Most popular course track based on active student demand
  - Recent enrollment activity log
- **Course Lifecycle Management**: Create, edit, and safely delete courses (protected from accidental deletion if batches exist).
- **Batch Management**: Add and update schedules, define timing and seat caps, and monitor occupancy.
- **Student Roster Management**: View all students enrolled in any selected batch and adjust their status (`Active`, `Completed`, or `Dropped`) with automatic seat recomputation.

---

## 🛠️ Technology Stack

| Layer | Technologies | Purpose |
| :--- | :--- | :--- |
| **Backend** | Node.js, Express.js | REST API server, routing, middleware |
| **Database** | MongoDB Atlas / Local MongoDB, Mongoose | Schema modeling, validations, aggregations |
| **Authentication** | JSON Web Tokens (JWT), bcryptjs | Secure password hashing & role authorization |
| **Frontend** | React 19, Vite, React Router 7 | Fast Single Page Application (SPA), routing |
| **Styling** | Vanilla CSS (CSS Variables, Flexbox, Grid) | Clean, responsive design without heavyweight CSS libraries |
| **HTTP Client** | Native Fetch API | Dedicated API client abstraction inside `api/` directory |

> **Development Note on JWT in `localStorage`**:  
> For this beginner-focused educational project, authentication tokens and basic user profile information are stored in the browser's `localStorage` via a simple `Authorization: Bearer <token>` header. This pattern makes the client-side authentication flow clear and easy to inspect, debug, and explain in technical interviews. In large-scale enterprise production systems, storing access tokens in `httpOnly` secure cookies is recommended to mitigate XSS exposure.

---

## 📁 Project Folder Structure

```
Assignment-6/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database connection with Mongoose
│   ├── controllers/
│   │   ├── authController.js       # Register, login, me, logout
│   │   ├── courseController.js     # Courses CRUD & search
│   │   ├── batchController.js      # Batches CRUD & enrolled roster
│   │   ├── enrollmentController.js # Enrollment & atomic seat logic
│   │   └── dashboardController.js  # Real aggregated metrics
│   ├── middleware/
│   │   ├── authHandler.js          # JWT verification middleware
│   │   ├── roleHandler.js          # allowRoles('admin' / 'student')
│   │   ├── errorHandler.js         # Centralized error handler (11000, CastError, etc.)
│   │   └── logger.js               # Clean request logging
│   ├── models/
│   │   ├── User.js                 # User schema with bcrypt pre-save hook
│   │   ├── Course.js               # Course schema with unique courseCode
│   │   ├── Batch.js                # Batch schema referencing Course
│   │   └── Enrollment.js           # Enrollment schema with status enum
│   ├── routes/
│   │   ├── authRoutes.js           # /api/auth
│   │   ├── courseRoutes.js         # /api/courses
│   │   ├── batchRoutes.js          # /api/batches
│   │   ├── enrollmentRoutes.js     # /api/enrollments
│   │   └── dashboardRoutes.js      # /api/dashboard
│   ├── server.js                   # Main Express application entry
│   ├── seed.js                     # Populates demo admin, students, 12 courses & batches
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/                    # Isolated API client layer
│   │   │   ├── client.js           # Reusable fetch client with auth header
│   │   │   ├── authApi.js          # Authentication endpoints
│   │   │   ├── courseApi.js        # Course catalog endpoints
│   │   │   ├── batchApi.js         # Batch schedule endpoints
│   │   │   ├── enrollmentApi.js    # Student enrollment endpoints
│   │   │   └── dashboardApi.js     # Admin metrics endpoints
│   │   ├── components/             # Reusable UI components
│   │   │   ├── Navbar.jsx          # Header navigation with NavLink
│   │   │   ├── ProtectedRoute.jsx  # Role-based route guard
│   │   │   ├── CourseForm.jsx      # Reusable form for Add & Edit course
│   │   │   ├── BatchForm.jsx       # Reusable form for batch creation
│   │   │   └── StatusBadge.jsx     # Colored pill badges
│   │   ├── pages/                  # Route view components
│   │   │   ├── Home.jsx            # Landing / dashboard overview
│   │   │   ├── Login.jsx           # Sign in with quick demo fillers
│   │   │   ├── Register.jsx        # Student registration
│   │   │   ├── Courses.jsx         # Catalog with URL search param state
│   │   │   ├── CourseDetails.jsx   # Course details, batches, seats, enroll button
│   │   │   ├── MyEnrollments.jsx   # Student's enrolled programs
│   │   │   ├── AdminDashboard.jsx  # Aggregated system metrics & recent activity
│   │   │   ├── AddCourse.jsx       # Admin course creation
│   │   │   ├── EditCourse.jsx      # Admin course updating
│   │   │   ├── BatchStudents.jsx   # Admin student roster & status updater
│   │   │   └── NotFound.jsx        # 404 Catch-all page
│   │   ├── App.jsx                 # User state & route definitions
│   │   ├── main.jsx                # BrowserRouter root entry
│   │   └── index.css               # Clean styling and design system
│   ├── index.html
│   ├── vite.config.js
│   ├── vercel.json                 # SPA rewrite configuration
│   ├── package.json
│   └── .env.example
├── .gitignore                      # Excludes node_modules, .env, build files
└── README.md
```

---

## 📋 Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: v18.0.0 or later (v20+ recommended)
- **npm**: v9.0.0 or later
- **MongoDB**: A running local MongoDB instance (e.g., `mongodb://127.0.0.1:27017`) or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster connection string.

---

## 🚀 Local Setup Instructions

### 1. Clone or Open the Repository
```bash
cd Assignment-6
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Configure your environment variables:
```bash
cp .env.example .env
```
*(Optionally modify `MONGO_URI` or `PORT` in `backend/.env` if your configuration differs from defaults).*

### 3. Seed the Database
Populate the database with demo admin and student accounts, 12 technical courses, schedules, and active enrollments:
```bash
npm run seed
```

### 4. Start the Backend Server
```bash
npm run dev
# Or: npm start
```
The backend API will start on `http://localhost:5000`. You can verify it at `http://localhost:5000/api/health`.

### 5. Frontend Setup
Open a new terminal window, navigate to the frontend directory, and install dependencies:
```bash
cd frontend
npm install
```

Configure your frontend environment variables:
```bash
cp .env.example .env
```

Start the Vite development server:
```bash
npm run dev
```
Open your browser and navigate to: **`http://localhost:5173`**.

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `PORT` | HTTP port Express listens on | `5000` |
| `NODE_ENV` | Environment mode | `development` |
| `MONGO_URI` | MongoDB connection URI | `mongodb://127.0.0.1:27017/course_enrollment_db` |
| `JWT_SECRET` | Secret key for signing authentication tokens | `super_secret_jwt_key_12345` |
| `FRONTEND_URL` | Deployed frontend origin for CORS | `http://localhost:5173` |
| `ADMIN_NAME` | Demo admin account name for seed script | `System Administrator` |
| `ADMIN_EMAIL` | Demo admin login email | `admin@example.com` |
| `ADMIN_PASSWORD` | Demo admin login password | `Admin@123` |

### Frontend (`frontend/.env`)
| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `VITE_API_URL` | Base URL of the Express API backend | `http://localhost:5000/api` |

---

## 🔑 Demo Test Accounts

The seed script creates the following pre-configured accounts:

| Role | Email Address | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@example.com` | `Admin@123` | Full CRUD on courses & batches, view analytics, manage student statuses |
| **Student 1** | `rahul@example.com` | `Student@123` | Browse catalog, enroll in batches, view personal enrollments |
| **Student 2** | `priya@example.com` | `Student@123` | Browse catalog, enroll in batches, view personal enrollments |
| **Student 3** | `amit@example.com` | `Student@123` | Browse catalog, enroll in batches, view personal enrollments |

> **Tip**: On the `/login` page, click the **"Fill Admin"** or **"Fill Student"** quick-select buttons to autofill these credentials instantly.

---

## 📡 REST API Reference

All backend API responses are delivered in structured JSON format (`res.status(...).json(...)`).

### Authentication (`/api/auth`)
| Method | Endpoint | Access Role | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new student (strictly forced to `student` role) |
| `POST` | `/api/auth/login` | Public | Authenticate email & password, returns JWT token & user |
| `POST` | `/api/auth/logout` | Public | Clears session response |
| `GET` | `/api/auth/me` | Logged In | Retrieve current authenticated user profile |

### Courses (`/api/courses`)
| Method | Endpoint | Access Role | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/courses` | Public | List courses (supports `?search=<keyword>` query) |
| `GET` | `/api/courses/:id` | Public | Course details with all batches & calculated seats left |
| `POST` | `/api/courses` | Admin | Create a new course offering |
| `PUT` | `/api/courses/:id` | Admin | Update course metadata, fee, duration, or syllabus |
| `DELETE` | `/api/courses/:id` | Admin | Delete course safely (blocks if batches are attached) |

### Batches (`/api/batches`)
| Method | Endpoint | Access Role | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/batches` | Public | List batches (supports `?course=<id>` filter) |
| `GET` | `/api/batches/:id` | Public | Batch details with dynamic occupied and left seat counts |
| `POST` | `/api/batches` | Admin | Create a batch under an existing course |
| `PUT` | `/api/batches/:id` | Admin | Update batch schedule, mode, or total seats |
| `DELETE` | `/api/batches/:id` | Admin | Delete batch safely (blocks if enrollments are present) |
| `GET` | `/api/batches/:id/students` | Admin | View student roster enrolled in the batch |

### Enrollments (`/api/enrollments`)
| Method | Endpoint | Access Role | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/enrollments` | Student | Enroll in a batch with atomic seat check and duplicate rule check |
| `GET` | `/api/enrollments/my` | Student / User | View logged-in student's active and past enrollments |
| `PUT` | `/api/enrollments/:id/status` | Admin | Update enrollment status (`Active`, `Completed`, `Dropped`) |

### Dashboard Analytics (`/api/dashboard`)
| Method | Endpoint | Access Role | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/dashboard/stats` | Admin | Aggregated database metrics: total courses, active batches, active enrollments, popular course |

