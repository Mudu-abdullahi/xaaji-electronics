
const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    paymentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    customer: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
    },

    job: {
      type: String,
      required: [true, "Job ID is required"],
      trim: true,
    },

    amount: {
      type: Number,
      required: [true, "Payment amount is required"],
      min: [0.01, "Amount must be greater than zero"],
    },

    method: {
      type: String,
      enum: ["M-Pesa", "Cash", "Bank Transfer", "Card"],
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Payment", paymentSchema);
