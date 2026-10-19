const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    product: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    unitPrice: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    reorderLevel: {
      type: Number,
      min: 0,
      default: 5,
    },

    supplier: {
      type: String,
      default: "",
      trim: true,
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["In Stock", "Low Stock", "Out of Stock"],
      default: "In Stock",
    },
  },
  {
    timestamps: true,
  }
);

const Inventory = mongoose.model("Inventory", inventorySchema);

module.exports = Inventory;