const mongoose = require("mongoose");
const Batch = require("../models/Batch");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

exports.getBatches = async (req, res, next) => {
  try {
    const { course } = req.query;
    const filter = {};

    if (course) {
      if (!mongoose.Types.ObjectId.isValid(course)) {
        return res.status(400).json({
          success: false,
          message: "Invalid course ID format."
        });
      }
      filter.course = course;
    }

    const batches = await Batch.find(filter)
      .populate("course", "title courseCode fee durationWeeks")
      .sort({ startDate: 1 });

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
      count: batchesWithSeats.length,
      data: batchesWithSeats
    });
  } catch (error) {
    next(error);
  }
};

exports.getBatchById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid batch ID format."
      });
    }

    const batch = await Batch.findById(id).populate("course", "title courseCode fee durationWeeks description");
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found."
      });
    }

    const occupiedSeats = await Enrollment.countDocuments({
      batch: batch._id,
      status: "Active"
    });
    const seatsLeft = Math.max(0, batch.totalSeats - occupiedSeats);

    res.status(200).json({
      success: true,
      data: {
        ...batch.toObject(),
        occupiedSeats,
        seatsLeft,
        isFull: seatsLeft <= 0
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.createBatch = async (req, res, next) => {
  try {
    const { course, batchName, startDate, timing, mode, totalSeats } = req.body;

    if (!course || !mongoose.Types.ObjectId.isValid(course)) {
      return res.status(400).json({
        success: false,
        message: "A valid course reference is required."
      });
    }

    const courseExists = await Course.findById(course);
    if (!courseExists) {
      return res.status(404).json({
        success: false,
        message: "The referenced course does not exist."
      });
    }

    const batch = await Batch.create({
      course,
      batchName,
      startDate,
      timing,
      mode,
      totalSeats: Number(totalSeats)
    });

    res.status(201).json({
      success: true,
      message: "Batch created successfully.",
      data: batch
    });
  } catch (error) {
    next(error);
  }
};

exports.updateBatch = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid batch ID format."
      });
    }

    const { batchName, startDate, timing, mode, totalSeats } = req.body;

    const existingBatch = await Batch.findById(id);
    if (!existingBatch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found."
      });
    }

    // Prevent reducing seats below the number of currently active students
    if (totalSeats !== undefined) {
      const activeEnrollments = await Enrollment.countDocuments({
        batch: id,
        status: "Active"
      });

      if (Number(totalSeats) < activeEnrollments) {
        return res.status(400).json({
          success: false,
          message: `Cannot reduce total seats to ${totalSeats}. There are currently ${activeEnrollments} active enrolled students in this batch.`
        });
      }
    }

    const updatedData = {
      ...(batchName !== undefined && { batchName }),
      ...(startDate !== undefined && { startDate }),
      ...(timing !== undefined && { timing }),
      ...(mode !== undefined && { mode }),
      ...(totalSeats !== undefined && { totalSeats: Number(totalSeats) })
    };

    const batch = await Batch.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true
    }).populate("course", "title courseCode");

    res.status(200).json({
      success: true,
      message: "Batch updated successfully.",
      data: batch
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteBatch = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid batch ID format."
      });
    }

    const batch = await Batch.findById(id);
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found."
      });
    }

    // Prevent accidental deletion if enrollments exist for this batch
    const enrollmentCount = await Enrollment.countDocuments({ batch: id });
    if (enrollmentCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete batch: There are ${enrollmentCount} enrollment record(s) associated with this batch.`
      });
    }

    await Batch.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Batch deleted successfully."
    });
  } catch (error) {
    next(error);
  }
};

exports.getBatchStudents = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid batch ID format."
      });
    }

    const batch = await Batch.findById(id).populate("course", "title courseCode");
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found."
      });
    }

    const enrollments = await Enrollment.find({ batch: id })
      .populate("student", "name email role createdAt")
      .sort({ createdAt: -1 });

    const studentsList = enrollments.map((enr) => ({
      enrollmentId: enr._id,
      status: enr.status,
      enrolledAt: enr.createdAt,
      updatedAt: enr.updatedAt,
      student: enr.student
    }));

    res.status(200).json({
      success: true,
      batch: {
        _id: batch._id,
        batchName: batch.batchName,
        course: batch.course,
        totalSeats: batch.totalSeats,
        timing: batch.timing,
        mode: batch.mode
      },
      count: studentsList.length,
      data: studentsList
    });
  } catch (error) {
    next(error);
  }
};
