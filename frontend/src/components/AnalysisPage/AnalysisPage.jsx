import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Ensure leaflet CSS is imported
import AnalystHeader from "../../components/AnalystHeader/AnalystHeader";
import AnalystSidebar from "../../components/AnalystSidebar/AnalystSidebar";
import "./AnalysisPage.css";

// --- Mock Data ---

const alertsOverTimeData = [
  { time: "00:00", alerts: 2 },
  { time: "04:00", alerts: 1 },
  { time: "08:00", alerts: 5 },
  { time: "12:00", alerts: 8 },
  { time: "16:00", alerts: 12 },
  { time: "20:00", alerts: 6 },
  { time: "23:59", alerts: 3 },
];

const socialFloodPostsData = [
  { date: "Dec 01", posts: 120 },
  { date: "Dec 02", posts: 145 },
  { date: "Dec 03", posts: 132 },
  { date: "Dec 04", posts: 280 }, // Spike
  { date: "Dec 05", posts: 190 },
  { date: "Dec 06", posts: 150 },
  { date: "Dec 07", posts: 175 },
];

const platformData = [
  { platform: "Twitter/X", count: 450, color: "#1DA1F2" },
  { platform: "Facebook", count: 320, color: "#4267B2" },
  { platform: "Instagram", count: 210, color: "#E1306C" },
  { platform: "Telegram", count: 150, color: "#0088cc" },
  { platform: "News/Web", count: 80, color: "#757575" },
];

const keywordData = [
  { keyword: "Flooding", count: 320 },
  { keyword: "High Tide", count: 280 },
  { keyword: "Blocked", count: 150 },
  { keyword: "Rescue", count: 90 },
  { keyword: "Power Out", count: 60 },
];

// Mock Geo Data for Heatmap (Simulated with Circles)
// Centered roughly around Mumbai for context based on previous dashboard data
const heatMapPoints = [
  { id: 1, lat: 19.076, lng: 72.8777, intensity: 0.9, loc: "Bandra" },
  { id: 2, lat: 19.0213, lng: 72.8424, intensity: 0.7, loc: "Marine Drive" },
  { id: 3, lat: 19.1136, lng: 72.8697, intensity: 0.8, loc: "Juhu" },
  { id: 4, lat: 18.922, lng: 72.8347, intensity: 0.5, loc: "Colaba" },
  { id: 5, lat: 19.155, lng: 72.849, intensity: 0.6, loc: "Goregaon" },
];

const AnalysisPage = () => {
  return (
    <div className="analysis-page">
      <AnalystSidebar />
      <div className="analysis-main-wrapper">
        <AnalystHeader />

        <div className="analysis-content">
          <div className="analysis-intro">
            <h2 className="analysis-title">Detailed Analysis</h2>
            <p className="analysis-subtitle">
              Deep dive into alert trends, social sentiment, and geospatial
              impact.
            </p>
          </div>

          <div className="analysis-grid">
            {/* Row 1: Line Charts */}
            <div className="chart-card">
              <div className="chart-header">
                <h3>Alerts Over Time</h3>
                <p>Frequency of official alerts issued (24h)</p>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={alertsOverTimeData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e0e0e0"
                  />
                  <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#757575", fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#757575", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="alerts"
                    stroke="#d32f2f"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#d32f2f" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <div className="chart-header">
                <h3>Social Flood Posts Over Time</h3>
                <p>Volume of user-generated content related to floods</p>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={socialFloodPostsData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e0e0e0"
                  />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#757575", fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#757575", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="posts"
                    stroke="#0077b6"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#0077b6" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Row 2: Bar Charts */}
            <div className="chart-card">
              <div className="chart-header">
                <h3>Social Posts by Platform</h3>
                <p>Distribution of data sources</p>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={platformData} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    stroke="#e0e0e0"
                  />
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="platform"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    width={100}
                    tick={{ fill: "#424242", fontSize: 12, fontWeight: 500 }}
                  />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
                    {platformData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <div className="chart-header">
                <h3>Keyword Frequency</h3>
                <p>Top terms detected in social streams</p>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={keywordData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e0e0e0"
                  />
                  <XAxis
                    dataKey="keyword"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#757575", fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#757575", fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(0,0,0,0.05)" }}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill="#7b2cbf"
                    radius={[4, 4, 0, 0]}
                    barSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Row 3: Map (Full Width) */}
            <div className="chart-card full-width">
              <div className="chart-header">
                <h3>Social Heatmap (Geo-Spatial)</h3>
                <p>Geographic concentration of high-priority social signals</p>
              </div>
              <div className="map-container-wrapper">
                <MapContainer
                  center={[19.076, 72.8777]}
                  zoom={11}
                  style={{ height: "100%", width: "100%", borderRadius: "8px" }}
                >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                  />
                  {heatMapPoints.map((point) => (
                    <CircleMarker
                      key={point.id}
                      center={[point.lat, point.lng]}
                      radius={20 * point.intensity} // Size based on intensity
                      fillColor="#d32f2f"
                      color="transparent"
                      fillOpacity={0.6}
                    >
                      <Popup>
                        <strong>{point.loc}</strong> <br />
                        Intensity: {point.intensity * 100}%
                      </Popup>
                    </CircleMarker>
                  ))}
                </MapContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;
