const mongoose = require("mongoose");

const smsReportSchema = new mongoose.Schema(
  {
    reporterPhone: { type: String, required: true },

    type: { type: String, default: "Unknown" },
    urgency: { type: String, default: "High" },
    description: { type: String, default: "" },

    locationName: { type: String, default: "Unknown" },

    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] },
    },

    isProcessedToMainReport: {
      type: Boolean,
      default: false,
    },

    receivedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

smsReportSchema.index({ location: "2dsphere" });
const SMSReport = mongoose.model("SMSReport", smsReportSchema);
module.exports = SMSReport;
