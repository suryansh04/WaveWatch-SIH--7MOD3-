import React from "react";
import AnalystHeader from "../AnalystHeader/AnalystHeader";
import AnalystSidebar from "../AnalystSidebar/AnalystSidebar";
import { Phone, Clock, User, MapPin } from "lucide-react";
import "./AnalystPages.css";

const AnalystCallReports = () => {
  const callReports = [
    {
      id: 1,
      caller: "Rajesh Kumar",
      phone: "+91 98765 43210",
      location: "Marina Beach, Chennai",
      time: "2024-12-07 10:30 AM",
      duration: "5 min",
      priority: "High",
      status: "Resolved",
      issue: "High waves reported near fishing zone",
    },
    {
      id: 2,
      caller: "Priya Sharma",
      phone: "+91 98234 56789",
      location: "Vizag Beach",
      time: "2024-12-07 09:15 AM",
      duration: "8 min",
      priority: "Medium",
      status: "In Progress",
      issue: "Tourist boat rescue request",
    },
    {
      id: 3,
      caller: "Amit Patel",
      phone: "+91 97654 32100",
      location: "Goa Coast",
      time: "2024-12-07 08:45 AM",
      duration: "3 min",
      priority: "Low",
      status: "Resolved",
      issue: "General inquiry about tide timings",
    },
    {
      id: 4,
      caller: "Sunita Reddy",
      phone: "+91 96543 21098",
      location: "Puri Beach",
      time: "2024-12-06 05:20 PM",
      duration: "12 min",
      priority: "High",
      status: "Resolved",
      issue: "Emergency - Missing swimmer",
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
              <Phone size={32} className="page-icon" />
              <div>
                <h1 className="page-title">Call Reports</h1>
                <p className="page-subtitle">
                  Emergency calls and support requests
                </p>
              </div>
            </div>
            <div className="page-header-actions">
              <button className="btn-primary">
                <Phone size={18} />
                New Call
              </button>
            </div>
          </div>

          {/* Call Statistics */}
          <div className="stats-row">
            <div className="stat-box">
              <div className="stat-value">24</div>
              <div className="stat-label">Total Calls Today</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">4</div>
              <div className="stat-label">High Priority</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">18</div>
              <div className="stat-label">Resolved</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">2</div>
              <div className="stat-label">In Progress</div>
            </div>
          </div>

          {/* Call Reports List */}
          <div className="content-card">
            <h3 className="card-title">Recent Call Reports</h3>
            <div className="call-reports-list">
              {callReports.map((call) => (
                <div key={call.id} className="call-report-card">
                  <div className="call-report-header">
                    <div className="call-info">
                      <div className="caller-info">
                        <User size={20} className="caller-icon" />
                        <div>
                          <h4 className="caller-name">{call.caller}</h4>
                          <p className="caller-phone">{call.phone}</p>
                        </div>
                      </div>
                      <div className="call-badges">
                        <span
                          className={`priority-badge priority-${call.priority.toLowerCase()}`}
                        >
                          {call.priority}
                        </span>
                        <span
                          className={`status-badge ${call.status
                            .toLowerCase()
                            .replace(" ", "-")}`}
                        >
                          {call.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="call-report-body">
                    <p className="call-issue">{call.issue}</p>
                    <div className="call-meta">
                      <div className="meta-item">
                        <MapPin size={16} />
                        <span>{call.location}</span>
                      </div>
                      <div className="meta-item">
                        <Clock size={16} />
                        <span>{call.time}</span>
                      </div>
                      <div className="meta-item">
                        <Phone size={16} />
                        <span>{call.duration}</span>
                      </div>
                    </div>
                  </div>

                  <div className="call-report-footer">
                    <button className="btn-action">View Details</button>
                    <button className="btn-action-secondary">Add Note</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalystCallReports;
