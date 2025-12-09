// const mongoose = require("mongoose");

// const reportSchema = new mongoose.Schema({
//   type: {
//     type: String,
//     required: true,
//   },

//   urgency: {
//     type: String,
//     enum: ["High", "Medium", "Low"],
//     required: true,
//   },
//   location: {
//     type: { type: String, enum: ["Point"], required: true, default: "Point" },
//     coordinates: { type: [Number], required: true }, // [lng, lat]
//   },
//   mediaUrl: [String],

//   description: {
//     type: String,
//   },
//   isVerified: {
//     type: Boolean,
//     default: false,
//   },
//   reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "AdminPanelUser" },
//   reportedAt: {
//     type: Date,
//     default: Date.now,
//   },
// });
// reportSchema.index({ location: "2dsphere" });
// const Report = mongoose.model("Report", reportSchema);
// module.exports = Report;

//------------------------------------------------- NEW CODE ------------------------------------------------------------------------------
const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },

  urgency: {
    type: String,
    enum: ["High", "Medium", "Low"],
    required: true,
  },
  location: {
    type: { type: String, enum: ["Point"], required: true, default: "Point" },
    coordinates: { type: [Number], required: true }, // [lng, lat]
  },
  mediaUrl: [String],

  description: {
    type: String,
  },
  rejectionReason: {
    type: String,
  },
  rejectedAt: {
    type: Date,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "AdminPanelUser" },
  reportedAt: {
    type: Date,
    default: Date.now,
  },
});
reportSchema.index({ location: "2dsphere" });
const Report = mongoose.model("Report", reportSchema);
module.exports = Report;
