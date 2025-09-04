const express = require("express");
const { check } = require("express-validator");

const router = express.Router();
const {
  getAllReports,
  getNearbyReports,
} = require("../controllers/reportController");

//Reports Route
router.route("/").get(getAllReports);

module.exports = router;
