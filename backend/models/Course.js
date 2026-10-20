const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
      minlength: [3, "Course title must be at least 3 characters long"],
      maxlength: [100, "Course title cannot exceed 100 characters"]
    },
    courseCode: {
      type: String,
      required: [true, "Course code is required"],
      unique: true,
      uppercase: true,
      trim: true,
      minlength: [2, "Course code must be at least 2 characters long"],
      maxlength: [15, "Course code cannot exceed 15 characters"]
    },
    durationWeeks: {
      type: Number,
      required: [true, "Duration in weeks is required"],
      min: [1, "Duration must be at least 1 week"],
      max: [104, "Duration cannot exceed 104 weeks"]
    },
    fee: {
      type: Number,
      required: [true, "Course fee is required"],
      min: [0, "Fee cannot be negative"]
    },
    description: {
      type: String,
      required: [true, "Course description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters long"],
      maxlength: [2000, "Description cannot exceed 2000 characters"]
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Course", courseSchema);
