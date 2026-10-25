const express = require("express");
const requireAdmin = require("../middleware/authMiddleware");

const {
  getInventory,
  getInventoryById,
  createInventory,
  updateInventory,
  deleteInventory,
} = require("../controllers/inventoryController");

const router = express.Router();

router.use(requireAdmin);

// Get all inventory items
router.get("/", getInventory);

// Get one inventory item
router.get("/:id", getInventoryById);

// Create inventory item
router.post("/", createInventory);

// Update inventory item
router.put("/:id", updateInventory);

// Delete inventory item
router.delete("/:id", deleteInventory);

module.exports = router;