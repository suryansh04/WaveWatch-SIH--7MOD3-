// // import React from "react";
// // import AnalystHeader from "../../components/AnalystHeader/AnalystHeader";
// // import AnalystSidebar from "../../components/AnalystSidebar/AnalystSidebar";
// // import AnalystStatsCards from "../../components/AnalystStatsCards/AnalystStatsCards";
// // import AnalystRecentActivity from "../../components/AnalystRecentActivity/AnalystRecentActivity";
// // import "./AnalystDashboard.css";

// // const AnalystDashboard = () => {
// //   return (
// //     <div className="analyst-dashboard">
// //       <AnalystSidebar />
// //       <div className="analyst-main-wrapper">
// //         <AnalystHeader />
// //       </div>
// //     </div>
// //   );
// // };

// // export default AnalystDashboard;

// //------------------------------------------- NEW CODE--------------------------------------------------------------------

// import React from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
// } from "recharts";
// import {
//   AlertTriangle,
//   MessageCircle,
//   TrendingUp,
//   Twitter,
//   Facebook,
//   Globe,
//   AlertOctagon,
// } from "lucide-react";
// import AnalystHeader from "../../components/AnalystHeader/AnalystHeader";
// import AnalystSidebar from "../../components/AnalystSidebar/AnalystSidebar";
// import "./AnalystDashboard.css";

// const AnalystDashboard = () => {
//   // Mock Data for the Trend Chart
//   const trendData = [
//     { date: "Dec 01", alerts: 4, posts: 24 },
//     { date: "Dec 02", alerts: 7, posts: 45 },
//     { date: "Dec 03", alerts: 5, posts: 38 },
//     { date: "Dec 04", alerts: 12, posts: 85 }, // Spike event
//     { date: "Dec 05", alerts: 8, posts: 65 },
//     { date: "Dec 06", alerts: 3, posts: 30 },
//     { date: "Dec 07", alerts: 2, posts: 20 },
//   ];

//   // Mock Data for Social Signals Panel
//   const socialSignals = [
//     {
//       id: 1,
//       source: "Twitter",
//       user: "@coastal_guard",
//       snippet: "Water rising rapidly near Marine Drive. High waves visible...",
//       keywords: ["High Waves", "Flooding"],
//       confidence: 0.95,
//       date: "10 mins ago",
//     },
//     {
//       id: 2,
//       source: "Facebook",
//       user: "Mumbai Locals Group",
//       snippet: "Sea water entering the localized slums in Bandra area.",
//       keywords: ["Inundation", "Damage"],
//       confidence: 0.88,
//       date: "25 mins ago",
//     },
//     {
//       id: 3,
//       source: "Twitter",
//       user: "@weather_watcher",
//       snippet: "Storm surge warning issued for next 4 hours. Stay safe.",
//       keywords: ["Storm Surge", "Warning"],
//       confidence: 0.92,
//       date: "1 hour ago",
//     },
//     {
//       id: 4,
//       source: "Web",
//       user: "News Portal",
//       snippet: "Fishermen advised not to venture out due to rough seas.",
//       keywords: ["Advisory", "Rough Sea"],
//       confidence: 0.85,
//       date: "2 hours ago",
//     },
//     {
//       id: 5,
//       source: "Twitter",
//       user: "@citizen_reptr",
//       snippet: "Unusual tide behavior observed at Juhu beach.",
//       keywords: ["Tide", "Unusual"],
//       confidence: 0.78,
//       date: "3 hours ago",
//     },
//   ];

//   return (
//     <div className="analyst-dashboard">
//       <AnalystSidebar />
//       <div className="analyst-main-wrapper">
//         <AnalystHeader />

//         <div className="analyst-content">
//           <div className="analyst-welcome-section">
//             <h2 className="analyst-welcome-title">Dashboard Overview</h2>
//             <p className="analyst-welcome-text">
//               Real-time monitoring of ocean hazards and social sentiment.
//             </p>
//           </div>

//           {/* 1. KPI Cards Section */}
//           <div className="stats-grid">
//             <div className="stat-card">
//               <div className="stat-info">
//                 <p className="stat-label">Total Alerts (7 Days)</p>
//                 <h3 className="stat-value">41</h3>
//                 <span className="stat-trend positive">
//                   <TrendingUp size={14} /> +12% from last week
//                 </span>
//               </div>
//               <div className="stat-icon-box blue">
//                 <AlertTriangle size={24} color="#0077b6" />
//               </div>
//             </div>

//             <div className="stat-card">
//               <div className="stat-info">
//                 <p className="stat-label">Active Alerts</p>
//                 <h3 className="stat-value text-red">3</h3>
//                 <span className="stat-subtext">Requires attention</span>
//               </div>
//               <div className="stat-icon-box red">
//                 <AlertOctagon size={24} color="#d32f2f" />
//               </div>
//             </div>

//             <div className="stat-card">
//               <div className="stat-info">
//                 <p className="stat-label">Flood Social Posts</p>
//                 <h3 className="stat-value">307</h3>
//                 <span className="stat-trend">Last 7 Days</span>
//               </div>
//               <div className="stat-icon-box purple">
//                 <MessageCircle size={24} color="#7b2cbf" />
//               </div>
//             </div>
//           </div>

//           {/* 2. Charts & Tables Grid */}
//           <div className="dashboard-split-layout">
//             {/* Multi-Source Trend Chart */}
//             <div className="chart-section card-box">
//               <div className="card-header">
//                 <h3>Multi-Source Trends</h3>
//                 <p>Correlation between Official Alerts and Social Activity</p>
//               </div>
//               <div className="chart-container">
//                 <ResponsiveContainer width="100%" height={300}>
//                   <LineChart data={trendData}>
//                     <CartesianGrid
//                       strokeDasharray="3 3"
//                       vertical={false}
//                       stroke="#e0e0e0"
//                     />
//                     <XAxis
//                       dataKey="date"
//                       axisLine={false}
//                       tickLine={false}
//                       tick={{ fill: "#757575", fontSize: 12 }}
//                       dy={10}
//                     />
//                     <YAxis
//                       axisLine={false}
//                       tickLine={false}
//                       tick={{ fill: "#757575", fontSize: 12 }}
//                     />
//                     <Tooltip
//                       contentStyle={{
//                         borderRadius: "8px",
//                         border: "none",
//                         boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//                       }}
//                     />
//                     <Legend wrapperStyle={{ paddingTop: "20px" }} />
//                     <Line
//                       type="monotone"
//                       dataKey="alerts"
//                       name="Official Alerts"
//                       stroke="#d32f2f"
//                       strokeWidth={3}
//                       dot={{ r: 4 }}
//                       activeDot={{ r: 6 }}
//                     />
//                     <Line
//                       type="monotone"
//                       dataKey="posts"
//                       name="Social Mentions"
//                       stroke="#0077b6"
//                       strokeWidth={3}
//                       dot={{ r: 4 }}
//                       activeDot={{ r: 6 }}
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>

//             {/* Social Media Signals Panel */}
//             <div className="social-panel card-box">
//               <div className="card-header">
//                 <h3>High Confidence Social Signals</h3>
//                 <p>NLP Detected Flood/Hazard Posts</p>
//               </div>

//               <div className="social-list">
//                 {socialSignals.map((post) => (
//                   <div key={post.id} className="social-item">
//                     <div className="social-icon">
//                       {post.source === "Twitter" && (
//                         <Twitter size={18} color="#1DA1F2" />
//                       )}
//                       {post.source === "Facebook" && (
//                         <Facebook size={18} color="#4267B2" />
//                       )}
//                       {post.source === "Web" && (
//                         <Globe size={18} color="#757575" />
//                       )}
//                     </div>
//                     <div className="social-content">
//                       <div className="social-top">
//                         <span className="social-user">{post.user}</span>
//                         <span className="social-date">{post.date}</span>
//                       </div>
//                       <p className="social-snippet">"{post.snippet}"</p>
//                       <div className="social-meta">
//                         <div className="keywords">
//                           {post.keywords.map((kw, idx) => (
//                             <span key={idx} className="keyword-tag">
//                               {kw}
//                             </span>
//                           ))}
//                         </div>
//                         <span
//                           className={`confidence-badge ${
//                             post.confidence > 0.9 ? "high" : "med"
//                           }`}
//                         >
//                           {Math.round(post.confidence * 100)}% Conf.
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AnalystDashboard;

import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  AlertTriangle,
  MessageCircle,
  TrendingUp,
  Twitter,
  Facebook,
  Globe,
  AlertOctagon,
} from "lucide-react";
import AnalystHeader from "../../components/AnalystHeader/AnalystHeader";
import AnalystSidebar from "../../components/AnalystSidebar/AnalystSidebar";
import "./AnalystDashboard.css";

const AnalystDashboard = () => {
  const [stats, setStats] = useState({
    totalAlerts: 0,
    activeAlerts: 0,
    totalPosts: 0,
    weeklyChange: 0,
  });
  const [trendData, setTrendData] = useState([]);
  const [socialSignals, setSocialSignals] = useState([]);
  const [loading, setLoading] = useState(true);

  // API Base URL - Update this to your backend URL
  const API_BASE_URL = "http://localhost:3000/";

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchAlertStats(),
        fetchSocialMediaStats(),
        fetchTrendData(),
        fetchSocialSignals(),
      ]);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Alert Statistics
  const fetchAlertStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/alerts`);
      const data = await response.json();

      if (data.success) {
        const alerts = data.data;
        const activeAlerts = alerts.filter((alert) => alert.isActive).length;

        // Calculate last 7 days alerts
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentAlerts = alerts.filter(
          (alert) => new Date(alert.createdAt) >= sevenDaysAgo
        );

        // Calculate previous 7 days for comparison
        const fourteenDaysAgo = new Date();
        fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

        const previousWeekAlerts = alerts.filter(
          (alert) =>
            new Date(alert.createdAt) >= fourteenDaysAgo &&
            new Date(alert.createdAt) < sevenDaysAgo
        );

        const weeklyChange =
          previousWeekAlerts.length > 0
            ? (
                ((recentAlerts.length - previousWeekAlerts.length) /
                  previousWeekAlerts.length) *
                100
              ).toFixed(0)
            : 0;

        setStats((prev) => ({
          ...prev,
          totalAlerts: recentAlerts.length,
          activeAlerts,
          weeklyChange,
        }));
      }
    } catch (error) {
      console.error("Error fetching alert stats:", error);
    }
  };

  // Fetch Social Media Statistics
  const fetchSocialMediaStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/social-media/stats`);
      const data = await response.json();

      setStats((prev) => ({
        ...prev,
        totalPosts: data.flood || 0,
      }));
    } catch (error) {
      console.error("Error fetching social media stats:", error);
    }
  };

  // Fetch Trend Data for Chart
  const fetchTrendData = async () => {
    try {
      // Get last 7 days of alerts
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 6); // Last 7 days including today

      const alertsResponse = await fetch(`${API_BASE_URL}/alerts`);
      const alertsData = await alertsResponse.json();

      // Get social media posts with flood label
      const socialResponse = await fetch(
        `${API_BASE_URL}/social-media?flood_filter=flood&limit=1000`
      );
      const socialData = await socialResponse.json();

      // Process data by date
      const dateMap = {};

      // Initialize last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateKey = date.toISOString().split("T")[0];
        const displayDate = date.toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
        });

        dateMap[dateKey] = {
          date: displayDate,
          alerts: 0,
          posts: 0,
        };
      }

      // Count alerts by date
      if (alertsData.success) {
        alertsData.data.forEach((alert) => {
          const alertDate = new Date(alert.createdAt)
            .toISOString()
            .split("T")[0];
          if (dateMap[alertDate]) {
            dateMap[alertDate].alerts++;
          }
        });
      }

      // Count social posts by date
      if (socialData.posts) {
        socialData.posts.forEach((post) => {
          const postDate = new Date(post.date).toISOString().split("T")[0];
          if (dateMap[postDate]) {
            dateMap[postDate].posts++;
          }
        });
      }

      const chartData = Object.values(dateMap);
      setTrendData(chartData);
    } catch (error) {
      console.error("Error fetching trend data:", error);
      // Fallback to mock data
      setTrendData([
        { date: "Dec 01", alerts: 4, posts: 24 },
        { date: "Dec 02", alerts: 7, posts: 45 },
        { date: "Dec 03", alerts: 5, posts: 38 },
        { date: "Dec 04", alerts: 12, posts: 85 },
        { date: "Dec 05", alerts: 8, posts: 65 },
        { date: "Dec 06", alerts: 3, posts: 30 },
        { date: "Dec 07", alerts: 2, posts: 20 },
      ]);
    }
  };

  // Fetch Social Signals (High Confidence Posts)
  const fetchSocialSignals = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/social-media?flood_filter=flood&limit=5`
      );
      const data = await response.json();

      if (data.posts && data.posts.length > 0) {
        const formattedSignals = data.posts.map((post, index) => {
          // Calculate time ago
          const postDate = new Date(post.date);
          const now = new Date();
          const diffMs = now - postDate;
          const diffMins = Math.floor(diffMs / 60000);
          const diffHours = Math.floor(diffMs / 3600000);
          const diffDays = Math.floor(diffMs / 86400000);

          let timeAgo;
          if (diffMins < 60) {
            timeAgo = `${diffMins} mins ago`;
          } else if (diffHours < 24) {
            timeAgo = `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
          } else {
            timeAgo = `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
          }

          // Extract keywords from text (simple implementation)
          const keywords = extractKeywords(post.text);

          // Determine source icon
          let source = "Web";
          if (
            post.subreddit &&
            post.subreddit.toLowerCase().includes("twitter")
          ) {
            source = "Twitter";
          } else if (
            post.subreddit &&
            post.subreddit.toLowerCase().includes("facebook")
          ) {
            source = "Facebook";
          }

          return {
            id: post._id || index,
            source,
            user: post.subreddit || "Unknown User",
            snippet:
              post.text.substring(0, 100) +
              (post.text.length > 100 ? "..." : ""),
            keywords,
            confidence:
              post.flood_label === 1 ? 0.85 + Math.random() * 0.15 : 0.75,
            date: timeAgo,
          };
        });

        setSocialSignals(formattedSignals);
      }
    } catch (error) {
      console.error("Error fetching social signals:", error);
      // Fallback to mock data
      setSocialSignals([
        {
          id: 1,
          source: "Twitter",
          user: "@coastal_guard",
          snippet:
            "Water rising rapidly near Marine Drive. High waves visible...",
          keywords: ["High Waves", "Flooding"],
          confidence: 0.95,
          date: "10 mins ago",
        },
        {
          id: 2,
          source: "Facebook",
          user: "Mumbai Locals Group",
          snippet: "Sea water entering the localized slums in Bandra area.",
          keywords: ["Inundation", "Damage"],
          confidence: 0.88,
          date: "25 mins ago",
        },
        {
          id: 3,
          source: "Twitter",
          user: "@weather_watcher",
          snippet: "Storm surge warning issued for next 4 hours. Stay safe.",
          keywords: ["Storm Surge", "Warning"],
          confidence: 0.92,
          date: "1 hour ago",
        },
      ]);
    }
  };

  // Helper function to extract keywords
  const extractKeywords = (text) => {
    const floodKeywords = [
      "flood",
      "flooding",
      "water",
      "rain",
      "storm",
      "surge",
      "waves",
      "tsunami",
      "inundation",
      "damage",
      "warning",
      "alert",
      "emergency",
      "evacuation",
      "tide",
      "sea",
    ];

    const textLower = text.toLowerCase();
    const found = floodKeywords.filter((kw) => textLower.includes(kw));

    // Capitalize first letter
    const formatted = found
      .slice(0, 3)
      .map((kw) => kw.charAt(0).toUpperCase() + kw.slice(1));

    return formatted.length > 0 ? formatted : ["Flood Related"];
  };

  if (loading) {
    return (
      <div className="analyst-dashboard">
        <AnalystSidebar />
        <div className="analyst-main-wrapper">
          <AnalystHeader />
          <div className="analyst-content">
            <div style={{ textAlign: "center", padding: "50px" }}>
              <p>Loading dashboard data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="analyst-dashboard">
      <AnalystSidebar />
      <div className="analyst-main-wrapper">
        <AnalystHeader />

        <div className="analyst-content">
          <div className="analyst-welcome-section">
            <h2 className="analyst-welcome-title">Dashboard Overview</h2>
            <p className="analyst-welcome-text">
              Real-time monitoring of ocean hazards and social sentiment.
            </p>
          </div>

          {/* 1. KPI Cards Section */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-info">
                <p className="stat-label">Total Alerts (7 Days)</p>
                <h3 className="stat-value">{stats.totalAlerts}</h3>
                <span
                  className={`stat-trend ${
                    stats.weeklyChange >= 0 ? "positive" : ""
                  }`}
                >
                  <TrendingUp size={14} /> {stats.weeklyChange >= 0 ? "+" : ""}
                  {stats.weeklyChange}% from last week
                </span>
              </div>
              <div className="stat-icon-box blue">
                <AlertTriangle size={24} color="#0077b6" />
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-info">
                <p className="stat-label">Active Alerts</p>
                <h3 className="stat-value text-red">{stats.activeAlerts}</h3>
                <span className="stat-subtext">Requires attention</span>
              </div>
              <div className="stat-icon-box red">
                <AlertOctagon size={24} color="#d32f2f" />
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-info">
                <p className="stat-label">Flood Social Posts</p>
                <h3 className="stat-value">{stats.totalPosts}</h3>
                <span className="stat-trend">Last 7 Days</span>
              </div>
              <div className="stat-icon-box purple">
                <MessageCircle size={24} color="#7b2cbf" />
              </div>
            </div>
          </div>

          {/* 2. Charts & Tables Grid */}
          <div className="dashboard-split-layout">
            {/* Multi-Source Trend Chart */}
            <div className="chart-section card-box">
              <div className="card-header">
                <h3>Multi-Source Trends</h3>
                <p>Correlation between Official Alerts and Social Activity</p>
              </div>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trendData}>
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
                    <Legend wrapperStyle={{ paddingTop: "20px" }} />
                    <Line
                      type="monotone"
                      dataKey="alerts"
                      name="Official Alerts"
                      stroke="#d32f2f"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="posts"
                      name="Social Mentions"
                      stroke="#0077b6"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Social Media Signals Panel */}
            <div className="social-panel card-box">
              <div className="card-header">
                <h3>High Confidence Social Signals</h3>
                <p>NLP Detected Flood/Hazard Posts</p>
              </div>

              <div className="social-list">
                {socialSignals.length > 0 ? (
                  socialSignals.map((post) => (
                    <div key={post.id} className="social-item">
                      <div className="social-icon">
                        {post.source === "Twitter" && (
                          <Twitter size={18} color="#1DA1F2" />
                        )}
                        {post.source === "Facebook" && (
                          <Facebook size={18} color="#4267B2" />
                        )}
                        {post.source === "Web" && (
                          <Globe size={18} color="#757575" />
                        )}
                      </div>
                      <div className="social-content">
                        <div className="social-top">
                          <span className="social-user">{post.user}</span>
                          <span className="social-date">{post.date}</span>
                        </div>
                        <p className="social-snippet">"{post.snippet}"</p>
                        <div className="social-meta">
                          <div className="keywords">
                            {post.keywords.map((kw, idx) => (
                              <span key={idx} className="keyword-tag">
                                {kw}
                              </span>
                            ))}
                          </div>
                          <span
                            className={`confidence-badge ${
                              post.confidence > 0.9 ? "high" : "med"
                            }`}
                          >
                            {Math.round(post.confidence * 100)}% Conf.
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p
                    style={{
                      textAlign: "center",
                      color: "#9e9e9e",
                      padding: "20px",
                    }}
                  >
                    No social signals available
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalystDashboard;
