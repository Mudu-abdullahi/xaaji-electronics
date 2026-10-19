const Inventory = require("../models/Inventory");

// Calculate inventory status
const calculateStatus = (quantity, reorderLevel) => {
  if (Number(quantity) === 0) {
    return "Out of Stock";
  }

  if (Number(quantity) <= Number(reorderLevel)) {
    return "Low Stock";
  }

  return "In Stock";
};

// ===============================
// GET ALL INVENTORY
// ===============================
const getInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: inventory.length,
      inventory,
    });
  } catch (error) {
    console.error("Get inventory error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch inventory",
      error: error.message,
    });
  }
};

// ===============================
// GET INVENTORY BY ID
// ===============================
const getInventoryById = async (req, res) => {
  try {
    const inventory = await Inventory.findById(req.params.id);

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }

    res.status(200).json({
      success: true,
      inventory,
    });
  } catch (error) {
    console.error("Get inventory item error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch inventory item",
      error: error.message,
    });
  }
};

// ===============================
// CREATE INVENTORY ITEM
// ===============================
const createInventory = async (req, res) => {
  try {
    const {
      product,
      category,
      quantity,
      unitPrice,
      reorderLevel = 5,
      supplier = "",
      location = "",
    } = req.body;

    if (
      !product ||
      !category ||
      quantity === undefined ||
      unitPrice === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Product, category, quantity, and unit price are required",
      });
    }

    if (Number(quantity) < 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity cannot be negative",
      });
    }

    if (Number(unitPrice) < 0) {
      return res.status(400).json({
        success: false,
        message: "Unit price cannot be negative",
      });
    }

    if (Number(reorderLevel) < 0) {
      return res.status(400).json({
        success: false,
        message: "Reorder level cannot be negative",
      });
    }

    const status = calculateStatus(quantity, reorderLevel);

    const inventory = await Inventory.create({
      product,
      category,
      quantity,
      unitPrice,
      reorderLevel,
      supplier,
      location,
      status,
    });

    res.status(201).json({
      success: true,
      message: "Inventory item created successfully",
      inventory,
    });
  } catch (error) {
    console.error("Create inventory error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create inventory item",
      error: error.message,
    });
  }
};

// ===============================
// UPDATE INVENTORY ITEM
// ===============================
const updateInventory = async (req, res) => {
  try {
    const inventory = await Inventory.findById(req.params.id);

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }

    const {
      product,
      category,
      quantity,
      unitPrice,
      reorderLevel,
      supplier,
      location,
    } = req.body;

    if (quantity !== undefined && Number(quantity) < 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity cannot be negative",
      });
    }

    if (unitPrice !== undefined && Number(unitPrice) < 0) {
      return res.status(400).json({
        success: false,
        message: "Unit price cannot be negative",
      });
    }

    if (reorderLevel !== undefined && Number(reorderLevel) < 0) {
      return res.status(400).json({
        success: false,
        message: "Reorder level cannot be negative",
      });
    }

    if (product !== undefined) inventory.product = product;
    if (category !== undefined) inventory.category = category;
    if (quantity !== undefined) inventory.quantity = quantity;
    if (unitPrice !== undefined) inventory.unitPrice = unitPrice;
    if (reorderLevel !== undefined) inventory.reorderLevel = reorderLevel;
    if (supplier !== undefined) inventory.supplier = supplier;
    if (location !== undefined) inventory.location = location;

    inventory.status = calculateStatus(
      inventory.quantity,
      inventory.reorderLevel
    );

    await inventory.save();

    res.status(200).json({
      success: true,
      message: "Inventory item updated successfully",
      inventory,
    });
  } catch (error) {
    console.error("Update inventory error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update inventory item",
      error: error.message,
    });
  }
};

// ===============================
// DELETE INVENTORY ITEM
// ===============================
const deleteInventory = async (req, res) => {
  try {
    const inventory = await Inventory.findByIdAndDelete(req.params.id);

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Inventory item deleted successfully",
      inventory,
    });
  } catch (error) {
    console.error("Delete inventory error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete inventory item",
      error: error.message,
    });
  }
};

module.exports = {
  getInventory,
  getInventoryById,
  createInventory,
  updateInventory,
  deleteInventory,
};