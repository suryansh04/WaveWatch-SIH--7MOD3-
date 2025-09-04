const Report = require("../models/ReportSchema");
const { validationResult } = require("express-validator");

exports.getAllReports = async (req, res) => {
  //filtering
  let queryObj = { ...req.query };
  const excludedFields = ["page", "sort", "limit", "fields"];
  excludedFields.forEach((field) => delete queryObj[field]);
  let query = Report.find(queryObj);
  //sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    //Latest reports shown first
    query = query.sort("-reportedAt");
  }
  try {
    const reports = await query.populate("reportedBy", "name email");
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
    const { lat, lon, radiusKm = 10 } = req.query; // defaults to 10 km
    if (!lat || !lon)
      return res.status(400).json({ msg: "lat and lng are required" });

    const reports = await Report.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [Number(lon), Number(lat)] },
          $maxDistance: Number(radiusKm) * 1000, // meters
        },
      },
    });

    res.json(reports);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
