const mongoose = require("mongoose");
const Enrollment = require("../models/Enrollment");
const Batch = require("../models/Batch");
const Course = require("../models/Course");

exports.enrollInBatch = async (req, res, next) => {
  try {
    const { batchId } = req.body;
    const studentId = req.user.id;

    if (!batchId || !mongoose.Types.ObjectId.isValid(batchId)) {
      return res.status(400).json({
        success: false,
        message: "A valid batch ID is required for enrollment."
      });
    }

    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "The specified batch does not exist."
      });
    }

    // Business rule: A student cannot enroll in the same course twice, even across different batches
    const courseBatches = await Batch.find({ course: batch.course }).select("_id");
    const courseBatchIds = courseBatches.map((b) => b._id);

    const existingEnrollment = await Enrollment.findOne({
      student: studentId,
      batch: { $in: courseBatchIds },
      status: { $in: ["Active", "Completed"] }
    });

    if (existingEnrollment) {
      const message =
        existingEnrollment.status === "Active"
          ? "You are already actively enrolled in this course. Students cannot enroll in the same course twice."
          : "You have already completed this course previously.";
      return res.status(400).json({ success: false, message });
    }

    // Business rule: Re-verify seat capacity on server side to prevent overbooking
    const occupiedSeats = await Enrollment.countDocuments({
      batch: batch._id,
      status: "Active"
    });

    if (occupiedSeats >= batch.totalSeats) {
      return res.status(400).json({
        success: false,
        message: "Enrollment failed: This batch is full. No seats are currently available."
      });
    }

    // If the student previously dropped this batch, reactivate the existing record instead of creating a duplicate
    const previousDropped = await Enrollment.findOne({
      student: studentId,
      batch: batch._id,
      status: "Dropped"
    });

    let enrollment;
    if (previousDropped) {
      previousDropped.status = "Active";
      await previousDropped.save();
      enrollment = previousDropped;
    } else {
      enrollment = await Enrollment.create({
        student: studentId,
        batch: batch._id,
        status: "Active"
      });
    }

    const populated = await Enrollment.findById(enrollment._id)
      .populate("student", "name email")
      .populate({
        path: "batch",
        select: "batchName startDate timing mode totalSeats",
        populate: {
          path: "course",
          select: "title courseCode fee durationWeeks"
        }
      });

    return res.status(201).json({
      success: true,
      message: "Successfully enrolled in the batch!",
      data: populated
    });
  } catch (error) {
    next(error);
  }
};

exports.getMyEnrollments = async (req, res, next) => {
  try {
    const studentId = req.user.id;

    const enrollments = await Enrollment.find({ student: studentId })
      .populate({
        path: "batch",
        select: "batchName startDate timing mode totalSeats",
        populate: {
          path: "course",
          select: "title courseCode fee durationWeeks description"
        }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments
    });
  } catch (error) {
    next(error);
  }
};

exports.updateEnrollmentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid enrollment ID format."
      });
    }

    const validStatuses = ["Active", "Completed", "Dropped"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status '${status}'. Must be one of: ${validStatuses.join(", ")}.`
      });
    }

    const enrollment = await Enrollment.findById(id).populate("batch");
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment record not found."
      });
    }

    // If reactivating a dropped or completed student back to Active, ensure the batch still has an available seat
    if (status === "Active" && enrollment.status !== "Active") {
      const activeCount = await Enrollment.countDocuments({
        batch: enrollment.batch._id,
        status: "Active"
      });

      if (activeCount >= enrollment.batch.totalSeats) {
        return res.status(400).json({
          success: false,
          message: `Cannot reactivate enrollment: The batch '${enrollment.batch.batchName}' is full (${activeCount}/${enrollment.batch.totalSeats} seats occupied).`
        });
      }
    }

    enrollment.status = status;
    await enrollment.save();

    const updated = await Enrollment.findById(id)
      .populate("student", "name email")
      .populate({
        path: "batch",
        select: "batchName startDate timing mode",
        populate: {
          path: "course",
          select: "title courseCode"
        }
      });

    res.status(200).json({
      success: true,
      message: `Enrollment status updated to '${status}'.`,
      data: updated
    });
  } catch (error) {
    next(error);
  }
};
