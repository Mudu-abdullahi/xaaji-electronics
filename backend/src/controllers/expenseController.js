
const Expense = require("../models/Expense");

// Generate the next expense ID
async function generateExpenseId() {
  const lastExpense = await Expense.findOne()
    .sort({ createdAt: -1 });

  if (!lastExpense) {
    return "EXP-001";
  }

  const lastNumber = parseInt(
    lastExpense.expenseId.split("-")[1],
    10
  );

  return `EXP-${String(lastNumber + 1).padStart(3, "0")}`;
}

// GET /api/expenses
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: expenses.length,
      expenses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch expenses",
      error: error.message,
    });
  }
};

// GET /api/expenses/:id
exports.getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    res.status(200).json({
      success: true,
      expense,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid expense ID",
    });
  }
};

// POST /api/expenses
exports.createExpense = async (req, res) => {
  try {
    const {
      description,
      category,
      amount,
      date,
      status,
      notes,
    } = req.body;

    if (
      !description ||
      !category ||
      amount === undefined ||
      amount === null ||
      amount === "" ||
      !date
    ) {
      return res.status(400).json({
        success: false,
        message: "Description, category, amount, and date are required",
      });
    }

    const expenseId = await generateExpenseId();

    const expense = await Expense.create({
      expenseId,
      description,
      category,
      amount,
      date,
      status,
      notes,
    });

    res.status(201).json({
      success: true,
      message: "Expense recorded successfully",
      expense,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create expense",
      error: error.message,
    });
  }
};

// PATCH /api/expenses/:id
exports.updateExpense = async (req, res) => {
  try {
    const allowedFields = [
      "description",
      "category",
      "amount",
      "date",
      "status",
      "notes",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      expense,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update expense",
      error: error.message,
    });
  }
};

// DELETE /api/expenses/:id
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to delete expense",
      error: error.message,
    });
  }
};
