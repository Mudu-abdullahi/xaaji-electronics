
const Settings = require("../models/Settings");

async function getOrCreateSettings() {
  let settings = await Settings.findOne();

  if (!settings) {
    settings = await Settings.create({});
  }

  return settings;
}

// GET /api/settings
exports.getSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();

    res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch settings",
      error: error.message,
    });
  }
};

// PATCH /api/settings
exports.updateSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    const { businessName, businessEmail, phoneNumber, businessAddress,
      acceptingRequests, notifications } = req.body;

    if (businessName !== undefined) settings.businessName = businessName;
    if (businessEmail !== undefined) settings.businessEmail = businessEmail;
    if (phoneNumber !== undefined) settings.phoneNumber = phoneNumber;
    if (businessAddress !== undefined) settings.businessAddress = businessAddress;

    if (acceptingRequests !== undefined) {
      settings.acceptingRequests = acceptingRequests;
    }

    if (notifications !== undefined) {
      if (typeof notifications !== "object" || notifications === null ||
          Array.isArray(notifications)) {
        return res.status(400).json({
          success: false,
          message: "Notifications must be an object",
        });
      }

      for (const key of ["newRequests", "payments", "lowStock"]) {
        if (notifications[key] !== undefined) {
          settings.notifications[key] = notifications[key];
        }
      }
    }

    await settings.save();

    res.status(200).json({
      success: true,
      message: "Settings saved successfully",
      settings,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to save settings",
      error: error.message,
    });
  }
};
