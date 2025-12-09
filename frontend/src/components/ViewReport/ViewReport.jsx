// "use client";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   Search,
//   Filter,
//   Calendar,
//   MapPin,
//   User,
//   Image,
//   CheckCircle,
//   Hourglass,
//   Eye,
//   Check,
//   X,
//   Tag,
//   AlertTriangle,
//   FileText,
//   Activity,
//   ChevronDown,
//   ChevronUp,
//   Download,
//   MapPinned,
//   Phone,
//   Mail,
// } from "lucide-react";
// import "./ViewReport.css";

// const ViewReports = () => {
//   const [reports, setReports] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [filters, setFilters] = useState({
//     type: "",
//     urgency: "",
//     isVerified: "",
//     dateRange: "",
//     startDate: "",
//     endDate: "",
//   });
//   const [sortBy, setSortBy] = useState("-reportedAt");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedReport, setSelectedReport] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
//   const [showLocationModal, setShowLocationModal] = useState(false);
//   const [locationSearch, setLocationSearch] = useState("");
//   const [mapBounds, setMapBounds] = useState(null);
//   const [showRejectionModal, setShowRejectionModal] = useState(false);
//   const [rejectionReason, setRejectionReason] = useState("");
//   const [reportToReject, setReportToReject] = useState(null);
//   // Report types for filtering
//   const reportTypes = [
//     "Unusual Tides",
//     "Flooding",
//     "High Waves",
//     "Rip Currents",
//     "Coastal Erosion",
//     "Marine Debris",
//     "Oil Spill",
//     "Storm Surge",
//     "Tsunami Warning",
//     "Other",
//   ];
//   // Export to CSV
//   const exportToCSV = () => {
//     const headers = [
//       "ID",
//       "Type",
//       "Urgency",
//       "Description",
//       "Location (Lat, Lng)",
//       "Reporter Name",
//       "Reporter Email",
//       "Reported At",
//       "Verification Status",
//       "Rejection Reason",
//     ];

//     const rows = reports.map((report) => [
//       report._id,
//       report.type,
//       report.urgency,
//       report.description || "N/A",
//       `${report.location.coordinates[1]}, ${report.location.coordinates[0]}`,
//       report.reportedBy?.name || "Anonymous",
//       report.reportedBy?.email || "N/A",
//       formatDate(report.reportedAt),
//       report.isVerified ? "Verified" : "Pending",
//       report.rejectionReason || "N/A",
//     ]);

//     let csvContent = headers.join(",") + "\n";
//     rows.forEach((row) => {
//       csvContent += row.map((cell) => `"${cell}"`).join(",") + "\n";
//     });

//     const blob = new Blob([csvContent], { type: "text/csv" });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `reports_${new Date().toISOString().split("T")[0]}.csv`;
//     a.click();
//     window.URL.revokeObjectURL(url);
//   };

//   // Export to PDF (using browser print)
//   const exportToPDF = () => {
//     const printWindow = window.open("", "_blank");
//     const styles = `
//     <style>
//       body { font-family: Arial, sans-serif; padding: 20px; }
//       table { width: 100%; border-collapse: collapse; margin-top: 20px; }
//       th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
//       th { background-color: #0077b6; color: white; }
//       h1 { color: #0077b6; }
//       .status-verified { color: green; font-weight: bold; }
//       .status-pending { color: orange; font-weight: bold; }
//     </style>
//   `;

//     const tableRows = reports
//       .map(
//         (report) => `
//     <tr>
//       <td>${report._id}</td>
//       <td>${report.type}</td>
//       <td>${report.urgency}</td>
//       <td>${report.description?.substring(0, 50) || "N/A"}...</td>
//       <td>${report.reportedBy?.name || "Anonymous"}</td>
//       <td>${formatDate(report.reportedAt)}</td>
//       <td class="status-${report.isVerified ? "verified" : "pending"}">
//         ${report.isVerified ? "Verified" : "Pending"}
//       </td>
//     </tr>
//   `
//       )
//       .join("");

//     printWindow.document.write(`
//     <!DOCTYPE html>
//     <html>
//       <head>
//         <title>WaveWatch Reports - ${new Date().toLocaleDateString()}</title>
//         ${styles}
//       </head>
//       <body>
//         <h1>WaveWatch Incident Reports</h1>
//         <p>Generated on: ${new Date().toLocaleString()}</p>
//         <p>Total Reports: ${reports.length}</p>
//         <table>
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Type</th>
//               <th>Urgency</th>
//               <th>Description</th>
//               <th>Reporter</th>
//               <th>Date</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${tableRows}
//           </tbody>
//         </table>
//       </body>
//     </html>
//   `);

//     printWindow.document.close();
//     setTimeout(() => {
//       printWindow.print();
//     }, 250);
//   };

//   // Handle location search
//   const handleLocationSearch = async () => {
//     if (!locationSearch.trim()) {
//       setError("Please enter a location to search");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       // Call your backend endpoint which handles geocoding
//       const response = await axios.get(
//         `http://localhost:3000/reports/location`,
//         {
//           params: {
//             placeName: locationSearch,
//             radiusKm: 50, // Search within 50km radius
//           },
//         }
//       );

//       if (response.data && response.data.success) {
//         setReports(response.data.reports);
//         setShowLocationModal(false);
//         setLocationSearch("");

//         // Show success message with location info
//         if (response.data.reports.length === 0) {
//           setError(
//             `No reports found near "${response.data.location.name}" within 50km radius.`
//           );
//         } else {
//           // Optional: You could show a success message
//           console.log(
//             `Found ${response.data.count} reports near ${response.data.location.name}`
//           );
//         }
//       } else {
//         setError("Location not found. Please try another search term.");
//       }
//     } catch (err) {
//       if (err.response && err.response.status === 404) {
//         setError(
//           "Location not found. Please try a different search term (e.g., 'Jaipur', 'Mumbai Beach', 'Chennai Marina')."
//         );
//       } else {
//         setError("Failed to search location. Please try again.");
//       }
//       console.error("Location search error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle rejection with reason
//   const openRejectionModal = (report) => {
//     setReportToReject(report);
//     setRejectionReason("");
//     setShowRejectionModal(true);
//   };

//   const handleRejectReport = async () => {
//     if (!rejectionReason.trim()) {
//       setError("Please provide a reason for rejection");
//       return;
//     }

//     try {
//       const response = await axios.patch(
//         `http://localhost:3000/reports/reject/${reportToReject._id}`,
//         {
//           rejectionReason: rejectionReason,
//         }
//       );

//       if (response.data.success) {
//         // Update local state
//         setReports((prevReports) =>
//           prevReports.map((report) =>
//             report._id === reportToReject._id
//               ? {
//                   ...report,
//                   isVerified: false,
//                   rejectionReason: rejectionReason,
//                 }
//               : report
//           )
//         );

//         // Update modal if open
//         if (selectedReport && selectedReport._id === reportToReject._id) {
//           setSelectedReport((prev) => ({
//             ...prev,
//             isVerified: false,
//             rejectionReason: rejectionReason,
//           }));
//         }

//         setShowRejectionModal(false);
//         setReportToReject(null);
//         setRejectionReason("");
//         setError("");
//       }
//     } catch (err) {
//       setError("Failed to reject report.");
//       console.error("Error rejecting report:", err);
//     }
//   };
//   // Fetch reports from API
//   const fetchReports = async () => {
//     try {
//       setLoading(true);
//       const queryParams = new URLSearchParams();

//       // Add filters
//       Object.keys(filters).forEach((key) => {
//         if (filters[key] && key !== "dateRange") {
//           queryParams.append(key, filters[key]);
//         }
//       });

//       // Add sorting
//       if (sortBy) {
//         queryParams.append("sort", sortBy);
//       }

//       const response = await axios.get(
//         `http://localhost:3000/reports?${queryParams.toString()}`
//       );

//       if (response.data && response.data.reports) {
//         setReports(response.data.reports);
//       }
//       setError("");
//     } catch (err) {
//       setError("Failed to fetch reports. Please try again.");
//       console.error("Error fetching reports:", err);
//     } finally {
//       setLoading(false);
//     }
//   };
//   // Updated toggleVerification function
//   const toggleVerification = async (reportId, currentStatus) => {
//     // If trying to unverify (reject), open rejection modal
//     if (currentStatus === true) {
//       const report = reports.find((r) => r._id === reportId);
//       if (report) {
//         openRejectionModal(report);
//       }
//       return;
//     }

//     // If verifying (was pending), proceed directly
//     try {
//       const response = await axios.patch(
//         `http://localhost:3000/reports/verify/${reportId}/`,
//         {
//           isVerified: true,
//         }
//       );

//       if (response.data.success) {
//         setReports((prevReports) =>
//           prevReports.map((report) =>
//             report._id === reportId
//               ? { ...report, isVerified: true, rejectionReason: null }
//               : report
//           )
//         );

//         if (selectedReport && selectedReport._id === reportId) {
//           setSelectedReport((prev) => ({
//             ...prev,
//             isVerified: true,
//             rejectionReason: null,
//           }));
//         }
//       }
//     } catch (err) {
//       setError("Failed to update verification status.");
//       console.error("Error updating verification:", err);
//     }
//   };

//   // Handle filter changes
//   const handleFilterChange = (filterType, value) => {
//     setFilters((prev) => {
//       const newFilters = {
//         ...prev,
//         [filterType]: value,
//       };

//       // Handle date range presets
//       if (filterType === "dateRange") {
//         const now = new Date();
//         switch (value) {
//           case "24h":
//             newFilters.startDate = new Date(
//               now.getTime() - 24 * 60 * 60 * 1000
//             ).toISOString();
//             newFilters.endDate = now.toISOString();
//             break;
//           case "7d":
//             newFilters.startDate = new Date(
//               now.getTime() - 7 * 24 * 60 * 60 * 1000
//             ).toISOString();
//             newFilters.endDate = now.toISOString();
//             break;
//           case "30d":
//             newFilters.startDate = new Date(
//               now.getTime() - 30 * 24 * 60 * 60 * 1000
//             ).toISOString();
//             newFilters.endDate = now.toISOString();
//             break;
//           case "custom":
//             // Keep existing dates for custom
//             break;
//           default:
//             newFilters.startDate = "";
//             newFilters.endDate = "";
//         }
//       }

//       return newFilters;
//     });
//     setCurrentPage(1);
//   };

//   // Handle sort change
//   const handleSortChange = (value) => {
//     setSortBy(value);
//     setCurrentPage(1);
//   };

//   // Reset filters
//   const resetFilters = () => {
//     setFilters({
//       type: "",
//       urgency: "",
//       isVerified: "",
//       dateRange: "",
//       startDate: "",
//       endDate: "",
//     });
//     setSortBy("-reportedAt");
//     setCurrentPage(1);
//   };

//   // Open modal
//   const openModal = (report) => {
//     setSelectedReport(report);
//     setShowModal(true);
//   };

//   // Close modal
//   const closeModal = () => {
//     setShowModal(false);
//     setSelectedReport(null);
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   // Get urgency class
//   const getUrgencyClass = (urgency) => {
//     if (!urgency) return "";
//     switch (urgency.toLowerCase()) {
//       case "high":
//         return "view-reports-comp-urgency-high";
//       case "medium":
//         return "view-reports-comp-urgency-medium";
//       case "low":
//         return "view-reports-comp-urgency-low";
//       default:
//         return "";
//     }
//   };

//   // Load reports on component mount and filter/sort changes
//   useEffect(() => {
//     fetchReports();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [filters, sortBy]);

//   // Initialize Leaflet map
//   useEffect(() => {
//     if (showModal && selectedReport) {
//       // Dynamically load Leaflet CSS and JS
//       const loadLeaflet = async () => {
//         // Load CSS
//         if (!document.getElementById("leaflet-css")) {
//           const link = document.createElement("link");
//           link.id = "leaflet-css";
//           link.rel = "stylesheet";
//           link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
//           document.head.appendChild(link);
//         }

//         // Load JS
//         if (!window.L) {
//           const script = document.createElement("script");
//           script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
//           script.onload = () => initMap();
//           document.head.appendChild(script);
//         } else {
//           initMap();
//         }
//       };

//       const initMap = () => {
//         setTimeout(() => {
//           const mapContainer = document.getElementById("report-map");
//           if (mapContainer && window.L) {
//             // Clear existing map
//             mapContainer.innerHTML = "";

//             const lat = selectedReport.location.coordinates[1];
//             const lng = selectedReport.location.coordinates[0];

//             const map = window.L.map("report-map").setView([lat, lng], 13);

//             window.L.tileLayer(
//               "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
//               {
//                 attribution: "© OpenStreetMap contributors",
//               }
//             ).addTo(map);

//             // Custom marker icon
//             const customIcon = window.L.divIcon({
//               className: "custom-map-marker",
//               html: '<div style="background-color: #ef4444; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>',
//               iconSize: [30, 30],
//               iconAnchor: [15, 15],
//             });

//             window.L.marker([lat, lng], { icon: customIcon })
//               .addTo(map)
//               .bindPopup(
//                 `<b>${
//                   selectedReport.type
//                 }</b><br>${selectedReport.description?.substring(0, 50)}...`
//               )
//               .openPopup();
//           }
//         }, 100);
//       };

//       loadLeaflet();
//     }
//   }, [showModal, selectedReport]);

//   if (loading) {
//     return (
//       <div className="view-reports-comp-main-container">
//         <div className="view-reports-comp-loading-spinner">
//           <div className="view-reports-comp-spinner"></div>
//           <p>Loading WaveWatch Reports...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="view-reports-comp-main-container">
//       <div className="view-reports-comp-header">
//         <div className="view-reports-comp-header-content">
//           <h1>Reports Management</h1>
//           <p>Manage and verify incident reports from coastal communities</p>
//         </div>
//       </div>

//       {error && (
//         <div className="view-reports-comp-error-message">
//           <span>
//             <AlertTriangle size={16} style={{ marginRight: 8 }} />
//             {error}
//           </span>
//           <button onClick={() => setError("")}>
//             <X size={18} />
//           </button>
//         </div>
//       )}

//       {/* Stats Section - Dashboard Style Cards */}
//       <div className="view-reports-comp-stats-container">
//         <div className="view-reports-comp-stat-card">
//           <div className="stat-info">
//             <span className="stat-label">Total Reports</span>
//             <span className="stat-number">{reports.length}</span>
//           </div>
//           <div className="stat-icon-wrapper blue">
//             <FileText size={24} />
//           </div>
//         </div>

//         <div className="view-reports-comp-stat-card">
//           <div className="stat-info">
//             <span className="stat-label">Verified</span>
//             <span className="stat-number">
//               {reports.filter((r) => r.isVerified).length}
//             </span>
//           </div>
//           <div className="stat-icon-wrapper green">
//             <CheckCircle size={24} />
//           </div>
//         </div>

//         <div className="view-reports-comp-stat-card">
//           <div className="stat-info">
//             <span className="stat-label">Pending</span>
//             <span className="stat-number">
//               {reports.filter((r) => !r.isVerified).length}
//             </span>
//           </div>
//           <div className="stat-icon-wrapper orange">
//             <Activity size={24} />
//           </div>
//         </div>
//       </div>
//       {/* Export Options */}
//       <div className="view-reports-comp-export-section">
//         <button
//           onClick={() => setShowLocationModal(true)}
//           className="export-btn export-location"
//         >
//           <MapPinned size={16} />
//           Filter by Location
//         </button>

//         {/* Separator will appear here via CSS */}

//         <button onClick={exportToCSV} className="export-btn export-csv">
//           <Download size={16} />
//           Export CSV
//         </button>
//         <button onClick={exportToPDF} className="export-btn export-pdf">
//           <Download size={16} />
//           Export PDF
//         </button>

//         <button
//           onClick={() => {
//             fetchReports();
//             setLocationSearch("");
//           }}
//           className="export-btn export-reset"
//         >
//           <X size={16} />
//           Reset View
//         </button>
//       </div>
//       {/* Filters and Controls */}
//       <div className="view-reports-comp-controls">
//         <div className="view-reports-comp-filters-section">
//           <div className="view-reports-comp-filter-group">
//             <label>
//               <Tag size={14} style={{ marginRight: 8 }} />
//               Report Type
//             </label>
//             <select
//               value={filters.type}
//               onChange={(e) => handleFilterChange("type", e.target.value)}
//             >
//               <option value="">All Types</option>
//               {reportTypes.map((type) => (
//                 <option key={type} value={type}>
//                   {type}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="view-reports-comp-filter-group">
//             <label>
//               <Filter size={14} style={{ marginRight: 8 }} />
//               Urgency
//             </label>
//             <select
//               value={filters.urgency}
//               onChange={(e) => handleFilterChange("urgency", e.target.value)}
//             >
//               <option value="">All Levels</option>
//               <option value="High">High</option>
//               <option value="Medium">Medium</option>
//               <option value="Low">Low</option>
//             </select>
//           </div>

//           <div className="view-reports-comp-filter-group">
//             <label>
//               <CheckCircle size={14} style={{ marginRight: 8 }} />
//               Status
//             </label>
//             <select
//               value={filters.isVerified}
//               onChange={(e) => handleFilterChange("isVerified", e.target.value)}
//             >
//               <option value="">All Status</option>
//               <option value="true">Verified</option>
//               <option value="false">Pending</option>
//             </select>
//           </div>

//           <div className="view-reports-comp-filter-group">
//             <label>
//               <Calendar size={14} style={{ marginRight: 8 }} />
//               Sort by
//             </label>
//             <select
//               value={sortBy}
//               onChange={(e) => handleSortChange(e.target.value)}
//             >
//               <option value="-reportedAt">Newest First</option>
//               <option value="reportedAt">Oldest First</option>
//               <option value="-urgency">Urgency: High → Low</option>
//               <option value="urgency">Urgency: Low → High</option>
//               <option value="type">Type (A-Z)</option>
//               <option value="isVerified">Verification Status</option>
//             </select>
//           </div>
//         </div>

//         {/* Advanced Filters Toggle */}
//         <div className="view-reports-comp-advanced-toggle">
//           <button
//             onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
//             className="advanced-filter-btn"
//           >
//             {showAdvancedFilters ? (
//               <>
//                 <ChevronUp size={16} />
//                 Hide Advanced Filters
//               </>
//             ) : (
//               <>
//                 <ChevronDown size={16} />
//                 Show Advanced Filters
//               </>
//             )}
//           </button>
//           {(filters.type ||
//             filters.urgency ||
//             filters.isVerified ||
//             filters.dateRange) && (
//             <button onClick={resetFilters} className="clear-filters-btn">
//               <X size={16} />
//               Clear All Filters
//             </button>
//           )}
//         </div>

//         {/* Advanced Filters Panel */}
//         {showAdvancedFilters && (
//           <div className="view-reports-comp-advanced-filters">
//             <div className="view-reports-comp-filter-group">
//               <label>
//                 <Calendar size={14} style={{ marginRight: 8 }} />
//                 Date Range
//               </label>
//               <select
//                 value={filters.dateRange}
//                 onChange={(e) =>
//                   handleFilterChange("dateRange", e.target.value)
//                 }
//               >
//                 <option value="">All Time</option>
//                 <option value="24h">Last 24 Hours</option>
//                 <option value="7d">Last 7 Days</option>
//                 <option value="30d">Last 30 Days</option>
//                 <option value="custom">Custom Range</option>
//               </select>
//             </div>

//             {filters.dateRange === "custom" && (
//               <>
//                 <div className="view-reports-comp-filter-group">
//                   <label>Start Date</label>
//                   <input
//                     type="datetime-local"
//                     value={
//                       filters.startDate
//                         ? new Date(filters.startDate).toISOString().slice(0, 16)
//                         : ""
//                     }
//                     onChange={(e) =>
//                       handleFilterChange(
//                         "startDate",
//                         new Date(e.target.value).toISOString()
//                       )
//                     }
//                   />
//                 </div>

//                 <div className="view-reports-comp-filter-group">
//                   <label>End Date</label>
//                   <input
//                     type="datetime-local"
//                     value={
//                       filters.endDate
//                         ? new Date(filters.endDate).toISOString().slice(0, 16)
//                         : ""
//                     }
//                     onChange={(e) =>
//                       handleFilterChange(
//                         "endDate",
//                         new Date(e.target.value).toISOString()
//                       )
//                     }
//                   />
//                 </div>
//               </>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Reports Grid */}
//       {reports.length === 0 ? (
//         <div className="view-reports-comp-no-reports">
//           <FileText size={48} style={{ opacity: 0.2, marginBottom: 16 }} />
//           <p>No reports found matching your criteria.</p>
//           <button onClick={resetFilters} className="view-reports-comp-view-btn">
//             Clear Filters
//           </button>
//         </div>
//       ) : (
//         <div className="view-reports-comp-grid">
//           {reports.map((report) => (
//             <div key={report._id} className="view-reports-comp-card">
//               <div className="view-reports-comp-card-header">
//                 <div className="view-reports-comp-header-top">
//                   <div className="view-reports-comp-type">
//                     <Tag
//                       size={12}
//                       style={{ verticalAlign: "middle", marginRight: 6 }}
//                     />
//                     {report.type}
//                   </div>
//                   <div
//                     className={`view-reports-comp-urgency-badge ${getUrgencyClass(
//                       report.urgency
//                     )}`}
//                   >
//                     {report.urgency}
//                   </div>
//                 </div>
//                 <div className="view-reports-comp-date">
//                   {formatDate(report.reportedAt)}
//                 </div>
//               </div>

//               <div className="view-reports-comp-content">
//                 <p className="view-reports-comp-description">
//                   {report.description?.substring(0, 80)}
//                   {report.description?.length > 80 && "..."}
//                 </p>

//                 <div className="view-reports-comp-meta">
//                   <div className="view-reports-comp-location">
//                     <MapPin
//                       size={14}
//                       style={{ marginRight: 6, verticalAlign: "middle" }}
//                     />
//                     {report.location.coordinates[1].toFixed(4)},{" "}
//                     {report.location.coordinates[0].toFixed(4)}
//                   </div>
//                   {report.reportedBy && (
//                     <div className="view-reports-comp-user">
//                       <User
//                         size={14}
//                         style={{ marginRight: 6, verticalAlign: "middle" }}
//                       />
//                       {report.reportedBy.name}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="view-reports-comp-footer">
//                 <div className="media-preview">
//                   {report.mediaUrl && report.mediaUrl.length > 0 ? (
//                     <span className="media-badge">
//                       <Image size={12} style={{ marginRight: 4 }} />
//                       {report.mediaUrl.length} Media
//                     </span>
//                   ) : (
//                     <span className="no-media">No Media</span>
//                   )}
//                 </div>

//                 <div
//                   className={`status-indicator ${
//                     report.isVerified ? "verified" : "pending"
//                   }`}
//                 >
//                   {report.isVerified ? "Verified" : "Pending"}
//                 </div>
//               </div>

//               <div className="view-reports-comp-actions">
//                 <button
//                   className="view-reports-comp-view-btn"
//                   onClick={() => openModal(report)}
//                 >
//                   View Details
//                 </button>

//                 <button
//                   className={`view-reports-comp-verify-btn ${
//                     report.isVerified
//                       ? "view-reports-comp-unverify"
//                       : "view-reports-comp-verify"
//                   }`}
//                   onClick={() =>
//                     toggleVerification(report._id, report.isVerified)
//                   }
//                 >
//                   {report.isVerified ? <>Unverify</> : <>Verify</>}
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Modal for Report Details */}
//       {showModal && selectedReport && (
//         <div className="view-reports-comp-modal-overlay" onClick={closeModal}>
//           <div
//             className="view-reports-comp-modal-content"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="view-reports-comp-modal-header">
//               <div>
//                 <h2>Report Details</h2>
//                 <span className="modal-id">ID: {selectedReport._id}</span>
//               </div>
//               <button
//                 className="view-reports-comp-close-btn"
//                 onClick={closeModal}
//                 aria-label="Close"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="view-reports-comp-modal-body">
//               <div className="modal-status-bar">
//                 <div
//                   className={`modal-status-badge ${
//                     selectedReport.isVerified ? "verified" : "pending"
//                   }`}
//                 >
//                   {selectedReport.isVerified ? (
//                     <CheckCircle size={16} />
//                   ) : (
//                     <Hourglass size={16} />
//                   )}
//                   {selectedReport.isVerified
//                     ? "Verified Incident"
//                     : "Pending Verification"}
//                 </div>
//                 <div
//                   className={`modal-urgency-badge ${getUrgencyClass(
//                     selectedReport.urgency
//                   )}`}
//                 >
//                   {selectedReport.urgency} Urgency
//                 </div>
//               </div>
//               <div className="view-reports-comp-split-layout">
//                 <div className="view-reports-comp-detail-grid">
//                   <div className="view-reports-comp-detail-card">
//                     <h3>
//                       <FileText size={16} /> Description
//                     </h3>
//                     <p className="detail-text">
//                       {selectedReport.description || "No description provided"}
//                     </p>
//                   </div>

//                   <div className="view-reports-comp-detail-card">
//                     <h3>
//                       <Tag size={16} /> Details
//                     </h3>
//                     <div className="detail-row">
//                       <span>Type:</span>
//                       <strong>{selectedReport.type}</strong>
//                     </div>
//                     <div className="detail-row">
//                       <span>Date:</span>
//                       <strong>{formatDate(selectedReport.reportedAt)}</strong>
//                     </div>
//                     <div className="detail-row">
//                       <span>Location:</span>
//                       <strong>
//                         {selectedReport.location.coordinates[1].toFixed(5)},{" "}
//                         {selectedReport.location.coordinates[0].toFixed(5)}
//                       </strong>
//                     </div>
//                   </div>
//                   {selectedReport.reportedBy && (
//                     <div className="view-reports-comp-detail-card">
//                       <h3>
//                         <User size={16} /> Reporter Information
//                       </h3>
//                       <div className="detail-row">
//                         <span>Name:</span>
//                         <strong>{selectedReport.reportedBy.name}</strong>
//                       </div>
//                       <div className="detail-row">
//                         <span>
//                           <Mail
//                             size={14}
//                             style={{ marginRight: 4, verticalAlign: "middle" }}
//                           />
//                           Email:
//                         </span>
//                         <strong>
//                           <a href={`mailto:${selectedReport.reportedBy.email}`}>
//                             {selectedReport.reportedBy.email}
//                           </a>
//                         </strong>
//                       </div>
//                       {selectedReport.reportedBy.phone && (
//                         <div className="detail-row">
//                           <span>
//                             <Phone
//                               size={14}
//                               style={{
//                                 marginRight: 4,
//                                 verticalAlign: "middle",
//                               }}
//                             />
//                             Phone:
//                           </span>
//                           <strong>
//                             <a href={`tel:${selectedReport.reportedBy.phone}`}>
//                               {selectedReport.reportedBy.phone}
//                             </a>
//                           </strong>
//                         </div>
//                       )}
//                     </div>
//                   )}

//                   {/* Add Rejection Reason if exists */}
//                   {selectedReport.rejectionReason && (
//                     <div className="view-reports-comp-detail-card rejection-reason-display">
//                       <h3>
//                         <AlertTriangle size={16} /> Rejection Reason
//                       </h3>
//                       <p className="detail-text rejection-text">
//                         {selectedReport.rejectionReason}
//                       </p>
//                       {selectedReport.rejectedAt && (
//                         <div className="detail-row">
//                           <span>Rejected At:</span>
//                           <strong>
//                             {formatDate(selectedReport.rejectedAt)}
//                           </strong>
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>

//                 {/* Map Section */}
//                 <div className="view-reports-comp-map-section">
//                   <h3>
//                     <MapPin size={16} style={{ marginRight: 8 }} />
//                     Incident Location
//                   </h3>
//                   <div id="report-map" className="report-map-container"></div>
//                 </div>
//               </div>
//               {selectedReport.mediaUrl &&
//                 selectedReport.mediaUrl.length > 0 && (
//                   <div className="view-reports-comp-media-section">
//                     <h3>
//                       <Image size={16} style={{ marginRight: 8 }} />
//                       Attached Media
//                     </h3>
//                     <div className="view-reports-comp-media-grid">
//                       {selectedReport.mediaUrl.map((url, index) => (
//                         <div
//                           key={index}
//                           className="view-reports-comp-media-item"
//                         >
//                           <img
//                             src={url || "/placeholder.svg"}
//                             alt={`Report media ${index + 1}`}
//                             onError={(e) => {
//                               e.target.style.display = "none";
//                             }}
//                           />
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//             </div>

//             <div className="view-reports-comp-modal-footer">
//               <button
//                 className={`view-reports-comp-verify-btn large ${
//                   selectedReport.isVerified
//                     ? "view-reports-comp-unverify"
//                     : "view-reports-comp-verify"
//                 }`}
//                 onClick={() =>
//                   toggleVerification(
//                     selectedReport._id,
//                     selectedReport.isVerified
//                   )
//                 }
//               >
//                 {selectedReport.isVerified ? (
//                   <>
//                     <X size={16} style={{ marginRight: 8 }} />
//                     Revoke Verification
//                   </>
//                 ) : (
//                   <>
//                     <Check size={16} style={{ marginRight: 8 }} />
//                     Verify Incident
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//       {/* Location Filter Modal */}
//       {showLocationModal && (
//         <div
//           className="view-reports-comp-modal-overlay"
//           onClick={() => setShowLocationModal(false)}
//         >
//           <div
//             className="view-reports-comp-modal-content location-modal"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="view-reports-comp-modal-header">
//               <div>
//                 <h2>Filter by Location</h2>
//                 <span className="modal-id">Search by place name or city</span>
//               </div>
//               <button
//                 className="view-reports-comp-close-btn"
//                 onClick={() => setShowLocationModal(false)}
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="view-reports-comp-modal-body">
//               <div className="location-search-container">
//                 <label>
//                   <MapPin size={16} style={{ marginRight: 8 }} />
//                   Enter Location
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="e.g., Jaipur, Mumbai, Chennai..."
//                   value={locationSearch}
//                   onChange={(e) => setLocationSearch(e.target.value)}
//                   onKeyPress={(e) => {
//                     if (e.key === "Enter") {
//                       handleLocationSearch();
//                     }
//                   }}
//                   className="location-search-input"
//                 />
//                 <button
//                   onClick={handleLocationSearch}
//                   className="location-search-btn"
//                 >
//                   <Search size={16} />
//                   Search Location
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Rejection Reason Modal */}
//       {showRejectionModal && reportToReject && (
//         <div
//           className="view-reports-comp-modal-overlay"
//           onClick={() => setShowRejectionModal(false)}
//         >
//           <div
//             className="view-reports-comp-modal-content rejection-modal"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="view-reports-comp-modal-header">
//               <div>
//                 <h2>Reject Report</h2>
//                 <span className="modal-id">
//                   Provide a reason for rejecting this report
//                 </span>
//               </div>
//               <button
//                 className="view-reports-comp-close-btn"
//                 onClick={() => setShowRejectionModal(false)}
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="view-reports-comp-modal-body">
//               <div className="rejection-info">
//                 <div className="rejection-report-info">
//                   <p>
//                     <strong>Report Type:</strong> {reportToReject.type}
//                   </p>
//                   <p>
//                     <strong>Urgency:</strong> {reportToReject.urgency}
//                   </p>
//                   <p>
//                     <strong>Description:</strong>{" "}
//                     {reportToReject.description?.substring(0, 100)}...
//                   </p>
//                 </div>
//               </div>

//               <div className="rejection-reason-container">
//                 <label>
//                   <FileText size={16} style={{ marginRight: 8 }} />
//                   Reason for Rejection *
//                 </label>
//                 <textarea
//                   placeholder="Please provide a detailed reason for rejecting this report..."
//                   value={rejectionReason}
//                   onChange={(e) => setRejectionReason(e.target.value)}
//                   className="rejection-reason-textarea"
//                   rows={5}
//                 />
//               </div>
//             </div>

//             <div className="view-reports-comp-modal-footer">
//               <button
//                 onClick={() => setShowRejectionModal(false)}
//                 className="cancel-rejection-btn"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleRejectReport}
//                 className="confirm-rejection-btn"
//                 disabled={!rejectionReason.trim()}
//               >
//                 <X size={16} style={{ marginRight: 8 }} />
//                 Reject Report
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ViewReports;

//---------------------------------------------------NEW CODE------------------------------------------------------------------------------
"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  User,
  Image,
  CheckCircle,
  Hourglass,
  Eye,
  Check,
  X,
  Tag,
  AlertTriangle,
  FileText,
  Activity,
  ChevronDown,
  ChevronUp,
  Download,
  MapPinned,
  Phone,
  Mail,
} from "lucide-react";
import "./ViewReport.css";

const ViewReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    type: "",
    urgency: "",
    isVerified: "",
    dateRange: "",
    startDate: "",
    endDate: "",
  });
  const [sortBy, setSortBy] = useState("-reportedAt");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");
  const [mapBounds, setMapBounds] = useState(null);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [reportToReject, setReportToReject] = useState(null);
  const [zoomImage, setZoomImage] = useState(null);
  const [showImageZoom, setShowImageZoom] = useState(false);
  const [nearbySocialMedia, setNearbySocialMedia] = useState([]);
  const [socialMediaLoading, setSocialMediaLoading] = useState(false);
  const [socialMediaError, setSocialMediaError] = useState("");
  // Report types for filtering
  const reportTypes = [
    "Unusual Tides",
    "Flooding",
    "High Waves",
    "Rip Currents",
    "Coastal Erosion",
    "Marine Debris",
    "Oil Spill",
    "Storm Surge",
    "Tsunami Warning",
    "Other",
  ];
  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      "ID",
      "Type",
      "Urgency",
      "Description",
      "Location (Lat, Lng)",
      "Reporter Name",
      "Reporter Email",
      "Reported At",
      "Verification Status",
      "Rejection Reason",
    ];

    const rows = reports.map((report) => [
      report._id,
      report.type,
      report.urgency,
      report.description || "N/A",
      `${report.location.coordinates[1]}, ${report.location.coordinates[0]}`,
      report.reportedBy?.name || "Anonymous",
      report.reportedBy?.email || "N/A",
      formatDate(report.reportedAt),
      report.isVerified ? "Verified" : "Pending",
      report.rejectionReason || "N/A",
    ]);

    let csvContent = headers.join(",") + "\n";
    rows.forEach((row) => {
      csvContent += row.map((cell) => `"${cell}"`).join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reports_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Export to PDF (using browser print)
  const exportToPDF = () => {
    const printWindow = window.open("", "_blank");
    const styles = `
    <style>
      body { font-family: Arial, sans-serif; padding: 20px; }
      table { width: 100%; border-collapse: collapse; margin-top: 20px; }
      th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
      th { background-color: #0077b6; color: white; }
      h1 { color: #0077b6; }
      .status-verified { color: green; font-weight: bold; }
      .status-pending { color: orange; font-weight: bold; }
    </style>
  `;

    const tableRows = reports
      .map(
        (report) => `
    <tr>
      <td>${report._id}</td>
      <td>${report.type}</td>
      <td>${report.urgency}</td>
      <td>${report.description?.substring(0, 50) || "N/A"}...</td>
      <td>${report.reportedBy?.name || "Anonymous"}</td>
      <td>${formatDate(report.reportedAt)}</td>
      <td class="status-${report.isVerified ? "verified" : "pending"}">
        ${report.isVerified ? "Verified" : "Pending"}
      </td>
    </tr>
  `
      )
      .join("");

    printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>WaveWatch Reports - ${new Date().toLocaleDateString()}</title>
        ${styles}
      </head>
      <body>
        <h1>WaveWatch Incident Reports</h1>
        <p>Generated on: ${new Date().toLocaleString()}</p>
        <p>Total Reports: ${reports.length}</p>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Urgency</th>
              <th>Description</th>
              <th>Reporter</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </body>
    </html>
  `);

    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  // Handle location search
  const handleLocationSearch = async () => {
    if (!locationSearch.trim()) {
      setError("Please enter a location to search");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Call your backend endpoint which handles geocoding
      const response = await axios.get(
        `http://localhost:3000/reports/location`,
        {
          params: {
            placeName: locationSearch,
            radiusKm: 50, // Search within 50km radius
          },
        }
      );

      if (response.data && response.data.success) {
        setReports(response.data.reports);
        setShowLocationModal(false);
        setLocationSearch("");

        // Show success message with location info
        if (response.data.reports.length === 0) {
          setError(
            `No reports found near "${response.data.location.name}" within 50km radius.`
          );
        } else {
          // Optional: You could show a success message
          console.log(
            `Found ${response.data.count} reports near ${response.data.location.name}`
          );
        }
      } else {
        setError("Location not found. Please try another search term.");
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError(
          "Location not found. Please try a different search term (e.g., 'Jaipur', 'Mumbai Beach', 'Chennai Marina')."
        );
      } else {
        setError("Failed to search location. Please try again.");
      }
      console.error("Location search error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle rejection with reason
  const openRejectionModal = (report) => {
    setReportToReject(report);
    setRejectionReason("");
    setShowRejectionModal(true);
  };

  const handleRejectReport = async () => {
    if (!rejectionReason.trim()) {
      setError("Please provide a reason for rejection");
      return;
    }

    try {
      const response = await axios.patch(
        `http://localhost:3000/reports/reject/${reportToReject._id}`,
        {
          rejectionReason: rejectionReason,
        }
      );

      if (response.data.success) {
        // Update local state
        setReports((prevReports) =>
          prevReports.map((report) =>
            report._id === reportToReject._id
              ? {
                  ...report,
                  isVerified: false,
                  rejectionReason: rejectionReason,
                }
              : report
          )
        );

        // Update modal if open
        if (selectedReport && selectedReport._id === reportToReject._id) {
          setSelectedReport((prev) => ({
            ...prev,
            isVerified: false,
            rejectionReason: rejectionReason,
          }));
        }

        setShowRejectionModal(false);
        setReportToReject(null);
        setRejectionReason("");
        setError("");
      }
    } catch (err) {
      setError("Failed to reject report.");
      console.error("Error rejecting report:", err);
    }
  };
  // Fetch reports from API
  const fetchReports = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();

      // Add filters
      Object.keys(filters).forEach((key) => {
        if (filters[key] && key !== "dateRange") {
          queryParams.append(key, filters[key]);
        }
      });

      // Add sorting
      if (sortBy) {
        queryParams.append("sort", sortBy);
      }

      const response = await axios.get(
        `http://localhost:3000/reports?${queryParams.toString()}`
      );

      if (response.data && response.data.reports) {
        setReports(response.data.reports);
      }
      setError("");
    } catch (err) {
      setError("Failed to fetch reports. Please try again.");
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  };
  // Updated toggleVerification function
  const toggleVerification = async (reportId, currentStatus) => {
    // If trying to unverify (reject), open rejection modal
    if (currentStatus === true) {
      const report = reports.find((r) => r._id === reportId);
      if (report) {
        openRejectionModal(report);
      }
      return;
    }

    // If verifying (was pending), proceed directly
    try {
      const response = await axios.patch(
        `http://localhost:3000/reports/verify/${reportId}/`,
        {
          isVerified: true,
        }
      );

      if (response.data.success) {
        setReports((prevReports) =>
          prevReports.map((report) =>
            report._id === reportId
              ? { ...report, isVerified: true, rejectionReason: null }
              : report
          )
        );

        if (selectedReport && selectedReport._id === reportId) {
          setSelectedReport((prev) => ({
            ...prev,
            isVerified: true,
            rejectionReason: null,
          }));
        }
      }
    } catch (err) {
      setError("Failed to update verification status.");
      console.error("Error updating verification:", err);
    }
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => {
      const newFilters = {
        ...prev,
        [filterType]: value,
      };

      // Handle date range presets
      if (filterType === "dateRange") {
        const now = new Date();
        switch (value) {
          case "24h":
            newFilters.startDate = new Date(
              now.getTime() - 24 * 60 * 60 * 1000
            ).toISOString();
            newFilters.endDate = now.toISOString();
            break;
          case "7d":
            newFilters.startDate = new Date(
              now.getTime() - 7 * 24 * 60 * 60 * 1000
            ).toISOString();
            newFilters.endDate = now.toISOString();
            break;
          case "30d":
            newFilters.startDate = new Date(
              now.getTime() - 30 * 24 * 60 * 60 * 1000
            ).toISOString();
            newFilters.endDate = now.toISOString();
            break;
          case "custom":
            // Keep existing dates for custom
            break;
          default:
            newFilters.startDate = "";
            newFilters.endDate = "";
        }
      }

      return newFilters;
    });
    setCurrentPage(1);
  };

  // Handle sort change
  const handleSortChange = (value) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      type: "",
      urgency: "",
      isVerified: "",
      dateRange: "",
      startDate: "",
      endDate: "",
    });
    setSortBy("-reportedAt");
    setCurrentPage(1);
  };

  // Open modal
  const openModal = (report) => {
    setSelectedReport(report);
    setShowModal(true);
    // Fetch nearby social media posts
    fetchNearbySocialMedia(report._id);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedReport(null);
    setNearbySocialMedia([]); // Clear social media posts
    setSocialMediaError("");
  };
  // Fetch nearby social media posts when modal opens
  const fetchNearbySocialMedia = async (reportId) => {
    setSocialMediaLoading(true);
    setSocialMediaError("");

    try {
      const response = await axios.get(
        `http://localhost:3000/reports/${reportId}/nearby-social`,
        {
          params: {
            radiusKm: 50, // 50km radius
          },
        }
      );

      if (response.data && response.data.success) {
        setNearbySocialMedia(response.data.nearbySocialMedia || []);
      }
    } catch (err) {
      console.error("Error fetching nearby social media:", err);
      setSocialMediaError("Failed to load nearby social media posts");
    } finally {
      setSocialMediaLoading(false);
    }
  };

  // Format social media date
  const formatSocialMediaDate = (dateString) => {
    if (!dateString) return "Unknown date";

    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get urgency class
  const getUrgencyClass = (urgency) => {
    if (!urgency) return "";
    switch (urgency.toLowerCase()) {
      case "high":
        return "view-reports-comp-urgency-high";
      case "medium":
        return "view-reports-comp-urgency-medium";
      case "low":
        return "view-reports-comp-urgency-low";
      default:
        return "";
    }
  };

  // Load reports on component mount and filter/sort changes
  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sortBy]);

  // Initialize Leaflet map
  useEffect(() => {
    if (showModal && selectedReport) {
      // Dynamically load Leaflet CSS and JS
      const loadLeaflet = async () => {
        // Load CSS
        if (!document.getElementById("leaflet-css")) {
          const link = document.createElement("link");
          link.id = "leaflet-css";
          link.rel = "stylesheet";
          link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
          document.head.appendChild(link);
        }

        // Load JS
        if (!window.L) {
          const script = document.createElement("script");
          script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
          script.onload = () => initMap();
          document.head.appendChild(script);
        } else {
          initMap();
        }
      };

      const initMap = () => {
        setTimeout(() => {
          const mapContainer = document.getElementById("report-map");
          if (mapContainer && window.L) {
            // Clear existing map
            mapContainer.innerHTML = "";

            const lat = selectedReport.location.coordinates[1];
            const lng = selectedReport.location.coordinates[0];

            const map = window.L.map("report-map").setView([lat, lng], 13);

            window.L.tileLayer(
              "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
              {
                attribution: "© OpenStreetMap contributors",
              }
            ).addTo(map);

            // Custom marker icon
            const customIcon = window.L.divIcon({
              className: "view-reports-comp-custom-map-marker",
              html: '<div style="background-color: #ef4444; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>',
              iconSize: [30, 30],
              iconAnchor: [15, 15],
            });

            window.L.marker([lat, lng], { icon: customIcon })
              .addTo(map)
              .bindPopup(
                `<b>${
                  selectedReport.type
                }</b><br>${selectedReport.description?.substring(0, 50)}...`
              )
              .openPopup();

            // Invalidate size to ensure it renders correctly in the new layout
            map.invalidateSize();
          }
        }, 300); // Increased timeout slightly to ensure DOM is ready
      };

      loadLeaflet();
    }
  }, [showModal, selectedReport]);
  // Open image zoom modal
  const openImageZoom = (imageUrl) => {
    setZoomImage(imageUrl);
    setShowImageZoom(true);
  };

  // Close image zoom modal
  const closeImageZoom = () => {
    setShowImageZoom(false);
    setZoomImage(null);
  };

  // Check if URL is a video
  const isVideoUrl = (url) => {
    const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".avi"];
    return videoExtensions.some((ext) => url.toLowerCase().includes(ext));
  };
  if (loading) {
    return (
      <div className="view-reports-comp-main-container">
        <div className="view-reports-comp-loading-spinner">
          <div className="view-reports-comp-spinner"></div>
          <p>Loading WaveWatch Reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="view-reports-comp-main-container">
      <div className="view-reports-comp-header">
        <div className="view-reports-comp-header-content">
          <h1>Reports Management</h1>
          <p>Manage and verify incident reports from coastal communities</p>
        </div>
      </div>

      {error && (
        <div className="view-reports-comp-error-message">
          <span>
            <AlertTriangle size={16} style={{ marginRight: 8 }} />
            {error}
          </span>
          <button onClick={() => setError("")}>
            <X size={18} />
          </button>
        </div>
      )}

      {/* Stats Section - Dashboard Style Cards */}
      <div className="view-reports-comp-stats-container">
        <div className="view-reports-comp-stat-card">
          <div className="view-reports-comp-stat-info">
            <span className="view-reports-comp-stat-label">Total Reports</span>
            <span className="view-reports-comp-stat-number">
              {reports.length}
            </span>
          </div>
          <div className="view-reports-comp-stat-icon-wrapper blue">
            <FileText size={24} />
          </div>
        </div>

        <div className="view-reports-comp-stat-card">
          <div className="view-reports-comp-stat-info">
            <span className="view-reports-comp-stat-label">Verified</span>
            <span className="view-reports-comp-stat-number">
              {reports.filter((r) => r.isVerified).length}
            </span>
          </div>
          <div className="view-reports-comp-stat-icon-wrapper green">
            <CheckCircle size={24} />
          </div>
        </div>

        <div className="view-reports-comp-stat-card">
          <div className="view-reports-comp-stat-info">
            <span className="view-reports-comp-stat-label">Pending</span>
            <span className="view-reports-comp-stat-number">
              {reports.filter((r) => !r.isVerified).length}
            </span>
          </div>
          <div className="view-reports-comp-stat-icon-wrapper orange">
            <Activity size={24} />
          </div>
        </div>
      </div>
      {/* Export Options */}
      <div className="view-reports-comp-export-section">
        <button
          onClick={() => setShowLocationModal(true)}
          className="view-reports-comp-export-btn view-reports-comp-export-location"
        >
          <MapPinned size={16} />
          Filter by Location
        </button>

        {/* Separator will appear here via CSS */}

        <button
          onClick={exportToCSV}
          className="view-reports-comp-export-btn view-reports-comp-export-csv"
        >
          <Download size={16} />
          Export CSV
        </button>
        <button
          onClick={exportToPDF}
          className="view-reports-comp-export-btn view-reports-comp-export-pdf"
        >
          <Download size={16} />
          Export PDF
        </button>

        <button
          onClick={() => {
            fetchReports();
            setLocationSearch("");
          }}
          className="view-reports-comp-export-btn view-reports-comp-export-reset"
        >
          <X size={16} />
          Reset View
        </button>
      </div>
      {/* Filters and Controls */}
      <div className="view-reports-comp-controls">
        <div className="view-reports-comp-filters-section">
          <div className="view-reports-comp-filter-group">
            <label>
              <Tag size={14} style={{ marginRight: 8 }} />
              Report Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange("type", e.target.value)}
            >
              <option value="">All Types</option>
              {reportTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="view-reports-comp-filter-group">
            <label>
              <Filter size={14} style={{ marginRight: 8 }} />
              Urgency
            </label>
            <select
              value={filters.urgency}
              onChange={(e) => handleFilterChange("urgency", e.target.value)}
            >
              <option value="">All Levels</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="view-reports-comp-filter-group">
            <label>
              <CheckCircle size={14} style={{ marginRight: 8 }} />
              Status
            </label>
            <select
              value={filters.isVerified}
              onChange={(e) => handleFilterChange("isVerified", e.target.value)}
            >
              <option value="">All Status</option>
              <option value="true">Verified</option>
              <option value="false">Pending</option>
            </select>
          </div>

          <div className="view-reports-comp-filter-group">
            <label>
              <Calendar size={14} style={{ marginRight: 8 }} />
              Sort by
            </label>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="-reportedAt">Newest First</option>
              <option value="reportedAt">Oldest First</option>
              <option value="-urgency">Urgency: High → Low</option>
              <option value="urgency">Urgency: Low → High</option>
              <option value="type">Type (A-Z)</option>
              <option value="isVerified">Verification Status</option>
            </select>
          </div>
        </div>

        {/* Advanced Filters Toggle */}
        <div className="view-reports-comp-advanced-toggle">
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="view-reports-comp-advanced-filter-btn"
          >
            {showAdvancedFilters ? (
              <>
                <ChevronUp size={16} />
                Hide Advanced Filters
              </>
            ) : (
              <>
                <ChevronDown size={16} />
                Show Advanced Filters
              </>
            )}
          </button>
          {(filters.type ||
            filters.urgency ||
            filters.isVerified ||
            filters.dateRange) && (
            <button
              onClick={resetFilters}
              className="view-reports-comp-clear-filters-btn"
            >
              <X size={16} />
              Clear All Filters
            </button>
          )}
        </div>

        {/* Advanced Filters Panel */}
        {showAdvancedFilters && (
          <div className="view-reports-comp-advanced-filters">
            <div className="view-reports-comp-filter-group">
              <label>
                <Calendar size={14} style={{ marginRight: 8 }} />
                Date Range
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) =>
                  handleFilterChange("dateRange", e.target.value)
                }
              >
                <option value="">All Time</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            {filters.dateRange === "custom" && (
              <>
                <div className="view-reports-comp-filter-group">
                  <label>Start Date</label>
                  <input
                    type="datetime-local"
                    value={
                      filters.startDate
                        ? new Date(filters.startDate).toISOString().slice(0, 16)
                        : ""
                    }
                    onChange={(e) =>
                      handleFilterChange(
                        "startDate",
                        new Date(e.target.value).toISOString()
                      )
                    }
                  />
                </div>

                <div className="view-reports-comp-filter-group">
                  <label>End Date</label>
                  <input
                    type="datetime-local"
                    value={
                      filters.endDate
                        ? new Date(filters.endDate).toISOString().slice(0, 16)
                        : ""
                    }
                    onChange={(e) =>
                      handleFilterChange(
                        "endDate",
                        new Date(e.target.value).toISOString()
                      )
                    }
                  />
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Reports Grid */}
      {reports.length === 0 ? (
        <div className="view-reports-comp-no-reports">
          <FileText size={48} style={{ opacity: 0.2, marginBottom: 16 }} />
          <p>No reports found matching your criteria.</p>
          <button onClick={resetFilters} className="view-reports-comp-view-btn">
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="view-reports-comp-grid">
          {reports.map((report) => (
            <div key={report._id} className="view-reports-comp-card">
              <div className="view-reports-comp-card-header">
                <div className="view-reports-comp-header-top">
                  <div className="view-reports-comp-type">
                    <Tag
                      size={12}
                      style={{ verticalAlign: "middle", marginRight: 6 }}
                    />
                    {report.type}
                  </div>
                  <div
                    className={`view-reports-comp-urgency-badge ${getUrgencyClass(
                      report.urgency
                    )}`}
                  >
                    {report.urgency}
                  </div>
                </div>
                <div className="view-reports-comp-date">
                  {formatDate(report.reportedAt)}
                </div>
              </div>

              <div className="view-reports-comp-content">
                <p className="view-reports-comp-description">
                  {report.description?.substring(0, 80)}
                  {report.description?.length > 80 && "..."}
                </p>

                <div className="view-reports-comp-meta">
                  <div className="view-reports-comp-location">
                    <MapPin
                      size={14}
                      style={{ marginRight: 6, verticalAlign: "middle" }}
                    />
                    {report.location.coordinates[1].toFixed(4)},{" "}
                    {report.location.coordinates[0].toFixed(4)}
                  </div>
                  {report.reportedBy && (
                    <div className="view-reports-comp-user">
                      <User
                        size={14}
                        style={{ marginRight: 6, verticalAlign: "middle" }}
                      />
                      {report.reportedBy.name}
                    </div>
                  )}
                </div>
              </div>

              <div className="view-reports-comp-footer">
                <div className="view-reports-comp-media-preview">
                  {report.mediaUrl && report.mediaUrl.length > 0 ? (
                    <span className="view-reports-comp-media-badge">
                      <Image size={12} style={{ marginRight: 4 }} />
                      {report.mediaUrl.length} Media
                    </span>
                  ) : (
                    <span className="view-reports-comp-no-media">No Media</span>
                  )}
                </div>

                <div
                  className={`view-reports-comp-status-indicator ${
                    report.isVerified ? "verified" : "pending"
                  }`}
                >
                  {report.isVerified ? "Verified" : "Pending"}
                </div>
              </div>

              <div className="view-reports-comp-actions">
                <button
                  className="view-reports-comp-view-btn"
                  onClick={() => openModal(report)}
                >
                  View Details
                </button>

                <button
                  className={`view-reports-comp-verify-btn ${
                    report.isVerified
                      ? "view-reports-comp-unverify"
                      : "view-reports-comp-verify"
                  }`}
                  onClick={() =>
                    toggleVerification(report._id, report.isVerified)
                  }
                >
                  {report.isVerified ? <>Unverify</> : <>Verify</>}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Report Details */}
      {showModal && selectedReport && (
        <div className="view-reports-comp-modal-overlay" onClick={closeModal}>
          <div
            className="view-reports-comp-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="view-reports-comp-modal-header">
              <div>
                <h2>Report Details</h2>
                <span className="view-reports-comp-modal-id">
                  ID: {selectedReport._id}
                </span>
              </div>
              <button
                className="view-reports-comp-close-btn"
                onClick={closeModal}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="view-reports-comp-modal-body">
              <div className="view-reports-comp-modal-status-bar">
                <div
                  className={`view-reports-comp-modal-status-badge ${
                    selectedReport.isVerified ? "verified" : "pending"
                  }`}
                >
                  {selectedReport.isVerified ? (
                    <CheckCircle size={16} />
                  ) : (
                    <Hourglass size={16} />
                  )}
                  {selectedReport.isVerified
                    ? "Verified Incident"
                    : "Pending Verification"}
                </div>
                <div
                  className={`view-reports-comp-modal-urgency-badge ${getUrgencyClass(
                    selectedReport.urgency
                  )}`}
                >
                  {selectedReport.urgency} Urgency
                </div>
              </div>

              {/* START SPLIT LAYOUT */}
              <div className="view-reports-comp-split-layout">
                {/* LEFT COLUMN: Details Grid + Attached Media */}
                <div className="view-reports-comp-left-column">
                  {/* LEFT COLUMN - CONTENT 1: Details Cards */}
                  <div className="view-reports-comp-detail-grid">
                    <div className="view-reports-comp-detail-card">
                      <h3>
                        <FileText size={16} /> Description
                      </h3>
                      <p className="view-reports-comp-detail-text">
                        {selectedReport.description ||
                          "No description provided"}
                      </p>
                    </div>

                    <div className="view-reports-comp-detail-card">
                      <h3>
                        <Tag size={16} /> Details
                      </h3>
                      <div className="view-reports-comp-detail-row">
                        <span>Type:</span>
                        <strong>{selectedReport.type}</strong>
                      </div>
                      <div className="view-reports-comp-detail-row">
                        <span>Date:</span>
                        <strong>{formatDate(selectedReport.reportedAt)}</strong>
                      </div>
                      <div className="view-reports-comp-detail-row">
                        <span>Location:</span>
                        <strong>
                          {selectedReport.location.coordinates[1].toFixed(5)},{" "}
                          {selectedReport.location.coordinates[0].toFixed(5)}
                        </strong>
                      </div>
                    </div>
                    {selectedReport.reportedBy && (
                      <div className="view-reports-comp-detail-card">
                        <h3>
                          <User size={16} /> Reporter Information
                        </h3>
                        <div className="view-reports-comp-detail-row">
                          <span>Name:</span>
                          <strong>{selectedReport.reportedBy.name}</strong>
                        </div>
                        <div className="view-reports-comp-detail-row">
                          <span>
                            <Mail
                              size={14}
                              style={{
                                marginRight: 4,
                                verticalAlign: "middle",
                              }}
                            />
                            Email:
                          </span>
                          <strong>
                            <a
                              href={`mailto:${selectedReport.reportedBy.email}`}
                            >
                              {selectedReport.reportedBy.email}
                            </a>
                          </strong>
                        </div>
                        {selectedReport.reportedBy.phone && (
                          <div className="view-reports-comp-detail-row">
                            <span>
                              <Phone
                                size={14}
                                style={{
                                  marginRight: 4,
                                  verticalAlign: "middle",
                                }}
                              />
                              Phone:
                            </span>
                            <strong>
                              <a
                                href={`tel:${selectedReport.reportedBy.phone}`}
                              >
                                {selectedReport.reportedBy.phone}
                              </a>
                            </strong>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Add Rejection Reason if exists */}
                    {selectedReport.rejectionReason && (
                      <div className="view-reports-comp-detail-card view-reports-comp-rejection-reason-display">
                        <h3>
                          <AlertTriangle size={16} /> Rejection Reason
                        </h3>
                        <p className="view-reports-comp-detail-text view-reports-comp-rejection-text">
                          {selectedReport.rejectionReason}
                        </p>
                        {selectedReport.rejectedAt && (
                          <div className="view-reports-comp-detail-row">
                            <span>Rejected At:</span>
                            <strong>
                              {formatDate(selectedReport.rejectedAt)}
                            </strong>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* LEFT COLUMN - CONTENT 2: Attached Media */}
                  {selectedReport.mediaUrl &&
                    selectedReport.mediaUrl.length > 0 && (
                      <div className="view-reports-comp-media-section">
                        <h3>
                          <Image size={16} style={{ marginRight: 8 }} />
                          Attached Media ({selectedReport.mediaUrl.length})
                        </h3>
                        <div className="view-reports-comp-media-grid">
                          {selectedReport.mediaUrl.map((url, index) => (
                            <div
                              key={index}
                              className="view-reports-comp-media-item"
                            >
                              {isVideoUrl(url) ? (
                                <div className="view-reports-comp-video-wrapper">
                                  <video
                                    controls
                                    className="view-reports-comp-media-video"
                                    onError={(e) => {
                                      e.target.style.display = "none";
                                    }}
                                  >
                                    <source src={url} />
                                    Your browser does not support the video tag.
                                  </video>
                                </div>
                              ) : (
                                <div
                                  className="view-reports-comp-image-wrapper"
                                  onClick={() => openImageZoom(url)}
                                >
                                  <img
                                    src={url || "/placeholder.svg"}
                                    alt={`Report media ${index + 1}`}
                                    onError={(e) => {
                                      e.target.style.display = "none";
                                    }}
                                  />
                                  <div className="view-reports-comp-zoom-overlay">
                                    <Eye size={20} />
                                    <span>Click to zoom</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>

                {/* RIGHT COLUMN: Map Section + Social Media */}
                <div className="view-reports-comp-right-column">
                  {/* RIGHT COLUMN - CONTENT 1: Map Section */}
                  <div className="view-reports-comp-map-section">
                    <h3>
                      <MapPin size={16} style={{ marginRight: 8 }} />
                      Incident Location
                    </h3>
                    <div
                      id="report-map"
                      className="view-reports-comp-report-map-container"
                    ></div>
                  </div>

                  {/* RIGHT COLUMN - CONTENT 2: Nearby Social Media Section */}
                  <div className="view-reports-comp-social-media-section">
                    <h3>
                      <Activity size={16} style={{ marginRight: 8 }} />
                      Nearby Social Media (50km)
                    </h3>

                    {socialMediaLoading ? (
                      <div className="view-reports-comp-social-loading">
                        <div
                          className="view-reports-comp-spinner"
                          style={{
                            width: "24px",
                            height: "24px",
                            margin: "0 auto 8px",
                          }}
                        ></div>
                        Loading nearby posts...
                      </div>
                    ) : socialMediaError ? (
                      <div className="view-reports-comp-social-error">
                        {socialMediaError}
                      </div>
                    ) : nearbySocialMedia.length === 0 ? (
                      <div className="view-reports-comp-no-social-posts">
                        <Activity
                          size={32}
                          style={{ opacity: 0.2, marginBottom: 8 }}
                        />
                        <p>No social posts nearby</p>
                      </div>
                    ) : (
                      <div className="view-reports-comp-social-posts-container">
                        {nearbySocialMedia.map((post, index) => (
                          <div
                            key={post._id || index}
                            className="view-reports-comp-social-post-card"
                          >
                            <div className="view-reports-comp-social-post-header">
                              <div className="view-reports-comp-social-subreddit">
                                <Tag size={10} />
                                r/{post.subreddit || "unknown"}
                              </div>
                              <div className="view-reports-comp-social-date">
                                {formatSocialMediaDate(post.date)}
                              </div>
                            </div>

                            <p className="view-reports-comp-social-post-text">
                              {post.text || "No text available"}
                            </p>

                            <div className="view-reports-comp-social-post-footer">
                              <span
                                className={`view-reports-comp-flood-badge ${
                                  post.flood_label === 1 ? "flood" : "non-flood"
                                }`}
                              >
                                {post.flood_label === 1
                                  ? "Flood Related"
                                  : "Non-Flood"}
                              </span>

                              {post.url && (
                                <a
                                  href={post.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="view-reports-comp-social-link"
                                >
                                  View Post
                                  <Eye size={12} />
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* END SPLIT LAYOUT */}
            </div>

            <div className="view-reports-comp-modal-footer">
              <button
                className={`view-reports-comp-verify-btn large ${
                  selectedReport.isVerified
                    ? "view-reports-comp-unverify"
                    : "view-reports-comp-verify"
                }`}
                onClick={() =>
                  toggleVerification(
                    selectedReport._id,
                    selectedReport.isVerified
                  )
                }
              >
                {selectedReport.isVerified ? (
                  <>
                    <X size={16} style={{ marginRight: 8 }} />
                    Revoke Verification
                  </>
                ) : (
                  <>
                    <Check size={16} style={{ marginRight: 8 }} />
                    Verify Incident
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Location Filter Modal */}
      {showLocationModal && (
        <div
          className="view-reports-comp-modal-overlay"
          onClick={() => setShowLocationModal(false)}
        >
          <div
            className="view-reports-comp-modal-content view-reports-comp-location-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="view-reports-comp-modal-header">
              <div>
                <h2>Filter by Location</h2>
                <span className="view-reports-comp-modal-id">
                  Search by place name or city
                </span>
              </div>
              <button
                className="view-reports-comp-close-btn"
                onClick={() => setShowLocationModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="view-reports-comp-modal-body">
              <div className="view-reports-comp-location-search-container">
                <label>
                  <MapPin size={16} style={{ marginRight: 8 }} />
                  Enter Location
                </label>
                <input
                  type="text"
                  placeholder="e.g., Jaipur, Mumbai, Chennai..."
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleLocationSearch();
                    }
                  }}
                  className="view-reports-comp-location-search-input"
                />
                <button
                  onClick={handleLocationSearch}
                  className="view-reports-comp-location-search-btn"
                >
                  <Search size={16} />
                  Search Location
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Reason Modal */}
      {showRejectionModal && reportToReject && (
        <div
          className="view-reports-comp-modal-overlay"
          onClick={() => setShowRejectionModal(false)}
        >
          <div
            className="view-reports-comp-modal-content view-reports-comp-rejection-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="view-reports-comp-modal-header">
              <div>
                <h2>Reject Report</h2>
                <span className="view-reports-comp-modal-id">
                  Provide a reason for rejecting this report
                </span>
              </div>
              <button
                className="view-reports-comp-close-btn"
                onClick={() => setShowRejectionModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="view-reports-comp-modal-body">
              <div className="view-reports-comp-rejection-info">
                <div className="view-reports-comp-rejection-report-info">
                  <p>
                    <strong>Report Type:</strong> {reportToReject.type}
                  </p>
                  <p>
                    <strong>Urgency:</strong> {reportToReject.urgency}
                  </p>
                  <p>
                    <strong>Description:</strong>{" "}
                    {reportToReject.description?.substring(0, 100)}...
                  </p>
                </div>
              </div>

              <div className="view-reports-comp-rejection-reason-container">
                <label>
                  <FileText size={16} style={{ marginRight: 8 }} />
                  Reason for Rejection *
                </label>
                <textarea
                  placeholder="Please provide a detailed reason for rejecting this report..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="view-reports-comp-rejection-reason-textarea"
                  rows={5}
                />
              </div>
            </div>

            <div className="view-reports-comp-modal-footer">
              <button
                onClick={() => setShowRejectionModal(false)}
                className="view-reports-comp-cancel-rejection-btn"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectReport}
                className="view-reports-comp-confirm-rejection-btn"
                disabled={!rejectionReason.trim()}
              >
                <X size={16} style={{ marginRight: 8 }} />
                Reject Report
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Image Zoom Modal */}
      {showImageZoom && zoomImage && (
        <div
          className="view-reports-comp-zoom-modal-overlay"
          onClick={closeImageZoom}
        >
          <div className="view-reports-comp-zoom-modal-content">
            <button
              className="view-reports-comp-zoom-close-btn"
              onClick={closeImageZoom}
              aria-label="Close zoom"
            >
              <X size={24} />
            </button>
            <img
              src={zoomImage}
              alt="Zoomed view"
              className="view-reports-comp-zoomed-image"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewReports;
