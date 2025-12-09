const Alert = require("../models/AlertSchema");

//Get All Alerts
exports.getAllAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: alerts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching alerts",
      error: error.message,
    });
  }
};

//Get Alert By ID
exports.getAlert = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found",
      });
    }

    res.json({
      success: true,
      data: alert,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching alert",
      error: error.message,
    });
  }
};

//Create Alert
// exports.createAlert = async (req, res) => {
//   try {
//     const { type, title, location, description } = req.body;

//     const alert = new Alert({
//       type,
//       title,
//       location,
//       description,
//     });

//     const savedAlert = await alert.save();

//     res.status(201).json({
//       success: true,
//       message: "Alert created successfully",
//       data: savedAlert,
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: "Error creating alert",
//       error: error.message,
//     });
//   }
// };
//Create Alert
exports.createAlert = async (req, res) => {
  try {
    const { type, title, location, description } = req.body;

    const alert = new Alert({
      type,
      title,
      location,
      description,
    });

    const savedAlert = await alert.save();

    // 🔥 NEW — forward alert to APP BACKEND for push broadcast
    await fetch("https://wavewatch-backend.onrender.com/api/alerts/broadcast", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        title,
        location,
        description,
      }),
    });

    res.status(201).json({
      success: true,
      message: "Alert created & broadcasted successfully",
      data: savedAlert,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error creating alert",
      error: error.message,
    });
  }
};

//Update Alert
exports.updateAlert = async (req, res) => {
  try {
    const { type, title, location, description, isActive } = req.body;

    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { type, title, location, description, isActive },
      { new: true, runValidators: true }
    );

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found",
      });
    }

    res.json({
      success: true,
      message: "Alert updated successfully",
      data: alert,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating alert",
      error: error.message,
    });
  }
};

//Delete Alert
exports.deleteAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndDelete(req.params.id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found",
      });
    }

    res.json({
      success: true,
      message: "Alert deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting alert",
      error: error.message,
    });
  }
};
// Toggle alert status
exports.toggleAlertStatus = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found",
      });
    }

    alert.isActive = !alert.isActive;
    await alert.save();

    res.json({
      success: true,
      message: "Alert status updated successfully",
      data: alert,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating alert status",
      error: error.message,
    });
  }
};
