import React, { useState, useEffect } from "react";
import {
  UserCheck,
  UserX,
  Mail,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Users,
  Filter,
  Search,
} from "lucide-react";
import axios from "axios";

const ApproveUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filter, setFilter] = useState("pending"); // pending, approved, rejected, all
  const [searchTerm, setSearchTerm] = useState("");
  const [processingUser, setProcessingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:3000/auth/users?status=${filter}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(response.data.users || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(
        err.response?.data?.msg || "Failed to fetch users. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to approve ${userName}?`)) {
      return;
    }

    setProcessingUser(userId);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:3000/auth/approve-user/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(`${userName} has been approved successfully!`);
      fetchUsers(); // Refresh the list
    } catch (err) {
      console.error("Error approving user:", err);
      setError(
        err.response?.data?.msg || "Failed to approve user. Please try again."
      );
    } finally {
      setProcessingUser(null);
    }
  };

  const handleReject = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to reject ${userName}?`)) {
      return;
    }

    setProcessingUser(userId);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:3000/auth/reject-user/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(`${userName} has been rejected.`);
      fetchUsers(); // Refresh the list
    } catch (err) {
      console.error("Error rejecting user:", err);
      setError(
        err.response?.data?.msg || "Failed to reject user. Please try again."
      );
    } finally {
      setProcessingUser(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="approve-users-status-badge status-pending">
            <Clock size={14} />
            Pending
          </span>
        );
      case "approved":
        return (
          <span className="approve-users-status-badge status-approved">
            <CheckCircle size={14} />
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="approve-users-status-badge status-rejected">
            <XCircle size={14} />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFilterCounts = () => {
    const pending = users.filter((u) => u.status === "pending").length;
    const approved = users.filter((u) => u.status === "approved").length;
    const rejected = users.filter((u) => u.status === "rejected").length;
    return { pending, approved, rejected, total: users.length };
  };

  const counts = getFilterCounts();

  return (
    <>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

        /* Wrapper to handle sidebar offset */
        .approve-users-wrapper {
          margin-left: 280px; /* Adjusted to match ViewReport */
          min-height: 100vh;
          background-color: #f8fafc;
        }

        /* Main Container */
        .approve-users-container {
          padding: 30px 40px;
          background-color: #f8fafc;
          min-height: 100vh;
          width: 100%;
          box-sizing: border-box;
          font-family: "Inter", sans-serif;
          color: #1e293b;
        }

        /* Header Section */
        .approve-users-header {
          margin-bottom: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .page-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 5px 0;
        }

        .page-subtitle {
          font-size: 0.95rem;
          color: #64748b;
          margin: 0;
        }

        /* Refresh Button - Matching Theme */
        .approve-users-refresh-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: white;
          border: 1px solid #cbd5e1;
          color: #475569;
          padding: 10px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.85rem;
          transition: all 0.2s ease;
        }

        .approve-users-refresh-btn:hover:not(:disabled) {
          background: #f1f5f9;
          border-color: #94a3b8;
          color: #1e293b;
        }

        .spinning {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Stats Grid - Matching ViewReport Layout */
        .approve-users-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr); /* 4 columns for users page */
          gap: 24px;
          margin-bottom: 32px;
        }

        .approve-users-stat-card {
          background: #ffffff;
          border-radius: 12px;
          padding: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
          border: 1px solid #e2e8f0;
        }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-label {
          color: #64748b;
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 4px;
        }

        .stat-number {
          color: #0f172a;
          font-size: 2rem;
          font-weight: 700;
          line-height: 1;
        }

        .stat-icon-wrapper {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-icon-wrapper.blue { background: #e0f2fe; color: #0284c7; }
        .stat-icon-wrapper.green { background: #dcfce7; color: #16a34a; }
        .stat-icon-wrapper.orange { background: #ffedd5; color: #ea580c; }
        .stat-icon-wrapper.red { background: #fee2e2; color: #dc2626; }

        /* Controls Card - Search & Filter */
        .approve-users-controls-card {
          background: #ffffff;
          border-radius: 12px;
          padding: 20px 24px;
          margin-bottom: 32px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }

        .approve-users-filter-group {
          display: flex;
          align-items: center;
          gap: 20px;
          flex: 1;
          flex-wrap: wrap;
        }

        /* Search Box */
        .approve-users-search-wrapper {
          position: relative;
          width: 300px;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }

        .approve-users-search-input {
          width: 100%;
          padding: 10px 14px 10px 40px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 0.9rem;
          color: #334155;
          outline: none;
          transition: all 0.2s;
          box-sizing: border-box;
        }

        .approve-users-search-input:focus {
          border-color: #0077b6;
          box-shadow: 0 0 0 2px rgba(0, 119, 182, 0.1);
        }

        /* Tabs */
        .approve-users-tabs {
          display: flex;
          gap: 8px;
        }

        .approve-users-tab {
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          border: 1px solid transparent;
          background: transparent;
          color: #64748b;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .approve-users-tab:hover {
          background: #f1f5f9;
          color: #334155;
        }

        .approve-users-tab.active {
          background: #e0f2fe;
          color: #0077b6;
          border-color: #bae6fd;
        }

        .tab-count {
          background: white;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.75rem;
          opacity: 0.8;
        }

        /* Messages */
        .approve-users-message {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .error-message {
          background: #fef2f2;
          color: #991b1b;
          border: 1px solid #fecaca;
        }

        .success-message {
          background: #f0fdf4;
          color: #166534;
          border: 1px solid #bbf7d0;
        }

        /* Users Grid */
        .users-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }

        .user-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px;
          transition: all 0.2s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
        }

        .user-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        .user-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
          gap: 12px;
        }

        .user-info {
          flex: 1;
          min-width: 0;
        }

        .user-name {
          font-size: 1.1rem;
          font-weight: 600;
          color: #0f172a;
          margin: 0 0 4px 0;
        }

        .role-badge {
          background: #f1f5f9;
          color: #475569;
          padding: 2px 8px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          display: inline-block;
        }

        /* Status Badges */
        .approve-users-status-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .status-pending { background: #fff7ed; color: #c2410c; border: 1px solid #fed7aa; }
        .status-approved { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
        .status-rejected { background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }

        /* User Card Body */
        .user-card-body {
          margin-bottom: 20px;
          flex-grow: 1;
        }

        .user-detail-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .detail-icon {
          color: #94a3b8;
          flex-shrink: 0;
        }

        .detail-text {
          font-size: 0.9rem;
          color: #475569;
          word-break: break-all;
        }

        /* Actions */
        .user-card-actions {
          display: flex;
          gap: 12px;
          border-top: 1px solid #f1f5f9;
          padding-top: 16px;
        }

        .action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.85rem;
          transition: all 0.2s ease;
          flex: 1;
        }

        .approve-btn {
          background: #0077b6;
          color: white;
        }

        .approve-btn:hover:not(:disabled) {
          background: #005f8a;
        }

        .reject-btn {
          background: #fff7ed;
          color: #c2410c;
          border: 1px solid #fed7aa;
        }

        .reject-btn:hover:not(:disabled) {
          background: #ffedd5;
        }

        .action-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Loading Spinner */
        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px;
          color: #64748b;
        }

        .approve-users-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e2e8f0;
          border-top: 3px solid #0077b6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }

        /* Empty State */
        .empty-state {
          background: white;
          border-radius: 12px;
          padding: 60px 40px;
          text-align: center;
          border: 2px dashed #cbd5e1;
          color: #64748b;
        }

        .empty-state h3 {
          margin: 0 0 8px 0;
          color: #334155;
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .approve-users-wrapper { margin-left: 260px; width: calc(100% - 260px); }
          .approve-users-stats-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 1024px) {
          .approve-users-wrapper { margin-left: 0; width: 100%; }
          .approve-users-container { padding: 20px; }
          .approve-users-stats-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 768px) {
          .approve-users-stats-grid { grid-template-columns: 1fr; }
          .approve-users-header { flex-direction: column; align-items: flex-start; gap: 16px; }
          .approve-users-controls-card { flex-direction: column; align-items: stretch; }
          .approve-users-search-wrapper { width: 100%; }
          .approve-users-tabs { overflow-x: auto; padding-bottom: 4px; }
          .users-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="approve-users-wrapper">
        <div className="approve-users-container">
          <div className="approve-users-header">
            <div className="header-content">
              <h1 className="page-title">User Management</h1>
              <p className="page-subtitle">
                Approve or reject analyst account requests
              </p>
            </div>
          </div>

          {/* Stats Cards - Updated to match ViewReport Theme */}
          <div className="approve-users-stats-grid">
            <div className="approve-users-stat-card">
              <div className="stat-info">
                <span className="stat-label">Total Users</span>
                <span className="stat-number">{counts.total}</span>
              </div>
              <div className="stat-icon-wrapper blue">
                <Users size={24} />
              </div>
            </div>

            <div className="approve-users-stat-card">
              <div className="stat-info">
                <span className="stat-label">Pending Approval</span>
                <span className="stat-number">{counts.pending}</span>
              </div>
              <div className="stat-icon-wrapper orange">
                <Clock size={24} />
              </div>
            </div>

            <div className="approve-users-stat-card">
              <div className="stat-info">
                <span className="stat-label">Approved</span>
                <span className="stat-number">{counts.approved}</span>
              </div>
              <div className="stat-icon-wrapper green">
                <CheckCircle size={24} />
              </div>
            </div>

            <div className="approve-users-stat-card">
              <div className="stat-info">
                <span className="stat-label">Rejected</span>
                <span className="stat-number">{counts.rejected}</span>
              </div>
              <div className="stat-icon-wrapper red">
                <XCircle size={24} />
              </div>
            </div>
          </div>

          {/* Filters and Search - Unified Controls Card */}
          <div className="approve-users-controls-card">
            <div className="approve-users-filter-group">
              <div className="approve-users-search-wrapper">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="approve-users-search-input"
                />
              </div>

              <div className="approve-users-tabs">
                {["all", "pending", "approved", "rejected"].map((status) => (
                  <button
                    key={status}
                    className={`approve-users-tab ${
                      filter === status ? "active" : ""
                    }`}
                    onClick={() => setFilter(status)}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                    {status !== "all" && (
                      <span className="tab-count">
                        {status === "pending" && counts.pending}
                        {status === "approved" && counts.approved}
                        {status === "rejected" && counts.rejected}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={fetchUsers}
              className="approve-users-refresh-btn"
              disabled={loading}
            >
              <RefreshCw size={16} className={loading ? "spinning" : ""} />
              Refresh
            </button>
          </div>

          {/* Messages */}
          {error && (
            <div className="approve-users-message error-message">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {success && (
            <div className="approve-users-message success-message">
              <CheckCircle size={16} />
              {success}
            </div>
          )}

          {/* Users List */}
          <div className="users-section">
            {loading ? (
              <div className="loading-state">
                <div className="approve-users-spinner"></div>
                <p>Loading users...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="empty-state">
                <Users size={48} style={{ opacity: 0.2, marginBottom: 16 }} />
                <h3>No users found</h3>
                <p>
                  {searchTerm
                    ? `No users match "${searchTerm}"`
                    : `No ${
                        filter === "all" ? "" : filter
                      } users at the moment`}
                </p>
              </div>
            ) : (
              <div className="users-grid">
                {filteredUsers.map((user) => (
                  <div key={user._id} className="user-card">
                    <div className="user-card-header">
                      <div className="user-info">
                        <h3 className="user-name">{user.name}</h3>
                        <span className="role-badge">Analyst</span>
                      </div>
                      {getStatusBadge(user.status)}
                    </div>

                    <div className="user-card-body">
                      <div className="user-detail-row">
                        <Mail size={14} className="detail-icon" />
                        <span className="detail-text">{user.email}</span>
                      </div>
                      <div className="user-detail-row">
                        <Calendar size={14} className="detail-icon" />
                        <span className="detail-text">
                          Registered: {formatDate(user.createdAt || new Date())}
                        </span>
                      </div>
                    </div>

                    {user.status === "pending" && (
                      <div className="user-card-actions">
                        <button
                          onClick={() => handleApprove(user._id, user.name)}
                          disabled={processingUser === user._id}
                          className="action-btn approve-btn"
                        >
                          <UserCheck size={16} />
                          {processingUser === user._id
                            ? "Processing..."
                            : "Approve"}
                        </button>
                        <button
                          onClick={() => handleReject(user._id, user.name)}
                          disabled={processingUser === user._id}
                          className="action-btn reject-btn"
                        >
                          <UserX size={16} />
                          {processingUser === user._id
                            ? "Processing..."
                            : "Reject"}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ApproveUsers;
