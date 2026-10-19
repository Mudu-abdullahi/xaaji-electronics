
const express = require("express");

const {
  getPayments,
  getPaymentById,
  createPayment,
  updatePaymentStatus,
  deletePayment,
} = require("../controllers/paymentController");

const router = express.Router();

router.get("/", getPayments);
router.get("/:id", getPaymentById);
router.post("/", createPayment);
router.patch("/:id/status", updatePaymentStatus);
router.delete("/:id", deletePayment);

module.exports = router;
