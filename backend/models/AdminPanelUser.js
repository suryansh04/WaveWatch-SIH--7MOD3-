const mongoose = require("mongoose");

const AdminPanelUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email!"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password!"],
    minlength: 8,
  },
  role: {
    type: String,
    enum: ["admin", "analyst"],
    default: "analyst",
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
});

const AdminPanelUser = mongoose.model("AdminPanelUser", AdminPanelUserSchema);

module.exports = AdminPanelUser;
