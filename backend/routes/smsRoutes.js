// routes/smsReportRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAllSMSReports,
  getSMSReportById,
  createSMSReport,
  updateSMSReport,
  markAsProcessed,
  deleteSMSReport,
  getSMSReportsStats,
} = require("../controllers/smsController");

// Stats route (must be before /:id route)
router.get("/stats", getSMSReportsStats);

// Main routes
router.route("/").get(getAllSMSReports).post(createSMSReport);

router
  .route("/:id")
  .get(getSMSReportById)
  .put(updateSMSReport)
  .delete(deleteSMSReport);

// Special action routes
router.patch("/:id/process", markAsProcessed);

module.exports = router;
