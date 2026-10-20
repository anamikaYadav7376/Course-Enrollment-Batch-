const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student reference is required"]
    },
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      required: [true, "Batch reference is required"]
    },
    status: {
      type: String,
      required: [true, "Enrollment status is required"],
      enum: {
        values: ["Active", "Completed", "Dropped"],
        message: "Status must be 'Active', 'Completed', or 'Dropped'"
      },
      default: "Active"
    }
  },
  {
    timestamps: true
  }
);

enrollmentSchema.index({ student: 1, batch: 1 });
enrollmentSchema.index({ batch: 1, status: 1 });

module.exports = mongoose.model("Enrollment", enrollmentSchema);
