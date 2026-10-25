
const express = require("express");
const requireAdmin = require("../middleware/authMiddleware");

const {
  getSettings,
  updateSettings,
} = require("../controllers/settingsController");

const router = express.Router();

router.get("/", getSettings);
router.patch("/", requireAdmin, updateSettings);

module.exports = router;
