const SocialMedia = require("../models/socialMediaSchema"); // or use global.db approach
const axios = require("axios");
exports.getSocialMediaPosts = async (req, res) => {
  try {
    const { flood_filter, search, page = 1, limit = 0 } = req.query;

    let query = {};

    // Filter by flood label
    if (flood_filter === "flood") {
      query.flood_label = 1;
    } else if (flood_filter === "non-flood") {
      query.flood_label = 0;
    }

    // Search in text and subreddit
    if (search) {
      query.$or = [
        { text: { $regex: search, $options: "i" } },
        { subreddit: { $regex: search, $options: "i" } },
      ];
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Get total count and posts
    const total = await SocialMedia.countDocuments(query);
    const posts = await SocialMedia.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      posts,
      currentPage: pageNum,
      totalPages: Math.ceil(total / limitNum),
      totalPosts: total,
      hasMore: skip + posts.length < total,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

exports.getSocialMediaStats = async (req, res) => {
  try {
    const total = await SocialMedia.countDocuments({});
    const flood = await SocialMedia.countDocuments({ flood_label: 1 });
    const nonFlood = await SocialMedia.countDocuments({ flood_label: 0 });

    res.json({ total, flood, nonFlood });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};
exports.reverseGeocode = async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ error: "lat and lon are required" });
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}`;

    const response = await axios.get(url);

    res.json(response.data);
  } catch (err) {
    console.error("Reverse geocoding error:", err);
    res.status(500).json({ error: "Failed to get location" });
  }
};
