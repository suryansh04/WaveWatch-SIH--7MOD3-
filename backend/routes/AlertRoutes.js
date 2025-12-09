const express = require("express");
const router = express.Router();
const {
  getAllAlerts,
  getAlert,
  createAlert,
  updateAlert,
  deleteAlert,
  toggleAlertStatus,
} = require("../controllers/AlertController");
const auth = require("../middlewares/auth");

router.get("/", auth(["admin"]), getAllAlerts);

router.get("/:id", auth(["admin"]), getAlert);

router.post("/", auth(["admin"]), createAlert);

router.put("/:id", auth(["admin"]), updateAlert);

router.delete("/:id", auth(["admin"]), deleteAlert);

router.patch("/:id/toggle", auth(["admin"]), toggleAlertStatus);

module.exports = router;
