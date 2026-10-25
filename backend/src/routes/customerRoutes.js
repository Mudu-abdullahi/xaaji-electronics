const express = require("express");
const requireAdmin = require("../middleware/authMiddleware");

const {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customerController");

const router = express.Router();

// Create customer / contact message
router.post("/", createCustomer);

// Get all customers
router.get("/", requireAdmin, getCustomers);

// Get one customer
router.get("/:id", requireAdmin, getCustomerById);

// Update customer
router.put("/:id", requireAdmin, updateCustomer);

// Delete customer
router.delete("/:id", requireAdmin, deleteCustomer);

module.exports = router;