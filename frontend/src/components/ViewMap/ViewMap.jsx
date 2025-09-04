// import React, { useState, useEffect, useRef } from "react";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import axios from "axios";
// import { MapPin, Filter, ChevronDown } from "lucide-react";
// import { DBSCAN } from "density-clustering";
// import "./ViewMap.css";

// // Fix for default markers in Leaflet
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
//   iconUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
//   shadowUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
// });

// const ViewMap = () => {
//   const mapRef = useRef(null);
//   const leafletMapRef = useRef(null);
//   const markersRef = useRef([]);
//   const hotspotsRef = useRef([]); // New: Store hotspot layers

//   const [reports, setReports] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [crowdReports, setCrowdReports] = useState(true);
//   const [socialMediaReports, setSocialMediaReports] = useState(true);
//   const [selectedFilter, setSelectedFilter] = useState("all");
//   const [showHotspots, setShowHotspots] = useState(true); // New: Toggle for hotspots

//   const urgencyColors = {
//     High: "#dc2626",
//     Medium: "#f59e0b",
//     Low: "#16a34a",
//   };

//   const reportTypeColors = {
//     Flooding: "#3b82f6",
//     "Unusual tides": "#8b5cf6",
//     "Coastal damage": "#ef4444",
//     Tsunami: "#dc2626",
//     "Swell surges": "#06b6d4",
//     "High waves": "#0891b2",
//     Fire: "#f97316",
//     Earthquake: "#7c2d12",
//     Storm: "#6b21a8",
//     Accident: "#374151",
//     Flood: "#1d4ed8",
//   };

//   const filterOptions = [
//     { value: "all", label: "All Reports" },
//     { value: "high", label: "High Urgency" },
//     { value: "medium", label: "Medium Urgency" },
//     { value: "low", label: "Low Urgency" },
//     { value: "flooding", label: "Flooding" },
//     { value: "tsunami", label: "Tsunami" },
//     { value: "coastal_damage", label: "Coastal Damage" },
//     { value: "unusual_tides", label: "Unusual Tides" },
//     { value: "swell_surges", label: "Swell Surges" },
//     { value: "high_waves", label: "High Waves" },
//   ];

//   // Fetch reports from API
//   const fetchReports = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get("http://localhost:3000/reports");
//       setReports(response.data.reports || []);
//       setError(null);
//     } catch (err) {
//       console.error("Error fetching reports:", err);
//       setError("Failed to fetch reports");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // New: Calculate distance between two lat/lng points (in kilometers)
//   const calculateDistance = (lat1, lon1, lat2, lon2) => {
//     const R = 6371; // Earth's radius in kilometers
//     const dLat = ((lat2 - lat1) * Math.PI) / 180;
//     const dLon = ((lon2 - lon1) * Math.PI) / 180;
//     const a =
//       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//       Math.cos((lat1 * Math.PI) / 180) *
//         Math.cos((lat2 * Math.PI) / 180) *
//         Math.sin(dLon / 2) *
//         Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     return R * c;
//   };

//   // New: Generate hotspots using DBSCAN
//   const generateHotspots = (filteredReports) => {
//     if (filteredReports.length < 3) return [];

//     // Prepare data for DBSCAN - convert to lat/lng coordinates
//     const points = filteredReports.map((report) => {
//       const [lng, lat] = report.location.coordinates;
//       return [lat, lng];
//     });

//     // Custom distance function for DBSCAN
//     const distanceFunction = (pointA, pointB) => {
//       return calculateDistance(pointA[0], pointA[1], pointB[0], pointB[1]);
//     };

//     // Initialize DBSCAN
//     const dbscan = new DBSCAN();

//     // Parameters:
//     // eps: 5km - reports within 5km are considered neighbors
//     // minPts: 3 - minimum 3 reports needed to form a hotspot
//     const clusters = dbscan.run(points, 5, 3, distanceFunction);

//     // Convert clusters to hotspot data
//     const hotspots = clusters.map((cluster, index) => {
//       const clusterReports = cluster.map(
//         (pointIndex) => filteredReports[pointIndex]
//       );

//       // Calculate centroid (center point) of the cluster
//       const centerLat =
//         cluster.reduce((sum, pointIndex) => sum + points[pointIndex][0], 0) /
//         cluster.length;
//       const centerLng =
//         cluster.reduce((sum, pointIndex) => sum + points[pointIndex][1], 0) /
//         cluster.length;

//       // Calculate hotspot intensity based on report count and urgency
//       const urgencyWeights = { High: 3, Medium: 2, Low: 1 };
//       const intensity = clusterReports.reduce(
//         (sum, report) => sum + (urgencyWeights[report.urgency] || 1),
//         0
//       );

//       // Count verified reports
//       const verifiedCount = clusterReports.filter((r) => r.isVerified).length;

//       return {
//         id: `hotspot-${index}`,
//         center: [centerLat, centerLng],
//         reports: clusterReports,
//         intensity,
//         verifiedCount,
//         reportCount: clusterReports.length,
//       };
//     });

//     return hotspots;
//   };

//   // New: Create hotspot visualization on map
//   const createHotspotLayer = (hotspot) => {
//     // Determine hotspot color and size based on intensity
//     const getHotspotStyle = (intensity) => {
//       if (intensity >= 8)
//         return { color: "#dc2626", fillColor: "#fca5a5", radius: 2000 }; // High intensity - Red
//       if (intensity >= 5)
//         return { color: "#f59e0b", fillColor: "#fbbf24", radius: 1500 }; // Medium intensity - Orange
//       return { color: "#eab308", fillColor: "#fde047", radius: 1000 }; // Low intensity - Yellow
//     };

//     const style = getHotspotStyle(hotspot.intensity);

//     // Create circle for hotspot area
//     const circle = L.circle(hotspot.center, {
//       color: style.color,
//       fillColor: style.fillColor,
//       fillOpacity: 0.3,
//       weight: 2,
//       radius: style.radius,
//     });

//     // Create popup content for hotspot
//     const popupContent = `
//       <div class="hotspot-popup">
//         <h3>🔥 Threat Hotspot</h3>
//         <div class="hotspot-stats">
//           <p><strong>Reports:</strong> ${hotspot.reportCount}</p>
//           <p><strong>Verified:</strong> ${hotspot.verifiedCount}</p>
//           <p><strong>Threat Level:</strong> ${
//             hotspot.intensity >= 8
//               ? "High"
//               : hotspot.intensity >= 5
//               ? "Medium"
//               : "Low"
//           }</p>
//         </div>
//         <div class="hotspot-report-types">
//           <strong>Report Types:</strong><br>
//           ${[...new Set(hotspot.reports.map((r) => r.type))].join(", ")}
//         </div>
//       </div>
//     `;

//     circle.bindPopup(popupContent);

//     return circle;
//   };

//   // Initialize map
//   useEffect(() => {
//     if (mapRef.current && !leafletMapRef.current) {
//       leafletMapRef.current = L.map(mapRef.current).setView(
//         [26.8419054, 75.5613303],
//         10
//       );

//       L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//         attribution: "© OpenStreetMap contributors",
//       }).addTo(leafletMapRef.current);
//     }

//     fetchReports();

//     return () => {
//       if (leafletMapRef.current) {
//         leafletMapRef.current.remove();
//         leafletMapRef.current = null;
//       }
//     };
//   }, []);

//   // Create custom marker icon
//   const createCustomIcon = (report) => {
//     const color = urgencyColors[report.urgency] || "#6b7280";

//     return L.divIcon({
//       html: `
//       <div class="pin-marker" style="color: ${color}">
//         <svg width="24" height="32" viewBox="0 0 24 32" fill="currentColor">
//           <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 20 12 20s12-11 12-20c0-6.627-5.373-12-12-12zm0 16c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z"/>
//         </svg>
//       </div>
//     `,
//       className: "custom-pin-icon",
//       iconSize: [24, 32],
//       iconAnchor: [12, 32],
//     });
//   };

//   // Filter reports based on toggles and dropdown
//   const getFilteredReports = () => {
//     let filtered = reports.filter((report) => {
//       const isCrowdReport = !report.socialMedia;
//       const isSocialMedia = report.socialMedia;

//       if (!crowdReports && isCrowdReport) return false;
//       if (!socialMediaReports && isSocialMedia) return false;

//       return true;
//     });

//     if (selectedFilter !== "all") {
//       filtered = filtered.filter((report) => {
//         switch (selectedFilter) {
//           case "high":
//           case "medium":
//           case "low":
//             return report.urgency.toLowerCase() === selectedFilter;
//           case "flooding":
//             return report.type.toLowerCase() === "flooding";
//           case "tsunami":
//             return report.type.toLowerCase() === "tsunami";
//           case "coastal_damage":
//             return report.type.toLowerCase() === "coastal damage";
//           case "unusual_tides":
//             return report.type.toLowerCase() === "unusual tides";
//           case "swell_surges":
//             return report.type.toLowerCase() === "swell surges";
//           case "high_waves":
//             return report.type.toLowerCase() === "high waves";
//           default:
//             return true;
//         }
//       });
//     }

//     return filtered;
//   };

//   // Update markers and hotspots on map
//   useEffect(() => {
//     if (!leafletMapRef.current) return;

//     // Clear existing markers and hotspots
//     markersRef.current.forEach((marker) => {
//       leafletMapRef.current.removeLayer(marker);
//     });
//     hotspotsRef.current.forEach((hotspot) => {
//       leafletMapRef.current.removeLayer(hotspot);
//     });
//     markersRef.current = [];
//     hotspotsRef.current = [];

//     const filteredReports = getFilteredReports();

//     // Generate and display hotspots
//     if (showHotspots) {
//       const hotspots = generateHotspots(filteredReports);
//       hotspots.forEach((hotspot) => {
//         const hotspotLayer = createHotspotLayer(hotspot);
//         hotspotLayer.addTo(leafletMapRef.current);
//         hotspotsRef.current.push(hotspotLayer);
//       });
//     }

//     // Add individual markers
//     filteredReports.forEach((report) => {
//       if (report.location && report.location.coordinates) {
//         const [lng, lat] = report.location.coordinates;
//         const marker = L.marker([lat, lng], {
//           icon: createCustomIcon(report),
//         });

//         const popupContent = `
//           <div class="marker-popup">
//             <h3>${report.type}</h3>
//             <p><strong>Urgency:</strong> <span class="urgency-${report.urgency.toLowerCase()}">${
//           report.urgency
//         }</span></p>
//             <p><strong>Description:</strong> ${
//               report.description || "No description available"
//             }</p>
//             <p><strong>Reported:</strong> ${new Date(
//               report.reportedAt
//             ).toLocaleString()}</p>
//             <p><strong>Verified:</strong> ${
//               report.isVerified ? "Yes" : "No"
//             }</p>
//             ${report.isSOS ? '<p class="sos-badge">SOS</p>' : ""}
//           </div>
//         `;

//         marker.bindPopup(popupContent);
//         marker.addTo(leafletMapRef.current);
//         markersRef.current.push(marker);
//       }
//     });
//   }, [reports, crowdReports, socialMediaReports, selectedFilter, showHotspots]);

//   return (
//     <div className="map-container">
//       {/* Map */}
//       <div className="map-wrapper">
//         {loading && (
//           <div className="loading-overlay">
//             <div className="loading-spinner"></div>
//             <p>Loading reports...</p>
//           </div>
//         )}

//         {error && (
//           <div className="error-overlay">
//             <p>Error: {error}</p>
//             <button onClick={fetchReports} className="retry-btn">
//               Retry
//             </button>
//           </div>
//         )}

//         {/* Top Right Controls Panel */}
//         <div className="controls-panel">
//           {/* Filter Dropdown */}
//           <div className="filter-section">
//             <div className="filter-dropdown">
//               <Filter className="filter-icon" />
//               <select
//                 value={selectedFilter}
//                 onChange={(e) => setSelectedFilter(e.target.value)}
//                 className="filter-select"
//               >
//                 {filterOptions.map((option) => (
//                   <option key={option.value} value={option.value}>
//                     {option.label}
//                   </option>
//                 ))}
//               </select>
//               <ChevronDown className="dropdown-arrow" />
//             </div>
//           </div>

//           {/* Toggle Controls */}
//           <div className="toggle-section">
//             {/* New: Hotspots Toggle */}
//             <div className="toggle-item">
//               <label className="toggle-switch">
//                 <input
//                   type="checkbox"
//                   checked={showHotspots}
//                   onChange={(e) => setShowHotspots(e.target.checked)}
//                 />
//                 <span className="slider"></span>
//               </label>
//               <span className="toggle-label">Threat Hotspots</span>
//               <div className="legend-indicator orange"></div>
//             </div>

//             <div className="toggle-item">
//               <label className="toggle-switch">
//                 <input
//                   type="checkbox"
//                   checked={crowdReports}
//                   onChange={(e) => setCrowdReports(e.target.checked)}
//                 />
//                 <span className="slider"></span>
//               </label>
//               <span className="toggle-label">Crowd Reports</span>
//               <div className="legend-indicator red"></div>
//             </div>

//             <div className="toggle-item">
//               <label className="toggle-switch">
//                 <input
//                   type="checkbox"
//                   checked={socialMediaReports}
//                   onChange={(e) => setSocialMediaReports(e.target.checked)}
//                 />
//                 <span className="slider"></span>
//               </label>
//               <span className="toggle-label">Social Media Reports</span>
//               <div className="legend-indicator blue"></div>
//             </div>
//           </div>

//           {/* Mini Legend */}
//           <div className="mini-legend">
//             <div className="legend-row">
//               <div className="legend-dot orange"></div>
//               <span>Threat Hotspots</span>
//             </div>
//             <div className="legend-row">
//               <div className="legend-dot red"></div>
//               <span>Crowd Reports</span>
//             </div>
//             <div className="legend-row">
//               <div className="legend-dot blue"></div>
//               <span>Social Media</span>
//             </div>
//             <div className="legend-row">
//               <div className="legend-dot pink"></div>
//               <span>Danger Zones</span>
//             </div>
//           </div>
//         </div>

//         <div ref={mapRef} className="leaflet-map"></div>
//       </div>
//     </div>
//   );
// };

// export default ViewMap;
//------------------------------------------------------NEW CODE ---------------------------------------------------------------------------------------
import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import {
  MapPin,
  Filter,
  ChevronDown,
  X,
  ExternalLink,
  Calendar,
  MapPin as LocationIcon,
  AlertTriangle,
  CheckCircle,
  User,
  Play,
} from "lucide-react";
import { DBSCAN } from "density-clustering";
import "./ViewMap.css";

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

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [crowdReports, setCrowdReports] = useState(true);
  const [socialMediaReports, setSocialMediaReports] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showHotspots, setShowHotspots] = useState(true);

  // New: Modal state
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

  // New: Open detailed modal
  const openDetailModal = (report) => {
    setSelectedReport(report);
    setShowModal(true);
  };

  // New: Close modal
  const closeModal = () => {
    setSelectedReport(null);
    setShowModal(false);
  };

  // New: Check if URL is video
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
      const response = await axios.get("http://localhost:3000/reports");
      setReports(response.data.reports || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError("Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  // Calculate distance between two lat/lng points (in kilometers)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
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

  // Generate hotspots using DBSCAN
  const generateHotspots = (filteredReports) => {
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
        id: `hotspot-${index}`,
        center: [centerLat, centerLng],
        reports: clusterReports,
        intensity,
        verifiedCount,
        reportCount: clusterReports.length,
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

    const popupContent = `
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

    circle.bindPopup(popupContent);
    return circle;
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
  }, []);

  // Create custom marker icon
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

  // Filter reports based on toggles and dropdown
  const getFilteredReports = () => {
    let filtered = reports.filter((report) => {
      const isCrowdReport = !report.socialMedia;
      const isSocialMedia = report.socialMedia;

      if (!crowdReports && isCrowdReport) return false;
      if (!socialMediaReports && isSocialMedia) return false;

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
    markersRef.current = [];
    hotspotsRef.current = [];

    const filteredReports = getFilteredReports();

    // Generate and display hotspots
    if (showHotspots) {
      const hotspots = generateHotspots(filteredReports);
      hotspots.forEach((hotspot) => {
        const hotspotLayer = createHotspotLayer(hotspot);
        hotspotLayer.addTo(leafletMapRef.current);
        hotspotsRef.current.push(hotspotLayer);
      });
    }

    // Add individual markers with updated popup
    filteredReports.forEach((report) => {
      if (report.location && report.location.coordinates) {
        const [lng, lat] = report.location.coordinates;
        const marker = L.marker([lat, lng], {
          icon: createCustomIcon(report),
        });

        // Updated popup with "See in Detail" button
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

    // Add global function to handle detail button clicks
    window.openReportDetail = (reportId) => {
      const report = reports.find((r) => r._id === reportId);
      if (report) {
        openDetailModal(report);
      }
    };
  }, [reports, crowdReports, socialMediaReports, selectedFilter, showHotspots]);

  return (
    <div className="map-container">
      {/* Map */}
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

        {/* Top Right Controls Panel */}
        <div className="controls-panel">
          {/* Filter Dropdown */}
          <div className="filter-section">
            <div className="filter-dropdown">
              <Filter className="filter-icon" />
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="filter-select"
              >
                {filterOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="dropdown-arrow" />
            </div>
          </div>

          {/* Toggle Controls */}
          <div className="toggle-section">
            <div className="toggle-item">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={showHotspots}
                  onChange={(e) => setShowHotspots(e.target.checked)}
                />
                <span className="slider"></span>
              </label>
              <span className="toggle-label">Threat Hotspots</span>
              <div className="legend-indicator orange"></div>
            </div>

            <div className="toggle-item">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={crowdReports}
                  onChange={(e) => setCrowdReports(e.target.checked)}
                />
                <span className="slider"></span>
              </label>
              <span className="toggle-label">Crowd Reports</span>
              <div className="legend-indicator red"></div>
            </div>

            <div className="toggle-item">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={socialMediaReports}
                  onChange={(e) => setSocialMediaReports(e.target.checked)}
                />
                <span className="slider"></span>
              </label>
              <span className="toggle-label">Social Media Reports</span>
              <div className="legend-indicator blue"></div>
            </div>
          </div>

          {/* Mini Legend */}
          <div className="mini-legend">
            <div className="legend-row">
              <div className="legend-dot orange"></div>
              <span>Threat Hotspots</span>
            </div>
            <div className="legend-row">
              <div className="legend-dot red"></div>
              <span>Crowd Reports</span>
            </div>
            <div className="legend-row">
              <div className="legend-dot blue"></div>
              <span>Social Media</span>
            </div>
            <div className="legend-row">
              <div className="legend-dot pink"></div>
              <span>Danger Zones</span>
            </div>
          </div>
        </div>

        <div ref={mapRef} className="leaflet-map"></div>
      </div>

      {/* New: Detailed Report Modal */}
      {showModal && selectedReport && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="modal-header">
              <h2 className="modal-title">Report Details</h2>
              <button className="modal-close" onClick={closeModal}>
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="modal-body">
              {/* Report Type & Urgency */}
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

              {/* Media Section */}
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
                                poster=""
                              >
                                Your browser does not support the video tag.
                              </video>
                            </div>
                          ) : (
                            <div className="image-container">
                              <img
                                src={url}
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

              {/* Description */}
              <div className="description-section">
                <h3 className="section-title">Description</h3>
                <p className="report-description">
                  {selectedReport.description || "No description provided"}
                </p>
              </div>

              {/* Report Information */}
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

              {/* SOS Badge */}
              {selectedReport.isSOS && (
                <div className="sos-section">
                  <div className="sos-alert">
                    <AlertTriangle className="sos-icon" size={20} />
                    <span>EMERGENCY SOS REPORT</span>
                  </div>
                </div>
              )}

              {/* External Link */}
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
    </div>
  );
};

export default ViewMap;
