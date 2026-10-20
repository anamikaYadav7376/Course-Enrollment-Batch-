const Course = require("../models/Course");
const Batch = require("../models/Batch");
const Enrollment = require("../models/Enrollment");
const User = require("../models/User");

exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalCourses = await Course.countDocuments();

    const totalBatches = await Batch.countDocuments();

    const batchesWithActiveStudents = await Enrollment.distinct("batch", { status: "Active" });
    const activeBatchesCount = batchesWithActiveStudents.length;

    const totalActiveEnrollments = await Enrollment.countDocuments({ status: "Active" });
    const totalCompletedEnrollments = await Enrollment.countDocuments({ status: "Completed" });
    const totalDroppedEnrollments = await Enrollment.countDocuments({ status: "Dropped" });
    const totalHistoricalEnrollments = totalCompletedEnrollments + totalDroppedEnrollments;
    const totalAllEnrollments = await Enrollment.countDocuments();

    const totalStudents = await User.countDocuments({ role: "student" });

    // Find the most popular course by counting active enrollments
    const activeEnrollments = await Enrollment.find({ status: "Active" }).populate({
      path: "batch",
      select: "course"
    });

    // Count how many active students are in each course
    const courseEnrollmentCounts = {};
    for (const enrollment of activeEnrollments) {
      if (enrollment.batch && enrollment.batch.course) {
        const courseId = enrollment.batch.course.toString();
        courseEnrollmentCounts[courseId] = (courseEnrollmentCounts[courseId] || 0) + 1;
      }
    }

    // Find the course ID with the highest number of active students
    let topCourseId = null;
    let maxEnrollments = 0;
    for (const [courseId, count] of Object.entries(courseEnrollmentCounts)) {
      if (count > maxEnrollments) {
        maxEnrollments = count;
        topCourseId = courseId;
      }
    }

    let mostPopularCourse = null;
    if (topCourseId) {
      const topCourse = await Course.findById(topCourseId);
      if (topCourse) {
        mostPopularCourse = {
          _id: topCourse._id,
          title: topCourse.title,
          courseCode: topCourse.courseCode,
          fee: topCourse.fee,
          activeEnrollments: maxEnrollments
        };
      }
    }

    const recentEnrollments = await Enrollment.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("student", "name email")
      .populate({
        path: "batch",
        select: "batchName",
        populate: { path: "course", select: "title courseCode" }
      });

    res.status(200).json({
      success: true,
      data: {
        totalCourses,
        totalBatches,
        activeBatches: activeBatchesCount,
        totalStudents,
        totalActiveEnrollments,
        totalHistoricalEnrollments,
        totalCompletedEnrollments,
        totalDroppedEnrollments,
        totalAllEnrollments,
        mostPopularCourse,
        recentEnrollments
      }
    });
  } catch (error) {
    next(error);
  }
};
