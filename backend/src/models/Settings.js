
const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: true,
      trim: true,
      default: "Xaaji Electronics",
    },

    businessEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },

    phoneNumber: {
      type: String,
      trim: true,
      default: "",
    },

    businessAddress: {
      type: String,
      trim: true,
      default: "",
    },

    acceptingRequests: {
      type: Boolean,
      default: true,
    },

    notifications: {
      newRequests: {
        type: Boolean,
        default: true,
      },
      payments: {
        type: Boolean,
        default: true,
      },
      lowStock: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Settings", settingsSchema);
