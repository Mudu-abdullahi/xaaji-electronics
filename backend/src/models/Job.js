
const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    customer: {
      type: String,
      required: true,
      trim: true,
    },

    electrician: {
      type: String,
      required: true,
      trim: true,
    },

    service: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Scheduled",
        "In Progress",
        "Completed",
        "Cancelled",
      ],
      default: "Pending",
    },

    date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Job", jobSchema);
