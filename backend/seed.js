const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const Course = require("./models/Course");
const Batch = require("./models/Batch");
const Enrollment = require("./models/Enrollment");

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/course_enrollment_db";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@example.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@123";
const ADMIN_NAME = process.env.ADMIN_NAME || "System Administrator";

const seedDatabase = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for seeding.");

    await Enrollment.deleteMany({});
    await Batch.deleteMany({});
    await Course.deleteMany({});
    await User.deleteMany({});
    console.log("Cleared existing collections.");

    const adminUser = await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL.toLowerCase(),
      password: ADMIN_PASSWORD,
      role: "admin"
    });
    console.log(`Created Admin user: ${adminUser.email}`);

    const student1 = await User.create({
      name: "Rahul Sharma",
      email: "rahul@example.com",
      password: "Student@123",
      role: "student"
    });

    const student2 = await User.create({
      name: "Priya Patel",
      email: "priya@example.com",
      password: "Student@123",
      role: "student"
    });

    const student3 = await User.create({
      name: "Amit Kumar",
      email: "amit@example.com",
      password: "Student@123",
      role: "student"
    });

    const student4 = await User.create({
      name: "Sneha Reddy",
      email: "sneha@example.com",
      password: "Student@123",
      role: "student"
    });
    console.log("Created 4 sample student accounts.");

    const sampleCourses = [
      {
        title: "Full Stack Web Development (MERN)",
        courseCode: "FS101",
        durationWeeks: 16,
        fee: 45000,
        description: "Master modern web development using MongoDB, Express, React, and Node.js with real-world industry capstone projects."
      },
      {
        title: "Python for Data Science & AI",
        courseCode: "PY201",
        durationWeeks: 12,
        fee: 38000,
        description: "Comprehensive introduction to Python, data analysis with Pandas and NumPy, data visualization, and applied machine learning."
      },
      {
        title: "Modern JavaScript & TypeScript Mastery",
        courseCode: "JS102",
        durationWeeks: 8,
        fee: 25000,
        description: "Deep dive into modern ECMAScript features, asynchronous programming, closures, event loops, and type-safe TypeScript development."
      },
      {
        title: "Cloud Computing & DevOps with AWS",
        courseCode: "CL301",
        durationWeeks: 14,
        fee: 42000,
        description: "Learn Docker, Kubernetes, CI/CD pipelines with GitHub Actions, and core AWS infrastructure services for modern deployments."
      },
      {
        title: "MongoDB & Relational Database Design",
        courseCode: "DB105",
        durationWeeks: 6,
        fee: 20000,
        description: "Master document data modeling in MongoDB, schema optimization, aggregation pipelines, and SQL relational schema comparisons."
      },
      {
        title: "UI/UX Design & Frontend Engineering",
        courseCode: "UI202",
        durationWeeks: 10,
        fee: 30000,
        description: "Design intuitive digital user interfaces with Figma and build responsive, accessible web applications using modern CSS and React."
      },
      {
        title: "System Design & Microservices Architecture",
        courseCode: "SE401",
        durationWeeks: 12,
        fee: 48000,
        description: "Architecture patterns for large-scale distributed systems, caching strategies, messaging queues, load balancing, and high availability."
      },
      {
        title: "Cybersecurity & Ethical Hacking",
        courseCode: "CY103",
        durationWeeks: 10,
        fee: 35000,
        description: "Understand network security fundamentals, penetration testing workflows, OWASP Top 10 vulnerabilities, and defense strategies."
      },
      {
        title: "Mobile App Development with React Native",
        courseCode: "MO204",
        durationWeeks: 12,
        fee: 36000,
        description: "Build cross-platform iOS and Android applications with React Native, native device APIs, state management, and app store deployment."
      },
      {
        title: "Applied Machine Learning & NLP",
        courseCode: "AI305",
        durationWeeks: 14,
        fee: 50000,
        description: "Hands-on machine learning algorithms, Scikit-Learn, PyTorch basics, Natural Language Processing, and LLM application engineering."
      },
      {
        title: "Backend Engineering with Go & Docker",
        courseCode: "GO104",
        durationWeeks: 8,
        fee: 28000,
        description: "Build high-throughput, concurrent backend services using the Go programming language, standard library HTTP, and containerization."
      },
      {
        title: "Automated Software Testing & QA",
        courseCode: "QA205",
        durationWeeks: 6,
        fee: 18000,
        description: "Unit testing, integration testing, API validation with Postman, and end-to-end automation with Playwright and Jest."
      }
    ];

    const createdCourses = await Course.insertMany(sampleCourses);
    console.log(`Created ${createdCourses.length} courses.`);

    const batchesData = [
      {
        course: createdCourses[0]._id,
        batchName: "MERN Morning Batch A",
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        timing: "08:00 AM - 10:00 AM (Mon - Fri)",
        mode: "Online",
        totalSeats: 30
      },
      {
        course: createdCourses[0]._id,
        batchName: "MERN Weekend Batch B",
        startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        timing: "10:00 AM - 02:00 PM (Sat - Sun)",
        mode: "Offline",
        totalSeats: 20
      },
      {
        course: createdCourses[1]._id,
        batchName: "Python DS Evening Batch",
        startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        timing: "06:30 PM - 08:30 PM (Mon - Thu)",
        mode: "Online",
        totalSeats: 25
      },
      {
        course: createdCourses[1]._id,
        batchName: "Python Weekend Fast-Track",
        startDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        timing: "09:00 AM - 01:00 PM (Sat - Sun)",
        mode: "Offline",
        totalSeats: 15
      },
      {
        course: createdCourses[2]._id,
        batchName: "JS/TS Cohort 1",
        startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        timing: "07:00 PM - 08:30 PM (Mon, Wed, Fri)",
        mode: "Online",
        totalSeats: 2
      },
      {
        course: createdCourses[3]._id,
        batchName: "DevOps & Cloud Sprint 1",
        startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        timing: "08:00 PM - 10:00 PM (Tue, Thu, Sat)",
        mode: "Online",
        totalSeats: 30
      },
      {
        course: createdCourses[4]._id,
        batchName: "Database Engineering Nov Cohort",
        startDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        timing: "10:00 AM - 12:00 PM (Mon - Wed)",
        mode: "Offline",
        totalSeats: 25
      },
      {
        course: createdCourses[5]._id,
        batchName: "UI/UX Design Studio A",
        startDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
        timing: "04:00 PM - 06:00 PM (Mon - Fri)",
        mode: "Online",
        totalSeats: 20
      },
      {
        course: createdCourses[6]._id,
        batchName: "System Design Masterclass Weekend",
        startDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        timing: "11:00 AM - 02:00 PM (Sat - Sun)",
        mode: "Online",
        totalSeats: 35
      },
      {
        course: createdCourses[7]._id,
        batchName: "Cybersecurity Hands-on Lab",
        startDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
        timing: "07:00 PM - 09:00 PM (Mon, Wed, Fri)",
        mode: "Online",
        totalSeats: 25
      }
    ];

    const createdBatches = await Batch.insertMany(batchesData);
    console.log(`Created ${createdBatches.length} sample batches.`);

    const sampleEnrollments = [
      {
        student: student1._id,
        batch: createdBatches[0]._id,
        status: "Active"
      },
      {
        student: student2._id,
        batch: createdBatches[0]._id,
        status: "Active"
      },
      {
        student: student3._id,
        batch: createdBatches[0]._id,
        status: "Active"
      },
      {
        student: student1._id,
        batch: createdBatches[6]._id,
        status: "Completed"
      },
      {
        student: student2._id,
        batch: createdBatches[2]._id,
        status: "Active"
      },
      {
        student: student3._id,
        batch: createdBatches[7]._id,
        status: "Dropped"
      },
      {
        student: student4._id,
        batch: createdBatches[0]._id,
        status: "Active"
      },
      {
        student: student4._id,
        batch: createdBatches[5]._id,
        status: "Active"
      },
      {
        student: student1._id,
        batch: createdBatches[4]._id,
        status: "Active"
      },
      {
        student: student2._id,
        batch: createdBatches[4]._id,
        status: "Active"
      }
    ];

    const createdEnrollments = await Enrollment.insertMany(sampleEnrollments);
    console.log(`Created ${createdEnrollments.length} sample enrollments.`);

    console.log("\n========================================================");
    console.log("DATABASE SEEDING COMPLETED SUCCESSFULLY!");
    console.log("========================================================");
    console.log("Demo Credentials:");
    console.log(`  Admin Role   : Email: ${ADMIN_EMAIL} | Password: ${ADMIN_PASSWORD}`);
    console.log(`  Student 1    : Email: rahul@example.com | Password: Student@123`);
    console.log(`  Student 2    : Email: priya@example.com | Password: Student@123`);
    console.log(`  Student 3    : Email: amit@example.com  | Password: Student@123`);
    console.log("========================================================\n");

    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedDatabase();
