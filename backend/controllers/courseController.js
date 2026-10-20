const mongoose = require("mongoose");
const Course = require("../models/Course");
const Batch = require("../models/Batch");
const Enrollment = require("../models/Enrollment");

exports.getCourses = async (req, res, next) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      query = {
        $or: [
          { title: searchRegex },
          { courseCode: searchRegex }
        ]
      };
    }

    const courses = await Course.find(query).sort({ createdAt: -1 });

    const courseIds = courses.map((c) => c._id);
    const batches = await Batch.find({ course: { $in: courseIds } });

    const coursesWithMeta = courses.map((course) => {
      const courseBatches = batches.filter((b) => b.course.toString() === course._id.toString());
      return {
        ...course.toObject(),
        batchCount: courseBatches.length
      };
    });

    res.status(200).json({
      success: true,
      count: coursesWithMeta.length,
      data: coursesWithMeta
    });
  } catch (error) {
    next(error);
  }
};

exports.getCourseById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID format."
      });
    }

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found."
      });
    }

    const batches = await Batch.find({ course: id }).sort({ startDate: 1 });

    const batchesWithSeats = await Promise.all(
      batches.map(async (batch) => {
        const occupiedSeats = await Enrollment.countDocuments({
          batch: batch._id,
          status: "Active"
        });

        const seatsLeft = Math.max(0, batch.totalSeats - occupiedSeats);

        return {
          ...batch.toObject(),
          occupiedSeats,
          seatsLeft,
          isFull: seatsLeft <= 0
        };
      })
    );

    res.status(200).json({
      success: true,
      data: {
        ...course.toObject(),
        batches: batchesWithSeats
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.createCourse = async (req, res, next) => {
  try {
    const { title, courseCode, durationWeeks, fee, description } = req.body;

    if (courseCode) {
      const existing = await Course.findOne({
        courseCode: courseCode.trim().toUpperCase()
      });
      if (existing) {
        return res.status(409).json({
          success: false,
          message: `A course with code '${courseCode.trim().toUpperCase()}' already exists.`
        });
      }
    }

    const course = await Course.create({
      title,
      courseCode: courseCode ? courseCode.trim().toUpperCase() : undefined,
      durationWeeks: Number(durationWeeks),
      fee: Number(fee),
      description
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully.",
      data: course
    });
  } catch (error) {
    next(error);
  }
};

exports.updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID format."
      });
    }

    const { title, courseCode, durationWeeks, fee, description } = req.body;

    if (courseCode) {
      const existing = await Course.findOne({
        courseCode: courseCode.trim().toUpperCase(),
        _id: { $ne: id }
      });
      if (existing) {
        return res.status(409).json({
          success: false,
          message: `Course code '${courseCode.trim().toUpperCase()}' is already used by another course.`
        });
      }
    }

    const updatedData = {
      ...(title !== undefined && { title }),
      ...(courseCode !== undefined && { courseCode: courseCode.trim().toUpperCase() }),
      ...(durationWeeks !== undefined && { durationWeeks: Number(durationWeeks) }),
      ...(fee !== undefined && { fee: Number(fee) }),
      ...(description !== undefined && { description })
    };

    const course = await Course.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found."
      });
    }

    res.status(200).json({
      success: true,
      message: "Course updated successfully.",
      data: course
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID format."
      });
    }

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found."
      });
    }

    // Prevent accidental deletion if batches are linked to this course
    const batchCount = await Batch.countDocuments({ course: id });
    if (batchCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete course: There are ${batchCount} batch(es) associated with this course. Delete or reassign the batches first.`
      });
    }

    await Course.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Course deleted successfully."
    });
  } catch (error) {
    next(error);
  }
};
