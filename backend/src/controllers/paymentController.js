
const Payment = require("../models/Payment");

const generatePaymentId = async () => {
  const latestPayment = await Payment.findOne({
    paymentId: { $regex: /^PAY-\d+$/ },
  }).sort({ createdAt: -1 });

  const currentNumber = latestPayment
    ? Number(latestPayment.paymentId.replace("PAY-", ""))
    : 0;

  return `PAY-${String(currentNumber + 1).padStart(3, "0")}`;
};

// GET /api/payments
const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch payments",
      error: error.message,
    });
  }
};

// GET /api/payments/:id
const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid payment ID",
    });
  }
};

// POST /api/payments
const createPayment = async (req, res) => {
  try {
    const { customer, job, amount, method, date, status } = req.body;

    if (
      typeof customer !== "string" ||
      !customer.trim() ||
      typeof job !== "string" ||
      !job.trim() ||
      amount === "" ||
      amount === null ||
      amount === undefined ||
      !Number.isFinite(Number(amount)) ||
      Number(amount) <= 0 ||
      !date ||
      !["M-Pesa", "Cash", "Bank Transfer", "Card"].includes(method) ||
      !["Pending", "Paid"].includes(status ?? "Pending")
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid payment details",
      });
    }

    const paymentId = await generatePaymentId();

    const payment = await Payment.create({
      paymentId,
      customer: customer.trim(),
      job: job.trim(),
      amount: Number(amount),
      method,
      date,
      status: status ?? "Pending",
    });

    res.status(201).json({
      success: true,
      message: "Payment recorded successfully",
      payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to record payment",
      error: error.message,
    });
  }
};

// PATCH /api/payments/:id/status
const updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Pending", "Paid"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be Paid or Pending",
      });
    }

    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment status updated successfully",
      payment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update payment status",
      error: error.message,
    });
  }
};

// DELETE /api/payments/:id
const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to delete payment",
      error: error.message,
    });
  }
};

module.exports = {
  getPayments,
  getPaymentById,
  createPayment,
  updatePaymentStatus,
  deletePayment,
};
