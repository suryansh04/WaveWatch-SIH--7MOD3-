import React from "react";
import { FileText, TrendingUp, MapPin, Phone } from "lucide-react";
import "./AnalystStatsCards.css";

const AnalystStatsCards = () => {
  const stats = [
    {
      id: 1,
      title: "Reports Analyzed",
      value: "248",
      change: "+12%",
      icon: FileText,
      color: "#0077b6",
      bgColor: "#e3f2fd",
    },
    {
      id: 2,
      title: "Active Incidents",
      value: "12",
      change: "-5%",
      icon: TrendingUp,
      color: "#f57c00",
      bgColor: "#fff3e0",
    },
    {
      id: 3,
      title: "Locations Monitored",
      value: "45",
      change: "+8%",
      icon: MapPin,
      color: "#388e3c",
      bgColor: "#e8f5e9",
    },
    {
      id: 4,
      title: "Call Reports",
      value: "89",
      change: "+15%",
      icon: Phone,
      color: "#7b1fa2",
      bgColor: "#f3e5f5",
    },
  ];

  return (
    <div className="analyst-stats-container">
      {stats.map((stat) => {
        const IconComponent = stat.icon;
        const isPositive = stat.change.startsWith("+");

        return (
          <div key={stat.id} className="analyst-stat-card">
            <div className="analyst-stat-header">
              <div
                className="analyst-stat-icon"
                style={{ backgroundColor: stat.bgColor }}
              >
                <IconComponent size={24} style={{ color: stat.color }} />
              </div>
              <span
                className={`analyst-stat-change ${
                  isPositive ? "positive" : "negative"
                }`}
              >
                {stat.change}
              </span>
            </div>

            <div className="analyst-stat-body">
              <h3 className="analyst-stat-value">{stat.value}</h3>
              <p className="analyst-stat-title">{stat.title}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AnalystStatsCards;
