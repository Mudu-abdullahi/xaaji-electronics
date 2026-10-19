const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
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

    description: {
      type: String,
      required: true,
      trim: true,
    },

    preferredDate: {
      type: Date,
    },

    priority: {
      type: String,
      enum: ["Normal", "Urgent", "Emergency"],
      default: "Normal",
    },

    status: {
      type: String,
      enum: [
        "New",
        "Inspection",
        "Quotation",
        "Approved",
        "Scheduled",
        "In Progress",
        "Completed",
        "Paid",
        "Cancelled",
      ],
      default: "New",
    },

    assignedElectrician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Electrician",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Request", requestSchema);