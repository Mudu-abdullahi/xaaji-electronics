const express = require("express");
const requireAdmin = require("../middleware/authMiddleware");

const {
  getElectricians,
  getElectricianById,
  createElectrician,
  updateElectrician,
  deleteElectrician,
} = require("../controllers/electricianController");

const router = express.Router();

router.get("/", getElectricians);

router.get("/:id", getElectricianById);

router.post("/", requireAdmin, createElectrician);

router.put("/:id", requireAdmin, updateElectrician);

router.delete("/:id", requireAdmin, deleteElectrician);

module.exports = router;