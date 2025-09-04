const express = require("express");
const {
  signup,
  login,
  approveAnalyst,
  rejectAnalyst,
  getAllUsers,
} = require("../controllers/authController");
const { check } = require("express-validator");
const auth = require("../middlewares/auth");
const router = express.Router();
router.get("/users", auth(["admin"]), getAllUsers);
router.post(
  "/signup",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Password must be 6+ characters").isLength({ min: 6 }),
  ],
  signup
);
router.post(
  "/login",
  [
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  login
);

router.patch("/approve-user/:userId", auth(["admin"]), approveAnalyst);
router.patch("/reject-user/:userId", auth(["admin"]), rejectAnalyst);
module.exports = router;
