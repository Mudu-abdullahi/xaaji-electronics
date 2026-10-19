const express = require("express");

const {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
} = require("../controllers/serviceController");

const router = express.Router();

// Create a service
router.post("/", createService);

// Get all services
router.get("/", getServices);

// Get one service
router.get("/:id", getServiceById);

// Update a service
router.put("/:id", updateService);

// Delete a service
router.delete("/:id", deleteService);

module.exports = router;