import React from "react";
import { AlertTriangle, Clock, MapPin } from "lucide-react";
import "./ActiveAlerts.css";

const ActiveAlerts = () => {
  const alertsData = [
    {
      id: 1,
      type: "Red Alert",
      severity: "Warning",
      title: "High Wave Alert",
      date: "29 Aug 2025",
      location: "23B Marine Drive, Besant Nagar, Chennai, Tamil Nadu - 600090",
    },
    {
      id: 2,
      type: "Red Alert",
      severity: "Warning",
      title: "Storm Surge Alert",
      date: "30 Aug 2025",
      location: "Marina Beach, Chennai, Tamil Nadu - 600001",
    },
    {
      id: 3,
      type: "Orange Alert",
      severity: "Caution",
      title: "Coastal Flooding Risk",
      date: "31 Aug 2025",
      location: "ECR Road, Mahabalipuram, Tamil Nadu - 603104",
    },
    {
      id: 4,
      type: "Red Alert",
      severity: "Warning",
      title: "Tsunami Warning",
      date: "01 Sep 2025",
      location: "Puducherry Beach, Puducherry - 605001",
    },
    {
      id: 5,
      type: "Yellow Alert",
      severity: "Advisory",
      title: "High Tide Alert",
      date: "02 Sep 2025",
      location: "Kovalam Beach, Chennai, Tamil Nadu - 600041",
    },
  ];

  const getAlertStyles = (alertType) => {
    switch (alertType) {
      case "Red Alert":
        return {
          headerBg: "#dc2626",
          contentBg: "#fef2f2",
          iconColor: "#dc2626",
        };
      case "Orange Alert":
        return {
          headerBg: "#ea580c",
          contentBg: "#fff7ed",
          iconColor: "#ea580c",
        };
      case "Yellow Alert":
        return {
          headerBg: "#ca8a04",
          contentBg: "#fefce8",
          iconColor: "#ca8a04",
        };
      default:
        return {
          headerBg: "#dc2626",
          contentBg: "#fef2f2",
          iconColor: "#dc2626",
        };
    }
  };

  return (
    <div className="activeAlert-container">
      <h2 className="activeAlert-title">Active Alerts</h2>

      <div className="activeAlert-scrollContainer">
        {alertsData.map((alert) => {
          const styles = getAlertStyles(alert.type);

          return (
            <div key={alert.id} className="activeAlert-card">
              <div
                className="activeAlert-header"
                style={{ background: styles.headerBg }}
              >
                <span className="activeAlert-badge">{alert.type}</span>
              </div>

              <div
                className="activeAlert-content"
                style={{ background: styles.contentBg }}
              >
                <div className="activeAlert-iconTitle">
                  <AlertTriangle
                    className="activeAlert-warningIcon"
                    size={20}
                    style={{ color: styles.iconColor }}
                  />
                  <span
                    className="activeAlert-type"
                    style={{ color: styles.iconColor }}
                  >
                    {alert.severity}
                  </span>
                  <div className="activeAlert-time">
                    <Clock size={16} />
                    <span>{alert.date}</span>
                  </div>
                </div>

                <h3 className="activeAlert-alertTitle">{alert.title}</h3>

                <div className="activeAlert-location">
                  <MapPin size={16} />
                  <span>{alert.location}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActiveAlerts;
