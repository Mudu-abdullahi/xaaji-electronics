const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Service name is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Service description is required"],
      trim: true,
    },

    category: {
      type: String,
      required: [true, "Service category is required"],
      trim: true,
    },

    price: {
      type: Number,
      default: 0,
      min: [0, "Price cannot be negative"],
    },

    pricingType: {
      type: String,
      enum: ["fixed", "from", "quote"],
      default: "quote",
    },

    image: {
      type: String,
      default: "",
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Service", serviceSchema);