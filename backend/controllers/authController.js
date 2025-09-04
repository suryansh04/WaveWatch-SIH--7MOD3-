const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AdminPanelUser = require("../models/AdminPanelUser");
const { validationResult } = require("express-validator");

exports.signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { name, email, password } = req.body;

    // check if user exists
    const existingUser = await AdminPanelUser.findOne({ email });
    if (existingUser)
      return res.status(400).json({ msg: "User already exists" });

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // save user
    const newUser = new AdminPanelUser({
      name,
      email,
      password: hashedPassword,
      role: "analyst",
      status: "pending",
    });
    await newUser.save();

    res.status(201).json({ msg: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;
    const user = await AdminPanelUser.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    if (user.role === "analyst" && user.status !== "approved") {
      return res
        .status(403)
        .json({ msg: "Your account is pending admin approval." });
    }

    // create token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Approve analyst
exports.approveAnalyst = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await AdminPanelUser.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (user.role !== "analyst")
      return res.status(400).json({ msg: "Only analysts can be approved" });

    user.status = "approved";
    await user.save();

    res.json({ msg: "Analyst approved successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Reject analyst
exports.rejectAnalyst = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await AdminPanelUser.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (user.role !== "analyst")
      return res.status(400).json({ msg: "Only analysts can be rejected" });

    user.status = "rejected";
    await user.save();

    res.json({ msg: "Analyst rejected successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get all users (for admin)
exports.getAllUsers = async (req, res) => {
  // try {
  //   // Check if user is admin
  //   const currentUser = await AdminPanelUser.findById(req.user.id);
  //   if (currentUser.role !== "admin") {
  //     return res.status(403).json({ msg: "Access denied. Admin only." });
  //   }

  //   const { status } = req.query;

  //   let filter = {};
  //   if (status && status !== "all") {
  //     filter.status = status;
  //   }

  //   const users = await AdminPanelUser.find(filter)
  //     .select("-password") // Don't send password
  //     .sort({ createdAt: -1 }); // Most recent first

  //   res.json({ users });
  // } catch (err) {
  //   res.status(500).json({ msg: err.message });
  // }

  try {
    const { status } = req.query;

    // Build filter object
    let filter = {};
    if (status && status !== "all") {
      filter.status = status;
    }

    console.log("Filter being used:", filter); // Debug log

    const users = await AdminPanelUser.find(filter);
    console.log("Users found:", users.length); // Debug log

    res.json({
      success: true,
      users: users,
      count: users.length,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};
