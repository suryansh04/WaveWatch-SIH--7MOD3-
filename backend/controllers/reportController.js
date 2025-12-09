const Report = require("../models/ReportSchema");
const SocialMedia = require("../models/socialMediaSchema");
const { validationResult } = require("express-validator");
const axios = require("axios");

// Helper function for reverse geocoding
const reverseGeocode = async (lat, lon) => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse`,
      {
        params: {
          lat: lat,
          lon: lon,
          format: "json",
          addressdetails: 1,
        },
        headers: {
          "User-Agent": "WaveWatch-App/1.0",
        },
      }
    );

    if (response.data && response.data.address) {
      return {
        state: response.data.address.state || null,
        district:
          response.data.address.state_district ||
          response.data.address.county ||
          null,
        city:
          response.data.address.city ||
          response.data.address.town ||
          response.data.address.village ||
          null,
      };
    }
    return { state: null, district: null, city: null };
  } catch (error) {
    // console.error("Reverse geocoding error:", error.message);
    return { state: null, district: null, city: null };
  }
};

exports.getAllReports = async (req, res) => {
  try {
    //filtering
    let queryObj = { ...req.query };
    const excludedFields = [
      "page",
      "sort",
      "limit",
      "fields",
      "startDate",
      "endDate",
      "state",
      "district",
      "urgency",
      "type",
      "verificationStatus",
    ];
    excludedFields.forEach((field) => delete queryObj[field]);

    // Build query object
    let filterQuery = {};

    // Date range filtering
    if (req.query.startDate || req.query.endDate) {
      filterQuery.reportedAt = {};
      if (req.query.startDate) {
        filterQuery.reportedAt.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        const endDate = new Date(req.query.endDate);
        endDate.setHours(23, 59, 59, 999);
        filterQuery.reportedAt.$lte = endDate;
      }
    }

    // Urgency filter (can be multiple values comma-separated)
    if (req.query.urgency) {
      const urgencyLevels = req.query.urgency.split(",");
      filterQuery.urgency = { $in: urgencyLevels };
    }

    // Type filter (can be multiple values comma-separated)
    if (req.query.type) {
      const types = req.query.type.split(",");
      filterQuery.type = { $in: types };
    }

    // Verification status filter
    if (req.query.verificationStatus) {
      const statuses = req.query.verificationStatus.split(",");

      if (statuses.length === 1) {
        if (statuses[0] === "verified") {
          filterQuery.isVerified = true;
        } else if (statuses[0] === "pending") {
          filterQuery.isVerified = false;
          filterQuery.rejectionReason = { $exists: false };
        } else if (statuses[0] === "rejected") {
          filterQuery.rejectionReason = { $exists: true, $ne: null };
        }
      } else {
        const orConditions = [];
        if (statuses.includes("verified")) {
          orConditions.push({ isVerified: true });
        }
        if (statuses.includes("pending")) {
          orConditions.push({
            isVerified: false,
            rejectionReason: { $exists: false },
          });
        }
        if (statuses.includes("rejected")) {
          orConditions.push({
            rejectionReason: { $exists: true, $ne: null },
          });
        }
        if (orConditions.length > 0) {
          filterQuery.$or = orConditions;
        }
      }
    }

    // Merge with other query params
    let query = Report.find({ ...queryObj, ...filterQuery });

    //sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      //Latest reports shown first
      query = query.sort("-reportedAt");
    }

    let reports = await query.populate("reportedBy", "name email phone");

    // Location-based filtering (state/district) - done on server side after geocoding
    const needsLocationFiltering = req.query.state || req.query.district;

    if (needsLocationFiltering) {
      // Geocode each report and filter
      const reportsWithLocation = await Promise.all(
        reports.map(async (report) => {
          const [lon, lat] = report.location.coordinates;
          const locationData = await reverseGeocode(lat, lon);

          // Add location data to report object (not saved to DB)
          const reportObj = report.toObject();
          reportObj.state = locationData.state;
          reportObj.district = locationData.district;
          reportObj.city = locationData.city;

          return reportObj;
        })
      );

      // Filter based on location
      reports = reportsWithLocation.filter((report) => {
        let matches = true;

        if (req.query.state && report.state) {
          matches =
            matches &&
            report.state.toLowerCase().includes(req.query.state.toLowerCase());
        } else if (req.query.state && !report.state) {
          matches = false;
        }

        if (req.query.district && report.district) {
          matches =
            matches &&
            report.district
              .toLowerCase()
              .includes(req.query.district.toLowerCase());
        } else if (req.query.district && !report.district) {
          matches = false;
        }

        return matches;
      });
    }

    res.status(200).json({
      message: "Reports fetched successfully",
      reports,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

exports.getNearbyReports = async (req, res) => {
  try {
    const { lat, lon, radiusKm = 10 } = req.query;
    if (!lat || !lon)
      return res.status(400).json({ msg: "lat and lng are required" });

    const reports = await Report.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [Number(lon), Number(lat)] },
          $maxDistance: Number(radiusKm) * 1000,
        },
      },
    });

    res.json(reports);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.updateVerificationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isVerified } = req.body;

    const report = await Report.findByIdAndUpdate(
      id,
      { isVerified },
      { new: true }
    ).populate("reportedBy", "name email phone");

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json({
      success: true,
      message: "Verification status updated successfully",
      report,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getReportsByLocation = async (req, res) => {
  try {
    const { placeName, radiusKm = 10 } = req.query;

    if (!placeName) {
      return res.status(400).json({ msg: "Place name is required" });
    }

    const geocodeResponse = await axios.get(
      `https://nominatim.openstreetmap.org/search`,
      {
        params: {
          q: placeName,
          format: "json",
          limit: 1,
        },
        headers: {
          "User-Agent": "WaveWatch-App/1.0",
        },
      }
    );

    if (!geocodeResponse.data || geocodeResponse.data.length === 0) {
      return res.status(404).json({
        msg: "Location not found. Please try a different search term.",
      });
    }

    const { lat, lon } = geocodeResponse.data[0];

    const reports = await Report.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [Number(lon), Number(lat)],
          },
          $maxDistance: Number(radiusKm) * 1000,
        },
      },
    }).populate("reportedBy", "name email");

    res.json({
      success: true,
      location: {
        name: geocodeResponse.data[0].display_name,
        lat: Number(lat),
        lon: Number(lon),
      },
      radiusKm: Number(radiusKm),
      count: reports.length,
      reports: reports,
    });
  } catch (err) {
    console.error("Location search error:", err);
    res.status(500).json({ msg: err.message });
  }
};

exports.rejectReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;

    const report = await Report.findByIdAndUpdate(
      id,
      {
        isVerified: false,
        rejectionReason: rejectionReason,
        rejectedAt: Date.now(),
      },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json({
      success: true,
      message: "Report rejected successfully",
      report,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getReportWithNearbySocialMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const { radiusKm = 50 } = req.query; // Default 50km radius

    // Get the report
    const report = await Report.findById(id).populate(
      "reportedBy",
      "name email phone"
    );

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // Get coordinates from report
    const [lon, lat] = report.location.coordinates;

    // Find nearby social media posts using aggregation pipeline
    const nearbySocialMedia = await SocialMedia.aggregate([
      {
        $match: {
          lat: { $exists: true, $ne: null },
          lon: { $exists: true, $ne: null },
        },
      },
      {
        $addFields: {
          distance: {
            $multiply: [
              6371, // Earth's radius in kilometers
              {
                $acos: {
                  $min: [
                    1,
                    {
                      $max: [
                        -1,
                        {
                          $add: [
                            {
                              $multiply: [
                                {
                                  $sin: {
                                    $multiply: [
                                      { $divide: [lat, 180] },
                                      Math.PI,
                                    ],
                                  },
                                },
                                {
                                  $sin: {
                                    $multiply: [
                                      { $divide: ["$lat", 180] },
                                      Math.PI,
                                    ],
                                  },
                                },
                              ],
                            },
                            {
                              $multiply: [
                                {
                                  $cos: {
                                    $multiply: [
                                      { $divide: [lat, 180] },
                                      Math.PI,
                                    ],
                                  },
                                },
                                {
                                  $cos: {
                                    $multiply: [
                                      { $divide: ["$lat", 180] },
                                      Math.PI,
                                    ],
                                  },
                                },
                                {
                                  $cos: {
                                    $multiply: [
                                      {
                                        $divide: [
                                          { $subtract: ["$lon", lon] },
                                          180,
                                        ],
                                      },
                                      Math.PI,
                                    ],
                                  },
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
        },
      },
      {
        $match: {
          distance: { $lte: Number(radiusKm) },
        },
      },
      {
        $sort: { date: -1 },
      },
      {
        $limit: 20,
      },
    ]);

    res.status(200).json({
      success: true,
      report,
      nearbySocialMedia,
      nearbyCount: nearbySocialMedia.length,
      radiusKm: Number(radiusKm),
    });
  } catch (err) {
    console.error("Error fetching report with nearby social media:", err);
    res.status(500).json({ message: err.message });
  }
};
