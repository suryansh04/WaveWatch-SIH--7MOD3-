import React from "react";
import AnalystHeader from "../AnalystHeader/AnalystHeader";
import AnalystSidebar from "../AnalystSidebar/AnalystSidebar";
import { FileText, Filter, Download, Search } from "lucide-react";
import "./AnalystPages.css";

const AnalystReports = () => {
  const reports = [
    {
      id: 1,
      title: "Coastal Wave Analysis - Q4 2024",
      date: "2024-12-05",
      location: "Chennai Coast",
      status: "Completed",
      severity: "Medium",
    },
    {
      id: 2,
      title: "High Tide Emergency Report",
      date: "2024-12-04",
      location: "Visakhapatnam",
      status: "Under Review",
      severity: "High",
    },
    {
      id: 3,
      title: "Routine Beach Safety Check",
      date: "2024-12-03",
      location: "Goa Beaches",
      status: "Completed",
      severity: "Low",
    },
    {
      id: 4,
      title: "Cyclone Impact Assessment",
      date: "2024-12-02",
      location: "Bay of Bengal",
      status: "Completed",
      severity: "High",
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
              <FileText size={32} className="page-icon" />
              <div>
                <h1 className="page-title">Reports</h1>
                <p className="page-subtitle">
                  View and analyze all submitted reports
                </p>
              </div>
            </div>
            <div className="page-header-actions">
              <button className="btn-secondary">
                <Filter size={18} />
                Filter
              </button>
              <button className="btn-primary">
                <Download size={18} />
                Export
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="search-section">
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search reports..."
                className="search-input"
              />
            </div>
            <div className="filter-tags">
              <button className="filter-tag active">All Reports</button>
              <button className="filter-tag">High Severity</button>
              <button className="filter-tag">Under Review</button>
              <button className="filter-tag">This Week</button>
            </div>
          </div>

          {/* Reports Table */}
          <div className="content-card">
            <div className="reports-table">
              <table>
                <thead>
                  <tr>
                    <th>Report Title</th>
                    <th>Date</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Severity</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report.id}>
                      <td className="report-title-cell">{report.title}</td>
                      <td>{report.date}</td>
                      <td>{report.location}</td>
                      <td>
                        <span
                          className={`status-badge ${report.status
                            .toLowerCase()
                            .replace(" ", "-")}`}
                        >
                          {report.status}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`severity-badge severity-${report.severity.toLowerCase()}`}
                        >
                          {report.severity}
                        </span>
                      </td>
                      <td>
                        <button className="btn-action">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalystReports;
