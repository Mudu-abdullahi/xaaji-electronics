const express = require("express");
const requireAdmin = require("../middleware/authMiddleware");

const {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
} = require("../controllers/serviceController");

const router = express.Router();

// Create a service
router.post("/", requireAdmin, createService);

// Get all services
router.get("/", getServices);

// Get one service
router.get("/:id", getServiceById);

// Update a service
router.put("/:id", requireAdmin, updateService);

// Delete a service
router.delete("/:id", requireAdmin, deleteService);

module.exports = router;