import React from "react";
import { FileText, Waves, Mountain, Zap } from "lucide-react";
import "./StatsCards.css";

const StatsCards = () => {
  const statsData = [
    {
      title: "Verified Reports",
      count: "100",
      icon: FileText,
      color: "#3b82f6",
    },
    {
      title: "Unverified Reports",
      count: "80",
      icon: FileText,
      color: "#3b82f6",
    },

    {
      title: "Total Reports",
      count: "150",
      icon: FileText,
      color: "#3b82f6",
    },
    {
      title: "Tsunami",
      count: "45",
      icon: Waves,
      color: "#06b6d4",
    },
    {
      title: "High Waves",
      count: "30",
      icon: Mountain,
      color: "#10b981",
    },
    {
      title: "Storm Surge",
      count: "20",
      icon: Zap,
      color: "#f59e0b",
    },
  ];

  return (
    <div className="stats-cards-container">
      {statsData.map((stat, index) => (
        <div key={index} className="stats-card">
          <div className="stats-card-content">
            <div className="stats-info">
              <h3 className="stats-title">{stat.title}</h3>
              <p className="stats-count">{stat.count}</p>
            </div>
            <div
              className="stats-icon"
              style={{ backgroundColor: `${stat.color}20`, color: stat.color }}
            >
              <stat.icon size={24} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
