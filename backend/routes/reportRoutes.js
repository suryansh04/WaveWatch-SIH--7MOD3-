const express = require("express");
const { check } = require("express-validator");

const router = express.Router();
const {
  getAllReports,
  getNearbyReports,
  updateVerificationStatus,
  getReportsByLocation,
  rejectReport,
  getReportWithNearbySocialMedia,
} = require("../controllers/reportController");

//Reports Route
router.route("/").get(getAllReports);
router.route("/verify/:id").patch(updateVerificationStatus);
router.route("/reject/:id").patch(rejectReport);
router.route("/nearby").get(getNearbyReports);
router.route("/location").get(getReportsByLocation);
router.route("/:id/nearby-social").get(getReportWithNearbySocialMedia);

module.exports = router;
