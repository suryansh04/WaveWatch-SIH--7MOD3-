import React from "react";
import { Clock, MapPin, AlertTriangle } from "lucide-react";
import "./AnalystRecentActivity.css";

const AnalystRecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: "report",
      title: "High Tide Alert - Marina Beach",
      location: "Chennai, Tamil Nadu",
      time: "2 hours ago",
      severity: "high",
    },
    {
      id: 2,
      type: "report",
      title: "Wave Height Increased - Vizag Coast",
      location: "Visakhapatnam, Andhra Pradesh",
      time: "4 hours ago",
      severity: "medium",
    },
    {
      id: 3,
      type: "call",
      title: "Emergency Call - Fishing Boat",
      location: "Off Mumbai Coast",
      time: "6 hours ago",
      severity: "high",
    },
    {
      id: 4,
      type: "report",
      title: "Routine Patrol Report",
      location: "Goa Beaches",
      time: "8 hours ago",
      severity: "low",
    },
    {
      id: 5,
      type: "report",
      title: "Cyclone Warning Update",
      location: "Bay of Bengal",
      time: "10 hours ago",
      severity: "high",
    },
  ];

  const getSeverityClass = (severity) => {
    switch (severity) {
      case "high":
        return "severity-high";
      case "medium":
        return "severity-medium";
      case "low":
        return "severity-low";
      default:
        return "";
    }
  };

  return (
    <div className="analyst-activity-container">
      <div className="analyst-activity-header">
        <h2 className="analyst-activity-title">Recent Activity</h2>
        <p className="analyst-activity-subtitle">
          Latest reports and updates from the field
        </p>
      </div>

      <div className="analyst-activity-list">
        {activities.map((activity) => (
          <div key={activity.id} className="analyst-activity-item">
            <div className="analyst-activity-icon">
              <AlertTriangle size={20} />
            </div>

            <div className="analyst-activity-content">
              <div className="analyst-activity-main">
                <h3 className="analyst-activity-item-title">
                  {activity.title}
                </h3>
                <span
                  className={`analyst-activity-severity ${getSeverityClass(
                    activity.severity
                  )}`}
                >
                  {activity.severity}
                </span>
              </div>

              <div className="analyst-activity-meta">
                <div className="analyst-activity-location">
                  <MapPin size={14} />
                  <span>{activity.location}</span>
                </div>
                <div className="analyst-activity-time">
                  <Clock size={14} />
                  <span>{activity.time}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalystRecentActivity;
