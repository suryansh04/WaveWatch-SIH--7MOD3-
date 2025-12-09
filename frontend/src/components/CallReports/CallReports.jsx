// import React, { useState, useEffect } from "react";
// import {
//   Phone,
//   MapPin,
//   Clock,
//   AlertTriangle,
//   User,
//   FileText,
// } from "lucide-react";
// import "./CallReports.css";

// // If you want to override API base, define REACT_APP_API_URL in frontend .env
// const API_BASE = "http://localhost:3000/api/v1/callReports";

// const CallReports = () => {
//   const [reports, setReports] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [filter, setFilter] = useState("all");

//   // fetch from backend
//   const fetchReports = async (hazardType) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const url =
//         hazardType && hazardType !== "all"
//           ? `${API_BASE}/reports?hazardType=${encodeURIComponent(hazardType)}`
//           : `${API_BASE}/reports`;
//       const res = await fetch(url);
//       if (!res.ok) {
//         const body = await res.json().catch(() => ({}));
//         throw new Error(body.error || `HTTP ${res.status}`);
//       }
//       const json = await res.json();
//       setReports(json.data || []);
//     } catch (err) {
//       console.error("Fetch reports error:", err);
//       setError(err.message || "Failed to load reports");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // initial fetch & fetch on filter change
//   useEffect(() => {
//     // map simple filter keywords to hazard types stored in DB
//     const mapFilterToHazard = (f) => {
//       if (f === "tide") return "unusual tide";
//       if (f === "storm") return "storm surge";
//       if (f === "tsunami") return "tsunami";
//       if (f === "flooding") return "flooding";
//       return null;
//     };

//     const hazardType = mapFilterToHazard(filter);
//     fetchReports(hazardType);
//   }, [filter]);

//   const formatDate = (dateString) => {
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleString("en-US", {
//         year: "numeric",
//         month: "short",
//         day: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//       });
//     } catch {
//       return dateString || "-";
//     }
//   };

//   const getHazardTypeColor = (hazardType) => {
//     const colors = {
//       tsunami: "#dc2626",
//       "unusual tide": "#f59e0b",
//       "storm surge": "#7c3aed",
//       flooding: "#2563eb",
//       default: "#6b7280",
//     };
//     return colors[(hazardType || "").toLowerCase()] || colors.default;
//   };

//   const filteredReports = reports; // backend already filtered when requested

//   if (loading) {
//     return (
//       <div className="callReports-container">
//         <div className="callReports-loadingState">
//           <div className="callReports-loadingSpinner"></div>
//           <p>Loading call reports...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="callReports-container">
//         <div className="callReports-errorState">
//           <AlertTriangle size={48} />
//           <h3>Error Loading Reports</h3>
//           <p>{error}</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="callReports-container">
//       {/* Header */}
//       <div className="callReports-header">
//         <div className="callReports-headerContent">
//           <h1 className="callReports-pageTitle">Call Reports</h1>
//           <p className="callReports-pageSubtitle">
//             Monitor emergency reports received via phone calls
//           </p>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="callReports-statsCardsSection">
//         <div className="callReports-statsCard">
//           <div className="callReports-statsNumber">{reports.length}</div>
//           <div className="callReports-statsLabel">Total Reports</div>
//         </div>
//         <div className="callReports-statsCard">
//           <div className="callReports-statsNumber">
//             {reports.filter((r) => r.hazardType === "tsunami").length}
//           </div>
//           <div className="callReports-statsLabel">Tsunami Reports</div>
//         </div>
//         <div className="callReports-statsCard">
//           <div className="callReports-statsNumber">
//             {reports.filter((r) => r.hazardType === "unusual tide").length}
//           </div>
//           <div className="callReports-statsLabel">Tide Reports</div>
//         </div>
//         <div className="callReports-statsCard">
//           <div className="callReports-statsNumber">
//             {reports.filter((r) => r.hazardType === "storm surge").length}
//           </div>
//           <div className="callReports-statsLabel">Storm Reports</div>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="callReports-filtersSection">
//         <div className="callReports-filterButtons">
//           <button
//             className={`callReports-filterBtn ${
//               filter === "all" ? "callReports-active" : ""
//             }`}
//             onClick={() => setFilter("all")}
//           >
//             All Reports
//           </button>
//           <button
//             className={`callReports-filterBtn ${
//               filter === "tsunami" ? "callReports-active" : ""
//             }`}
//             onClick={() => setFilter("tsunami")}
//           >
//             Tsunami
//           </button>
//           <button
//             className={`callReports-filterBtn ${
//               filter === "tide" ? "callReports-active" : ""
//             }`}
//             onClick={() => setFilter("tide")}
//           >
//             Tides
//           </button>
//           <button
//             className={`callReports-filterBtn ${
//               filter === "storm" ? "callReports-active" : ""
//             }`}
//             onClick={() => setFilter("storm")}
//           >
//             Storms
//           </button>
//           <button
//             className={`callReports-filterBtn ${
//               filter === "flooding" ? "callReports-active" : ""
//             }`}
//             onClick={() => setFilter("flooding")}
//           >
//             Flooding
//           </button>
//         </div>
//       </div>

//       {/* Reports List */}
//       <div className="callReports-reportsSection">
//         {filteredReports.length === 0 ? (
//           <div className="callReports-emptyState">
//             <Phone size={64} className="callReports-emptyIcon" />
//             <h3>No Call Reports Found</h3>
//             <p>No phone call reports match your current filter criteria.</p>
//           </div>
//         ) : (
//           <div className="callReports-reportsGrid">
//             {filteredReports.map((report) => (
//               <div key={report._id} className="callReports-reportCard">
//                 <div className="callReports-reportHeader">
//                   <div className="callReports-reportType">
//                     <div
//                       className="callReports-hazardIndicator"
//                       style={{
//                         backgroundColor: getHazardTypeColor(report.hazardType),
//                       }}
//                     />
//                     <span className="callReports-hazardType">
//                       {report.hazardType}
//                     </span>
//                   </div>
//                   <div className="callReports-reportSource">
//                     <Phone size={16} />
//                     <span>{report.source || "Phone Call"}</span>
//                   </div>
//                 </div>

//                 <div className="callReports-reportContent">
//                   <div className="callReports-reporterInfo">
//                     <User size={16} className="callReports-infoIcon" />
//                     <span className="callReports-reporterName">
//                       {report.reporterName}
//                     </span>
//                   </div>

//                   <div className="callReports-locationInfo">
//                     <MapPin size={16} className="callReports-infoIcon" />
//                     <span className="callReports-location">
//                       {report.location}
//                     </span>
//                   </div>

//                   <div className="callReports-descriptionSection">
//                     <FileText size={16} className="callReports-infoIcon" />
//                     <p className="callReports-description">
//                       {report.description}
//                     </p>
//                   </div>

//                   <div className="callReports-timestampInfo">
//                     <Clock size={16} className="callReports-infoIcon" />
//                     <span className="callReports-timestamp">
//                       {formatDate(report.createdAt)}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="callReports-reportActions">
//                   <button className="callReports-actionBtn callReports-primary">
//                     View Details
//                   </button>
//                   <button className="callReports-actionBtn callReports-secondary">
//                     Create Alert
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CallReports;

//--------------------------------------------------NEW CODE----------------------------------------------------------------------------------

import React, { useState, useEffect } from "react";
import {
  Phone,
  MapPin,
  Clock,
  AlertTriangle,
  User,
  FileText,
  Waves,
  CloudLightning,
  Droplets,
  Activity,
} from "lucide-react";

// If you want to override API base, define REACT_APP_API_URL in frontend .env
const API_BASE = "http://localhost:3000/api/v1/callReports";

const CallReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  // fetch from backend
  const fetchReports = async (hazardType) => {
    setLoading(true);
    setError(null);
    try {
      const url =
        hazardType && hazardType !== "all"
          ? `${API_BASE}/reports?hazardType=${encodeURIComponent(hazardType)}`
          : `${API_BASE}/reports`;
      const res = await fetch(url);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${res.status}`);
      }
      const json = await res.json();
      setReports(json.data || []);
    } catch (err) {
      console.error("Fetch reports error:", err);
      setError(err.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  // initial fetch & fetch on filter change
  useEffect(() => {
    // map simple filter keywords to hazard types stored in DB
    const mapFilterToHazard = (f) => {
      if (f === "tide") return "unusual tide";
      if (f === "storm") return "storm surge";
      if (f === "tsunami") return "tsunami";
      if (f === "flooding") return "flooding";
      return null;
    };

    const hazardType = mapFilterToHazard(filter);
    fetchReports(hazardType);
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
    if (type.includes("flooding")) return "badge-blue";
    return "badge-gray";
  };

  const filteredReports = reports; // backend already filtered when requested

  // Count helpers for stats
  const getCount = (type) =>
    reports.filter((r) => r.hazardType === type).length;

  return (
    <>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

        /* Main Container */
        .callReports-container {
          margin-left: 280px; /* Fixed sidebar width */
          padding: 30px 40px;
          min-height: 100vh;
          background-color: #f8fafc; /* Light slate bg */
          font-family: "Inter", sans-serif;
          color: #1e293b;
          box-sizing: border-box;
        }

        /* Header Section */
        .callReports-header {
          margin-bottom: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .callReports-pageTitle {
          font-size: 1.8rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 5px 0;
        }

        .callReports-pageSubtitle {
          font-size: 0.95rem;
          color: #64748b;
          margin: 0;
        }

        /* Stats Cards Section - Grid Layout */
        .callReports-statsCardsSection {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          margin-bottom: 32px;
        }

        .callReports-statCard {
          background: #ffffff;
          border-radius: 12px;
          padding: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
          border: 1px solid #e2e8f0;
        }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-label {
          color: #64748b;
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 4px;
        }

        .stat-number {
          color: #0f172a;
          font-size: 2rem;
          font-weight: 700;
          line-height: 1;
        }

        .stat-icon-wrapper {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-icon-wrapper.blue { background: #e0f2fe; color: #0077b6; }
        .stat-icon-wrapper.red { background: #fee2e2; color: #dc2626; }
        .stat-icon-wrapper.orange { background: #ffedd5; color: #ea580c; }
        .stat-icon-wrapper.purple { background: #f3e8ff; color: #7c3aed; }

        /* Controls Card (Filters) */
        .callReports-controlsCard {
          background: #ffffff;
          border-radius: 12px;
          padding: 20px 24px;
          margin-bottom: 32px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .callReports-filterLabel {
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: 600;
            color: #334155;
            font-size: 0.9rem;
        }

        .callReports-filterButtons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .callReports-filterBtn {
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          border: 1px solid transparent;
          background: transparent;
          color: #64748b;
          transition: all 0.2s ease;
        }

        .callReports-filterBtn:hover {
          background: #f1f5f9;
          color: #334155;
        }

        .callReports-filterBtn.callReports-active {
          background: #e0f2fe;
          color: #0077b6;
          border-color: #bae6fd;
        }

        /* Reports Grid */
        .callReports-reportsGrid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }

        .callReports-reportCard {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          transition: all 0.2s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .callReports-reportCard:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        /* Report Header */
        .callReports-reportHeader {
          padding: 20px 20px 16px 20px;
          border-bottom: 1px solid #f1f5f9;
        }

        .callReports-headerTop {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 12px;
        }

        .callReports-badge {
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .badge-red { background: #fef2f2; color: #ef4444; border: 1px solid #fecaca; }
        .badge-orange { background: #fff7ed; color: #f97316; border: 1px solid #fed7aa; }
        .badge-purple { background: #faf5ff; color: #9333ea; border: 1px solid #e9d5ff; }
        .badge-blue { background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; }
        .badge-gray { background: #f8fafc; color: #64748b; border: 1px solid #e2e8f0; }

        .callReports-sourceBadge {
            display: flex;
            align-items: center;
            font-size: 0.75rem;
            color: #64748b;
            background: #f1f5f9;
            padding: 4px 8px;
            border-radius: 6px;
            font-weight: 500;
        }

        .callReports-timestamp {
            display: flex;
            align-items: center;
            font-size: 0.8rem;
            color: #94a3b8;
        }

        /* Report Content */
        .callReports-reportContent {
          padding: 20px;
          flex-grow: 1;
        }

        .callReports-infoRow {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 8px;
        }

        .callReports-infoIcon {
            color: #94a3b8;
            flex-shrink: 0;
        }

        .callReports-infoText {
            font-size: 0.9rem;
            color: #475569;
        }

        .callReports-infoText.strong {
            color: #1e293b;
            font-weight: 600;
        }

        .callReports-descriptionBox {
            margin-top: 16px;
            background: #f8fafc;
            padding: 12px;
            border-radius: 8px;
            border: 1px solid #f1f5f9;
        }

        .callReports-description {
          font-size: 0.9rem;
          color: #334155;
          line-height: 1.5;
          margin: 0;
        }

        /* Actions */
        .callReports-reportActions {
          padding: 16px 20px;
          border-top: 1px solid #f1f5f9;
          display: flex;
          gap: 12px;
        }

        .callReports-actionBtn {
          flex: 1;
          padding: 10px;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .callReports-primary {
          background: white;
          border: 1px solid #cbd5e1;
          color: #475569;
        }

        .callReports-primary:hover {
          background: #f1f5f9;
          color: #1e293b;
          border-color: #94a3b8;
        }

        .callReports-secondary {
          background: #0077b6;
          color: white;
        }

        .callReports-secondary:hover {
          background: #005f8a;
        }

        /* Loading/Error/Empty States */
        .callReports-loadingState,
        .callReports-errorState {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px;
          color: #64748b;
        }

        .callReports-loadingSpinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e2e8f0;
          border-top: 3px solid #0077b6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }

        .callReports-emptyState {
          background: white;
          border-radius: 12px;
          padding: 60px 40px;
          text-align: center;
          border: 2px dashed #cbd5e1;
          color: #64748b;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .callReports-emptyIcon {
            opacity: 0.2;
            margin-bottom: 16px;
        }

        .callReports-emptyState h3 {
          margin: 0 0 8px 0;
          color: #334155;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .callReports-container { margin-left: 260px; width: calc(100% - 260px); }
        }

        @media (max-width: 1024px) {
          .callReports-container { margin-left: 0; width: 100%; padding: 20px; }
          .callReports-statsCardsSection { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 768px) {
          .callReports-statsCardsSection { grid-template-columns: 1fr; }
          .callReports-reportsGrid { grid-template-columns: 1fr; }
          .callReports-controlsCard { flex-direction: column; align-items: flex-start; }
          .callReports-filterButtons { width: 100%; overflow-x: auto; padding-bottom: 4px; }
        }
      `}</style>

      <div className="callReports-container">
        {/* Header */}
        <div className="callReports-header">
          <div className="callReports-headerContent">
            <h1 className="callReports-pageTitle">Call Reports</h1>
            <p className="callReports-pageSubtitle">
              Monitor emergency reports received via phone calls
            </p>
          </div>
        </div>

        {/* Stats Cards - Updated Layout */}
        {loading ? (
          <div className="callReports-loadingState">
            <div className="callReports-loadingSpinner"></div>
            <p>Loading call reports...</p>
          </div>
        ) : error ? (
          <div className="callReports-errorState">
            <AlertTriangle size={48} />
            <h3>Error Loading Reports</h3>
            <p>{error}</p>
          </div>
        ) : (
          <>
            <div className="callReports-statsCardsSection">
              <div className="callReports-statCard">
                <div className="stat-info">
                  <span className="stat-label">Total Reports</span>
                  <span className="stat-number">{reports.length}</span>
                </div>
                <div className="stat-icon-wrapper blue">
                  <Phone size={24} />
                </div>
              </div>

              <div className="callReports-statCard">
                <div className="stat-info">
                  <span className="stat-label">Tsunami</span>
                  <span className="stat-number">
                    {reports.filter((r) => r.hazardType === "tsunami").length}
                  </span>
                </div>
                <div className="stat-icon-wrapper red">
                  <Waves size={24} />
                </div>
              </div>

              <div className="callReports-statCard">
                <div className="stat-info">
                  <span className="stat-label">Tides</span>
                  <span className="stat-number">
                    {
                      reports.filter((r) => r.hazardType === "unusual tide")
                        .length
                    }
                  </span>
                </div>
                <div className="stat-icon-wrapper orange">
                  <Activity size={24} />
                </div>
              </div>

              <div className="callReports-statCard">
                <div className="stat-info">
                  <span className="stat-label">Storms</span>
                  <span className="stat-number">
                    {
                      reports.filter((r) => r.hazardType === "storm surge")
                        .length
                    }
                  </span>
                </div>
                <div className="stat-icon-wrapper purple">
                  <CloudLightning size={24} />
                </div>
              </div>
            </div>

            {/* Controls Card (Filters) */}
            <div className="callReports-controlsCard">
              <div className="callReports-filterLabel">
                <FileText size={16} /> Filter by Hazard:
              </div>
              <div className="callReports-filterButtons">
                {["all", "tsunami", "tide", "storm", "flooding"].map((f) => (
                  <button
                    key={f}
                    className={`callReports-filterBtn ${
                      filter === f ? "callReports-active" : ""
                    }`}
                    onClick={() => setFilter(f)}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)} Reports
                  </button>
                ))}
              </div>
            </div>

            {/* Reports List */}
            <div className="callReports-reportsSection">
              {filteredReports.length === 0 ? (
                <div className="callReports-emptyState">
                  <Phone size={48} className="callReports-emptyIcon" />
                  <h3>No Call Reports Found</h3>
                  <p>
                    No phone call reports match your current filter criteria.
                  </p>
                </div>
              ) : (
                <div className="callReports-reportsGrid">
                  {filteredReports.map((report) => (
                    <div key={report._id} className="callReports-reportCard">
                      <div className="callReports-reportHeader">
                        <div className="callReports-headerTop">
                          <span
                            className={`callReports-badge ${getHazardTypeClass(
                              report.hazardType
                            )}`}
                          >
                            {report.hazardType}
                          </span>
                          <span className="callReports-sourceBadge">
                            <Phone size={12} style={{ marginRight: 4 }} />
                            {report.source || "Phone Call"}
                          </span>
                        </div>
                        <div className="callReports-timestamp">
                          <Clock size={14} style={{ marginRight: 4 }} />
                          {formatDate(report.createdAt)}
                        </div>
                      </div>

                      <div className="callReports-reportContent">
                        <div className="callReports-infoRow">
                          <User size={16} className="callReports-infoIcon" />
                          <span className="callReports-infoText strong">
                            {report.reporterName}
                          </span>
                        </div>

                        <div className="callReports-infoRow">
                          <MapPin size={16} className="callReports-infoIcon" />
                          <span className="callReports-infoText">
                            {report.location}
                          </span>
                        </div>

                        <div className="callReports-descriptionBox">
                          <p className="callReports-description">
                            {report.description}
                          </p>
                        </div>
                      </div>

                      <div className="callReports-reportActions">
                        <button className="callReports-actionBtn callReports-primary">
                          View Details
                        </button>
                        <button className="callReports-actionBtn callReports-secondary">
                          Create Alert
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CallReports;
