import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  MapPin,
  Clock,
  AlertTriangle,
  User,
  FileText,
  Waves,
  CloudLightning,
  Activity,
  Smartphone,
  RefreshCw,
} from "lucide-react";
import "./SmsReports.css";

// Configure your API base URL
const API_BASE_URL = "http://localhost:3000/api";

const SmsReports = () => {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    tsunami: 0,
    tide: 0,
    storm: 0,
    flooding: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  // Fetch reports from backend
  const fetchReports = async (filterType = "all") => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const params = new URLSearchParams();
      if (filterType && filterType !== "all") {
        params.append("type", filterType);
      }

      const response = await fetch(
        `${API_BASE_URL}/sms-reports?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        // Map backend fields to frontend expected format
        const mappedReports = result.data.map((report) => ({
          _id: report._id,
          hazardType: report.type || "Unknown",
          source: "SMS",
          reporterName: report.reporterPhone || "Unknown",
          location: report.locationName || "Unknown Location",
          description: report.description || "No description provided",
          createdAt: report.receivedAt || report.createdAt,
          urgency: report.urgency,
          isProcessed: report.isProcessedToMainReport,
          coordinates: report.location?.coordinates || [0, 0],
        }));

        setReports(mappedReports);
      } else {
        throw new Error(result.message || "Failed to fetch reports");
      }
    } catch (err) {
      console.error("Fetch reports error:", err);
      setError(err.message || "Failed to load SMS reports");
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics from backend
  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/sms-reports/stats`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        const statsData = result.data;

        // Map type counts
        const typeMap = {
          tsunami: 0,
          tide: 0,
          storm: 0,
          flooding: 0,
        };

        statsData.byType.forEach((item) => {
          const type = item._id.toLowerCase();
          if (type.includes("tsunami")) typeMap.tsunami = item.count;
          else if (type.includes("tide")) typeMap.tide = item.count;
          else if (type.includes("storm")) typeMap.storm = item.count;
          else if (type.includes("flood")) typeMap.flooding = item.count;
        });

        setStats({
          total: statsData.total,
          ...typeMap,
        });
      }
    } catch (err) {
      console.error("Fetch stats error:", err);
    }
  };

  // Mark report as processed (Create Alert functionality)
  const handleCreateAlert = async (reportId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/sms-reports/${reportId}/process`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to process report");
      }

      const result = await response.json();

      if (result.success) {
        // Update local state
        setReports((prevReports) =>
          prevReports.map((report) =>
            report._id === reportId ? { ...report, isProcessed: true } : report
          )
        );

        alert("Alert created successfully! Report marked as processed.");
      }
    } catch (err) {
      console.error("Error creating alert:", err);
      alert("Failed to create alert. Please try again.");
    }
  };

  // Handle view details
  const handleViewDetails = (report) => {
    // You can implement a modal or navigate to a detail page
    console.log("View details for:", report);
    alert(
      `Report Details:\n\nType: ${report.hazardType}\nLocation: ${report.location}\nDescription: ${report.description}`
    );
  };

  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchReports(filter), fetchStats()]);
    setRefreshing(false);
  };

  // Initial fetch
  useEffect(() => {
    fetchReports(filter);
    fetchStats();
  }, [filter]);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString || "-";
    }
  };

  // Helper for badge styling
  const getHazardTypeClass = (hazardType) => {
    const type = (hazardType || "").toLowerCase();
    if (type.includes("tsunami")) return "badge-red";
    if (type.includes("tide")) return "badge-orange";
    if (type.includes("storm")) return "badge-purple";
    if (type.includes("flood")) return "badge-blue";
    return "badge-gray";
  };

  return (
    <div className="smsReports-container">
      {/* Header */}
      <div className="smsReports-header">
        <div className="smsReports-headerContent">
          <h1 className="smsReports-pageTitle">SMS Reports</h1>
          <p className="smsReports-pageSubtitle">
            Monitor emergency reports received via SMS messages
          </p>
        </div>
        {/* <button
          className="smsReports-actionBtn smsReports-secondary"
          onClick={handleRefresh}
          disabled={refreshing}
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <RefreshCw size={16} className={refreshing ? "spinning" : ""} />
          Refresh
        </button> */}
      </div>

      {/* Stats Cards */}
      {loading && reports.length === 0 ? (
        <div className="smsReports-loadingState">
          <div className="smsReports-loadingSpinner"></div>
          <p>Loading SMS reports...</p>
        </div>
      ) : error ? (
        <div className="smsReports-errorState">
          <AlertTriangle size={48} />
          <h3>Error Loading Reports</h3>
          <p>{error}</p>
          <button
            className="smsReports-actionBtn smsReports-secondary"
            onClick={handleRefresh}
            style={{ marginTop: "20px" }}
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          <div className="smsReports-statsCardsSection">
            <div className="smsReports-statCard">
              <div className="stat-info">
                <span className="stat-label">Total Reports</span>
                <span className="stat-number">{stats.total}</span>
              </div>
              <div className="stat-icon-wrapper blue">
                <MessageSquare size={24} />
              </div>
            </div>

            <div className="smsReports-statCard">
              <div className="stat-info">
                <span className="stat-label">Tsunami</span>
                <span className="stat-number">{stats.tsunami}</span>
              </div>
              <div className="stat-icon-wrapper red">
                <Waves size={24} />
              </div>
            </div>

            <div className="smsReports-statCard">
              <div className="stat-info">
                <span className="stat-label">Tides</span>
                <span className="stat-number">{stats.tide}</span>
              </div>
              <div className="stat-icon-wrapper orange">
                <Activity size={24} />
              </div>
            </div>

            <div className="smsReports-statCard">
              <div className="stat-info">
                <span className="stat-label">Storms</span>
                <span className="stat-number">{stats.storm}</span>
              </div>
              <div className="stat-icon-wrapper purple">
                <CloudLightning size={24} />
              </div>
            </div>
          </div>

          {/* Controls Card (Filters) */}
          <div className="smsReports-controlsCard">
            <div className="smsReports-filterLabel">
              <FileText size={16} /> Filter by Hazard:
            </div>
            <div className="smsReports-filterButtons">
              {["all", "tsunami", "tide", "storm", "flooding"].map((f) => (
                <button
                  key={f}
                  className={`smsReports-filterBtn ${
                    filter === f ? "smsReports-active" : ""
                  }`}
                  onClick={() => setFilter(f)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)} Reports
                </button>
              ))}
            </div>
          </div>

          {/* Reports List */}
          <div className="smsReports-reportsSection">
            {reports.length === 0 ? (
              <div className="smsReports-emptyState">
                <MessageSquare size={48} className="smsReports-emptyIcon" />
                <h3>No SMS Reports Found</h3>
                <p>No SMS reports match your current filter criteria.</p>
              </div>
            ) : (
              <div className="smsReports-reportsGrid">
                {reports.map((report) => (
                  <div key={report._id} className="smsReports-reportCard">
                    <div className="smsReports-reportHeader">
                      <div className="smsReports-headerTop">
                        <span
                          className={`smsReports-badge ${getHazardTypeClass(
                            report.hazardType
                          )}`}
                        >
                          {report.hazardType}
                        </span>
                        <span className="smsReports-sourceBadge">
                          <Smartphone size={12} style={{ marginRight: 4 }} />
                          {report.source || "SMS"}
                        </span>
                      </div>
                      <div className="smsReports-timestamp">
                        <Clock size={14} style={{ marginRight: 4 }} />
                        {formatDate(report.createdAt)}
                      </div>
                    </div>

                    <div className="smsReports-reportContent">
                      <div className="smsReports-infoRow">
                        <User size={16} className="smsReports-infoIcon" />
                        <span className="smsReports-infoText strong">
                          {report.reporterName}
                        </span>
                      </div>

                      <div className="smsReports-infoRow">
                        <MapPin size={16} className="smsReports-infoIcon" />
                        <span className="smsReports-infoText">
                          {report.location}
                        </span>
                      </div>

                      <div className="smsReports-descriptionBox">
                        <p className="smsReports-description">
                          {report.description}
                        </p>
                      </div>

                      {report.isProcessed && (
                        <div
                          style={{
                            marginTop: "12px",
                            padding: "8px 12px",
                            background: "#ecfdf5",
                            border: "1px solid #a7f3d0",
                            borderRadius: "6px",
                            fontSize: "0.8rem",
                            color: "#059669",
                            fontWeight: 600,
                          }}
                        >
                          ✓ Processed
                        </div>
                      )}
                    </div>
                    {/* 
                    <div className="smsReports-reportActions">
                      <button
                        className="smsReports-actionBtn smsReports-primary"
                        onClick={() => handleViewDetails(report)}
                      >
                        View Details
                      </button>
                      <button
                        className="smsReports-actionBtn smsReports-secondary"
                        onClick={() => handleCreateAlert(report._id)}
                        disabled={report.isProcessed}
                        style={{
                          opacity: report.isProcessed ? 0.6 : 1,
                          cursor: report.isProcessed
                            ? "not-allowed"
                            : "pointer",
                        }}
                      >
                        {report.isProcessed ? "Processed" : "Create Alert"}
                      </button>
                    </div> */}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SmsReports;
