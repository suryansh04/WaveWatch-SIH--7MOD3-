import React from "react";
import AnalystHeader from "../AnalystHeader/AnalystHeader";
import AnalystSidebar from "../AnalystSidebar/AnalystSidebar";
import { Map, MapPin, Layers, ZoomIn } from "lucide-react";
import "./AnalystPages.css";

const AnalystMap = () => {
  const locations = [
    {
      id: 1,
      name: "Marina Beach",
      city: "Chennai",
      alerts: 3,
      severity: "high",
    },
    {
      id: 2,
      name: "RK Beach",
      city: "Visakhapatnam",
      alerts: 1,
      severity: "medium",
    },
    {
      id: 3,
      name: "Calangute Beach",
      city: "Goa",
      alerts: 0,
      severity: "low",
    },
    {
      id: 4,
      name: "Juhu Beach",
      city: "Mumbai",
      alerts: 2,
      severity: "medium",
    },
  ];

  return (
    <div className="analyst-page">
      <AnalystSidebar />
      <div className="analyst-page-wrapper">
        <AnalystHeader />
        <div className="analyst-page-content">
          {/* Page Header */}
          <div className="page-header">
            <div className="page-header-left">
              <Map size={32} className="page-icon" />
              <div>
                <h1 className="page-title">Interactive Map</h1>
                <p className="page-subtitle">
                  Monitor coastal locations and active alerts
                </p>
              </div>
            </div>
            <div className="page-header-actions">
              <button className="btn-secondary">
                <Layers size={18} />
                Layers
              </button>
              <button className="btn-secondary">
                <ZoomIn size={18} />
                Reset View
              </button>
            </div>
          </div>

          {/* Map Container */}
          <div className="map-view-container">
            <div className="map-placeholder">
              <div className="map-placeholder-content">
                <Map size={64} className="map-placeholder-icon" />
                <h3>Interactive Map View</h3>
                <p>
                  Map component will be integrated here with real-time location
                  tracking
                </p>
                <button className="btn-primary">Load Map</button>
              </div>
            </div>

            {/* Location List Sidebar */}
            <div className="map-sidebar">
              <h3 className="map-sidebar-title">Active Locations</h3>
              <div className="location-list">
                {locations.map((location) => (
                  <div key={location.id} className="location-card">
                    <div className="location-header">
                      <MapPin
                        size={20}
                        className={`location-pin severity-${location.severity}`}
                      />
                      <div>
                        <h4 className="location-name">{location.name}</h4>
                        <p className="location-city">{location.city}</p>
                      </div>
                    </div>
                    <div className="location-alerts">
                      <span
                        className={`alert-count ${
                          location.alerts > 0 ? "active" : ""
                        }`}
                      >
                        {location.alerts} Active Alerts
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalystMap;
