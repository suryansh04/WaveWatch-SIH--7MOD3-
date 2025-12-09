"use client";

import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import {
  Filter,
  ChevronDown,
  X,
  ExternalLink,
  Calendar,
  LocateOffIcon as LocationIcon,
  AlertTriangle,
  CheckCircle,
  User,
  MapIcon,
  Layers,
  Clock,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { DBSCAN } from "density-clustering";
import "./ViewMap.css";

// Import for the social-media image marker
import redditMarker from "/src/assets/marker.png";

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const ViewMap = () => {
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markersRef = useRef([]);
  const hotspotsRef = useRef([]);
  const socialMediaMarkersRef = useRef([]);

  const [reports, setReports] = useState([]);
  const [socialMediaPosts, setSocialMediaPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [crowdReports, setCrowdReports] = useState(true);
  const [socialMediaReports, setSocialMediaReports] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showHotspots, setShowHotspots] = useState(true);

  // Hotspot items for the right-side list
  const [hotspotItems, setHotspotItems] = useState([]);

  // Temporary filter state (user edits here before applying)
  const [tempFilters, setTempFilters] = useState({
    state: "",
    district: "",
    quickTime: "",
    startDate: "",
    endDate: "",
    reportTypes: [],
    socialMediaTypes: [],
    urgencyLevels: [],
    verificationStatus: [],
  });

  // Applied filters (triggers API call)
  const [advancedFilters, setAdvancedFilters] = useState({
    state: "",
    district: "",
    quickTime: "",
    startDate: "",
    endDate: "",
    reportTypes: [],
    socialMediaTypes: [],
    urgencyLevels: [],
    verificationStatus: [],
  });

  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Indian states for dropdown
  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry",
  ];

  // Modal state
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedSocialPost, setSelectedSocialPost] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("report");

  const urgencyColors = {
    High: "#dc2626",
    Medium: "#f59e0b",
    Low: "#16a34a",
  };

  const reportTypeColors = {
    Flooding: "#3b82f6",
    "Unusual tides": "#8b5cf6",
    "Coastal damage": "#ef4444",
    Tsunami: "#dc2626",
    "Swell surges": "#06b6d4",
    "High waves": "#0891b2",
    Fire: "#f97316",
    Earthquake: "#7c2d12",
    Storm: "#6b21a8",
    Accident: "#374151",
    Flood: "#1d4ed8",
  };

  const filterOptions = [
    { value: "all", label: "All Reports" },
    { value: "high", label: "High Urgency" },
    { value: "medium", label: "Medium Urgency" },
    { value: "low", label: "Low Urgency" },
    { value: "flooding", label: "Flooding" },
    { value: "tsunami", label: "Tsunami" },
    { value: "coastal_damage", label: "Coastal Damage" },
    { value: "unusual_tides", label: "Unusual Tides" },
    { value: "swell_surges", label: "Swell Surges" },
    { value: "high_waves", label: "High Waves" },
  ];

  // Open detailed modal
  const openDetailModal = (item, type = "report") => {
    if (type === "report") {
      setSelectedReport(item);
      setSelectedSocialPost(null);
    } else {
      setSelectedSocialPost(item);
      setSelectedReport(null);
    }
    setModalType(type);
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setSelectedReport(null);
    setSelectedSocialPost(null);
    setShowModal(false);
  };

  // Check if URL is video
  const isVideoUrl = (url) => {
    return (
      url &&
      (url.includes(".mp4") ||
        url.includes(".webm") ||
        url.includes(".ogg") ||
        url.includes("video"))
    );
  };

  // Fetch reports from API
  const fetchReports = async () => {
    try {
      setLoading(true);

      // Build query parameters from advanced filters
      const params = new URLSearchParams();

      // Time filters - handle quick time
      let startDate = advancedFilters.startDate;
      let endDate = advancedFilters.endDate;

      if (advancedFilters.quickTime) {
        const now = new Date();
        switch (advancedFilters.quickTime) {
          case "1h":
            startDate = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
            break;
          case "24h":
            startDate = new Date(
              now.getTime() - 24 * 60 * 60 * 1000
            ).toISOString();
            break;
          case "7d":
            startDate = new Date(
              now.getTime() - 7 * 24 * 60 * 60 * 1000
            ).toISOString();
            break;
          case "30d":
            startDate = new Date(
              now.getTime() - 30 * 24 * 60 * 60 * 1000
            ).toISOString();
            break;
        }
        endDate = now.toISOString();
      }

      if (startDate) {
        params.append("startDate", startDate);
      }
      if (endDate) {
        params.append("endDate", endDate);
      }

      // Location filters
      if (advancedFilters.state) {
        params.append("state", advancedFilters.state);
      }
      if (advancedFilters.district) {
        params.append("district", advancedFilters.district);
      }

      // Report type filters
      if (advancedFilters.reportTypes.length > 0) {
        params.append("type", advancedFilters.reportTypes.join(","));
      }

      // Urgency filters
      if (advancedFilters.urgencyLevels.length > 0) {
        params.append("urgency", advancedFilters.urgencyLevels.join(","));
      }

      // Verification status filters
      if (advancedFilters.verificationStatus.length > 0) {
        params.append(
          "verificationStatus",
          advancedFilters.verificationStatus.join(",")
        );
      }

      const queryString = params.toString();
      const reportsUrl = `http://localhost:3000/reports${
        queryString ? `?${queryString}` : ""
      }`;

      const [reportsResponse, socialMediaResponse] = await Promise.all([
        axios.get(reportsUrl),
        axios.get("http://localhost:3000/social-media/posts"),
      ]);

      setReports(reportsResponse.data.reports || []);
      setSocialMediaPosts(socialMediaResponse.data.posts || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  // Calculate distance between two lat/lng points (in kilometers)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Generate hotspots using DBSCAN for reports
  const generateReportHotspots = (filteredReports) => {
    if (filteredReports.length < 3) return [];

    const points = filteredReports.map((report) => {
      const [lng, lat] = report.location.coordinates;
      return [lat, lng];
    });

    const distanceFunction = (pointA, pointB) => {
      return calculateDistance(pointA[0], pointA[1], pointB[0], pointB[1]);
    };

    const dbscan = new DBSCAN();
    const clusters = dbscan.run(points, 5, 3, distanceFunction);

    const hotspots = clusters.map((cluster, index) => {
      const clusterReports = cluster.map(
        (pointIndex) => filteredReports[pointIndex]
      );

      const centerLat =
        cluster.reduce((sum, pointIndex) => sum + points[pointIndex][0], 0) /
        cluster.length;
      const centerLng =
        cluster.reduce((sum, pointIndex) => sum + points[pointIndex][1], 0) /
        cluster.length;

      const urgencyWeights = { High: 3, Medium: 2, Low: 1 };
      const intensity = clusterReports.reduce(
        (sum, report) => sum + (urgencyWeights[report.urgency] || 1),
        0
      );

      const verifiedCount = clusterReports.filter((r) => r.isVerified).length;

      return {
        id: `report-hotspot-${index}`,
        type: "report",
        center: [centerLat, centerLng],
        reports: clusterReports,
        intensity,
        verifiedCount,
        reportCount: clusterReports.length,
      };
    });

    return hotspots;
  };

  // Generate hotspots using DBSCAN for social media posts
  const generateSocialMediaHotspots = (filteredSocialPosts) => {
    if (filteredSocialPosts.length < 2) return [];

    const points = filteredSocialPosts.map((post) => [post.lat, post.lon]);

    const distanceFunction = (pointA, pointB) => {
      return calculateDistance(pointA[0], pointA[1], pointB[0], pointB[1]);
    };

    const dbscan = new DBSCAN();
    const clusters = dbscan.run(points, 8, 2, distanceFunction);

    const hotspots = clusters.map((cluster, index) => {
      const clusterPosts = cluster.map(
        (pointIndex) => filteredSocialPosts[pointIndex]
      );

      const centerLat =
        cluster.reduce((sum, pointIndex) => sum + points[pointIndex][0], 0) /
        cluster.length;
      const centerLng =
        cluster.reduce((sum, pointIndex) => sum + points[pointIndex][1], 0) /
        cluster.length;

      const intensity = clusterPosts.length * 2;

      return {
        id: `social-hotspot-${index}`,
        type: "social",
        center: [centerLat, centerLng],
        posts: clusterPosts,
        intensity,
        postCount: clusterPosts.length,
      };
    });

    return hotspots;
  };

  // Create hotspot visualization on map
  const createHotspotLayer = (hotspot) => {
    const getHotspotStyle = (intensity) => {
      if (intensity >= 8)
        return { color: "#dc2626", fillColor: "#fca5a5", radius: 2000 };
      if (intensity >= 5)
        return { color: "#f59e0b", fillColor: "#fbbf24", radius: 1500 };
      return { color: "#eab308", fillColor: "#fde047", radius: 1000 };
    };

    const style = getHotspotStyle(hotspot.intensity);

    const circle = L.circle(hotspot.center, {
      color: style.color,
      fillColor: style.fillColor,
      fillOpacity: 0.3,
      weight: 2,
      radius: style.radius,
    });

    circle._customId = hotspot.id;

    let popupContent;

    if (hotspot.type === "social") {
      popupContent = `
        <div class="hotspot-popup">
          <h3>📱 Social Media Hotspot</h3>
          <div class="hotspot-stats">
            <p><strong>Posts:</strong> ${hotspot.postCount}</p>
            <p><strong>Activity Level:</strong> ${
              hotspot.intensity >= 8
                ? "High"
                : hotspot.intensity >= 5
                ? "Medium"
                : "Low"
            }</p>
          </div>
          <div class="hotspot-report-types">
            <strong>Sources:</strong><br>
            ${[
              ...new Set(
                hotspot.posts.map((p) => p.subreddit || "Social Media")
              ),
            ].join(", ")}
          </div>
        </div>
      `;
    } else {
      popupContent = `
        <div class="hotspot-popup">
          <h3>🔥 Threat Hotspot</h3>
          <div class="hotspot-stats">
            <p><strong>Reports:</strong> ${hotspot.reportCount}</p>
            <p><strong>Verified:</strong> ${hotspot.verifiedCount}</p>
            <p><strong>Threat Level:</strong> ${
              hotspot.intensity >= 8
                ? "High"
                : hotspot.intensity >= 5
                ? "Medium"
                : "Low"
            }</p>
          </div>
          <div class="hotspot-report-types">
            <strong>Report Types:</strong><br>
            ${[...new Set(hotspot.reports.map((r) => r.type))].join(", ")}
          </div>
        </div>
      `;
    }

    circle.bindPopup(popupContent);
    return circle;
  };

  // Create custom marker icon for reports
  const createCustomIcon = (report) => {
    const color = urgencyColors[report.urgency] || "#6b7280";

    return L.divIcon({
      html: `
      <div class="pin-marker" style="color: ${color}">
        <svg width="24" height="32" viewBox="0 0 24 32" fill="currentColor">
          <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 20 12 20s12-11 12-20c0-6.627-5.373-12-12-12zm0 16c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z"/>
        </svg>
      </div>
    `,
      className: "custom-pin-icon",
      iconSize: [24, 32],
      iconAnchor: [12, 32],
    });
  };

  // Create custom marker icon for social media posts
  const createSocialMediaIcon = () => {
    return L.icon({
      iconUrl: redditMarker,
      iconRetinaUrl: redditMarker,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      className: "social-media-pin-icon",
    });
  };

  // Filter reports based on toggles and dropdown
  const getFilteredReports = () => {
    let filtered = reports.filter((report) => {
      const isCrowdReport = !report.socialMedia;
      if (!crowdReports && isCrowdReport) return false;
      return true;
    });

    if (selectedFilter !== "all") {
      filtered = filtered.filter((report) => {
        switch (selectedFilter) {
          case "high":
          case "medium":
          case "low":
            return report.urgency.toLowerCase() === selectedFilter;
          case "flooding":
            return report.type.toLowerCase() === "flooding";
          case "tsunami":
            return report.type.toLowerCase() === "tsunami";
          case "coastal_damage":
            return report.type.toLowerCase() === "coastal damage";
          case "unusual_tides":
            return report.type.toLowerCase() === "unusual tides";
          case "swell_surges":
            return report.type.toLowerCase() === "swell surges";
          case "high_waves":
            return report.type.toLowerCase() === "high waves";
          default:
            return true;
        }
      });
    }

    return filtered;
  };

  // Filter social media posts
  const getFilteredSocialMediaPosts = () => {
    if (!socialMediaReports) return [];
    return socialMediaPosts.filter(
      (post) => post.lat && post.lon && post.flood_label === 1
    );
  };

  // Initialize map
  useEffect(() => {
    if (mapRef.current && !leafletMapRef.current) {
      leafletMapRef.current = L.map(mapRef.current).setView(
        [26.8419054, 75.5613303],
        10
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(leafletMapRef.current);
    }

    fetchReports();

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [advancedFilters]);

  // Update markers and hotspots on map
  useEffect(() => {
    if (!leafletMapRef.current) return;

    // Clear existing markers and hotspots
    markersRef.current.forEach((marker) => {
      leafletMapRef.current.removeLayer(marker);
    });
    hotspotsRef.current.forEach((hotspot) => {
      leafletMapRef.current.removeLayer(hotspot);
    });
    socialMediaMarkersRef.current.forEach((marker) => {
      leafletMapRef.current.removeLayer(marker);
    });

    markersRef.current = [];
    hotspotsRef.current = [];
    socialMediaMarkersRef.current = [];
    setHotspotItems([]);

    const filteredReports = getFilteredReports();
    const filteredSocialPosts = getFilteredSocialMediaPosts();

    const hotspotListToShow = [];

    if (showHotspots) {
      const reportHotspots = generateReportHotspots(filteredReports);
      reportHotspots.forEach((hotspot) => {
        const hotspotLayer = createHotspotLayer(hotspot);
        hotspotLayer.addTo(leafletMapRef.current);
        hotspotsRef.current.push(hotspotLayer);

        hotspotListToShow.push({
          id: hotspot.id,
          type: hotspot.type,
          center: hotspot.center,
          count: hotspot.reportCount,
          intensity: hotspot.intensity,
        });
      });

      const socialHotspots = generateSocialMediaHotspots(filteredSocialPosts);
      socialHotspots.forEach((hotspot) => {
        const hotspotLayer = createHotspotLayer(hotspot);
        hotspotLayer.addTo(leafletMapRef.current);
        hotspotsRef.current.push(hotspotLayer);

        hotspotListToShow.push({
          id: hotspot.id,
          type: hotspot.type,
          center: hotspot.center,
          count: hotspot.postCount,
          intensity: hotspot.intensity,
        });
      });
    }

    // Add individual markers for reports
    filteredReports.forEach((report) => {
      if (report.location && report.location.coordinates) {
        const [lng, lat] = report.location.coordinates;
        const marker = L.marker([lat, lng], {
          icon: createCustomIcon(report),
        });

        const popupContent = `
          <div class="marker-popup">
            <h3>${report.type}</h3>
            <p><strong>Urgency:</strong> <span class="urgency-${report.urgency.toLowerCase()}">${
          report.urgency
        }</span></p>
            <p><strong>Description:</strong> ${
              report.description || "No description available"
            }</p>
            <p><strong>Reported:</strong> ${new Date(
              report.reportedAt
            ).toLocaleString()}</p>
            <p><strong>Verified:</strong> ${
              report.isVerified ? "Yes" : "No"
            }</p>
            ${report.isSOS ? '<p class="sos-badge">SOS</p>' : ""}
            <button class="detail-btn" onclick="window.openReportDetail('${
              report._id
            }')">
              See in Detail
            </button>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.addTo(leafletMapRef.current);
        markersRef.current.push(marker);
      }
    });

    // Add social media markers
    filteredSocialPosts.forEach((post) => {
      const marker = L.marker([post.lat, post.lon], {
        icon: createSocialMediaIcon(),
      });

      const popupContent = `
        <div class="social-media-popup">
          <h3>📱 Social Media Alert</h3>
          <p><strong>Source:</strong> ${post.subreddit || "Social Media"}</p>
          <p><strong>Content:</strong> ${
            post.text
              ? post.text.substring(0, 100) + "..."
              : "No text available"
          }</p>
          <p><strong>Date:</strong> ${new Date(post.date).toLocaleString()}</p>
          <p><strong>Flood Indicator:</strong> ${
            post.flood_label === 1 ? "Detected" : "None"
          }</p>
          <button class="detail-btn" onclick="window.openSocialDetail('${
            post._id
          }')">
            See in Detail
          </button>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.addTo(leafletMapRef.current);
      socialMediaMarkersRef.current.push(marker);
    });

    setHotspotItems(hotspotListToShow);

    // Add global functions to handle detail button clicks
    window.openReportDetail = (reportId) => {
      const report = reports.find((r) => r._id === reportId);
      if (report) {
        openDetailModal(report, "report");
      }
    };

    window.openSocialDetail = (postId) => {
      const post = socialMediaPosts.find((p) => p._id === postId);
      if (post) {
        openDetailModal(post, "social");
      }
    };
  }, [
    reports,
    socialMediaPosts,
    crowdReports,
    socialMediaReports,
    selectedFilter,
    showHotspots,
  ]);

  // Handle clicking an item in the hotspot list
  const handleHotspotClick = (hotspotId) => {
    if (!leafletMapRef.current) return;

    const layer = hotspotsRef.current.find(
      (l) => l && l._customId === hotspotId
    );
    const item = hotspotItems.find((h) => h.id === hotspotId);

    if (item && leafletMapRef.current) {
      const zoomLevel =
        item.intensity >= 8 ? 14 : item.intensity >= 5 ? 13 : 12;
      leafletMapRef.current.setView(item.center, zoomLevel, { animate: true });
    }

    if (layer) {
      try {
        layer.openPopup();
      } catch (e) {
        // ignore if no popup
      }
    }
  };

  // Handle advanced filter changes
  const handleAdvancedFilterChange = (filterType, value) => {
    setTempFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  // Handle checkbox filters
  const handleCheckboxFilterChange = (filterType, value) => {
    setTempFilters((prev) => {
      const currentValues = prev[filterType];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      return {
        ...prev,
        [filterType]: newValues,
      };
    });
  };

  // Handle quick time filter
  const handleQuickTimeFilter = (timeValue) => {
    setTempFilters((prev) => ({
      ...prev,
      quickTime: prev.quickTime === timeValue ? "" : timeValue,
      startDate: "",
      endDate: "",
    }));
  };

  // Apply filters
  const handleApplyFilters = () => {
    setAdvancedFilters({ ...tempFilters });
  };

  // Clear all advanced filters
  const handleClearFilters = () => {
    const clearedFilters = {
      state: "",
      district: "",
      quickTime: "",
      startDate: "",
      endDate: "",
      reportTypes: [],
      socialMediaTypes: [],
      urgencyLevels: [],
      verificationStatus: [],
    };
    setTempFilters(clearedFilters);
    setAdvancedFilters(clearedFilters);
  };

  // Calculate active filters count
  useEffect(() => {
    let count = 0;
    if (advancedFilters.state) count++;
    if (advancedFilters.district) count++;
    if (advancedFilters.quickTime) count++;
    if (advancedFilters.startDate || advancedFilters.endDate) count++;
    count += advancedFilters.reportTypes.length;
    count += advancedFilters.socialMediaTypes.length;
    count += advancedFilters.urgencyLevels.length;
    count += advancedFilters.verificationStatus.length;
    setActiveFiltersCount(count);
  }, [advancedFilters]);

  return (
    <div className="map-container">
      <div className="map-wrapper">
        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Loading reports...</p>
          </div>
        )}

        {error && (
          <div className="error-overlay">
            <p>Error: {error}</p>
            <button onClick={fetchReports} className="retry-btn">
              Retry
            </button>
          </div>
        )}

        {/* Controls Panel - New Modern UI */}
        <div className="controls-panel">
          {/* Quick Filter Card */}
          <div className="panel-card filter-main-card">
            <div className="card-header">
              <Filter className="icon-sm" />
              <span>Quick Filter</span>
            </div>
            <div className="filter-input-wrapper">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="theme-select"
              >
                {filterOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="select-arrow" size={16} />
            </div>
          </div>

          {/* Advanced Filters Card */}
          <div className="panel-card advanced-filters-card">
            <div className="card-header">
              <SlidersHorizontal className="icon-sm" />
              <span>Advanced Filters</span>
              {activeFiltersCount > 0 && (
                <span className="badge-count">{activeFiltersCount}</span>
              )}
            </div>

            <div className="filters-content">
              {/* Location */}
              <div className="filter-group">
                <label className="filter-label">
                  <LocationIcon size={14} className="label-icon" /> Location
                </label>
                <div className="inputs-row">
                  <div className="select-container">
                    <select
                      className="theme-select sm"
                      value={tempFilters.state}
                      onChange={(e) =>
                        handleAdvancedFilterChange("state", e.target.value)
                      }
                    >
                      <option value="">All States</option>
                      {indianStates.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="select-arrow" size={14} />
                  </div>
                  <div className="input-container">
                    <Search className="input-icon" size={14} />
                    <input
                      type="text"
                      className="theme-input sm"
                      placeholder="District"
                      value={tempFilters.district}
                      onChange={(e) =>
                        handleAdvancedFilterChange("district", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Time */}
              <div className="filter-group">
                <label className="filter-label">
                  <Clock size={14} className="label-icon" /> Time Range
                </label>
                <div className="quick-tags">
                  {["1h", "24h", "7d", "30d"].map((t) => (
                    <button
                      key={t}
                      className={`tag-btn ${
                        tempFilters.quickTime === t ? "active" : ""
                      }`}
                      onClick={() => handleQuickTimeFilter(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <div className="date-row">
                  <input
                    type="date"
                    className="theme-input date-input"
                    value={tempFilters.startDate}
                    onChange={(e) => {
                      handleAdvancedFilterChange("startDate", e.target.value);
                      handleAdvancedFilterChange("quickTime", "");
                    }}
                  />
                  <span className="date-separator">to</span>
                  <input
                    type="date"
                    className="theme-input date-input"
                    value={tempFilters.endDate}
                    onChange={(e) => {
                      handleAdvancedFilterChange("endDate", e.target.value);
                      handleAdvancedFilterChange("quickTime", "");
                    }}
                  />
                </div>
              </div>

              {/* Threats */}
              <div className="filter-group">
                <label className="filter-label">
                  <AlertTriangle size={14} className="label-icon" /> Threats
                </label>
                <div className="checkbox-grid">
                  {[
                    "Flooding",
                    "High waves",
                    "Coastal damage",
                    "Unusual tides",
                    "Storm",
                    "Tsunami",
                  ].map((type) => (
                    <label key={type} className="checkbox-pill">
                      <input
                        type="checkbox"
                        checked={tempFilters.reportTypes.includes(type)}
                        onChange={() =>
                          handleCheckboxFilterChange("reportTypes", type)
                        }
                      />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Urgency & Status */}
              <div className="split-group">
                <div className="filter-group half">
                  <label className="filter-label">Urgency</label>
                  <div className="checkbox-list">
                    {["High", "Medium", "Low"].map((urgency) => (
                      <label key={urgency} className="checkbox-row">
                        <input
                          type="checkbox"
                          checked={tempFilters.urgencyLevels.includes(urgency)}
                          onChange={() =>
                            handleCheckboxFilterChange("urgencyLevels", urgency)
                          }
                        />
                        <span
                          className={`urgency-dot ${urgency.toLowerCase()}`}
                        ></span>
                        {urgency}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="filter-group half">
                  <label className="filter-label">Status</label>
                  <div className="checkbox-list">
                    <label className="checkbox-row">
                      <input
                        type="checkbox"
                        checked={tempFilters.verificationStatus.includes(
                          "verified"
                        )}
                        onChange={() =>
                          handleCheckboxFilterChange(
                            "verificationStatus",
                            "verified"
                          )
                        }
                      />
                      Verified
                    </label>
                    <label className="checkbox-row">
                      <input
                        type="checkbox"
                        checked={tempFilters.verificationStatus.includes(
                          "pending"
                        )}
                        onChange={() =>
                          handleCheckboxFilterChange(
                            "verificationStatus",
                            "pending"
                          )
                        }
                      />
                      Pending
                    </label>
                    <label className="checkbox-row">
                      <input
                        type="checkbox"
                        checked={tempFilters.verificationStatus.includes(
                          "rejected"
                        )}
                        onChange={() =>
                          handleCheckboxFilterChange(
                            "verificationStatus",
                            "rejected"
                          )
                        }
                      />
                      Rejected
                    </label>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="card-footer">
                <button className="btn-secondary" onClick={handleClearFilters}>
                  Clear
                </button>
                <button className="btn-primary" onClick={handleApplyFilters}>
                  Apply Filters
                </button>
              </div>
            </div>
          </div>

          {/* Hotspots List */}
          <div
            className="panel-card hotspots-card"
            aria-label="Current hotspots"
          >
            <div className="card-header border-bottom">
              <MapIcon className="icon-sm" />
              <span>Active Hotspots</span>
              <span className="badge-gray">{hotspotItems.length}</span>
            </div>

            <div className="hotspot-list-container">
              {hotspotItems.length === 0 ? (
                <div className="empty-state">No hotspots detected</div>
              ) : (
                <div className="hotspot-items-wrapper">
                  {hotspotItems.map((h) => (
                    <button
                      key={h.id}
                      className={`hotspot-row ${
                        h.type === "social" ? "social-border" : "report-border"
                      }`}
                      onClick={() => handleHotspotClick(h.id)}
                    >
                      <div
                        className={`hotspot-indicator ${
                          h.type === "social" ? "bg-social" : "bg-report"
                        }`}
                      ></div>
                      <div className="hotspot-info">
                        <div className="hotspot-name">
                          {h.type === "social"
                            ? "Social Activity"
                            : "Threat Zone"}
                        </div>
                        <div className="hotspot-details">
                          {h.count} {h.type === "social" ? "posts" : "reports"}{" "}
                          • Level {h.intensity}
                        </div>
                      </div>
                      <ExternalLink size={14} className="link-icon" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Toggles */}
          <div className="panel-card toggles-card">
            <div className="card-header border-bottom">
              <Layers className="icon-sm" />
              <span>Map Layers</span>
            </div>
            <div className="toggles-list">
              <div className="toggle-row">
                <span className="toggle-text">Threat Hotspots</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={showHotspots}
                    onChange={(e) => setShowHotspots(e.target.checked)}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
              <div className="toggle-row">
                <span className="toggle-text">Crowd Reports</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={crowdReports}
                    onChange={(e) => setCrowdReports(e.target.checked)}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
              <div className="toggle-row">
                <span className="toggle-text">Social Media</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={socialMediaReports}
                    onChange={(e) => setSocialMediaReports(e.target.checked)}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="panel-card legend-card">
            <div className="legend-grid">
              <div className="legend-item">
                <span className="dot dot-high"></span> High
              </div>
              <div className="legend-item">
                <span className="dot dot-medium"></span> Medium
              </div>
              <div className="legend-item">
                <span className="dot dot-low"></span> Low
              </div>
              <div className="legend-item">
                <span className="dot dot-danger"></span> Zones
              </div>
            </div>
          </div>
        </div>

        <div ref={mapRef} className="leaflet-map"></div>
      </div>

      {/* Detailed Report Modal */}
      {showModal && modalType === "report" && selectedReport && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Report Details</h2>
              <button className="modal-close" onClick={closeModal}>
                <X size={24} />
              </button>
            </div>

            <div className="modal-body">
              <div className="report-header">
                <div
                  className="report-type-badge"
                  style={{
                    backgroundColor:
                      reportTypeColors[selectedReport.type] || "#6b7280",
                  }}
                >
                  {selectedReport.type}
                </div>
                <div
                  className={`urgency-badge urgency-${selectedReport.urgency.toLowerCase()}`}
                >
                  <AlertTriangle size={16} />
                  {selectedReport.urgency} Priority
                </div>
              </div>

              {selectedReport.mediaUrl &&
                selectedReport.mediaUrl.length > 0 && (
                  <div className="media-section">
                    <h3 className="section-title">Media Evidence</h3>
                    <div className="media-grid">
                      {selectedReport.mediaUrl.map((url, index) => (
                        <div key={index} className="media-item">
                          {isVideoUrl(url) ? (
                            <div className="video-container">
                              <video
                                src={url}
                                controls
                                className="report-video"
                              >
                                Your browser does not support the video tag.
                              </video>
                            </div>
                          ) : (
                            <div className="image-container">
                              <img
                                src={url || "/placeholder.svg"}
                                alt={`Report evidence ${index + 1}`}
                                className="report-image"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                }}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              <div className="description-section">
                <h3 className="section-title">Description</h3>
                <p className="report-description">
                  {selectedReport.description || "No description provided"}
                </p>
              </div>

              <div className="info-grid">
                <div className="info-item">
                  <LocationIcon className="info-icon" size={18} />
                  <div>
                    <span className="info-label">Location</span>
                    <span className="info-value">
                      {selectedReport.location?.coordinates[1]?.toFixed(6)},{" "}
                      {selectedReport.location?.coordinates[0]?.toFixed(6)}
                    </span>
                  </div>
                </div>

                <div className="info-item">
                  <Calendar className="info-icon" size={18} />
                  <div>
                    <span className="info-label">Reported At</span>
                    <span className="info-value">
                      {new Date(selectedReport.reportedAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="info-item">
                  <CheckCircle
                    className={`info-icon ${
                      selectedReport.isVerified ? "verified" : "unverified"
                    }`}
                    size={18}
                  />
                  <div>
                    <span className="info-label">Verification Status</span>
                    <span
                      className={`info-value ${
                        selectedReport.isVerified ? "verified" : "unverified"
                      }`}
                    >
                      {selectedReport.isVerified
                        ? "Verified"
                        : "Pending Verification"}
                    </span>
                  </div>
                </div>

                <div className="info-item">
                  <User className="info-icon" size={18} />
                  <div>
                    <span className="info-label">Report ID</span>
                    <span className="info-value">{selectedReport._id}</span>
                  </div>
                </div>
              </div>

              {selectedReport.isSOS && (
                <div className="sos-section">
                  <div className="sos-alert">
                    <AlertTriangle className="sos-icon" size={20} />
                    <span>EMERGENCY SOS REPORT</span>
                  </div>
                </div>
              )}

              <div className="action-section">
                <button
                  className="external-link-btn"
                  onClick={() => {
                    const [lng, lat] = selectedReport.location.coordinates;
                    window.open(
                      `https://maps.google.com/?q=${lat},${lng}`,
                      "_blank"
                    );
                  }}
                >
                  <ExternalLink size={16} />
                  View on Google Maps
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Social Media Post Modal */}
      {showModal && modalType === "social" && selectedSocialPost && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">📱 Social Media Alert</h2>
              <button className="modal-close" onClick={closeModal}>
                <X size={24} />
              </button>
            </div>

            <div className="modal-body">
              <div className="social-header">
                <div className="social-source-badge">
                  {selectedSocialPost.subreddit || "Social Media"}
                </div>
                <div className="flood-detection-badge">
                  Flood Detection:{" "}
                  {selectedSocialPost.flood_label === 1
                    ? "Positive"
                    : "Negative"}
                </div>
              </div>

              <div className="description-section">
                <h3 className="section-title">Content</h3>
                <p className="report-description">
                  {selectedSocialPost.text || "No text content available"}
                </p>
              </div>

              <div className="info-grid">
                <div className="info-item">
                  <LocationIcon className="info-icon" size={18} />
                  <div>
                    <span className="info-label">Location</span>
                    <span className="info-value">
                      {selectedSocialPost.lat?.toFixed(6)},{" "}
                      {selectedSocialPost.lon?.toFixed(6)}
                    </span>
                  </div>
                </div>

                <div className="info-item">
                  <Calendar className="info-icon" size={18} />
                  <div>
                    <span className="info-label">Posted At</span>
                    <span className="info-value">
                      {new Date(selectedSocialPost.date).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="info-item">
                  <User className="info-icon" size={18} />
                  <div>
                    <span className="info-label">Post ID</span>
                    <span className="info-value">{selectedSocialPost._id}</span>
                  </div>
                </div>
              </div>

              <div className="action-section">
                <button
                  className="external-link-btn"
                  onClick={() => {
                    window.open(
                      `https://maps.google.com/?q=${selectedSocialPost.lat},${selectedSocialPost.lon}`,
                      "_blank"
                    );
                  }}
                >
                  <ExternalLink size={16} />
                  View on Google Maps
                </button>
                {selectedSocialPost.url && (
                  <button
                    className="external-link-btn"
                    onClick={() => {
                      window.open(selectedSocialPost.url, "_blank");
                    }}
                    style={{ marginTop: "1rem" }}
                  >
                    <ExternalLink size={16} />
                    View Original Post
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewMap;
