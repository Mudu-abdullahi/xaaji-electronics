const express = require("express");

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

router.post("/", createElectrician);

router.put("/:id", updateElectrician);

router.delete("/:id", deleteElectrician);

module.exports = router;