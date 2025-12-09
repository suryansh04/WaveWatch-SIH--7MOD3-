const CallReport = require("../models/CallReportSchema");

// Manual report (already there)
exports.createCallReport = async (req, res) => {
  try {
    const { name, hazardType, location, description } = req.body;

    const newReport = await CallReport.create({
      reporterName: name,
      hazardType,
      location,
      description,
      source: "phone-call",
    });

    res.status(201).json({ success: true, data: newReport });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

exports.getAllCallReports = async (req, res) => {
  try {
    const { hazardType } = req.query;
    const filter = {};

    if (hazardType) {
      // use case-insensitive regex match
      filter.hazardType = { $regex: new RegExp(hazardType, "i") };
    }

    const reports = await CallReport.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: reports });
  } catch (err) {
    console.error("Error fetching reports:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

exports.getCallReportById = async (req, res) => {
  try {
    const report = await CallReport.findById(req.params.id);
    if (!report)
      return res.status(404).json({ success: false, error: "Not found" });
    res.status(200).json({ success: true, data: report });
  } catch (err) {
    console.error("Error fetching report by id:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// exports.vapiWebhook = async (req, res) => {
//   try {
//     const event = req.body;
//     // console.log(event);
//     console.log(event.message.analysis);
//     const reporterName =
//       event.message.analysis.structuredData?.name || "Unknown";
//     const hazardType =
//       event.message.analysis.structuredData?.hazardType || "General";
//     const location =
//       event.message.analysis.structuredData?.location || "Unknown";
//     const description =
//       event.message.analysis.structuredData?.description ||
//       "No description provided";
//     const newReport = await CallReport.create({
//       reporterName: reporterName || "Unknown",
//       hazardType,
//       location,
//       description,
//       source: "phone-call",
//     });

//     // console.log("✅ Call Report saved:", newReport._id);
//     return res.status(201).json({ success: true });
//   } catch (err) {
//     console.error("❌ Webhook Error:", err);
//     return res.status(500).json({ success: false, error: err.message });
//   }
// };

exports.vapiWebhook = async (req, res) => {
  try {
    const { type, message, call, timestamp } = req.body;
    console.log(type);
    console.log(message);
    console.log(`Webhook received: ${type} at ${timestamp}`);

    // const event = req.body;
    // console.log(res.message);
    // console.log(event.message.transcript.text);
    // const reporterName = event.artifact.structuredOutputs?.name || "Unknown";
    // const hazardType =
    //   event.message.analysis.structuredData?.hazardType || "General";
    // const location =
    //   event.message.analysis.structuredData?.location || "Unknown";
    // const description =
    //   event.message.analysis.structuredData?.description ||
    //   "No description provided";
    // const newReport = await CallReport.create({
    //   reporterName: reporterName || "Unknown",
    //   hazardType,
    //   location,
    //   description,
    //   source: "phone-call",
    // });

    // console.log("✅ Call Report saved:", newReport._id);
    return res.status(201).json({ success: true });
  } catch (err) {
    console.error("❌ Webhook Error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
