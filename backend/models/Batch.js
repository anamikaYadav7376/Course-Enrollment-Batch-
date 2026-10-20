const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course reference is required"]
    },
    batchName: {
      type: String,
      required: [true, "Batch name is required"],
      trim: true,
      minlength: [2, "Batch name must be at least 2 characters long"],
      maxlength: [60, "Batch name cannot exceed 60 characters"]
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"]
    },
    timing: {
      type: String,
      required: [true, "Batch timing is required"],
      trim: true,
      maxlength: [100, "Timing cannot exceed 100 characters"]
    },
    mode: {
      type: String,
      required: [true, "Mode is required"],
      enum: {
        values: ["Online", "Offline"],
        message: "Mode must be either 'Online' or 'Offline'"
      }
    },
    totalSeats: {
      type: Number,
      required: [true, "Total seats are required"],
      min: [1, "Total seats must be at least 1"],
      max: [500, "Total seats cannot exceed 500"]
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Batch", batchSchema);
