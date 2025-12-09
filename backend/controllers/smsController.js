const SMSReport = require("../models/smsReportModel");

// @desc    Get all SMS reports with optional filtering
// @route   GET /api/sms-reports
// @access  Public (or add authentication middleware)
exports.getAllSMSReports = async (req, res) => {
  try {
    const { type, urgency, isProcessed, startDate, endDate } = req.query;

    // Build filter object
    const filter = {};

    if (type && type !== "all") {
      filter.type = new RegExp(type, "i"); // Case-insensitive search
    }

    if (urgency) {
      filter.urgency = urgency;
    }

    if (isProcessed !== undefined) {
      filter.isProcessedToMainReport = isProcessed === "true";
    }

    // Date range filter
    if (startDate || endDate) {
      filter.receivedAt = {};
      if (startDate) filter.receivedAt.$gte = new Date(startDate);
      if (endDate) filter.receivedAt.$lte = new Date(endDate);
    }

    const reports = await SMSReport.find(filter)
      .sort({ receivedAt: -1 }) // Most recent first
      .lean();

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    console.error("Error fetching SMS reports:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch SMS reports",
      error: error.message,
    });
  }
};

// @desc    Get single SMS report by ID
// @route   GET /api/sms-reports/:id
// @access  Public
exports.getSMSReportById = async (req, res) => {
  try {
    const report = await SMSReport.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "SMS report not found",
      });
    }

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error("Error fetching SMS report:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch SMS report",
      error: error.message,
    });
  }
};

// @desc    Create new SMS report
// @route   POST /api/sms-reports
// @access  Public
exports.createSMSReport = async (req, res) => {
  try {
    const {
      reporterPhone,
      type,
      urgency,
      description,
      locationName,
      coordinates,
    } = req.body;

    // Validate required fields
    if (!reporterPhone) {
      return res.status(400).json({
        success: false,
        message: "Reporter phone number is required",
      });
    }

    // Create report object
    const reportData = {
      reporterPhone,
      type: type || "Unknown",
      urgency: urgency || "High",
      description: description || "",
      locationName: locationName || "Unknown",
    };

    // Add location coordinates if provided
    if (coordinates && Array.isArray(coordinates) && coordinates.length === 2) {
      reportData.location = {
        type: "Point",
        coordinates: coordinates, // [longitude, latitude]
      };
    }

    const report = await SMSReport.create(reportData);

    res.status(201).json({
      success: true,
      message: "SMS report created successfully",
      data: report,
    });
  } catch (error) {
    console.error("Error creating SMS report:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create SMS report",
      error: error.message,
    });
  }
};

// @desc    Update SMS report
// @route   PUT /api/sms-reports/:id
// @access  Public
exports.updateSMSReport = async (req, res) => {
  try {
    const report = await SMSReport.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "SMS report not found",
      });
    }

    const updatedReport = await SMSReport.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "SMS report updated successfully",
      data: updatedReport,
    });
  } catch (error) {
    console.error("Error updating SMS report:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update SMS report",
      error: error.message,
    });
  }
};

// @desc    Mark SMS report as processed
// @route   PATCH /api/sms-reports/:id/process
// @access  Public
exports.markAsProcessed = async (req, res) => {
  try {
    const report = await SMSReport.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "SMS report not found",
      });
    }

    report.isProcessedToMainReport = true;
    await report.save();

    res.status(200).json({
      success: true,
      message: "SMS report marked as processed",
      data: report,
    });
  } catch (error) {
    console.error("Error marking report as processed:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark report as processed",
      error: error.message,
    });
  }
};

// @desc    Delete SMS report
// @route   DELETE /api/sms-reports/:id
// @access  Public
exports.deleteSMSReport = async (req, res) => {
  try {
    const report = await SMSReport.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "SMS report not found",
      });
    }

    await report.deleteOne();

    res.status(200).json({
      success: true,
      message: "SMS report deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting SMS report:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete SMS report",
      error: error.message,
    });
  }
};

// @desc    Get SMS reports statistics
// @route   GET /api/sms-reports/stats
// @access  Public
exports.getSMSReportsStats = async (req, res) => {
  try {
    const stats = await SMSReport.aggregate([
      {
        $facet: {
          totalCount: [{ $count: "count" }],
          byType: [
            {
              $group: {
                _id: "$type",
                count: { $sum: 1 },
              },
            },
          ],
          byUrgency: [
            {
              $group: {
                _id: "$urgency",
                count: { $sum: 1 },
              },
            },
          ],
          processed: [
            {
              $match: { isProcessedToMainReport: true },
            },
            { $count: "count" },
          ],
          unprocessed: [
            {
              $match: { isProcessedToMainReport: false },
            },
            { $count: "count" },
          ],
        },
      },
    ]);

    const result = {
      total: stats[0].totalCount[0]?.count || 0,
      byType: stats[0].byType,
      byUrgency: stats[0].byUrgency,
      processed: stats[0].processed[0]?.count || 0,
      unprocessed: stats[0].unprocessed[0]?.count || 0,
    };

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching SMS reports stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch statistics",
      error: error.message,
    });
  }
};
