
const express = require("express");
const requireAdmin = require("../middleware/authMiddleware");

const {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
} = require("../controllers/expenseController");

const router = express.Router();

router.use(requireAdmin);

// Get all expenses
router.get("/", getExpenses);

// Get one expense
router.get("/:id", getExpenseById);

// Create an expense
router.post("/", createExpense);

// Update an expense
router.patch("/:id", updateExpense);

// Delete an expense
router.delete("/:id", deleteExpense);

module.exports = router;
