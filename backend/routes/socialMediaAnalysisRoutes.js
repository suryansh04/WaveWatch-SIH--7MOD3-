const express = require("express");
const router = express.Router();
const {
  getSocialMediaPosts,
  getSocialMediaStats,
  reverseGeocode,
} = require("../controllers/socialMediaAnalysisController");
// SOS trigger: frontend calls this endpoint
router.get("/posts", getSocialMediaPosts);
router.get("/stats", getSocialMediaStats);
router.get("/reverse-geocode", reverseGeocode);
module.exports = router;
