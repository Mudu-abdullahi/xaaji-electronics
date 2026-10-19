
const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    expenseId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Expense description is required"],
      trim: true,
    },

    category: {
      type: String,
      required: [true, "Expense category is required"],
      enum: [
        "Materials",
        "Transport",
        "Tools",
        "Rent",
        "Communication",
        "Utilities",
        "Salaries",
        "Other",
      ],
    },

    amount: {
      type: Number,
      required: [true, "Expense amount is required"],
      min: [0.01, "Amount must be greater than zero"],
    },

    date: {
      type: String,
      required: [true, "Expense date is required"],
    },

    status: {
      type: String,
      enum: ["Paid", "Pending"],
      default: "Pending",
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Expense", expenseSchema);
